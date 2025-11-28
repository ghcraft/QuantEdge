# 🚀 Deploy na Vercel - Guia Completo

## ✅ Status do Deploy

O projeto foi **deployado com sucesso** na Vercel! 🎉

## 📋 Variáveis de Ambiente Necessárias

Configure as seguintes variáveis de ambiente no painel da Vercel:

### Variáveis Obrigatórias

```bash
DATABASE_URL=postgresql://usuario:senha@host:porta/database
JWT_SECRET=sua-chave-secreta-jwt-aqui
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

### Como Configurar na Vercel

1. Acesse o painel da Vercel: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione cada variável:
   - **Name**: `DATABASE_URL`
   - **Value**: Sua string de conexão PostgreSQL
   - **Environment**: Production, Preview, Development (marque todos)
5. Repita para `JWT_SECRET`, `JWT_EXPIRES_IN` e `NODE_ENV`

## 🔧 Configurações do Projeto

### Build Command
```bash
npm run build
```

### Output Directory
```
.next
```

### Install Command
```bash
npm install
```

## 📝 Notas Importantes

### 1. Prisma Client
- O Prisma Client é gerado automaticamente durante o build via `postinstall` script
- Não é necessário executar `prisma generate` manualmente

### 2. Cron Jobs
- Os cron jobs são executados via API routes
- Para atualizar notícias manualmente, acesse: `/api/cron/update`
- O cron inicia automaticamente quando qualquer API route é acessada

### 3. Feeds RSS
- Alguns feeds podem falhar (CNN, Terra, Reuters, UOL)
- O sistema continua funcionando com os feeds disponíveis
- Erros de feeds não críticos são silenciados em produção

### 4. Banco de Dados
- Certifique-se de que o banco PostgreSQL está acessível publicamente
- Se necessário, configure whitelist de IPs na Vercel

## 🔍 Verificando o Deploy

### 1. Verificar Build
- Acesse o painel da Vercel → **Deployments**
- Verifique se o build foi concluído com sucesso
- Todos os logs devem mostrar `✓ Compiled successfully`

### 2. Testar Funcionalidades
- Acesse a URL do deploy
- Teste as rotas principais:
  - `/` - Página inicial
  - `/dashboard` - Dashboard (requer autenticação)
  - `/noticias` - Feed de notícias
  - `/api/news` - API de notícias

### 3. Verificar APIs
```bash
# Teste a API de notícias
curl https://seu-dominio.vercel.app/api/news

# Teste inicialização do cron
curl https://seu-dominio.vercel.app/api/init

# Force atualização de notícias
curl -X POST https://seu-dominio.vercel.app/api/cron/update
```

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"
- Verifique se `DATABASE_URL` está configurada corretamente
- Verifique se o banco permite conexões externas
- Verifique firewall/whitelist de IPs

### Erro: "JWT_SECRET is not defined"
- Adicione `JWT_SECRET` nas variáveis de ambiente
- Use uma string aleatória segura (mínimo 32 caracteres)

### Build falha com erro de Prisma
- Verifique se `DATABASE_URL` está configurada
- O Prisma precisa de acesso ao banco durante o build para gerar o client

### Cron job não está rodando
- Acesse `/api/init` para forçar inicialização
- Verifique os logs da Vercel para erros
- O cron inicia automaticamente quando uma API route é acessada

## 📊 Monitoramento

### Logs da Vercel
- Acesse **Deployments** → Selecione o deployment → **Functions** → **View Function Logs**
- Os logs mostram:
  - Execução do cron job
  - Erros de feeds RSS (não críticos)
  - Erros de API

### Métricas
- Acesse **Analytics** no painel da Vercel
- Monitore:
  - Requisições por segundo
  - Tempo de resposta
  - Erros

## 🔄 Atualizações

### Deploy Automático
- A Vercel faz deploy automático a cada push no branch `main`
- Não é necessário fazer nada manualmente

### Deploy Manual
```bash
# Instale a CLI da Vercel
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel --prod
```

## 🎯 Próximos Passos

1. ✅ Configure as variáveis de ambiente
2. ✅ Teste todas as funcionalidades
3. ✅ Configure domínio customizado (opcional)
4. ✅ Configure monitoramento e alertas
5. ✅ Otimize performance (cache, CDN)

## 📚 Recursos

- [Documentação da Vercel](https://vercel.com/docs)
- [Next.js na Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Variáveis de Ambiente](https://vercel.com/docs/environment-variables)

