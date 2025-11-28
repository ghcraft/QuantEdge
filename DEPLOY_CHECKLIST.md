# ✅ Checklist de Deploy - Vercel

## 📋 Pré-Deploy

### Variáveis de Ambiente
- [ ] `DATABASE_URL` configurada no painel da Vercel
- [ ] `JWT_SECRET` configurada (mínimo 32 caracteres)
- [ ] `JWT_EXPIRES_IN` configurada (ex: `7d`)
- [ ] `NODE_ENV` configurada como `production`

### Banco de Dados
- [ ] PostgreSQL está acessível publicamente
- [ ] Whitelist de IPs configurada (se necessário)
- [ ] Migrações do Prisma aplicadas
- [ ] Conexão testada localmente

### Código
- [ ] Build local funciona: `npm run build`
- [ ] Sem erros de TypeScript
- [ ] Sem erros de ESLint críticos
- [ ] Todos os arquivos commitados no Git

## 🚀 Deploy

### Primeiro Deploy
1. [ ] Conectar repositório GitHub na Vercel
2. [ ] Configurar variáveis de ambiente
3. [ ] Aguardar build completar
4. [ ] Verificar se o deploy foi bem-sucedido

### Verificações Pós-Deploy
- [ ] Site está acessível
- [ ] Página inicial carrega corretamente
- [ ] API `/api/news` retorna dados
- [ ] API `/api/init` inicia o cron job
- [ ] Autenticação funciona (`/login`, `/cadastro`)
- [ ] Dashboard carrega (`/dashboard`)

## 🔍 Testes

### Funcionalidades Principais
- [ ] Feed de notícias atualiza
- [ ] Cotações funcionam (`/cotacoes`)
- [ ] Portfolio funciona (`/portfolio`)
- [ ] Favoritos funcionam (`/favoritos`)
- [ ] Análises funcionam (`/analises`)

### APIs
- [ ] `GET /api/news` - Retorna notícias
- [ ] `GET /api/init` - Inicia cron job
- [ ] `POST /api/cron/update` - Atualiza notícias
- [ ] `POST /api/auth/register` - Registro de usuário
- [ ] `POST /api/auth/login` - Login
- [ ] `GET /api/auth/me` - Verifica autenticação

## 📊 Monitoramento

### Logs
- [ ] Verificar logs da Vercel para erros
- [ ] Verificar se cron job está rodando
- [ ] Verificar se feeds RSS estão funcionando

### Performance
- [ ] Verificar tempo de resposta das páginas
- [ ] Verificar tempo de resposta das APIs
- [ ] Verificar uso de recursos

## 🐛 Troubleshooting

### Se o build falhar
1. Verificar logs de build na Vercel
2. Testar build local: `npm run build`
3. Verificar variáveis de ambiente
4. Verificar se todas as dependências estão instaladas

### Se o site não carregar
1. Verificar se o deploy foi concluído
2. Verificar logs de runtime
3. Verificar variáveis de ambiente
4. Verificar conexão com banco de dados

### Se APIs não funcionarem
1. Verificar logs de função na Vercel
2. Testar endpoints manualmente
3. Verificar se o banco está acessível
4. Verificar se JWT_SECRET está configurado

## 📝 Notas

- O cron job inicia automaticamente quando uma API route é acessada
- Feeds RSS podem falhar (não crítico, sistema continua funcionando)
- Erros de feeds são silenciados em produção
- Build na Vercel é mais rápido que na Netlify para Next.js

