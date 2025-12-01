# 🚀 Guía de Despliegue en Producción

Esta guía te ayudará a desplegar el Sistema de Inventario INN en producción.

## 📋 Opciones de Despliegue

### Opción 1: Vercel (Recomendado - Gratis) ⭐

Vercel es la plataforma de los creadores de Next.js. Es la opción más fácil y rápida.

#### Pasos:

1. **Crear cuenta en Vercel:**
   - Ve a [https://vercel.com](https://vercel.com)
   - Regístrate con GitHub, GitLab o Email

2. **Subir tu proyecto a Git (GitHub recomendado):**
   - Crea un repositorio en GitHub
   - Sube tu código:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin tu-repositorio-github
   git push -u origin main
   ```

3. **Importar proyecto en Vercel:**
   - En Vercel Dashboard, haz clic en "New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es Next.js

4. **Configurar Variables de Entorno:**
   - En la configuración del proyecto, ve a "Environment Variables"
   - Agrega:
     - `NEXT_PUBLIC_SUPABASE_URL`: https://evkklwfxnonsajneoxcn.supabase.co
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: tu_anon_key

5. **Desplegar:**
   - Haz clic en "Deploy"
   - Espera unos minutos
   - ¡Listo! Tu app estará en una URL como: `tu-proyecto.vercel.app`

#### Actualizaciones:
Cada vez que hagas `git push`, Vercel desplegará automáticamente los cambios.

---

### Opción 2: Netlify (Gratis)

1. **Crear cuenta en Netlify:**
   - Ve a [https://netlify.com](https://netlify.com)
   - Regístrate

2. **Subir proyecto a Git:**
   - Igual que en Vercel (GitHub, GitLab, etc.)

3. **Conectar repositorio:**
   - New site from Git
   - Selecciona tu repositorio
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Variables de entorno:**
   - Site settings > Build & deploy > Environment
   - Agrega las variables de Supabase

---

### Opción 3: VPS (DigitalOcean, AWS, etc.)

Para despliegue en un servidor propio:

#### Requisitos:
- Ubuntu 22.04 o superior
- Node.js 18+
- PM2 para gestión de procesos
- Nginx como reverse proxy

#### Pasos básicos:

```bash
# 1. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Instalar PM2
sudo npm install -g pm2

# 3. Clonar proyecto
git clone tu-repositorio
cd tu-proyecto

# 4. Instalar dependencias
npm install

# 5. Crear .env.local con tus variables

# 6. Compilar proyecto
npm run build

# 7. Iniciar con PM2
pm2 start npm --name "inn-inventario" -- start
pm2 startup
pm2 save

# 8. Configurar Nginx (opcional)
# Ver archivo nginx.conf de ejemplo abajo
```

---

## 🔒 Configuración de Seguridad

### En Supabase:

1. **Configurar políticas de autenticación:**
   - Authentication > Settings
   - Deshabilita "Enable email signups" si solo quieres usuarios invitados
   - Configura "Email confirmation" como obligatorio

2. **Configurar dominios permitidos:**
   - Authentication > URL Configuration
   - Agrega tu dominio de producción a "Site URL"

3. **Revisar políticas RLS:**
   - Ve a Database > Tables
   - Verifica que RLS esté habilitado en todas las tablas

---

## 🌐 Dominio Personalizado

### En Vercel:

1. Ve a tu proyecto > Settings > Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones
4. Espera la propagación DNS (puede tomar hasta 48 horas)

---

## 📊 Monitoreo

### Vercel Analytics (Gratis):
- Automáticamente incluido
- Ve a tu proyecto > Analytics

### Supabase Logs:
- Database > Logs
- Monitorea queries, errores, etc.

---

## 🔄 Actualizar la Aplicación

### Con Git (Vercel/Netlify):
```bash
git add .
git commit -m "Descripción del cambio"
git push
```
Se desplegará automáticamente.

### En VPS:
```bash
cd tu-proyecto
git pull
npm install
npm run build
pm2 restart inn-inventario
```

---

## 🐛 Solución de Problemas

### Error 500 en producción:
- Revisa los logs en Vercel/Netlify
- Verifica las variables de entorno
- Asegúrate que el build se completó sin errores

### No conecta con Supabase:
- Verifica las variables de entorno
- Confirma que las políticas RLS están correctas
- Revisa que el dominio esté en la whitelist de Supabase

### Página en blanco:
- Revisa la consola del navegador (F12)
- Verifica que ejecutaste el script SQL en Supabase
- Confirma que la autenticación funciona

---

## 📝 Checklist Pre-Despliegue

- [ ] Código subido a Git
- [ ] Script SQL ejecutado en Supabase
- [ ] Variables de entorno configuradas
- [ ] Build local exitoso (`npm run build`)
- [ ] Autenticación funcionando
- [ ] CRUD de productos/categorías funcionando
- [ ] RLS habilitado en Supabase
- [ ] Email confirmation configurado

---

## 💰 Costos Estimados

### Gratis (Tier Gratuito):
- **Vercel:** Ilimitado para proyectos personales
- **Netlify:** 300 minutos build/mes
- **Supabase:** 500MB base de datos, 1GB storage
- **Total:** $0/mes ✅

### Si creces (Opcional):
- **Vercel Pro:** $20/mes (no necesario al inicio)
- **Supabase Pro:** $25/mes (2GB storage, más features)

---

## 🎓 Recursos Adicionales

- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Supabase](https://supabase.com/docs)
- [Guía de Vercel](https://vercel.com/docs)

---

**¡Tu sistema estará en producción y accesible desde cualquier lugar! 🌍**

