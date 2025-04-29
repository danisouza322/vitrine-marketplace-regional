import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

// Middleware sem o wrapper withAuth para termos mais controle
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    
    // Verificar se o token está presente e tem os dados necessários
    console.log('Middleware executando para:', pathname);
    console.log('Token existe:', !!token);
    console.log('Token data:', {
      role: token?.role,
      tenantId: token?.tenant_id
    });
    
    // Informações do usuário da sessão
    const userRole = token?.role || '';
    const tenantId = token?.tenant_id || '';
    
    // Páginas públicas que não precisam de autenticação
    if (['/login', '/register', '/'].includes(pathname)) {
      // Se já está autenticado e tentando acessar login/register, redireciona para painel
      if (token) {
        if (userRole === 'tenant') {
          return NextResponse.redirect(new URL('/painel', req.url));
        } else if (userRole === 'admin') {
          return NextResponse.redirect(new URL('/admin', req.url));
        }
      }
      return NextResponse.next();
    }
    
    // A partir daqui, todas as rotas precisam de autenticação
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // Verificações de acesso baseadas em perfil
    
    // Rota de admin (somente role "admin")
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // Rota de tenant/painel (apenas usuários com role=tenant)
    if (pathname.startsWith('/painel') && userRole !== 'tenant') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // Rota /tenant (redirecionamento para /painel para usuários tenant)
    if (pathname === '/tenant' && userRole === 'tenant') {
      return NextResponse.redirect(new URL('/painel', req.url));
    }
    
    // Rota /tenant deve ser acessível apenas por admins se não for um redirecionamento
    if (pathname === '/tenant' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // Se for uma rota específica de tenant, verifica se o tenant_id na URL corresponde ao tenant_id do usuário
    if (pathname.startsWith('/tenant/') && userRole === 'tenant') {
      const pathTenantId = pathname.split('/')[2]; // Pega o ID da URL (/tenant/:id/...)
      if (pathTenantId && pathTenantId !== tenantId) {
        return NextResponse.redirect(new URL('/painel', req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Apenas verifica se o token existe, mas não bloqueia - 
        // deixamos o middleware decidir o que fazer
        return true;
      },
    },
  }
);

// Configurar quais rotas devem passar pelo middleware
export const config = {
  matcher: [
    // Todas as rotas passam pelo middleware
    '/(.*)',
  ],
}; 