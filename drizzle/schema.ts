import { pgTable, uuid, varchar, text, timestamp, integer, decimal, boolean } from 'drizzle-orm/pg-core';

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }),
  slug: varchar('slug', { length: 50 }).unique(),
  logo: varchar('logo', { length: 255 }),
  description: text('description'),
  whatsapp: varchar('whatsapp', { length: 20 }),
  plan_id: uuid('plan_id').references(() => plans.id),
  status: varchar('status', { length: 20 }),
  created_at: timestamp('created_at').defaultNow(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id').references(() => tenants.id),
  email: varchar('email', { length: 100 }).unique(),
  password_hash: varchar('password_hash', { length: 255 }),
  role: varchar('role', { length: 20 }), // 'admin' | 'tenant'
  created_at: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id').references(() => tenants.id),
  name: varchar('name', { length: 100 }),
  description: text('description'),
  image_url: varchar('image_url', { length: 255 }),
  category: varchar('category', { length: 50 }),
  active: boolean('active').default(true),
  created_at: timestamp('created_at').defaultNow(),
});

export const plans = pgTable('plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }),
  product_limit: integer('product_limit'),
  price: decimal('price', { precision: 10, scale: 2 }),
  features: text('features'),
});

export const analytics = pgTable('analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id').references(() => tenants.id),
  product_id: uuid('product_id').references(() => products.id),
  event_type: varchar('event_type', { length: 20 }),
  timestamp: timestamp('timestamp').defaultNow(),
  ip: varchar('ip', { length: 45 }),
}); 