import { unstable_cache } from 'next/cache'
import { db } from './db'
import { eq, desc, and, sql } from 'drizzle-orm'
import { products, categories, views, leads } from './db/schema'

interface QueryResult {
  count: number
}

interface ConversionResult {
  rate: number
}

// Cache de produtos por tenant
export const getCachedTenantProducts = unstable_cache(
  async (tenantId: number) => {
    return await db
      .select()
      .from(products)
      .where(and(
        eq(products.tenantId, tenantId),
        eq(products.active, true)
      ))
      .orderBy(desc(products.createdAt))
  },
  ['tenant-products'],
  { revalidate: 60, tags: ['products'] }
)

// Cache de categorias por tenant
export const getCachedTenantCategories = unstable_cache(
  async (tenantId: number) => {
    return await db
      .select()
      .from(categories)
      .where(and(
        eq(categories.tenantId, tenantId),
        eq(categories.active, true)
      ))
      .orderBy(desc(categories.createdAt))
  },
  ['tenant-categories'],
  { revalidate: 300, tags: ['categories'] }
)

// Cache de produtos em destaque
export const getCachedFeaturedProducts = unstable_cache(
  async (tenantId: number, limit = 6) => {
    return await db
      .select()
      .from(products)
      .where(and(
        eq(products.tenantId, tenantId),
        eq(products.active, true),
        eq(products.featured, true)
      ))
      .limit(limit)
      .orderBy(desc(products.createdAt))
  },
  ['featured-products'],
  { revalidate: 120, tags: ['products'] }
)

// Cache de métricas do tenant
export const getCachedTenantMetrics = unstable_cache(
  async (tenantId: number) => {
    const [
      totalProducts,
      totalViews,
      totalLeads,
      conversionRate
    ] = await Promise.all([
      // Total de produtos ativos
      db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(and(
          eq(products.tenantId, tenantId),
          eq(products.active, true)
        ))
        .then((res: QueryResult[]) => res[0]?.count ?? 0),

      // Total de visualizações nos últimos 30 dias
      db
        .select({ count: sql<number>`count(*)` })
        .from(views)
        .where(and(
          eq(views.tenantId, tenantId),
          sql`created_at > now() - interval '30 days'`
        ))
        .then((res: QueryResult[]) => res[0]?.count ?? 0),

      // Total de leads nos últimos 30 dias
      db
        .select({ count: sql<number>`count(*)` })
        .from(leads)
        .where(and(
          eq(leads.tenantId, tenantId),
          sql`created_at > now() - interval '30 days'`
        ))
        .then((res: QueryResult[]) => res[0]?.count ?? 0),

      // Taxa de conversão (leads/views) dos últimos 30 dias
      db
        .select({
          rate: sql<number>`
            ROUND(
              CAST(COUNT(DISTINCT ${leads.id}) AS DECIMAL) /
              NULLIF(COUNT(DISTINCT ${views.id}), 0) * 100,
              2
            )
          `
        })
        .from(views)
        .leftJoin(leads, and(
          eq(leads.tenantId, views.tenantId),
          eq(leads.productId, views.productId),
          sql`${leads.createdAt} >= ${views.createdAt}`
        ))
        .where(and(
          eq(views.tenantId, tenantId),
          sql`${views.createdAt} > now() - interval '30 days'`
        ))
        .then((res: ConversionResult[]) => res[0]?.rate ?? 0)
    ])

    return {
      totalProducts,
      totalViews,
      totalLeads,
      conversionRate
    }
  },
  ['tenant-metrics'],
  { revalidate: 300, tags: ['metrics', 'products', 'views', 'leads'] }
)

// Cache de produtos mais vistos
export const getCachedMostViewedProducts = unstable_cache(
  async (tenantId: number, limit = 5) => {
    return await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        images: products.images,
        viewCount: sql<number>`count(${views.id})`
      })
      .from(products)
      .leftJoin(views, eq(views.productId, products.id))
      .where(and(
        eq(products.tenantId, tenantId),
        eq(products.active, true),
        sql`${views.createdAt} > now() - interval '30 days'`
      ))
      .groupBy(products.id)
      .orderBy(desc(sql`count(${views.id})`))
      .limit(limit)
  },
  ['most-viewed-products'],
  { revalidate: 3600, tags: ['products', 'views'] }
)

// Cache de produtos por categoria
export const getCachedProductsByCategory = unstable_cache(
  async (tenantId: number, categoryId: number) => {
    return await db
      .select()
      .from(products)
      .where(and(
        eq(products.tenantId, tenantId),
        eq(products.categoryId, categoryId),
        eq(products.active, true)
      ))
      .orderBy(desc(products.createdAt))
  },
  ['category-products'],
  { revalidate: 60, tags: ['products'] }
) 