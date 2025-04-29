import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { products } from '../../../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// TODO: Integrar tenant_id da sessão (por enquanto, usar um valor fixo para protótipo)
const TENANT_ID = 'e7e84d74-ec30-4ae1-881d-4e610e2e5d85'; // Usando um UUID válido para testes

export async function GET() {
  try {
    console.log('Buscando produtos para tenant:', TENANT_ID);
    const result = await db.select().from(products).where(eq(products.tenant_id, TENANT_ID));
    console.log('Produtos encontrados:', result.length);
    return NextResponse.json({ products: result });
  } catch (e) {
    console.error('Erro ao buscar produtos:', e);
    return NextResponse.json({ error: 'Erro ao buscar produtos.', details: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, image_url, category, active } = await req.json();
    if (!name) return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 });
    
    console.log('Criando produto:', { name, category, tenantId: TENANT_ID });
    
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
    
    console.log('Produto criado com sucesso, ID:', id);
    return NextResponse.json({ success: true, id });
  } catch (e) {
    console.error('Erro ao criar produto:', e);
    return NextResponse.json({ error: 'Erro ao criar produto.', details: String(e) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, description, image_url, category, active } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
    
    console.log('Atualizando produto:', { id, name, category });
    
    await db.update(products)
      .set({ name, description, image_url, category, active })
      .where(and(eq(products.id, id), eq(products.tenant_id, TENANT_ID)));
    
    console.log('Produto atualizado com sucesso');
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Erro ao editar produto:', e);
    return NextResponse.json({ error: 'Erro ao editar produto.', details: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
    
    console.log('Excluindo produto:', id);
    
    await db.delete(products).where(and(eq(products.id, id), eq(products.tenant_id, TENANT_ID)));
    
    console.log('Produto excluído com sucesso');
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Erro ao excluir produto:', e);
    return NextResponse.json({ error: 'Erro ao excluir produto.', details: String(e) }, { status: 500 });
  }
} 