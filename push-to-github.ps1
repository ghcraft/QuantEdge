# Script PowerShell para fazer push para GitHub
# Execute: .\push-to-github.ps1

Write-Host "🚀 Configurando Git para QuantEdge Pro..." -ForegroundColor Cyan

# Verificar se Git está instalado
$gitPath = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitPath) {
    Write-Host "❌ Git não encontrado no PATH!" -ForegroundColor Red
    Write-Host "Por favor, instale o Git ou use o Git Bash." -ForegroundColor Yellow
    Write-Host "Download: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Git encontrado!" -ForegroundColor Green

# Verificar se já é um repositório Git
if (Test-Path .git) {
    Write-Host "✅ Repositório Git já inicializado" -ForegroundColor Green
} else {
    Write-Host "📦 Inicializando repositório Git..." -ForegroundColor Yellow
    git init
}

# Verificar se remote já existe
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "✅ Remote 'origin' já configurado: $remoteExists" -ForegroundColor Green
    $changeRemote = Read-Host "Deseja alterar para https://github.com/ghcraft/QuantEdge.git? (s/n)"
    if ($changeRemote -eq "s" -or $changeRemote -eq "S") {
        git remote set-url origin https://github.com/ghcraft/QuantEdge.git
        Write-Host "✅ Remote atualizado!" -ForegroundColor Green
    }
} else {
    Write-Host "🔗 Adicionando remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/ghcraft/QuantEdge.git
    Write-Host "✅ Remote adicionado!" -ForegroundColor Green
}

# Adicionar arquivos
Write-Host "📝 Adicionando arquivos..." -ForegroundColor Yellow
git add .

# Verificar se há mudanças para commitar
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "ℹ️  Nenhuma mudança para commitar" -ForegroundColor Yellow
} else {
    Write-Host "💾 Fazendo commit..." -ForegroundColor Yellow
    $commitMessage = "Initial commit: QuantEdge Pro - Plataforma de análise de mercado em tempo real"
    git commit -m $commitMessage
    Write-Host "✅ Commit realizado!" -ForegroundColor Green
}

# Renomear branch para main
Write-Host "🌿 Configurando branch main..." -ForegroundColor Yellow
git branch -M main 2>$null

# Fazer push
Write-Host "🚀 Fazendo push para GitHub..." -ForegroundColor Yellow
Write-Host "⚠️  Você pode precisar fazer login no GitHub" -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
    Write-Host "🌐 Repositório: https://github.com/ghcraft/QuantEdge" -ForegroundColor Cyan
} else {
    Write-Host "❌ Erro ao fazer push. Verifique suas credenciais GitHub." -ForegroundColor Red
    Write-Host "💡 Dica: Use Personal Access Token se solicitado senha" -ForegroundColor Yellow
}

