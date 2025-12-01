# 🚀 Guía para Subir el Proyecto a GitHub

## ✅ Archivos de Seguridad Ya Configurados

El proyecto ya tiene configurado:
- ✅ `.gitignore` - Archivos que NO se suben a GitHub
- ✅ `.env.example` - Plantilla de configuración SIN credenciales
- ✅ Documentación limpia sin credenciales

---

## 🔒 Archivos que NO se subirán (están en .gitignore)

```
❌ .env
❌ .env.local (TUS CREDENCIALES)
❌ node_modules/
❌ .next/
❌ *_PRIVADA.md
❌ terminals/
```

---

## 📋 Pasos para Subir a GitHub

### 1️⃣ Verificar que NO haya credenciales expuestas

```powershell
# Asegúrate que .env.local NO se subirá
git status
# NO debe aparecer .env.local en la lista
```

### 2️⃣ Inicializar Git (si no está inicializado)

```powershell
git init
```

### 3️⃣ Agregar todos los archivos

```powershell
git add .
```

### 4️⃣ Hacer el primer commit

```powershell
git commit -m "Initial commit: Sistema de Inventario INN"
```

### 5️⃣ Crear repositorio en GitHub

1. Ve a https://github.com
2. Haz clic en **"New repository"** (botón verde)
3. Nombre: `inn-inventario` o el que prefieras
4. Descripción: `Sistema de gestión de inventario de equipos informáticos`
5. **Privado o Público:** Elige según prefieras
6. **NO marques** "Initialize with README" (ya tienes uno)
7. Haz clic en **"Create repository"**

### 6️⃣ Conectar con GitHub

GitHub te mostrará comandos similares a estos (cópialos de tu pantalla):

```powershell
git remote add origin https://github.com/tu-usuario/inn-inventario.git
git branch -M main
git push -u origin main
```

**Importante:** Reemplaza `tu-usuario` con tu nombre de usuario de GitHub.

---

## 🔐 Configurar Credenciales en Producción

### Si despliegas en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`: (tu URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (tu key)

### Si compartes con tu equipo:

1. **NO compartas** el archivo `.env.local`
2. Comparte el archivo `CONFIGURACION_SUPABASE_PRIVADA.md` por:
   - Email privado
   - Mensaje directo
   - Drive privado
   - **NUNCA en el repositorio público**

---

## 👥 Para que tus compañeros clonen el proyecto

Envíales estas instrucciones:

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/inn-inventario.git
cd inn-inventario

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env.local
# Pedirle al administrador las credenciales

# 4. Copiar el ejemplo y agregar credenciales
cp .env.example .env.local
# Editar .env.local con las credenciales reales

# 5. Ejecutar el script SQL en Supabase
# Ver archivo: supabase-schema.sql

# 6. Iniciar servidor
npm run dev
```

---

## 🔄 Actualizar el Repositorio

Después de hacer cambios:

```powershell
# Ver cambios
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push
```

---

## ⚠️ IMPORTANTE: Seguridad

### ✅ HACER:
- Mantener `.env.local` en local solamente
- Usar variables de entorno en producción
- Compartir credenciales de forma privada
- Revisar que .gitignore esté funcionando

### ❌ NUNCA:
- Subir `.env.local` a GitHub
- Hacer commit de archivos con credenciales
- Compartir credenciales en el README público
- Hardcodear credenciales en el código

---

## 🐛 Solución de Problemas

### "El archivo .env.local aparece en git status"

```powershell
# Asegúrate que está en .gitignore
echo ".env.local" >> .gitignore

# Si ya hiciste commit, elimínalo del historial
git rm --cached .env.local
git commit -m "Remove .env.local from git"
```

### "Olvidé quitar credenciales antes de hacer push"

1. **CAMBIAR inmediatamente** las credenciales en Supabase
2. Ve a Supabase → Settings → API → "Reset" para generar nuevas keys
3. Actualiza tu `.env.local` local con las nuevas credenciales

---

## 📊 Estructura del Repositorio

```
inn-inventario/
├── .gitignore              ✅ Configurado
├── .env.example            ✅ Template público
├── README.md               ✅ Sin credenciales
├── package.json
├── supabase-schema.sql     ✅ Solo estructura, sin datos
├── app/
├── components/
├── lib/
└── public/
```

---

## 📚 Documentación en GitHub

El repositorio incluirá:
- ✅ README.md completo
- ✅ Instrucciones de instalación
- ✅ Guías de configuración
- ✅ Script SQL para la base de datos
- ✅ Ejemplo de variables de entorno

**NO incluirá:**
- ❌ Credenciales reales
- ❌ Archivos .env
- ❌ node_modules
- ❌ Archivos de build

---

**¡Listo para subir a GitHub de forma segura! 🔒**

