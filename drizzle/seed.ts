import { db } from '../lib/db';
import { plans } from './schema';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  const planId = uuidv4();
  await db.insert(plans).values({
    id: planId,
    name: 'Plano Básico',
    product_limit: 20,
    price: '0.00',
    features: 'Limite de 20 produtos',
  });
  console.log('Plano Básico inserido com sucesso!');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
}); 