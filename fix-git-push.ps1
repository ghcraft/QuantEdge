# Script para corrigir problemas do Git e fazer push
# Execute este script no terminal onde o Git funciona

Write-Host "🔧 Corrigindo problemas do Git..." -ForegroundColor Cyan

# Remover lock file se existir
if (Test-Path .git\index.lock) {
    Write-Host "🗑️  Removendo arquivo de lock..." -ForegroundColor Yellow
    Remove-Item -Force .git\index.lock
    Write-Host "✅ Lock removido!" -ForegroundColor Green
}

Write-Host "`n📋 Execute os seguintes comandos no terminal onde o Git funciona:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "# 1. Remover lock (se ainda existir)" -ForegroundColor Yellow
Write-Host "Remove-Item -Force .git\index.lock" -ForegroundColor White
Write-Host ""
Write-Host "# 2. Verificar status" -ForegroundColor Yellow
Write-Host "git status" -ForegroundColor White
Write-Host ""
Write-Host "# 3. Adicionar todos os arquivos" -ForegroundColor Yellow
Write-Host "git add ." -ForegroundColor White
Write-Host ""
Write-Host "# 4. Fazer commit" -ForegroundColor Yellow
Write-Host 'git commit -m "Initial commit: QuantEdge Pro - Plataforma de análise de mercado"' -ForegroundColor White
Write-Host ""
Write-Host "# 5. Configurar branch main" -ForegroundColor Yellow
Write-Host "git branch -M main" -ForegroundColor White
Write-Host ""
Write-Host "# 6. Verificar remote" -ForegroundColor Yellow
Write-Host "git remote -v" -ForegroundColor White
Write-Host ""
Write-Host "# 7. Fazer push" -ForegroundColor Yellow
Write-Host "git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

