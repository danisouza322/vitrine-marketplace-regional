# Sistema de Autenticação

## Visão Geral

O sistema de autenticação da Vitrine Marketplace Regional foi implementado usando Next-Auth com JWT e oferece as seguintes funcionalidades:

- Login com credenciais (email/senha)
- Sistema de roles (admin/tenant)
- Proteção de rotas baseada em perfil
- Redirecionamento inteligente

## Estrutura

### Componentes Principais

1. **NextAuth Handler** (`app/api/auth/[...nextauth]/route.ts`)
   - Configuração principal do NextAuth
   - Processamento de credenciais
   - Callbacks de JWT e sessão

2. **Middleware** (`middleware.ts`)
   - Interceptação de requisições HTTP
   - Verificação de autenticação
   - Controle de acesso baseado em roles

3. **Utilitários de Autenticação** (`lib/auth.ts`)
   - Funções helper para componentes de servidor
   - Verificação de permissões
   - Acesso à sessão do usuário

4. **Cliente Session Provider** (`app/providers.tsx`)
   - Disponibiliza contexto de autenticação para componentes cliente

## Fluxo de Autenticação

1. Usuário acessa a página de login (`/login`)
2. Credenciais são enviadas ao endpoint NextAuth
3. NextAuth valida as credenciais com o banco de dados
4. Se válido, gera token JWT com dados do usuário
5. Middleware verifica token em cada requisição
6. Middleware redireciona usuário com base em seu role

## Roles e Permissões

### `admin`
- Acesso ao painel administrativo (`/admin/*`)
- Pode gerenciar todos os tenants
- Acesso a recursos de configuração global

### `tenant`
- Acesso ao painel do tenant (`/painel/*`) 
- Gerencia apenas seus próprios recursos
- Não tem acesso às áreas administrativas

## Proteção de Rotas

### Server-Side
```typescript
// Em componentes do servidor
import { checkPermission } from '@/lib/auth';

export default async function AdminPage() {
  // Somente admin pode acessar
  const session = await checkPermission('admin');
  // Resto do componente...
}
```

### Client-Side 
```typescript
// Em componentes do cliente
'use client';
import { useSession } from '@/lib/auth';

export function ProfileButton() {
  const { data: session } = useSession();
  
  if (!session) return null;
  
  return <span>Olá, {session.user?.email}</span>;
}
```

## Redirecionamento

- Usuário não autenticado → `/login`
- Role `tenant` tentando acessar `/admin/*` → `/login`
- Role `admin` tentando acessar `/painel/*` → `/login` 
- Tenant tentando acessar tenant de outro usuário → `/painel`

## Logout

O sistema oferece uma função de logout que limpa a sessão e redireciona para a página de login:

```typescript
// Em componentes do cliente
import { signOut } from 'next-auth/react';

// Logout com redirecionamento para login
signOut({ callbackUrl: '/login' });
``` 