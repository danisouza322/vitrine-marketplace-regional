import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  jsonb,
  decimal,
  integer,
  varchar,
  uuid,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { sql } from 'drizzle-orm'

// Tabela de Tenants (Empresas)
export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  logo: text('logo_url'),
  whatsapp: varchar('whatsapp', { length: 20 }),
  active: boolean('active').default(true).notNull(),
  settings: jsonb('settings').$type<{
    theme: {
      primaryColor: string
      secondaryColor: string
    }
    contact: {
      email: string
      phone: string
      address: string
    }
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Tabela de Categorias
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  description: text('description'),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Tabela de Produtos
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').references(() => categories.id),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }),
  comparePrice: decimal('compare_price', { precision: 10, scale: 2 }),
  images: jsonb('images').$type<string[]>().default([]),
  featured: boolean('featured').default(false),
  active: boolean('active').default(true).notNull(),
  metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Tabela de Visualizações
export const views = pgTable('views', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }),
  sessionId: uuid('session_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Tabela de Contatos/Leads
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  productId: integer('product_id').references(() => products.id),
  name: varchar('name', { length: 255 }),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }),
  message: text('message'),
  status: varchar('status', { length: 20 }).default('new').notNull(),
  metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Definição das Relações

export const tenantsRelations = relations(tenants, ({ many }) => ({
  products: many(products),
  categories: many(categories),
  leads: many(leads),
  views: many(views),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [categories.tenantId],
    references: [tenants.id],
  }),
  products: many(products),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [products.tenantId],
    references: [tenants.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  views: many(views),
  leads: many(leads),
}))

// Schemas de Validação com Zod
export const insertTenantSchema = createInsertSchema(tenants)
export const selectTenantSchema = createSelectSchema(tenants)

export const insertProductSchema = createInsertSchema(products)
export const selectProductSchema = createSelectSchema(products)

export const insertCategorySchema = createInsertSchema(categories)
export const selectCategorySchema = createSelectSchema(categories)

export const insertLeadSchema = createInsertSchema(leads)
export const selectLeadSchema = createSelectSchema(leads)

// Índices e Triggers (serão criados via migrations)
export const createIndexes = sql`
  CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON products (tenant_id);
  CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);
  CREATE INDEX IF NOT EXISTS idx_products_active ON products (active);
  CREATE INDEX IF NOT EXISTS idx_products_featured ON products (featured);
  CREATE INDEX IF NOT EXISTS idx_categories_tenant_id ON categories (tenant_id);
  CREATE INDEX IF NOT EXISTS idx_views_tenant_id ON views (tenant_id);
  CREATE INDEX IF NOT EXISTS idx_views_product_id ON views (product_id);
  CREATE INDEX IF NOT EXISTS idx_leads_tenant_id ON leads (tenant_id);
  CREATE INDEX IF NOT EXISTS idx_leads_product_id ON leads (product_id);
  CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
`

// Trigger para atualizar updated_at
export const createUpdateTrigger = sql`
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
` 