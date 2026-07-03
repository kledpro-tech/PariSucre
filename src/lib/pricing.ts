import type { PriceTier } from '@/lib/constants';
import { DEFAULT_PRICE_TIERS, DEFAULT_VAT_RATE, IDF_DEPARTMENTS } from '@/lib/constants';

// ─── TYPES ───────────────────────────────────────────────

export interface PricingResult {
  /** The matched price tier */
  tier: PriceTier;
  /** Quantity rounded up to the nearest packaging unit */
  adjustedQuantity: number;
  /** Price per unit in cents */
  unitPriceCents: number;
  /** Subtotal before tax and shipping, in cents */
  subtotalCents: number;
  /** VAT amount in cents */
  vatAmountCents: number;
  /** Shipping cost in cents (0 for Île-de-France) */
  shippingCents: number;
  /** Total including VAT and shipping, in cents */
  totalCents: number;
  /** Percentage saved vs. base (first) tier */
  savingsPercent: number;
  /** Amount saved vs. base tier for this quantity, in cents */
  savingsCents: number;
}

// ─── DEFAULT SHIPPING COST (outside IDF) ─────────────────

const DEFAULT_SHIPPING_CENTS = 1500; // 15.00 €

// ─── PUBLIC API ──────────────────────────────────────────

/**
 * Find the applicable price tier for a given quantity.
 * Returns `undefined` if the quantity is below the minimum of all tiers.
 */
export function findTierForQuantity(
  quantity: number,
  tiers: PriceTier[] = DEFAULT_PRICE_TIERS,
): PriceTier | undefined {
  // Sort tiers by minQuantity ascending to ensure correct matching
  const sorted = [...tiers].sort((a, b) => a.minQuantity - b.minQuantity);

  return sorted.find(
    (t) => quantity >= t.minQuantity && (t.maxQuantity === null || quantity <= t.maxQuantity),
  );
}

/**
 * Round a quantity up to the nearest packaging unit for the given tier.
 */
export function roundToPackagingUnit(quantity: number, packagingUnit: number): number {
  return Math.ceil(quantity / packagingUnit) * packagingUnit;
}

/**
 * Determine shipping cost based on postal code.
 * Île-de-France (departments 75, 77, 78, 91, 92, 93, 94, 95) → free.
 * Other French departments → flat rate.
 */
export function calculateShippingCents(postalCode?: string): number {
  if (!postalCode) return DEFAULT_SHIPPING_CENTS;

  const prefix = postalCode.substring(0, 2);
  if (IDF_DEPARTMENTS.includes(prefix)) {
    return 0;
  }

  return DEFAULT_SHIPPING_CENTS;
}

/**
 * Full pricing calculation.
 *
 * @param quantity  — desired quantity (will be rounded to packaging unit)
 * @param tiers     — available price tiers
 * @param vatRate   — VAT rate as a percentage (e.g. 20 for 20%)
 * @param postalCode — optional postal code for shipping calculation
 *
 * @throws Error if no tier matches the quantity
 */
export function calculatePricing(
  quantity: number,
  tiers: PriceTier[] = DEFAULT_PRICE_TIERS,
  vatRate: number = DEFAULT_VAT_RATE,
  postalCode?: string,
): PricingResult {
  const tier = findTierForQuantity(quantity, tiers);
  if (!tier) {
    throw new Error(
      `Aucun palier de prix ne correspond à la quantité ${quantity}. ` +
        `Quantité minimum : ${Math.min(...tiers.map((t) => t.minQuantity))}.`,
    );
  }

  const adjustedQuantity = roundToPackagingUnit(quantity, tier.packagingUnit);
  const unitPriceCents = tier.unitPriceCents;
  const subtotalCents = adjustedQuantity * unitPriceCents;

  // VAT: rate is given as percentage (e.g. 20), convert to decimal
  const vatAmountCents = Math.round(subtotalCents * (vatRate / 100));

  // Shipping
  const shippingCents = calculateShippingCents(postalCode);

  // Total
  const totalCents = subtotalCents + vatAmountCents + shippingCents;

  // Savings vs. base (first/most expensive) tier
  const sortedTiers = [...tiers].sort((a, b) => a.minQuantity - b.minQuantity);
  const baseTier = sortedTiers[0];
  let savingsPercent = 0;
  let savingsCents = 0;

  if (baseTier && baseTier.unitPriceCents > unitPriceCents) {
    savingsPercent = Math.round(
      ((baseTier.unitPriceCents - unitPriceCents) / baseTier.unitPriceCents) * 100,
    );
    savingsCents = (baseTier.unitPriceCents - unitPriceCents) * adjustedQuantity;
  }

  return {
    tier,
    adjustedQuantity,
    unitPriceCents,
    subtotalCents,
    vatAmountCents,
    shippingCents,
    totalCents,
    savingsPercent,
    savingsCents,
  };
}
