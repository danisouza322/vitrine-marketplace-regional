# APIs RESTful

## Visão Geral

A Vitrine Marketplace Regional utiliza o padrão API RESTful para comunicação entre o frontend e o backend. As APIs são organizadas seguindo a convenção de rotas do Next.js App Router, onde cada endpoint é implementado como um arquivo `route.ts` dentro da pasta `app/api/`.

## Endpoints Disponíveis

### Produtos

Base URL: `/api/painel/produtos`

#### GET - Listar Produtos

Retorna uma lista de produtos para o tenant autenticado.

**Resposta de Sucesso:**
```json
{
  "products": [
    {
      "id": "uuid-do-produto",
      "tenant_id": "uuid-do-tenant",
      "name": "Nome do Produto",
      "description": "Descrição do produto",
      "image_url": "https://exemplo.com/imagem.jpg",
      "category": "Categoria",
      "active": true,
      "created_at": "2023-05-01T12:00:00Z"
    }
  ]
}
```

**Resposta de Erro:**
```json
{
  "error": "Erro ao buscar produtos.",
  "details": "Detalhes do erro"
}
```

#### POST - Criar Produto

Cria um novo produto para o tenant autenticado.

**Corpo da Requisição:**
```json
{
  "name": "Nome do Produto",
  "description": "Descrição detalhada",
  "image_url": "https://exemplo.com/imagem.jpg",
  "category": "Eletrônicos",
  "active": true
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "id": "uuid-do-novo-produto"
}
```

**Resposta de Erro:**
```json
{
  "error": "Erro ao criar produto.",
  "details": "Nome é obrigatório."
}
```

#### PUT - Atualizar Produto

Atualiza um produto existente.

**Corpo da Requisição:**
```json
{
  "id": "uuid-do-produto",
  "name": "Nome Atualizado",
  "description": "Nova descrição",
  "image_url": "https://exemplo.com/nova-imagem.jpg",
  "category": "Nova Categoria",
  "active": false
}
```

**Resposta de Sucesso:**
```json
{
  "success": true
}
```

**Resposta de Erro:**
```json
{
  "error": "Erro ao editar produto.",
  "details": "ID é obrigatório."
}
```

#### DELETE - Excluir Produto

Remove um produto existente.

**Corpo da Requisição:**
```json
{
  "id": "uuid-do-produto"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true
}
```

**Resposta de Erro:**
```json
{
  "error": "Erro ao excluir produto.",
  "details": "ID é obrigatório."
}
```

### Autenticação

Base URL: `/api/auth`

A autenticação é gerenciada através do NextAuth.js com os seguintes endpoints:

- **POST `/api/auth/signin`** - Iniciar sessão
- **GET `/api/auth/signout`** - Encerrar sessão
- **GET `/api/auth/session`** - Obter sessão atual
- **GET `/api/auth/csrf`** - Obter token CSRF

### Setup (Desenvolvimento)

Base URL: `/api/setup`

Endpoint temporário para facilitar o desenvolvimento. Cria um tenant com UUID fixo para testes.

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Tenant criado com sucesso!"
}
```

**Se o tenant já existir:**
```json
{
  "message": "Tenant já existe",
  "id": "e7e84d74-ec30-4ae1-881d-4e610e2e5d85"
}
```

## Segurança

Todas as APIs são protegidas pelo middleware de autenticação, que:

1. Verifica se o usuário está autenticado
2. Confirma se o usuário tem permissão para acessar o recurso
3. No caso de APIs de tenant, garante que o usuário só acesse seus próprios recursos

## Convenções

1. **Status HTTP**:
   - 200: Operação bem-sucedida
   - 400: Erro do cliente (dados inválidos)
   - 401: Não autenticado
   - 403: Não autorizado
   - 500: Erro do servidor

2. **Formato de Resposta**:
   - Sucesso: `{ success: true, ... }`
   - Erro: `{ error: "Mensagem", details: "Detalhes" }`

3. **Campos de Data**:
   - Formato ISO 8601: `YYYY-MM-DDTHH:mm:ssZ`

4. **IDs**:
   - UUID v4 para todos os registros

## Exemplo de Consumo

```typescript
// Função para buscar produtos
async function fetchProducts() {
  try {
    const res = await fetch("/api/painel/produtos");
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || "Erro ao buscar produtos");
    }
    
    return data.products;
  } catch (err) {
    console.error("Erro:", err);
    return [];
  }
}
``` 