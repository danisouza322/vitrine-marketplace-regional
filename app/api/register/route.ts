import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { tenants, users, plans } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, whatsapp } = await req.json();
    if (!name || !email || !password || !whatsapp) {
      return NextResponse.json({ error: 'Dados obrigatórios faltando.' }, { status: 400 });
    }
    // Verifica se já existe usuário
    const existing = await db.select().from(users).where(eq(users.email, email)).then(res => res[0]);
    if (existing) {
      return NextResponse.json({ error: 'Email já cadastrado.' }, { status: 409 });
    }
    // Plano padrão (primeiro plano cadastrado)
    const plan = await db.select().from(plans).then(res => res[0]);
    if (!plan) {
      return NextResponse.json({ error: 'Nenhum plano disponível.' }, { status: 500 });
    }
    const tenantId = uuidv4();
    const userId = uuidv4();
    await db.insert(tenants).values({
      id: tenantId,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      whatsapp,
      plan_id: plan.id,
      status: 'active',
      created_at: new Date(),
    });
    await db.insert(users).values({
      id: userId,
      tenant_id: tenantId,
      email,
      password_hash: await hash(password, 10),
      role: 'tenant',
      created_at: new Date(),
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao registrar.' }, { status: 500 });
  }
} 