const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const schema = require('./schema');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
  try {
    console.log('🌱 Inserindo dados iniciais...');
    
    // Inserir tenant com UUID específico
    await db.insert(schema.tenants).values({
      id: 'e7e84d74-ec30-4ae1-881d-4e610e2e5d85',
      name: 'Empresa Teste',
      slug: 'empresa-teste',
      status: 'active',
      created_at: new Date(),
    }).onConflictDoNothing();
    
    console.log('✅ Dados inseridos com sucesso!');
  } catch (e) {
    console.error('❌ Erro ao inserir dados:', e);
  } finally {
    await pool.end();
  }
}

seed(); 