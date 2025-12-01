@echo off
chcp 65001 >nul
echo ╔════════════════════════════════════════════════════════╗
echo ║     🌱 Sistema de Inventario INN - Instalador        ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo ⏳ Instalando dependencias...
echo.

call npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ Error al instalar dependencias
    echo.
    echo 💡 Solución:
    echo    1. Verifica que tienes Node.js instalado
    echo    2. Ejecuta: node --version
    echo    3. Si no está instalado, descárgalo de https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Dependencias instaladas correctamente
echo.
echo ════════════════════════════════════════════════════════
echo.
echo 📋 PRÓXIMOS PASOS:
echo.
echo 1. Crea un archivo llamado ".env.local" con tus credenciales
echo    (Ver archivo INSTRUCCIONES.md para más detalles)
echo.
echo 2. Ejecuta el script SQL en Supabase
echo    (Abre supabase-schema.sql y sigue las instrucciones)
echo.
echo 3. Inicia el servidor con: npm run dev
echo.
echo 4. Abre tu navegador en: http://localhost:3000
echo.
echo ════════════════════════════════════════════════════════
echo.
echo 📖 Lee INSTRUCCIONES.md para una guía completa paso a paso
echo.
pause

