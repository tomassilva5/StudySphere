# Script para abrir portas no Firewall do Windows
# EXECUTAR COMO ADMINISTRADOR

Write-Host "Configurando Firewall do Windows para StudySphere..." -ForegroundColor Cyan

# Remover regras antigas se existirem
Write-Host "Removendo regras antigas..." -ForegroundColor Yellow
netsh advfirewall firewall delete rule name="StudySphere Frontend" 2>$null
netsh advfirewall firewall delete rule name="StudySphere Backend" 2>$null
netsh advfirewall firewall delete rule name="StudySphere WebSocket" 2>$null

# Adicionar regras para porta 5000 (Frontend)
Write-Host "Adicionando regra para porta 5000 (Frontend)..." -ForegroundColor Yellow
netsh advfirewall firewall add rule name="StudySphere Frontend" dir=in action=allow protocol=TCP localport=5000

# Adicionar regras para porta 3000 (Backend/API)
Write-Host "Adicionando regra para porta 3000 (Backend)..." -ForegroundColor Yellow
netsh advfirewall firewall add rule name="StudySphere Backend" dir=in action=allow protocol=TCP localport=3000

# Adicionar regra para saída também
Write-Host "Adicionando regras de saída..." -ForegroundColor Yellow
netsh advfirewall firewall add rule name="StudySphere Frontend" dir=out action=allow protocol=TCP localport=5000
netsh advfirewall firewall add rule name="StudySphere Backend" dir=out action=allow protocol=TCP localport=3000

Write-Host ""
Write-Host "Firewall configurado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Agora outros PCs podem aceder:" -ForegroundColor Cyan
Write-Host "  http://192.168.1.183:5000" -ForegroundColor White
Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
