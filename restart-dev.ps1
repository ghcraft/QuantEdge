# Script para reiniciar o servidor de desenvolvimento do Next.js
# Limpa o cache e reinicia o servidor

Write-Host "Limpando cache do Next.js..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "Cache limpo!" -ForegroundColor Green
} else {
    Write-Host "Nenhum cache encontrado." -ForegroundColor Gray
}

Write-Host "`nIniciando servidor de desenvolvimento..." -ForegroundColor Yellow
npm run dev

