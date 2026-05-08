@echo off
echo ============================================
echo   SERVIDOR DE SINCRONIZACAO ENSALAMENTO
echo ============================================
echo.

cd /d "%~dp0"

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo.
    echo Instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)

REM Instalar dependências se necessário
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install express cors
    if errorlevel 1 (
        echo ERRO: Falha ao instalar dependencias!
        pause
        exit /b 1
    )
)

echo.
echo Iniciando servidor de sincronizacao...
echo.
echo O servidor ficara disponivel em:
echo   Local: http://localhost:3001
echo   Rede:  http://[IP-DA-REDE]:3001
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

node sync-server.js