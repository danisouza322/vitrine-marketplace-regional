-- Inserir tenant para teste
INSERT INTO tenants (id, name, slug, logo, description, status, created_at)
VALUES ('e7e84d74-ec30-4ae1-881d-4e610e2e5d85', 'Empresa Teste', 'empresa-teste', NULL, 'Empresa para testes', 'active', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING; 