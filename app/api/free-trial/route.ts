import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import nodemailer from "nodemailer";
import type { DogCount } from "@/lib/booking";

declare global {
  interface CloudflareEnv {
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_USER?: string;
    SMTP_PASS?: string;
    SMTP_FROM?: string;
    ADMIN_EMAIL?: string;
    SMTP_TO?: string;
    PROMO_KV?: {
      get(key: string): Promise<string | null>;
      put(key: string, value: string): Promise<void>;
    };
  }
}

type FreeTrialPayload = {
  name: string;
  phone: string;
  email: string;
  address: string;
  dogs: string;
  consent?: boolean;
  website?: string;
  locale?: "en" | "fr";
};

const TOTAL_SPOTS = 10;
const COUNT_KEY = "free-trial:count";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-()\s]{10,20}$/;

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip") || "unknown";
}

function isAllowedOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  const host = req.headers.get("host");
  if (!host) return false;

  try {
    const originUrl = new URL(origin);
    const hostUrl = new URL(`http://${host}`);
    return originUrl.host === hostUrl.host;
  } catch {
    return false;
  }
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return false;
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  return true;
}

const DIACRITIC_MARKS = /[\u0300-\u036f]/g;

function normalizeAddress(address: string) {
  return address
    .normalize("NFD")
    .replace(DIACRITIC_MARKS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

async function getKv() {
  try {
    const context = await getCloudflareContext({ async: true });
    return context.env.PROMO_KV ?? null;
  } catch {
    return null;
  }
}

async function getMailConfig() {
  let cfEnv: CloudflareEnv | undefined;

  try {
    const context = await getCloudflareContext({ async: true });
    cfEnv = context.env;
  } catch {
    // Fall back to process.env outside the Cloudflare runtime.
  }

  const host = cfEnv?.SMTP_HOST ?? process.env.SMTP_HOST;
  const portValue = cfEnv?.SMTP_PORT ?? process.env.SMTP_PORT;
  const user = cfEnv?.SMTP_USER ?? process.env.SMTP_USER;
  const pass = cfEnv?.SMTP_PASS ?? process.env.SMTP_PASS;
  const from = cfEnv?.SMTP_FROM ?? process.env.SMTP_FROM;
  const adminTo = cfEnv?.ADMIN_EMAIL ?? process.env.ADMIN_EMAIL ?? cfEnv?.SMTP_TO ?? process.env.SMTP_TO;

  return {
    host,
    port: portValue ? Number(portValue) : undefined,
    user,
    pass,
    from,
    adminTo,
  };
}

export async function GET() {
  const kv = await getKv();
  let claimed = 0;

  if (kv) {
    try {
      const stored = await kv.get(COUNT_KEY);
      claimed = stored ? parseInt(stored, 10) || 0 : 0;
    } catch {
      claimed = 0;
    }
  }

  return NextResponse.json({ claimed, total: TOTAL_SPOTS, remaining: Math.max(0, TOTAL_SPOTS - claimed) });
}

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }

    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = (await req.json()) as Partial<FreeTrialPayload>;
    const { name, phone, email, address, dogs, consent, website, locale } = body;

    if (website) {
      return NextResponse.json({ ok: true, remaining: TOTAL_SPOTS, waitlisted: false, duplicate: false });
    }

    if (!name || !phone || !email || !address || !dogs) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (consent !== true) {
      return NextResponse.json({ error: "Consent is required." }, { status: 400 });
    }

    if (!["1", "2", "3plus"].includes(dogs)) {
      return NextResponse.json({ error: "Invalid dog count." }, { status: 400 });
    }

    if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 80) {
      return NextResponse.json({ error: "Invalid name." }, { status: 400 });
    }

    if (typeof email !== "string" || !emailPattern.test(email) || email.length > 120) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (typeof phone !== "string" || !phonePattern.test(phone) || phone.length > 20) {
      return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
    }

    if (typeof address !== "string" || address.trim().length < 5 || address.trim().length > 300) {
      return NextResponse.json({ error: "Invalid address." }, { status: 400 });
    }

    const kv = await getKv();
    const normalizedAddress = normalizeAddress(address);
    const addressKey = `free-trial:addr:${normalizedAddress}`;

    let duplicate = false;
    let claimed = 0;

    if (kv) {
      try {
        const existing = await kv.get(addressKey);
        duplicate = Boolean(existing);
      } catch {
        duplicate = false;
      }

      try {
        const stored = await kv.get(COUNT_KEY);
        claimed = stored ? parseInt(stored, 10) || 0 : 0;
      } catch {
        claimed = 0;
      }
    }

    const waitlisted = !duplicate && claimed >= TOTAL_SPOTS;

    const { host, port, user, pass, from, adminTo } = await getMailConfig();

    if (!host || !port || !user || !pass || !from) {
      console.error("Free trial email config missing:", {
        SMTP_HOST: Boolean(host),
        SMTP_PORT: Boolean(port),
        SMTP_USER: Boolean(user),
        SMTP_PASS: Boolean(pass),
        SMTP_FROM: Boolean(from),
      });
      return NextResponse.json({ error: "Service is temporarily unavailable." }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const isFrench = locale === "fr";
    const dogsLabel = (dogs as DogCount) === "3plus" ? (isFrench ? "3+ chiens" : "3+ dogs") : `${dogs} ${isFrench ? (dogs === "1" ? "chien" : "chiens") : (dogs === "1" ? "dog" : "dogs")}`;
    const requestLabel = isFrench ? "Essai gratuit de 2 semaines" : "2-Week Free Trial";
    const statusPrefix = duplicate ? "[Duplicate address] " : waitlisted ? "[Waitlist] " : "";
    const subject = `${statusPrefix}${requestLabel} | ${name.trim()}`;

    const statusLineText = duplicate
      ? (isFrench
          ? "Cette adresse a deja une inscription enregistree. Ceci est une nouvelle soumission pour la meme adresse."
          : "This address already has a signup on file. This is a repeat submission for the same address.")
      : waitlisted
        ? (isFrench
            ? "Les 10 places sont deja reservees. Cette personne a ete ajoutee a la liste d'attente."
            : "All 10 spots are already claimed. This person has been added to the waitlist.")
        : (isFrench
            ? "Nouvelle inscription a l'essai gratuit de 2 semaines."
            : "New signup for the 2-week free trial.");

    const buildText = (isAdmin: boolean) =>
      [
        isFrench ? `Bonjour ${name.trim()},` : `Hi ${name.trim()},`,
        ``,
        statusLineText,
        ``,
        isFrench ? `Resume :` : `Summary:`,
        `- ${isFrench ? "Nom" : "Name"}: ${name.trim()}`,
        `- ${isFrench ? "Adresse" : "Address"}: ${address.trim()}`,
        `- ${isFrench ? "Chiens" : "Dogs"}: ${dogsLabel}`,
        `- ${isFrench ? "Telephone" : "Phone"}: ${phone.trim()}`,
        `- ${isFrench ? "Courriel" : "Email"}: ${email.trim()}`,
        ``,
        isFrench ? `Nous vous contacterons sous peu pour planifier la premiere visite.` : `We'll reach out soon to schedule your first visit.`,
        ``,
        `Ca-Ca Canin`,
      ].join("\n");

    const buildHtml = (isAdmin: boolean) => `
      <div style="font-family: Arial, sans-serif; background:#f7faf7; padding:24px; color:#1f2937;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #d7e6da; border-radius:20px; overflow:hidden;">
          <div style="background:linear-gradient(135deg, #307944 0%, #3d8b52 100%); color:#ffffff; padding:20px 24px;">
            <p style="margin:0; font-size:12px; letter-spacing:0.18em; text-transform:uppercase; font-weight:700;">Ca-Ca Canin</p>
            <h1 style="margin:8px 0 0; font-size:28px; line-height:1.2;">${requestLabel}</h1>
          </div>
          <div style="padding:24px;">
            <p style="margin:0 0 16px; font-size:16px;">${isFrench ? "Bonjour" : "Hi"} ${name.trim()},</p>
            <p style="margin:0 0 20px; font-size:16px; line-height:1.6;">${statusLineText}</p>
            <div style="border:1px solid #d7e6da; border-radius:16px; padding:18px; background:#eef7f0;">
              <p style="margin:0 0 12px; font-size:12px; letter-spacing:0.14em; text-transform:uppercase; font-weight:700; color:#307944;">
                ${isFrench ? "Resume de la demande" : "Request summary"}
              </p>
              <table style="width:100%; border-collapse:collapse; font-size:15px;">
                <tr><td style="padding:8px 0; color:#6b7280;">${isFrench ? "Adresse" : "Address"}</td><td style="padding:8px 0; text-align:right; font-weight:600;">${address.trim()}</td></tr>
                <tr><td style="padding:8px 0; color:#6b7280;">${isFrench ? "Chiens" : "Dogs"}</td><td style="padding:8px 0; text-align:right; font-weight:600;">${dogsLabel}</td></tr>
                <tr><td style="padding:8px 0; color:#6b7280;">${isFrench ? "Telephone" : "Phone"}</td><td style="padding:8px 0; text-align:right; font-weight:600;">${phone.trim()}</td></tr>
                <tr><td style="padding:8px 0; color:#6b7280;">${isFrench ? "Courriel" : "Email"}</td><td style="padding:8px 0; text-align:right; font-weight:600;">${email.trim()}</td></tr>
              </table>
            </div>
            <p style="margin:20px 0 0; font-size:15px; line-height:1.6; color:#4b5563;">
              ${isFrench ? "Nous vous contacterons sous peu pour planifier la premiere visite." : "We'll be in touch soon to schedule your first visit."}
            </p>
          </div>
          <div style="border-top:1px solid #d7e6da; background:#f7faf7; padding:18px 24px;">
            <p style="margin:0 0 6px; font-size:12px; letter-spacing:0.16em; text-transform:uppercase; font-weight:700; color:#307944;">
              Ca-Ca Canin
            </p>
            <p style="margin:0; font-size:14px; line-height:1.6; color:#4b5563;">
              Laval, QC<br />
              Phone: 438 880 8922<br />
              Email: cacacaninqc@gmail.com
            </p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from,
      to: email,
      subject,
      text: buildText(false),
      html: buildHtml(false),
      replyTo: adminTo || from,
    });

    if (adminTo && adminTo !== email) {
      await transporter.sendMail({
        from,
        to: adminTo,
        subject,
        text: buildText(true),
        html: buildHtml(true),
        replyTo: email.trim(),
      });
    }

    let remaining = Math.max(0, TOTAL_SPOTS - claimed);

    if (kv && !duplicate) {
      try {
        await kv.put(addressKey, "1");
        const newClaimed = claimed + 1;
        await kv.put(COUNT_KEY, String(newClaimed));
        remaining = Math.max(0, TOTAL_SPOTS - newClaimed);
      } catch {
        // Counter update best-effort; the lead is already emailed.
      }
    }

    return NextResponse.json({ ok: true, remaining, waitlisted, duplicate });
  } catch (error) {
    console.error("Free trial email error:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
