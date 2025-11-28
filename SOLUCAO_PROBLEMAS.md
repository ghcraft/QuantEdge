# 🔧 Solução de Problemas - MarketLiveFeed

## ❌ Erros Comuns e Soluções

### 1. Erro: "Cannot find module" ou "Module not found"

**Causa**: Dependências não instaladas ou node_modules corrompido

**Solução**:
```bash
# Remove node_modules e package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Reinstala dependências
npm install
```

### 2. Erro: "Port 3000 is already in use"

**Causa**: Porta 3000 já está sendo usada por outro processo

**Solução**:
```powershell
# Opção 1: Usar outra porta
$env:PORT=3001; npm run dev

# Opção 2: Encontrar e matar o processo na porta 3000
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### 3. Erro: "TypeError: Cannot read property" ou erros de TypeScript

**Causa**: Arquivos TypeScript não compilados ou cache corrompido

**Solução**:
```bash
# Limpa cache do Next.js
Remove-Item -Recurse -Force .next

# Reinstala e reconstrói
npm install
npm run build
npm run dev
```

### 4. Erro: "rss-parser" ou "node-cron" não encontrado

**Causa**: Dependências não instaladas corretamente

**Solução**:
```bash
# Instala dependências manualmente
npm install rss-parser node-cron

# Ou reinstala tudo
npm install
```

### 5. Erro: "Cannot find module '@/lib/...'"

**Causa**: Problema com path aliases do TypeScript

**Solução**:
1. Verifique se `tsconfig.json` tem:
```json
"paths": {
  "@/*": ["./*"]
}
```

2. Reinicie o servidor:
```bash
# Pare o servidor (Ctrl+C) e inicie novamente
npm run dev
```

### 6. Erro: "EADDRINUSE" ou "Port already in use"

**Causa**: Servidor já está rodando

**Solução**:
```powershell
# Encontra o processo
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess

# Mata o processo (substitua PID pelo número)
Stop-Process -Id [PID] -Force

# Ou simplesmente use outra porta
$env:PORT=3001; npm run dev
```

### 7. Erro: "Cannot read properties of undefined" no RSS

**Causa**: Feed RSS indisponível ou formato inválido

**Solução**:
- O sistema tenta múltiplos feeds, alguns podem falhar
- Verifique os logs do console
- Alguns feeds podem estar temporariamente indisponíveis
- O sistema continuará funcionando com os feeds disponíveis

### 8. Erro: "ENOENT: no such file or directory" para data/news.json

**Causa**: Diretório data/ não existe

**Solução**:
```bash
# Cria o diretório manualmente
New-Item -ItemType Directory -Path data

# Ou força atualização via API
# Acesse: http://localhost:3000/api/cron/update
```

### 9. Erro: "SyntaxError" ou erros de parsing

**Causa**: Arquivo JSON corrompido

**Solução**:
```bash
# Remove o arquivo corrompido
Remove-Item data/news.json

# Força nova atualização
# Acesse: http://localhost:3000/api/cron/update
```

### 10. Cron job não está rodando

**Causa**: Cron não foi inicializado

**Solução**:
1. Acesse `http://localhost:3000/api/init` no navegador
2. Ou acesse qualquer página do site (o cron inicia automaticamente)
3. Verifique os logs do console para confirmar

## 🔍 Como Diagnosticar Problemas

### 1. Verificar Logs do Console

Quando executar `npm run dev`, você verá:
- ✅ `> Ready on http://localhost:3000` - Servidor iniciado
- ✅ `⏰ Cron job iniciado` - Cron funcionando
- ✅ `🔄 Iniciando atualização de notícias...` - Buscando notícias
- ✅ `✅ Atualização concluída!` - Notícias salvas

### 2. Verificar Arquivos

```bash
# Verifica se os arquivos principais existem
Test-Path app/page.tsx
Test-Path lib/cron-job.ts
Test-Path data/news.json
```

### 3. Testar APIs Manualmente

```powershell
# Testa API de notícias
Invoke-WebRequest -Uri http://localhost:3000/api/news

# Testa inicialização do cron
Invoke-WebRequest -Uri http://localhost:3000/api/init

# Força atualização
Invoke-WebRequest -Uri http://localhost:3000/api/cron/update -Method POST
```

### 4. Verificar Dependências

```bash
# Lista dependências instaladas
npm list --depth=0

# Verifica versões
node --version
npm --version
```

## 🛠️ Comandos Úteis

### Limpar e Reinstalar Tudo

```powershell
# Para tudo e limpa
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
Remove-Item -Force package-lock.json

# Reinstala
npm install

# Reconstrói
npm run build
npm run dev
```

### Verificar Porta

```powershell
# Verifica se porta 3000 está em uso
netstat -ano | findstr :3000
```

### Ver Logs em Tempo Real

```bash
# Execute o servidor e observe os logs
npm run dev
```

## 📞 Se Nada Funcionar

1. **Verifique a versão do Node.js**:
   ```bash
   node --version
   # Deve ser >= 18.0.0
   ```

2. **Atualize o npm**:
   ```bash
   npm install -g npm@latest
   ```

3. **Reinstale tudo do zero**:
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Recurse -Force .next
   Remove-Item -Force package-lock.json
   npm cache clean --force
   npm install
   ```

4. **Verifique se há erros de sintaxe**:
   ```bash
   npm run lint
   ```

## ✅ Checklist de Verificação

Antes de reportar um problema, verifique:

- [ ] Node.js instalado (versão >= 18)
- [ ] npm instalado e atualizado
- [ ] Dependências instaladas (`npm install`)
- [ ] Porta 3000 disponível
- [ ] Nenhum erro no console
- [ ] Arquivo `data/news.json` existe (ou será criado)
- [ ] Internet funcionando (para buscar RSS)

## 🎯 Problemas Conhecidos

### Feeds RSS podem estar indisponíveis

Alguns feeds RSS podem estar temporariamente indisponíveis. O sistema tenta múltiplos feeds e usa os que funcionarem.

### Primeira execução pode demorar

Na primeira execução, o sistema busca notícias de múltiplos feeds, o que pode levar alguns segundos.

### Hot-reload pode não funcionar com cron

Se você modificar arquivos do cron job, pode precisar reiniciar o servidor manualmente.

---

**Se o problema persistir**, compartilhe:
1. Mensagem de erro completa
2. Logs do console
3. Versão do Node.js (`node --version`)
4. Sistema operacional

