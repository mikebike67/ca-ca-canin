export type ServiceFrequency = "weekly" | "biweekly" | "monthly" | "onetime";
export type DogCount = "1" | "2" | "3plus";
export type YardCategory = "small" | "medium" | "large" | "xlarge";

export const BASE_PRICING: Record<ServiceFrequency, Record<DogCount, number>> = {
  weekly: { "1": 20, "2": 25, "3plus": 30 },
  biweekly: { "1": 30, "2": 35, "3plus": 40 },
  monthly: { "1": 50, "2": 55, "3plus": 60 },
  onetime: { "1": 60, "2": 60, "3plus": 60 },
};

const YARD_MODIFIERS: Record<YardCategory, number> = {
  small: 1,
  medium: 1.12,
  large: 1.24,
  xlarge: 1.36,
};

export function normalizePostalCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isCanadianPostalCode(value: string) {
  return /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(normalizePostalCode(value));
}

export function getYardCategory(yardSqft: number): YardCategory {
  if (yardSqft <= 3000) return "small";
  if (yardSqft <= 6000) return "medium";
  if (yardSqft < 10000) return "large";
  return "xlarge";
}

export function calculateBookingPrice(
  frequency: ServiceFrequency,
  dogs: DogCount,
  yardSqft: number,
) {
  const base = BASE_PRICING[frequency][dogs];

  if (frequency === "onetime") {
    return base;
  }

  const yardCategory = getYardCategory(yardSqft);
  const modifier = YARD_MODIFIERS[yardCategory];
  const extraSqft = Math.max(0, yardSqft - 3000);
  const increments = Math.floor(extraSqft / 100);
  const midIncrements = Math.min(increments, 20);
  const largeIncrements = Math.max(0, increments - 20);
  const multiplier = Math.pow(1.004, midIncrements) * Math.pow(1.0025, largeIncrements);

  return Math.round(base * modifier * multiplier * 100) / 100;
}

export function getMonthlyVisits(frequency: ServiceFrequency) {
  if (frequency === "weekly") return 4;
  if (frequency === "biweekly") return 2;
  if (frequency === "monthly") return 1;
  return 0;
}
