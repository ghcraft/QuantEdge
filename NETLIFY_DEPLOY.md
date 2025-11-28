# 🚀 Guia de Deploy na Netlify

## 📋 Variáveis de Ambiente

Configure estas variáveis no painel da Netlify:

### Site Settings → Environment Variables

1. **DATABASE_URL**
   ```
   postgresql://usuario:senha@host:5432/quantedge?schema=public
   ```
   - Para Neon: `postgresql://usuario:senha@ep-xxx-xxx.us-east-2.aws.neon.tech/quantedge?sslmode=require`
   - Para Supabase: `postgresql://postgres:senha@db.xxx.supabase.co:5432/postgres`

2. **JWT_SECRET**
   ```
   ZYoNZgHo980Hd0VOG+2z/2mGttF6IbF3+ckprLomAVQ=
   ```
   - ⚠️ Gere uma nova chave para produção:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

3. **JWT_EXPIRES_IN** (opcional)
   ```
   30d
   ```

4. **NODE_ENV**
   ```
   production
   ```

## ⚙️ Configuração do Build

A Netlify detecta automaticamente o Next.js, mas você pode configurar manualmente:

### Build settings:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: `20` (ou a versão que você está usando)

## 🔧 Troubleshooting

### Se o build falhar:

1. **Verifique os logs completos** na Netlify
2. **Limpe o cache**: Site settings → Build & deploy → Clear cache
3. **Verifique as variáveis de ambiente** estão configuradas
4. **Certifique-se de que o banco de dados está acessível**

### Erros comuns:

- **"Prisma Client not found"**: Execute `prisma generate` no script de build
- **"Module not found"**: Verifique se todas as dependências estão em `dependencies` e não em `devDependencies`
- **"ESLint errors"**: O `next.config.js` está configurado para ignorar erros do ESLint durante o build

## 📝 Arquivo netlify.toml

O arquivo `netlify.toml` foi criado com as configurações recomendadas:
- Node.js 20
- Plugin Next.js
- Build command configurado

## ✅ Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados acessível
- [ ] Código commitado e pushado
- [ ] Build command correto
- [ ] Publish directory: `.next`

