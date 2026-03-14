import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import nodemailer from "nodemailer";

declare global {
  interface CloudflareEnv {
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_USER?: string;
    SMTP_PASS?: string;
    SMTP_FROM?: string;
    ADMIN_EMAIL?: string;
    SMTP_TO?: string;
  }
}

type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent?: boolean;
  website?: string;
  locale?: "en" | "fr";
};

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

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }

    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = (await req.json()) as Partial<ContactPayload>;
    const { name, email, phone, message, consent, website, locale } = body;

    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (consent !== true) {
      return NextResponse.json({ error: "Consent is required." }, { status: 400 });
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

    if (typeof message !== "string" || message.trim().length < 10 || message.trim().length > 4000) {
      return NextResponse.json({ error: "Invalid message." }, { status: 400 });
    }

    const { host, port, user, pass, from, adminTo } = await getMailConfig();

    if (!host || !port || !user || !pass || !from) {
      console.error("Contact email config missing:", {
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
    const subject = isFrench
      ? `Message de contact | ${name.trim()}`
      : `Contact message | ${name.trim()}`;

    const text = [
      isFrench ? `Bonjour ${name.trim()},` : `Hi ${name.trim()},`,
      ``,
      isFrench ? `Nous avons bien recu votre message.` : `We received your message.`,
      ``,
      isFrench ? `Resume :` : `Summary:`,
      `- ${isFrench ? "Nom" : "Name"}: ${name.trim()}`,
      `- ${isFrench ? "Telephone" : "Phone"}: ${phone.trim()}`,
      `- ${isFrench ? "Courriel" : "Email"}: ${email.trim()}`,
      `- ${isFrench ? "Message" : "Message"}: ${message.trim()}`,
      ``,
      isFrench ? `Nous vous repondrons sous peu.` : `We will reply shortly.`,
      ``,
      `Ca-Ca Canin`,
    ].join("\n");

    const html = `
      <div style="font-family: Arial, sans-serif; background:#f7faf7; padding:24px; color:#1f2937;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #d7e6da; border-radius:20px; overflow:hidden;">
          <div style="background:linear-gradient(135deg, #307944 0%, #3d8b52 100%); color:#ffffff; padding:20px 24px;">
            <p style="margin:0; font-size:12px; letter-spacing:0.18em; text-transform:uppercase; font-weight:700;">Ca-Ca Canin</p>
            <h1 style="margin:8px 0 0; font-size:28px; line-height:1.2;">${isFrench ? "Message de contact" : "Contact message"}</h1>
          </div>
          <div style="padding:24px;">
            <p style="margin:0 0 16px; font-size:16px;">${isFrench ? "Bonjour" : "Hi"} ${name.trim()},</p>
            <p style="margin:0 0 20px; font-size:16px; line-height:1.6;">
              ${isFrench ? "Nous avons bien recu votre message et nous vous repondrons sous peu." : "We received your message and will reply shortly."}
            </p>
            <div style="border:1px solid #d7e6da; border-radius:16px; padding:18px; background:#eef7f0;">
              <p style="margin:0 0 12px; font-size:12px; letter-spacing:0.14em; text-transform:uppercase; font-weight:700; color:#307944;">
                ${isFrench ? "Resume du message" : "Message summary"}
              </p>
              <table style="width:100%; border-collapse:collapse; font-size:15px;">
                <tr><td style="padding:8px 0; color:#6b7280;">${isFrench ? "Nom" : "Name"}</td><td style="padding:8px 0; text-align:right; font-weight:600;">${name.trim()}</td></tr>
                <tr><td style="padding:8px 0; color:#6b7280;">${isFrench ? "Telephone" : "Phone"}</td><td style="padding:8px 0; text-align:right; font-weight:600;">${phone.trim()}</td></tr>
                <tr><td style="padding:8px 0; color:#6b7280;">${isFrench ? "Courriel" : "Email"}</td><td style="padding:8px 0; text-align:right; font-weight:600;">${email.trim()}</td></tr>
              </table>
              <div style="margin-top:16px; border-top:1px solid #d7e6da; padding-top:16px;">
                <p style="margin:0 0 8px; font-size:12px; letter-spacing:0.14em; text-transform:uppercase; font-weight:700; color:#307944;">
                  ${isFrench ? "Message" : "Message"}
                </p>
                <p style="margin:0; font-size:15px; line-height:1.7; white-space:pre-wrap;">${message.trim()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const recipients = [email, adminTo].filter((value): value is string => Boolean(value));

    await transporter.sendMail({
      from,
      to: recipients,
      subject,
      text,
      html,
      replyTo: email.trim(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
