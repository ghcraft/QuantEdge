# 🚀 Setup de Produção - QuantEdge Pro

## 📋 Pré-requisitos

1. Node.js 18+ instalado
2. Banco de dados (SQLite para desenvolvimento, PostgreSQL recomendado para produção)

## 🔧 Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (GERE UMA CHAVE SEGURA EM PRODUÇÃO!)
# Use: openssl rand -base64 32
JWT_SECRET="your-secret-key-change-in-production-minimum-32-characters"
JWT_EXPIRES_IN="30d"

# Environment
NODE_ENV="production"

# API Keys (opcional)
# BINANCE_API_KEY=""
# YAHOO_FINANCE_API_KEY=""

# Allowed Origins (para CORS em produção)
# ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
```

### 2. Gerar JWT Secret Seguro

```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 3. Configurar Banco de Dados

#### SQLite (Desenvolvimento)
```bash
# Já configurado por padrão
DATABASE_URL="file:./dev.db"
```

#### PostgreSQL (Produção Recomendado)
```bash
# Atualize prisma/schema.prisma:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# E configure DATABASE_URL:
DATABASE_URL="postgresql://user:password@localhost:5432/quantedge?schema=public"
```

### 4. Executar Migrations

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrations
npx prisma migrate deploy
```

## 🔐 Segurança

### Headers de Segurança
- ✅ Content Security Policy (CSP) configurado
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ HSTS habilitado em HTTPS

### Autenticação
- ✅ JWT com expiração de 30 dias
- ✅ Bcrypt para hash de senhas (12 rounds)
- ✅ Validação de força de senha
- ✅ Cookies HTTP-only

### Rate Limiting
- ✅ 200 requisições/minuto por IP nas APIs

## 📊 Monitoramento

### Logs
- Sistema de logging centralizado em `lib/logger.ts`
- Níveis: info, warn, error, debug
- Em produção, integrar com:
  - Sentry (erros)
  - LogRocket (sessões)
  - Datadog (métricas)

### Métricas Recomendadas
- Taxa de erro de autenticação
- Tempo de resposta das APIs
- Uso de memória/CPU
- Requisições por minuto

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório GitHub
2. Configure variáveis de ambiente no painel
3. Configure build command:
   ```bash
   npm run build
   ```
4. Configure output directory: `.next`

### Outros Provedores

#### Railway
```bash
railway up
```

#### Render
- Configure build: `npm run build`
- Configure start: `npm start`

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔄 Migração de Dados (localStorage → Banco)

Se você já tem usuários no localStorage, crie um script de migração:

```typescript
// scripts/migrate-localStorage.ts
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/security/password";

// Ler dados do localStorage (via export manual)
// Migrar para banco de dados
```

## ✅ Checklist de Produção

- [ ] JWT_SECRET configurado e seguro
- [ ] DATABASE_URL configurado
- [ ] NODE_ENV=production
- [ ] HTTPS habilitado
- [ ] CORS configurado corretamente
- [ ] Rate limiting ativo
- [ ] Logs configurados
- [ ] Backup do banco de dados
- [ ] Monitoramento configurado
- [ ] Testes executados
- [ ] Documentação atualizada

## 📝 Notas Importantes

1. **Nunca commite o arquivo `.env`**
2. **Use variáveis de ambiente no provedor de deploy**
3. **Gere JWT_SECRET único para cada ambiente**
4. **Configure backups automáticos do banco**
5. **Monitore logs regularmente**

