# Migrations do Drizzle ORM

Para rodar as migrations e criar as tabelas no banco PostgreSQL:

1. Certifique-se de que a variável DATABASE_URL está correta no arquivo .env.
2. Execute o comando de migration do Drizzle:

   ```bash
   npx drizzle-kit generate:pg
   npx drizzle-kit push:pg
   ```

Esses comandos vão gerar e aplicar as migrations conforme o schema definido em drizzle/schema.ts. 