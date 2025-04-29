import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// Configuração do pool de conexões
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Criação da instância do Drizzle
export const db = drizzle(pool, { schema })

// Função helper para obter o tenant_id da sessão
export async function getCurrentTenantId(): Promise<number | null> {
  // TODO: Implementar lógica de obtenção do tenant_id da sessão
  return null
}

// Função helper para validar acesso ao tenant
export async function validateTenantAccess(tenantId: number): Promise<boolean> {
  // TODO: Implementar lógica de validação de acesso ao tenant
  return true
} 