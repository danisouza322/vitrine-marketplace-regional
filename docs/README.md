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

## Decisões Importantes
- Multi-tenancy: cada empresa tem seus próprios dados isolados.
- CRUD de produtos implementado com rotas RESTful.
- Layout do painel com header fixo, menu responsivo e navegação clara.
- Integração futura com dados reais do tenant via autenticação.
- Estrutura pronta para refino visual avançado (inspirado em Velzon/Figma).

## Próximos Passos Sugeridos
- Refino visual do painel de produtos (filtros, tabela avançada, modal de detalhes).
- Integração com design do Figma (quando disponível).
- Implementação do painel de perfil da loja.
- Integração do tenant_id real via sessão/autenticação.
- Implementação de analytics e dashboard para admin.

## Histórico de Implementação
- Setup inicial do projeto Next.js, Drizzle, banco e autenticação.
- CRUD de produtos funcional e rotas RESTful alinhadas ao painel.
- Dashboard moderno com navegação e layout responsivo.

---

> **Atenção agentes:**
> Consulte este arquivo antes de implementar novas features. Mantenha a documentação atualizada para garantir continuidade e clareza no projeto. 