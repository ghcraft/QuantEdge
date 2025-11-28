# 🔐 Variáveis de Ambiente para Vercel

## 📋 Variáveis Obrigatórias

Configure estas variáveis no painel da Vercel:

### 1. DATABASE_URL
**Obrigatória** - String de conexão do PostgreSQL

```
DATABASE_URL=postgresql://usuario:senha@host:5432/quantedge?schema=public
```

**Exemplos:**
- **Neon (Recomendado)**: `postgresql://usuario:senha@ep-xxx-xxx.us-east-2.aws.neon.tech/quantedge?sslmode=require`
- **Vercel Postgres**: `postgres://default:xxx@xxx.aws.neon.tech:5432/verceldb`
- **Supabase**: `postgresql://postgres:senha@db.xxx.supabase.co:5432/postgres`
- **Local**: `postgresql://postgres:1132@localhost:5432/quantedge?schema=public`

### 2. JWT_SECRET
**Obrigatória** - Chave secreta para assinar tokens JWT

```
JWT_SECRET=ZYoNZgHo980Hd0VOG+2z/2mGttF6IbF3+ckprLomAVQ=
```

**⚠️ IMPORTANTE**: Gere uma nova chave secreta para produção:
```bash
# No terminal, gere uma chave segura:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. NODE_ENV
**Obrigatória** - Ambiente de execução

```
NODE_ENV=production
```

## 📋 Variáveis Opcionais

### 4. JWT_EXPIRES_IN
**Opcional** - Tempo de expiração do token JWT (padrão: 30d)

```
JWT_EXPIRES_IN=30d
```

**Valores aceitos:**
- `30d` - 30 dias (padrão)
- `7d` - 7 dias
- `1h` - 1 hora
- `3600` - 3600 segundos

### 5. ALLOWED_ORIGINS
**Opcional** - Origens permitidas para CORS (separadas por vírgula)

```
ALLOWED_ORIGINS=https://quantedge.vercel.app,https://www.quantedge.com
```

## 🚀 Como Configurar na Vercel

### Passo 1: Acesse o Painel
1. Vá para https://vercel.com
2. Faça login e selecione seu projeto

### Passo 2: Adicione Variáveis
1. Clique em **Settings** (Configurações)
2. Clique em **Environment Variables** (Variáveis de Ambiente)
3. Adicione cada variável:

#### Para Production:
- **Name**: `DATABASE_URL`
- **Value**: `postgresql://usuario:senha@host:5432/quantedge?schema=public`
- **Environment**: ✅ Production
- Clique em **Save**

- **Name**: `JWT_SECRET`
- **Value**: `ZYoNZgHo980Hd0VOG+2z/2mGttF6IbF3+ckprLomAVQ=` (ou gere uma nova)
- **Environment**: ✅ Production
- Clique em **Save**

- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environment**: ✅ Production
- Clique em **Save**

- **Name**: `JWT_EXPIRES_IN` (opcional)
- **Value**: `30d`
- **Environment**: ✅ Production
- Clique em **Save**

#### Para Preview/Development (opcional):
Repita o processo acima marcando ✅ Preview e ✅ Development

### Passo 3: Verificar
Após adicionar todas as variáveis:
1. Vá para **Deployments**
2. Clique nos **3 pontos** do último deploy
3. Selecione **Redeploy**
4. Aguarde o build completar

## 🔍 Verificar se Está Funcionando

Após o deploy, teste:
1. Acesse: `https://seu-projeto.vercel.app/api/auth/register`
2. Tente criar uma conta
3. Se funcionar, as variáveis estão corretas!

## 🗄️ Configurar Banco de Dados

### Opção 1: Vercel Postgres (Integrado)
1. No painel da Vercel, vá em **Storage**
2. Clique em **Create Database**
3. Selecione **Postgres**
4. A Vercel criará automaticamente a variável `DATABASE_URL`

### Opção 2: Neon (Recomendado - Gratuito)
1. Acesse https://neon.tech
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a **Connection String**
5. Cole no campo `DATABASE_URL` na Vercel

### Opção 3: Supabase (Gratuito)
1. Acesse https://supabase.com
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Vá em **Settings** → **Database**
5. Copie a **Connection String**
6. Cole no campo `DATABASE_URL` na Vercel

## 📝 Exemplo Completo de Configuração

```
DATABASE_URL=postgresql://postgres:senha@ep-xxx-xxx.us-east-2.aws.neon.tech/quantedge?sslmode=require
JWT_SECRET=ZYoNZgHo980Hd0VOG+2z/2mGttF6IbF3+ckprLomAVQ=
JWT_EXPIRES_IN=30d
NODE_ENV=production
ALLOWED_ORIGINS=https://quantedge.vercel.app
```

## ⚠️ Importante

1. **Nunca** commite o arquivo `.env` no Git
2. **Sempre** gere uma nova `JWT_SECRET` para produção
3. **Use** SSL (`sslmode=require`) em conexões de produção
4. **Teste** as variáveis após cada mudança

## 🔄 Após Configurar

1. Faça um novo deploy na Vercel
2. Execute as migrações do Prisma:
   ```bash
   # Na Vercel, isso é feito automaticamente pelo script de build
   # Mas você pode executar manualmente se necessário:
   npx prisma migrate deploy
   ```

## 📞 Problemas?

Se o deploy falhar:
1. Verifique se todas as variáveis estão configuradas
2. Verifique se a `DATABASE_URL` está correta
3. Verifique os logs do deploy na Vercel
4. Certifique-se de que o banco de dados está acessível

