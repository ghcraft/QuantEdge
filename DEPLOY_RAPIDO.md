# ⚡ Deploy Rápido - QuantEdge Pro

## 🚀 Vercel (Mais Rápido - 5 minutos)

### 1. Acesse
👉 https://vercel.com/new

### 2. Importe Repositório
- Clique em "Import Git Repository"
- Selecione `ghcraft/QuantEdge`
- Clique em "Import"

### 3. Configure Variáveis de Ambiente
Clique em "Environment Variables" e adicione:

```
DATABASE_URL=postgresql://postgres:1132@seu-host:5432/quantedge?schema=public
JWT_SECRET=ZYoNZgHo980Hd0VOG+2z/2mGttF6IbF3+ckprLomAVQ=
JWT_EXPIRES_IN=30d
NODE_ENV=production
```

### 4. Deploy!
- Clique em "Deploy"
- Aguarde 2-5 minutos
- ✅ Pronto! Seu site estará no ar

## 🗄️ Banco de Dados (Neon - Gratuito)

### 1. Crie conta
👉 https://neon.tech

### 2. Crie projeto
- Nome: `quantedge`
- Região: Escolha a mais próxima

### 3. Copie connection string
- Vá em "Connection Details"
- Copie a string que começa com `postgresql://`
- Use no `DATABASE_URL` da Vercel

### 4. Execute migrations
No terminal do Neon ou via Vercel:
```bash
npx prisma migrate deploy
```

## ✅ Checklist Rápido

- [ ] Código no GitHub ✅
- [ ] Conta Vercel criada
- [ ] Repositório importado
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados criado (Neon)
- [ ] Migrations executadas
- [ ] Deploy realizado

## 🎉 Pronto!

Seu site estará em: `https://quantedge.vercel.app`

Ou configure domínio customizado na Vercel!

