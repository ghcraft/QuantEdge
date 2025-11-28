# ⚡ Quick Start - MarketLiveFeed

## 🚀 Início Rápido (3 passos)

### 1. Instalar
```bash
npm install
```

### 2. Executar
```bash
npm run dev
```

### 3. Acessar
Abra no navegador: `http://localhost:3000`

---

## 📝 O que acontece automaticamente:

✅ O servidor inicia na porta 3000  
✅ O cron job inicia automaticamente quando você acessa a página  
✅ O cron busca notícias imediatamente na primeira execução  
✅ O arquivo `data/news.json` é criado automaticamente  
✅ O feed atualiza a cada 75 segundos no frontend  
✅ O cron atualiza notícias a cada 1 hora  

## 🔄 Forçar Atualização Manual

Acesse: `http://localhost:3000/api/cron/update`

Ou use PowerShell:
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/cron/update -Method POST
```

## 📚 Documentação Completa

- **README.md** - Documentação completa do projeto
- **INSTRUCOES.md** - Instruções detalhadas passo a passo

## 🎨 Características

- ✨ Visual premium com fundo preto
- 🔄 Auto-atualização a cada 75 segundos
- ⏰ Cron job a cada 1 hora
- 📰 Feed de notícias financeiras
- 🎭 Animações suaves
- 💀 Skeleton loading

---

**Pronto para usar!** 🎉

