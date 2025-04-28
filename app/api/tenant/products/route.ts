import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { products } from '../../../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// TODO: Integrar tenant_id da sessão (por enquanto, usar um valor fixo para protótipo)
const TENANT_ID = 'tenant-id-fake';

export async function GET() {
  try {
    const result = await db.select().from(products).where(eq(products.tenant_id, TENANT_ID));
    return NextResponse.json({ products: result });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao buscar produtos.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, image_url, category, active } = await req.json();
    if (!name) return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 });
    const id = uuidv4();
    await db.insert(products).values({
      id,
      tenant_id: TENANT_ID,
      name,
      description,
      image_url,
      category,
      active: active ?? true,
      created_at: new Date(),
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao criar produto.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, description, image_url, category, active } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
    await db.update(products)
      .set({ name, description, image_url, category, active })
      .where(and(eq(products.id, id), eq(products.tenant_id, TENANT_ID)));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao editar produto.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
    await db.delete(products).where(and(eq(products.id, id), eq(products.tenant_id, TENANT_ID)));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao excluir produto.' }, { status: 500 });
  }
} 