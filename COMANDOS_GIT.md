# 🚀 Comandos Git - Push para GitHub

## ⚠️ Problema: Arquivo de Lock

Se você receber o erro `fatal: Unable to create '.git/index.lock'`, execute primeiro:

```powershell
Remove-Item -Force .git\index.lock
```

## 📝 Sequência de Comandos

Execute estes comandos **na ordem** no terminal onde o Git funciona:

### 1. Remover lock (se necessário)
```powershell
Remove-Item -Force .git\index.lock
```

### 2. Verificar status
```powershell
git status
```

### 3. Adicionar todos os arquivos
```powershell
git add .
```

### 4. Fazer commit
```powershell
git commit -m "Initial commit: QuantEdge Pro - Plataforma de análise de mercado em tempo real"
```

### 5. Configurar branch main
```powershell
git branch -M main
```

### 6. Verificar remote (deve mostrar o GitHub)
```powershell
git remote -v
```

Se não mostrar ou estiver errado:
```powershell
git remote set-url origin https://github.com/ghcraft/QuantEdge.git
```

### 7. Fazer push
```powershell
git push -u origin main
```

## 🔐 Autenticação

Se for solicitado login:

1. **Usuário**: Seu username do GitHub (ghcraft)
2. **Senha**: Use um **Personal Access Token** (não sua senha normal)
   - Vá em: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token → Selecione escopo: `repo`
   - Copie o token e use como senha

## ✅ Verificação

Após o push, verifique em:
https://github.com/ghcraft/QuantEdge

## 🐛 Problemas Comuns

### "error: src refspec main does not match any"
**Solução**: Você precisa fazer um commit primeiro (passo 4)

### "remote origin already exists"
**Solução**: Está correto, apenas continue com os próximos passos

### "fatal: Unable to create index.lock"
**Solução**: Execute `Remove-Item -Force .git\index.lock`

### "Authentication failed"
**Solução**: Use Personal Access Token ao invés de senha

