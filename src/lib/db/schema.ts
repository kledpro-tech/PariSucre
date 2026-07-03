import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  integer,
  decimal,
  boolean,
  timestamp,
  jsonb,
  serial,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── ENUMS ───────────────────────────────────────────────

export const orderStatusEnum = pgEnum('order_status', [
  'PENDING_PAYMENT',
  'PAID',
  'WAITING_APPROVAL',
  'APPROVED',
  'IN_PRODUCTION',
  'SHIPPED',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
]);

export const fileTypeEnum = pgEnum('file_type', [
  'SVG',
  'PDF',
  'PNG',
  'JPG',
  'JPEG',
  'WEBP',
]);

// ─── JSONB TYPE HELPERS ──────────────────────────────────

/** Colors stored with the order design */
export type DesignColors = string[];

/** Metadata stored with uploaded logos */
export interface LogoMetadata {
  originalName: string;
  width?: number;
  height?: number;
  dpi?: number;
  isVector: boolean;
}

/** Shipping zone configuration stored as JSONB */
export interface ShippingZoneConfig {
  departments: string[];
  postalCodePrefixes?: string[];
  estimatedDays: { min: number; max: number };
  freeAbove?: number;
}

/** Global settings value — intentionally flexible */
export type SettingsValue = Record<string, unknown>;

// ─── TABLES ──────────────────────────────────────────────

// 1. Users
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }),
    companyName: varchar('company_name', { length: 255 }),
    phone: varchar('phone', { length: 50 }),
    passwordHash: text('password_hash'), // null = account not activated
    siret: varchar('siret', { length: 14 }),
    stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('users_email_idx').on(table.email)],
);

// 2. Customer Addresses
export const customerAddresses = pgTable('customer_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'billing' | 'shipping'
  line1: varchar('line1', { length: 255 }).notNull(),
  line2: varchar('line2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  postalCode: varchar('postal_code', { length: 10 }).notNull(),
  country: varchar('country', { length: 2 }).default('FR').notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. Products
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  sugarType: varchar('sugar_type', { length: 50 }).notNull().default('Sucre blanc'),
  weightGrams: integer('weight_grams').notNull().default(5),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Price Tiers
export const priceTiers = pgTable('price_tiers', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  label: varchar('label', { length: 100 }).notNull(),
  minQuantity: integer('min_quantity').notNull(),
  maxQuantity: integer('max_quantity'), // null = unlimited
  unitPriceCents: integer('unit_price_cents').notNull(),
  packagingUnit: integer('packaging_unit').notNull().default(500),
  isHighlighted: boolean('is_highlighted').default(false).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 5. Uploaded Logos
export const uploadedLogos = pgTable('uploaded_logos', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  blobUrl: text('blob_url').notNull(),
  fileType: fileTypeEnum('file_type').notNull(),
  fileSizeBytes: integer('file_size_bytes').notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  originalFilename: varchar('original_filename', { length: 255 }).notNull(),
  metadata: jsonb('metadata').$type<LogoMetadata>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 6. Orders
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: serial('order_number').notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  status: orderStatusEnum('status').default('PENDING_PAYMENT').notNull(),
  quantity: integer('quantity').notNull(),
  unitPriceCents: integer('unit_price_cents').notNull(),
  subtotalCents: integer('subtotal_cents').notNull(),
  taxRate: decimal('tax_rate', { precision: 5, scale: 4 }).notNull(),
  vatAmountCents: integer('vat_amount_cents').notNull(),
  shippingCents: integer('shipping_cents').default(0).notNull(),
  totalCents: integer('total_cents').notNull(),
  templateSlug: varchar('template_slug', { length: 50 }).notNull(),
  establishmentName: varchar('establishment_name', { length: 255 }),
  slogan: varchar('slogan', { length: 255 }),
  legalMentions: text('legal_mentions'),
  legalAddress: text('legal_address'),
  sugarType: varchar('sugar_type', { length: 50 }),
  weightGrams: varchar('weight_grams', { length: 20 }),
  stripeSessionId: varchar('stripe_session_id', { length: 255 }),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  customerEmail: varchar('customer_email', { length: 255 }),
  customerCompanyName: varchar('customer_company_name', { length: 255 }),
  customerPhone: varchar('customer_phone', { length: 50 }),
  customerSiret: varchar('customer_siret', { length: 14 }),
  trackingNumber: varchar('tracking_number', { length: 100 }),
  batApprovedAt: timestamp('bat_approved_at', { withTimezone: true }),
  shippedAt: timestamp('shipped_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 7. Order Designs — stores the visual design details for each order
export const orderDesigns = pgTable('order_designs', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  logoId: uuid('logo_id').references(() => uploadedLogos.id, { onDelete: 'set null' }),
  logoUrl: text('logo_url').notNull(),
  colors: jsonb('colors').$type<DesignColors>().notNull(),
  previewUrl: text('preview_url'),
  batPdfUrl: text('bat_pdf_url'),
  designData: jsonb('design_data').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 8. Order Status History — audit trail of all status changes
export const orderStatusHistory = pgTable('order_status_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  fromStatus: orderStatusEnum('from_status'),
  toStatus: orderStatusEnum('to_status').notNull(),
  changedBy: varchar('changed_by', { length: 255 }), // 'system' | 'admin' | user email
  reason: text('reason'),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 9. Global Settings — key/value configuration store
export const globalSettings = pgTable('global_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: jsonb('value').$type<SettingsValue>().notNull(),
  description: text('description'),
  updatedBy: varchar('updated_by', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 10. Shipping Zones
export const shippingZones = pgTable('shipping_zones', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  config: jsonb('config').$type<ShippingZoneConfig>().notNull(),
  shippingCostCents: integer('shipping_cost_cents').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── RELATIONS ───────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(customerAddresses),
  orders: many(orders),
  uploadedLogos: many(uploadedLogos),
}));

export const customerAddressesRelations = relations(customerAddresses, ({ one }) => ({
  user: one(users, {
    fields: [customerAddresses.userId],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  priceTiers: many(priceTiers),
}));

export const priceTiersRelations = relations(priceTiers, ({ one }) => ({
  product: one(products, {
    fields: [priceTiers.productId],
    references: [products.id],
  }),
}));

export const uploadedLogosRelations = relations(uploadedLogos, ({ one }) => ({
  user: one(users, {
    fields: [uploadedLogos.userId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  design: one(orderDesigns),
  statusHistory: many(orderStatusHistory),
}));

export const orderDesignsRelations = relations(orderDesigns, ({ one }) => ({
  order: one(orders, {
    fields: [orderDesigns.orderId],
    references: [orders.id],
  }),
  logo: one(uploadedLogos, {
    fields: [orderDesigns.logoId],
    references: [uploadedLogos.id],
  }),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
  order: one(orders, {
    fields: [orderStatusHistory.orderId],
    references: [orders.id],
  }),
}));
