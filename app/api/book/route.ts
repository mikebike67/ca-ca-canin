import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type BookingPayload = {
  name: string;
  phone: string;
  email: string;
  postalCode?: string;
  frequency: string;
  dogs: string;
  yardSqft: number;
  price: number;
  consent?: boolean;
  website?: string;
  source?: "home-calculator" | "spring-cleanup";
  locale?: "en" | "fr";
};

const basePricing: Record<"weekly" | "biweekly" | "monthly" | "onetime", Record<"1" | "2" | "3plus", number>> = {
  weekly: { "1": 20, "2": 25, "3plus": 30 },
  biweekly: { "1": 30, "2": 35, "3plus": 40 },
  monthly: { "1": 50, "2": 55, "3plus": 60 },
  onetime: { "1": 60, "2": 60, "3plus": 60 },
};

const yardModifiers = {
  small: 1,
  medium: 1.12,
  large: 1.24,
  xlarge: 1.36,
} as const;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const normalizePostalCode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");
const isCanadianPostalCode = (value: string) => /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(normalizePostalCode(value));
const isLavalPostalCode = (value: string) => normalizePostalCode(value).startsWith("H7");
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

function calculateServerPrice(
  frequency: "weekly" | "biweekly" | "monthly" | "onetime",
  dogs: "1" | "2" | "3plus",
  yardSqft: number
) {
  const yardCategory =
    yardSqft <= 3000 ? "small" :
    yardSqft <= 6000 ? "medium" :
    yardSqft < 10000 ? "large" :
    "xlarge";
  const base = basePricing[frequency][dogs];

  if (frequency === "onetime") {
    return base;
  }

  const modifier = yardModifiers[yardCategory];
  const extraSqft = Math.max(0, yardSqft - 3000);
  const increments = Math.floor(extraSqft / 100);
  const midIncrements = Math.min(increments, 20);
  const largeIncrements = Math.max(0, increments - 20);
  const multiplier = Math.pow(1.004, midIncrements) * Math.pow(1.0025, largeIncrements);

  return Math.round(base * modifier * multiplier * 100) / 100;
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

    const body = (await req.json()) as Partial<BookingPayload>;
    const { name, phone, email, postalCode, frequency, dogs, yardSqft, price, consent, website, source, locale } = body;

    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !phone || !email || !frequency || !dogs || typeof yardSqft !== "number" || typeof price !== "number") {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (consent !== true) {
      return NextResponse.json({ error: "Consent is required." }, { status: 400 });
    }

    if (!["weekly", "biweekly", "monthly", "onetime"].includes(frequency)) {
      return NextResponse.json({ error: "Invalid service frequency." }, { status: 400 });
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

    if (!Number.isFinite(yardSqft) || yardSqft < 500 || yardSqft > 20000) {
      return NextResponse.json({ error: "Invalid yard size." }, { status: 400 });
    }

    const normalizedPostalCode = postalCode ? normalizePostalCode(postalCode) : "";
    if (normalizedPostalCode) {
      if (!isCanadianPostalCode(normalizedPostalCode)) {
        return NextResponse.json({ error: "Invalid postal code." }, { status: 400 });
      }

      if (!isLavalPostalCode(normalizedPostalCode)) {
        return NextResponse.json({ error: "Service is limited to Laval, QC." }, { status: 400 });
      }
    }

    const serverPrice = calculateServerPrice(
      frequency as "weekly" | "biweekly" | "monthly" | "onetime",
      dogs as "1" | "2" | "3plus",
      yardSqft
    );

    if (Math.abs(serverPrice - price) > 0.01) {
      return NextResponse.json({ error: "Invalid quote request." }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM;
    const adminTo = process.env.ADMIN_EMAIL || process.env.SMTP_TO;

    if (!host || !port || !user || !pass || !from) {
      return NextResponse.json({ error: "Service is temporarily unavailable." }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const isFrench = locale === "fr";
    const requestLabel = isFrench
      ? source === "spring-cleanup"
        ? "Demande de devis - nettoyage de printemps"
        : "Demande de devis"
      : source === "spring-cleanup"
        ? "Spring Cleanup Quote Request"
        : "Quote Request";
    const estimateLabel = isFrench
      ? source === "spring-cleanup"
        ? "Prix de depart estime"
        : "Prix estime"
      : source === "spring-cleanup"
        ? "Estimated starting price"
        : "Estimated price";
    const cadenceLabel = isFrench
      ? frequency === "onetime"
        ? "Visite ponctuelle"
        : `Service ${frequency}`
      : frequency === "onetime"
        ? "One-time visit"
        : `${frequency} service`;
    const subject = `${requestLabel} | ${normalizedPostalCode || "No postal code"} | ${dogs} dog${dogs === "1" ? "" : "s"} | ${yardSqft} sq ft`;
    const text = [
      isFrench ? `Bonjour ${name.trim()},` : `Hi ${name.trim()},`,
      ``,
      isFrench ? `Merci d'avoir contacte Ca-Ca Canin.` : `Thanks for reaching out to Ca-Ca Canin.`,
      ``,
      isFrench ? `Nous avons bien recu votre demande.` : `We received your ${requestLabel.toLowerCase()}.`,
      ``,
      isFrench ? `Resume de la demande :` : `Request details:`,
      `- ${isFrench ? "Code postal" : "Postal code"}: ${normalizedPostalCode || (isFrench ? "Non fourni" : "Not provided")}`,
      `- ${isFrench ? "Type de service" : "Service type"}: ${cadenceLabel}`,
      `- ${isFrench ? "Chiens" : "Dogs"}: ${dogs}`,
      `- ${isFrench ? "Taille du terrain" : "Yard size"}: ${yardSqft} sq ft`,
      `- ${estimateLabel}: $${serverPrice.toFixed(2)}${frequency === "onetime" ? " for the first 30 minutes" : " per visit"}`,
      `- ${isFrench ? "Telephone" : "Phone"}: ${phone.trim()}`,
      `- ${isFrench ? "Courriel" : "Email"}: ${email.trim()}`,
      ``,
      isFrench ? `Nous vous contacterons sous peu pour confirmer les details et la suite.` : `We'll reach out soon to finalize your schedule.`,
      ``,
      `Ca-Ca Canin`,
    ].join("\n");

    const html = `
      <div style="font-family: Arial, sans-serif; background:#f7faf7; padding:24px; color:#1f2937;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #d7e6da; border-radius:20px; overflow:hidden;">
          <div style="background:linear-gradient(135deg, #307944 0%, #3d8b52 100%); color:#ffffff; padding:20px 24px;">
            <p style="margin:0; font-size:12px; letter-spacing:0.18em; text-transform:uppercase; font-weight:700;">Ca-Ca Canin</p>
            <h1 style="margin:8px 0 0; font-size:28px; line-height:1.2;">${requestLabel}</h1>
          </div>
          <div style="padding:24px;">
            <p style="margin:0 0 16px; font-size:16px;">${isFrench ? "Bonjour" : "Hi"} ${name.trim()},</p>
            <p style="margin:0 0 20px; font-size:16px; line-height:1.6;">
              ${isFrench ? "Nous avons bien recu votre demande et nous vous contacterons sous peu." : `We received your ${requestLabel.toLowerCase()} and will follow up shortly.`}
            </p>
            <div style="border:1px solid #d7e6da; border-radius:16px; padding:18px; background:#eef7f0;">
              <p style="margin:0 0 12px; font-size:12px; letter-spacing:0.14em; text-transform:uppercase; font-weight:700; color:#307944;">
                ${isFrench ? "Resume de la demande" : "Request summary"}
              </p>
              <table style="width:100%; border-collapse:collapse; font-size:15px;">
                <tr><td style="padding:8px 0; color:#6b7280;">${isFrench ? "Code postal" : "Postal code"}</td><td style="padding:8px 0; text-align:right; font-weight:600;">${normalizedPostalCode || (isFrench ? "Non fourni" : "Not provided")}</td></tr>
                <tr><td style="padding:8px 0; color:#6b7280;">${isFrench ? "Type de service" : "Service type"}</td><td style="padding:8px 0; text-align:right; font-weight:600;">${cadenceLabel}</td></tr>
                <tr><td style="padding:8px 0; color:#6b7280;">${isFrench ? "Chiens" : "Dogs"}</td><td style="padding:8px 0; text-align:right; font-weight:600;">${dogs}</td></tr>
                <tr><td style="padding:8px 0; color:#6b7280;">${isFrench ? "Taille du terrain" : "Yard size"}</td><td style="padding:8px 0; text-align:right; font-weight:600;">${yardSqft} sq ft</td></tr>
                <tr><td style="padding:8px 0; color:#6b7280;">${estimateLabel}</td><td style="padding:8px 0; text-align:right; font-weight:600;">$${serverPrice.toFixed(2)}${frequency === "onetime" ? " / first 30 min" : " / visit"}</td></tr>
                <tr><td style="padding:8px 0; color:#6b7280;">${isFrench ? "Telephone" : "Phone"}</td><td style="padding:8px 0; text-align:right; font-weight:600;">${phone.trim()}</td></tr>
                <tr><td style="padding:8px 0; color:#6b7280;">${isFrench ? "Courriel" : "Email"}</td><td style="padding:8px 0; text-align:right; font-weight:600;">${email.trim()}</td></tr>
              </table>
            </div>
            <p style="margin:20px 0 0; font-size:15px; line-height:1.6; color:#4b5563;">
              ${isFrench ? "Nous vous contacterons sous peu pour confirmer les details et la suite." : "We&apos;ll be in touch soon to confirm the details and next steps."}
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
    console.error("Booking email error:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
