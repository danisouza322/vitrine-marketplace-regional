# Middleware de Autenticação

## Visão Geral

O middleware é um componente crítico do sistema de autenticação e autorização da Vitrine Marketplace, interceptando todas as requisições HTTP antes que cheguem aos componentes da aplicação. Sua função principal é verificar a autenticação e autorização do usuário para cada rota.

## Implementação

O middleware está implementado no arquivo `middleware.ts` na raiz do projeto e utiliza a funcionalidade `withAuth` do NextAuth.js para simplificar a integração.

```typescript
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    
    // Lógica de autorização e redirecionamento
    // ...
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // Deixamos o nosso middleware decidir
    },
  }
);
```

## Funcionalidades Principais

### 1. Proteção de Rotas

O middleware protege todas as rotas que não são explicitamente definidas como públicas. Rotas que exigem autenticação incluem:

- `/painel/*` - Dashboard e funcionalidades do tenant
- `/admin/*` - Área administrativa
- `/tenant/*` - Acesso a tenant específico

### 2. Verificação de Role

Cada rota tem requisitos específicos de role:

- Rotas `/admin/*` exigem role `admin`
- Rotas `/painel/*` exigem role `tenant`
- Rotas `/tenant/:id/*` exigem que o ID do tenant corresponda ao do usuário logado

### 3. Redirecionamento Inteligente

O middleware implementa lógica de redirecionamento com base no contexto:

- Usuários não autenticados são redirecionados para `/login`
- Usuários autenticados tentando acessar `/login` são redirecionados para sua área apropriada
- Tenants tentando acessar áreas admin são redirecionados para `/login`
- Admins tentando acessar áreas de tenant são redirecionados conforme necessário

### 4. Depuração

O middleware inclui logs que auxiliam na depuração:

```
Middleware executando para: /painel
Token existe: true
Token data: { role: 'tenant', tenantId: 'e7e84d74-ec30-4ae1-881d-4e610e2e5d85' }
```

## Configuração do Matcher

O middleware é aplicado a todas as rotas através da configuração:

```typescript
export const config = {
  matcher: [
    '/(.*)', // Aplica a todas as rotas
  ],
};
```

## Fluxograma de Decisão

```
┌─────────────────┐
│ Requisição HTTP │
└────────┬────────┘
         ▼
┌────────────────┐     Sim     ┌──────────────────┐
│ Rota Pública?  ├────────────►│ Usuário logado?  │
└────────┬───────┘             └────────┬─────────┘
         │ Não                          │ Sim
         ▼                              ▼
┌────────────────┐             ┌──────────────────┐
│ Usuário logado?│     Não     │ Redirecionar para│
└────────┬───────┴────────────►│ área apropriada  │
         │ Sim                 └──────────────────┘
         ▼
┌────────────────┐     Não     ┌──────────────────┐
│ Role correto?  ├────────────►│ Redirecionar para│
└────────┬───────┘             │ /login           │
         │ Sim                 └──────────────────┘
         ▼
┌────────────────┐
│ Permitir acesso│
└────────────────┘
```

## Customização

Para adicionar novas verificações de autorização ou alterar o comportamento do middleware, edite o arquivo `middleware.ts`. Exemplos de alterações comuns:

- Adicionar novas rotas públicas
- Modificar regras de redirecionamento
- Adicionar novos roles e permissões
- Incluir verificação de acesso baseada em recursos específicos 