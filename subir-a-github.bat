@echo off
chcp 65001 >nul
echo ╔════════════════════════════════════════════════════════╗
echo ║     🚀 Subir Proyecto INN a GitHub                   ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo ⚠️  IMPORTANTE: Verificando seguridad...
echo.

REM Verificar que .env.local no está en git
if exist ".env.local" (
    echo ✅ Archivo .env.local encontrado (NO se subirá)
) else (
    echo ⚠️  No se encontró .env.local (créalo primero)
)
echo.

REM Verificar .gitignore
if exist ".gitignore" (
    echo ✅ .gitignore configurado
) else (
    echo ❌ ERROR: .gitignore no encontrado
    pause
    exit /b 1
)
echo.

echo ════════════════════════════════════════════════════════
echo.
echo 📋 PASOS:
echo.
echo 1. Inicializando repositorio Git...
git init
echo.

echo 2. Agregando archivos seguros...
git add .
echo.

echo 3. Verificando que .env.local NO esté en staging...
git status | findstr ".env.local" >nul
if %errorlevel%==0 (
    echo ❌ ERROR: .env.local aparece en git!
    echo    Esto NO debería pasar. Verifica tu .gitignore
    pause
    exit /b 1
) else (
    echo ✅ .env.local NO se subirá (correcto)
)
echo.

echo 4. Creando primer commit...
git commit -m "Initial commit: Sistema de Inventario INN"
echo.

echo ════════════════════════════════════════════════════════
echo.
echo ✅ Repositorio listo para GitHub!
echo.
echo 📝 PRÓXIMOS PASOS:
echo.
echo 1. Ve a: https://github.com/new
echo 2. Crea un repositorio llamado: inn-inventario
echo 3. Copia los comandos que GitHub te muestra
echo 4. Pégalos aquí en esta terminal
echo.
echo Ejemplo:
echo    git remote add origin https://github.com/tu-usuario/inn-inventario.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo ════════════════════════════════════════════════════════
echo.
echo 📖 Lee SUBIR_A_GITHUB.md para más detalles
echo.
pause

