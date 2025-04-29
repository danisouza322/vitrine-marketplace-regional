import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { tenants } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Verifica se o tenant já existe
    const existingTenant = await db.select({ id: tenants.id })
      .from(tenants)
      .where(eq(tenants.id, 'e7e84d74-ec30-4ae1-881d-4e610e2e5d85'))
      .limit(1);
    
    if (existingTenant.length > 0) {
      return NextResponse.json({ message: 'Tenant já existe', id: existingTenant[0].id });
    }
    
    // Insere o tenant
    await db.insert(tenants).values({
      id: 'e7e84d74-ec30-4ae1-881d-4e610e2e5d85',
      name: 'Empresa Teste',
      slug: 'empresa-teste',
      status: 'active',
      created_at: new Date(),
    });
    
    return NextResponse.json({ success: true, message: 'Tenant criado com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar tenant:', error);
    return NextResponse.json({ error: 'Falha ao criar tenant', details: String(error) }, { status: 500 });
  }
} 