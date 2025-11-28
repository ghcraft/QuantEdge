# 🚀 Guia de Deploy - QuantEdge Pro

## 📋 Pré-requisitos

- ✅ Código no GitHub: https://github.com/ghcraft/QuantEdge
- ✅ Conta na plataforma de deploy escolhida
- ✅ Banco de dados PostgreSQL configurado (ou usar SQLite temporariamente)

## 🎯 Opção 1: Vercel (Recomendado para Next.js)

### Passo a Passo

1. **Acesse**: https://vercel.com
2. **Faça login** com sua conta GitHub
3. **Clique em "Add New Project"**
4. **Importe o repositório** `ghcraft/QuantEdge`
5. **Configure o projeto**:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (raiz)
   - Build Command: `npm run build` (já vem preenchido)
   - Output Directory: `.next` (já vem preenchido)
   - Install Command: `npm install`

6. **Configure Variáveis de Ambiente**:
   Clique em "Environment Variables" e adicione:
   ```
   DATABASE_URL=postgresql://postgres:1132@seu-host:5432/quantedge?schema=public
   JWT_SECRET=ZYoNZgHo980Hd0VOG+2z/2mGttF6IbF3+ckprLomAVQ=
   JWT_EXPIRES_IN=30d
   NODE_ENV=production
   ```

7. **Deploy!**
   - Clique em "Deploy"
   - Aguarde o build (2-5 minutos)
   - Seu site estará em: `https://quantedge.vercel.app` (ou domínio customizado)

### ⚙️ Configurações Adicionais

**Para PostgreSQL na Vercel:**
- Use **Vercel Postgres** (integrado) ou
- Use **Neon** (https://neon.tech) - gratuito e compatível
- Use **Supabase** (https://supabase.com) - gratuito

**String de conexão Neon/Supabase:**
```
DATABASE_URL=postgresql://user:password@host.neon.tech/quantedge?sslmode=require
```

## 🎯 Opção 2: Railway

### Passo a Passo

1. **Acesse**: https://railway.app
2. **Faça login** com GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Selecione** `ghcraft/QuantEdge`
5. **Adicione PostgreSQL**:
   - Clique em "+ New" → **Database** → **PostgreSQL**
   - Railway criará automaticamente e adicionará `DATABASE_URL` nas variáveis

6. **Configure variáveis**:
   ```
   JWT_SECRET=ZYoNZgHo980Hd0VOG+2z/2mGttF6IbF3+ckprLomAVQ=
   JWT_EXPIRES_IN=30d
   NODE_ENV=production
   ```

7. **Deploy automático!**
   - Railway detecta Next.js e faz deploy automaticamente
   - Seu site estará em: `https://quantedge.up.railway.app`

## 🎯 Opção 3: Render

### Passo a Passo

1. **Acesse**: https://render.com
2. **Faça login** com GitHub
3. **New** → **Web Service**
4. **Conecte** o repositório `ghcraft/QuantEdge`
5. **Configure**:
   - Name: `quantedge`
   - Environment: **Node**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: **Free** (ou pago)

6. **Adicione PostgreSQL**:
   - **New** → **PostgreSQL**
   - Render criará e adicionará `DATABASE_URL` automaticamente

7. **Configure variáveis**:
   ```
   JWT_SECRET=ZYoNZgHo980Hd0VOG+2z/2mGttF6IbF3+ckprLomAVQ=
   JWT_EXPIRES_IN=30d
   NODE_ENV=production
   ```

8. **Deploy!**
   - Clique em "Create Web Service"
   - Aguarde o build (5-10 minutos na primeira vez)
   - Seu site estará em: `https://quantedge.onrender.com`

## 🎯 Opção 4: Netlify

### Passo a Passo

1. **Acesse**: https://netlify.com
2. **Faça login** com GitHub
3. **Add new site** → **Import an existing project**
4. **Selecione** `ghcraft/QuantEdge`
5. **Configure build**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - **⚠️ Netlify requer configuração especial para Next.js**

6. **Adicione variáveis de ambiente**
7. **Para PostgreSQL**: Use serviço externo (Neon, Supabase)

**⚠️ Nota**: Netlify é mais complexo para Next.js com API routes. Prefira Vercel.

## 🗄️ Configurar Banco de Dados em Produção

### Opção A: Neon (Recomendado - Gratuito)

1. **Acesse**: https://neon.tech
2. **Crie conta** (gratuita)
3. **Crie projeto** → Escolha região
4. **Copie connection string**:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/quantedge?sslmode=require
   ```
5. **Use no DATABASE_URL** da plataforma de deploy

### Opção B: Supabase (Gratuito)

1. **Acesse**: https://supabase.com
2. **Crie projeto**
3. **Settings** → **Database** → **Connection string**
4. **Copie e use** no `DATABASE_URL`

### Opção C: Railway PostgreSQL (Integrado)

- Já vem configurado se usar Railway
- `DATABASE_URL` é adicionado automaticamente

## 🔧 Executar Migrations no Deploy

### Vercel
Adicione no `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### Railway/Render
Adicione build command:
```bash
npx prisma generate && npx prisma migrate deploy && npm run build
```

## ✅ Checklist de Deploy

- [ ] Código no GitHub
- [ ] Conta na plataforma de deploy
- [ ] Banco de dados PostgreSQL configurado
- [ ] Variáveis de ambiente configuradas:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET` (gerar novo para produção!)
  - [ ] `JWT_EXPIRES_IN`
  - [ ] `NODE_ENV=production`
- [ ] Migrations executadas
- [ ] Build bem-sucedido
- [ ] Site acessível
- [ ] Testar registro/login

## 🔐 Segurança em Produção

### ⚠️ IMPORTANTE: Gerar Novo JWT_SECRET

**NÃO use o mesmo JWT_SECRET de desenvolvimento!**

Gere um novo para produção:
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## 🐛 Troubleshooting

### Erro: "Prisma Client not generated"
**Solução**: Adicione `prisma generate` no build command

### Erro: "Database connection failed"
**Solução**: Verifique `DATABASE_URL` e se o banco aceita conexões externas

### Erro: "JWT_SECRET not found"
**Solução**: Adicione a variável de ambiente na plataforma

### Build falha
**Solução**: Verifique logs do build na plataforma

## 📊 Monitoramento

Após deploy, configure:
- **Vercel Analytics** (se usar Vercel)
- **Sentry** para erros: https://sentry.io
- **LogRocket** para sessões: https://logrocket.com

## 🎉 Pronto!

Seu site estará no ar! 🚀

