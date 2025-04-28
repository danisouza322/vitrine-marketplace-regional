# Vitrine Marketplace Regional

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
```
/
├── app/
│   ├── admin/
│   ├── tenant/
│   ├── [tenant]/
│   └── api/
├── components/
├── lib/
├── drizzle/
│   ├── schema.ts
│   └── migrations/
├── public/
├── styles/
│   └── globals.css
```

## Setup Inicial
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o banco de dados PostgreSQL e variáveis de ambiente.
3. Rode as migrations do Drizzle.
4. Inicie o projeto:
   ```bash
   npm run dev
   ```

## Regras e Guidelines
Consulte `.cursor/rules/contributing.mdc` para padrões de código, multi-tenancy, segurança e fluxo de trabalho. 