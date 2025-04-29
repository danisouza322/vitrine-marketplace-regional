# Documentação do Projeto Vitrine Marketplace Regional

## Visão Geral
Plataforma multi-tenant para vitrines online regionais, onde cada empresa possui sua própria loja (tenant) e os produtos são exibidos para visualização, com contato via WhatsApp. Não há pagamento online.

## Arquitetura
- **Frontend/Backend:** Next.js (App Router)
- **ORM:** Drizzle ORM
- **Banco:** PostgreSQL
- **Autenticação:** NextAuth.js (empresas/admin)
- **Estilização:** TailwindCSS
- **Armazenamento de imagens:** Cloudinary/S3

## Estrutura de Pastas
- `/painel` — Dashboard principal do tenant
- `/painel/produtos` — CRUD de produtos
- `/painel/perfil` — Perfil da loja
- `/api/painel/produtos` — API RESTful de produtos
- `/register` — Cadastro de empresa
- `/login` — Login de empresa/admin

## Documentação do Sistema
- [Autenticação](./AUTHENTICATION.md) - Detalhes do sistema de autenticação e autorização
- [API RESTful](./API.md) - Documentação das APIs disponíveis *(em desenvolvimento)*
- [Middleware](./MIDDLEWARE.md) - Como funciona o middleware e proteção de rotas *(em desenvolvimento)*

## Decisões Importantes
- Multi-tenancy: cada empresa tem seus próprios dados isolados.
- CRUD de produtos implementado com rotas RESTful.
- Layout do painel com header fixo, menu responsivo e navegação clara.
- Autenticação robusta com roles e permissões (admin/tenant).
- Middleware para proteção de rotas baseada em perfil.
- Estrutura pronta para refino visual avançado (inspirado em Velzon/Figma).

## Atualização Recente (Maio 2023)
- **Sistema de Autenticação**: Implementação completa com NextAuth.js
  - JWT para armazenamento de sessão
  - Middleware para proteção de rotas
  - Sistema de roles (admin/tenant)
  - Redirecionamento inteligente baseado em perfil
- **Correção de Redirecionamento**: Resolvido problema de loop de redirecionamento após login
- **Botão de Logout**: Implementado componente de logout para fácil navegação

## Próximos Passos Sugeridos
- Refino visual do painel de produtos (filtros, tabela avançada, modal de detalhes).
- Integração com design do Figma (quando disponível).
- Implementação do painel de perfil da loja.
- Integração do tenant_id real via sessão/autenticação.
- Implementação de analytics e dashboard para admin.
- 2FA para maior segurança na autenticação.
- Recuperação de senha via email.

## Histórico de Implementação
- Setup inicial do projeto Next.js, Drizzle, banco e autenticação.
- CRUD de produtos funcional e rotas RESTful alinhadas ao painel.
- Dashboard moderno com navegação e layout responsivo.
- Sistema de autenticação robusto com proteção de rotas.

## Setup do Banco de Dados

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure o arquivo `.env` na raiz do projeto, baseado no `.env.example`.

3. Rode as migrations do banco:
   ```bash
   npx drizzle-kit push:pg
   ```
   *(ou configure um script no package.json para facilitar: `"drizzle:migrate": "npx drizzle-kit push:pg"`)*
   
4. (Opcional) Rode as seeds:
   ```bash
   npx tsx drizzle/seed-pg.ts
   ```
   *(ou configure um script: `"drizzle:seed": "npx tsx drizzle/seed-pg.ts"`)*

## Onboarding em Nova Máquina

1. Clone o repositório.
2. Copie `.env.example` para `.env` e preencha os valores.
3. Instale as dependências: `npm install`
4. Rode as migrations e seeds conforme acima.
5. Inicie o projeto: `npm run dev`

---

> **Atenção agentes:**
> Consulte este arquivo antes de implementar novas features. Mantenha a documentação atualizada para garantir continuidade e clareza no projeto. 

# .env.example

# Banco de dados
DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco

# Autenticação NextAuth
NEXTAUTH_SECRET=sua_chave_secreta
NEXTAUTH_URL=http://localhost:3000

# (Opcional) Cloudinary/S3 para imagens
# CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
# S3_BUCKET=nome-do-bucket
# S3_ACCESS_KEY=chave
# S3_SECRET_KEY=segredo 