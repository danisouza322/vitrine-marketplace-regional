import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { db } from './db';
import { tenants } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { authOptions } from '../app/api/auth/[...nextauth]/route';

// Tipos de permissões
export type Permission = 'admin' | 'tenant' | 'any';

// Obter sessão no servidor
export async function getSession() {
  return await getServerSession(authOptions);
}

// Verificar se o usuário está logado (server component)
export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    redirect('/login');
  }
  return session;
}

// Verificar permissão por role (server component)
export async function checkPermission(requiredPermission: Permission = 'any') {
  const session = await requireAuth();
  const userRole = session.user?.role;
  
  switch (requiredPermission) {
    case 'admin':
      if (userRole !== 'admin') {
        redirect('/login');
      }
      break;
    case 'tenant':
      if (userRole !== 'tenant') {
        redirect('/login');
      }
      break;
    case 'any':
      // Já verificado por requireAuth
      break;
  }
  
  return session;
}

// Verificar acesso a um tenant específico
export async function checkTenantAccess(tenantId: string) {
  const session = await requireAuth();
  const userRole = session.user?.role;
  const userTenantId = session.user?.tenant_id;
  
  // Admins podem acessar qualquer tenant
  if (userRole === 'admin') {
    return true;
  }
  
  // Tenants só podem acessar seu próprio tenant
  if (userRole === 'tenant' && userTenantId === tenantId) {
    return true;
  }
  
  return false;
}

// Verificar se um tenant existe
export async function getTenantIfExists(tenantId: string) {
  const tenant = await db.select()
    .from(tenants)
    .where(eq(tenants.id, tenantId))
    .limit(1)
    .then(res => res[0] || null);
  
  return tenant;
}

// Hooks para cliente (reexportar)
export { useSession, signIn, signOut } from 'next-auth/react'; 