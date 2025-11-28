# 📦 Configuração Git - QuantEdge Pro

## 🚀 Comandos para fazer push para o GitHub

Como o Git não está no PATH do PowerShell, você pode usar o Git Bash ou adicionar ao PATH. Aqui estão os comandos:

### Opção 1: Usando Git Bash (Recomendado)

1. Abra o **Git Bash** na pasta do projeto
2. Execute os seguintes comandos:

```bash
# Inicializar repositório (se ainda não foi feito)
git init

# Adicionar remote
git remote add origin https://github.com/ghcraft/QuantEdge.git

# Verificar se foi adicionado
git remote -v

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit: QuantEdge Pro - Plataforma de análise de mercado"

# Renomear branch para main (se necessário)
git branch -M main

# Fazer push
git push -u origin main
```

### Opção 2: Usando PowerShell (se Git estiver instalado)

Se você tiver o Git instalado mas não estiver no PATH, encontre o caminho de instalação e use:

```powershell
# Exemplo: C:\Program Files\Git\bin\git.exe
& "C:\Program Files\Git\bin\git.exe" init
& "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/ghcraft/QuantEdge.git
& "C:\Program Files\Git\bin\git.exe" add .
& "C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: QuantEdge Pro"
& "C:\Program Files\Git\bin\git.exe" branch -M main
& "C:\Program Files\Git\bin\git.exe" push -u origin main
```

### Opção 3: Usando GitHub Desktop

1. Abra o **GitHub Desktop**
2. File → Add Local Repository
3. Selecione a pasta `C:\Users\guihe\Noticias`
4. Publish repository → Escolha o repositório `ghcraft/QuantEdge`
5. Clique em "Publish repository"

## ⚠️ Arquivos que NÃO serão commitados (já no .gitignore)

- `.env` (variáveis de ambiente)
- `node_modules/` (dependências)
- `.next/` (build do Next.js)
- `*.db` (bancos de dados)
- `data/news.json` (dados temporários)

## ✅ Arquivos que SERÃO commitados

- Todo o código fonte
- Configurações (package.json, tsconfig.json, etc.)
- Documentação
- Schema do Prisma
- Componentes e páginas

## 🔐 Autenticação GitHub

Se for solicitado login, você pode:

1. **Usar Personal Access Token** (recomendado):
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token → Selecione escopos: `repo`
   - Use o token como senha

2. **Ou usar GitHub CLI**:
   ```bash
   gh auth login
   ```

## 📝 Próximos Commits

Após o commit inicial, para fazer novos commits:

```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

