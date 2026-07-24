import { getCloudflareContext } from "@opennextjs/cloudflare";

declare global {
  interface CloudflareEnv {
    REFERRAL_CODES?: string;
    REFERRAL_DISCOUNT_AMOUNT?: string;
  }
}

type ReferralCodeEntry =
  | string
  | {
      label: string;
      type?: "flat" | "percent";
      amount?: number;
      recurring?: boolean;
      requiresProof?: boolean;
      isPartner?: boolean;
    };

type NormalizedReferralCode = {
  label: string;
  type: "flat" | "percent";
  amount: number;
  recurring: boolean;
  requiresProof: boolean;
  isPartner: boolean;
};

export async function getReferralConfig() {
  let cfEnv: CloudflareEnv | undefined;

  try {
    const context = await getCloudflareContext({ async: true });
    cfEnv = context.env;
  } catch {
    // Fall back to process.env outside the Cloudflare runtime.
  }

  const rawCodes = cfEnv?.REFERRAL_CODES ?? process.env.REFERRAL_CODES ?? "{}";
  const rawDiscount = cfEnv?.REFERRAL_DISCOUNT_AMOUNT ?? process.env.REFERRAL_DISCOUNT_AMOUNT ?? "0";

  let codes: Record<string, ReferralCodeEntry> = {};
  try {
    const parsed = JSON.parse(rawCodes);
    if (parsed && typeof parsed === "object") {
      codes = parsed;
    }
  } catch {
    // Malformed REFERRAL_CODES env var; treat as no codes configured.
  }

  const discount = Number(rawDiscount);

  return {
    codes,
    discount: Number.isFinite(discount) ? discount : 0,
  };
}

function formatReferrerLabel(label: string) {
  const parts = label.trim().split(/\s+/);
  if (parts.length < 2) return parts[0] ?? label;

  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0];
  return `${firstName} ${lastInitial.toUpperCase()}.`;
}

function normalizeCodeEntry(entry: ReferralCodeEntry, globalDiscount: number): NormalizedReferralCode {
  if (typeof entry === "string") {
    return {
      label: entry,
      type: "flat",
      amount: globalDiscount,
      recurring: false,
      requiresProof: false,
      isPartner: false,
    };
  }

  return {
    label: entry.label ?? "",
    type: entry.type === "percent" ? "percent" : "flat",
    amount: typeof entry.amount === "number" ? entry.amount : globalDiscount,
    recurring: Boolean(entry.recurring),
    requiresProof: Boolean(entry.requiresProof),
    isPartner: Boolean(entry.isPartner),
  };
}

export async function lookupReferralCode(code: string) {
  const { codes, discount: globalDiscount } = await getReferralConfig();
  const normalized = code.trim().toUpperCase();

  const match = Object.keys(codes).find((key) => key.trim().toUpperCase() === normalized);

  if (!match) {
    return { valid: false as const };
  }

  const config = normalizeCodeEntry(codes[match], globalDiscount);

  if (config.amount <= 0) {
    return { valid: false as const };
  }

  return {
    valid: true as const,
    discount: config.amount,
    type: config.type,
    recurring: config.recurring,
    requiresProof: config.requiresProof,
    isPartner: config.isPartner,
    referrerLabel: config.isPartner ? config.label : formatReferrerLabel(config.label),
  };
}
