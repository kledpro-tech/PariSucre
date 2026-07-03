export const ACCEPTED_MIME_TYPES: Record<string, string> = {
  'image/svg+xml': 'SVG',
  'application/pdf': 'PDF',
  'image/png': 'PNG',
  'image/jpeg': 'JPEG',
  'image/webp': 'WebP',
};

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MIN_RESOLUTION_WARNING = 300;
export const MIN_RESOLUTION_BLOCKING = 150;

export interface PriceTier {
  minQuantity: number;
  maxQuantity: number | null;
  unitPriceCents: number;
  packagingUnit: number;
  label: string;
}

export const DEFAULT_PRICE_TIERS: PriceTier[] = [
  { minQuantity: 1000, maxQuantity: 4999, unitPriceCents: 8, packagingUnit: 1000, label: "Essentiel" },
  { minQuantity: 5000, maxQuantity: 9999, unitPriceCents: 6, packagingUnit: 1000, label: "Pro" },
  { minQuantity: 10000, maxQuantity: null, unitPriceCents: 4, packagingUnit: 1000, label: "Volume" },
];

export const DEFAULT_VAT_RATE = 20; // 20%
export const IDF_DEPARTMENTS = ['75', '77', '78', '91', '92', '93', '94', '95'];
