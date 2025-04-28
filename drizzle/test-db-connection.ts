import 'dotenv/config';
import { Client } from 'pg';

async function testConnection() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log('Conexão com o PostgreSQL bem-sucedida!');
    await client.end();
  } catch (e) {
    console.error('Erro ao conectar:', e);
  }
}

testConnection(); 