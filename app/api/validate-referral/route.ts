import { NextRequest, NextResponse } from "next/server";
import { lookupReferralCode } from "@/lib/referral";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 20;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip") || "unknown";
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

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = (await req.json().catch(() => ({}))) as { code?: string };
    const code = typeof body.code === "string" ? body.code : "";

    if (!code.trim()) {
      return NextResponse.json({ valid: false });
    }

    const result = await lookupReferralCode(code);

    if (!result.valid) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({
      valid: true,
      discount: result.discount,
      type: result.type,
      recurring: result.recurring,
      requiresProof: result.requiresProof,
    });
  } catch (error) {
    console.error("Referral validation error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
