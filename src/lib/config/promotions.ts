// ─── Promotion / Discount Code Configuration ──────────────────────────────
// Edit this file to add, remove, or modify discount codes.

export interface DiscountCode {
  code: string;
  /** Percentage off (0-100) */
  discountPercent: number;
  /** Human-readable label shown to the user */
  label: string;
}

/** All valid discount codes */
export const DISCOUNT_CODES: DiscountCode[] = [
  {
    code: "ceep100",
    discountPercent: 50,
    label: "50% İndirim",
  },
];

/** localStorage key that stores the ISO string of the promotion end date */
export const PROMO_END_KEY = "ceepyol_promo_end";

/** Duration of the promotion in seconds (3 days) */
export const PROMO_DURATION_SECONDS = 3 * 24 * 60 * 60;

/**
 * Validate a discount code string.
 * Returns the matching DiscountCode or null if invalid / expired.
 */
export function validateDiscountCode(
  input: string,
  promoActive: boolean
): DiscountCode | null {
  if (!promoActive) return null;
  const normalised = input.trim().toLowerCase();
  return (
    DISCOUNT_CODES.find((d) => d.code.toLowerCase() === normalised) ?? null
  );
}

/**
 * Get the promotion end Date, persisting it in localStorage on first call.
 * Safe to call on server (returns null there).
 */
export function getPromoEndDate(): Date | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(PROMO_END_KEY);
  if (stored) {
    const d = new Date(stored);
    if (!isNaN(d.getTime())) return d;
  }
  const end = new Date(Date.now() + PROMO_DURATION_SECONDS * 1000);
  localStorage.setItem(PROMO_END_KEY, end.toISOString());
  return end;
}
