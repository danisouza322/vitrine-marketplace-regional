import 'dotenv/config';
import { Client } from 'pg';

async function seed() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(
    `INSERT INTO plans (id, name, product_limit, price, features)
     VALUES (gen_random_uuid(), 'Plano Básico', 20, '0.00', 'Limite de 20 produtos')`
  );
  console.log('Plano Básico inserido com sucesso!');
  await client.end();
}

seed().catch(console.error); 