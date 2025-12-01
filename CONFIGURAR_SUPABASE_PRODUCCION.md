# 🚀 Configuración de Supabase para Producción

Tu app está desplegada en: **https://proyecto-grado-green.vercel.app**

Para que la confirmación de email funcione correctamente, debes configurar las URLs en Supabase.

---

## 📋 Pasos para Configurar URLs de Confirmación

### 1️⃣ Ir a Configuración de Autenticación

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **"Authentication"**
4. Luego haz clic en **"URL Configuration"**

---

### 2️⃣ Configurar Site URL

En **"Site URL"**, cambia de:
```
http://localhost:3000
```

A:
```
https://proyecto-grado-green.vercel.app
```

✅ Haz clic en **"Save"**

---

### 3️⃣ Configurar Redirect URLs

En **"Redirect URLs"**, agrega estas URLs (una por línea):

```
http://localhost:3000/**
https://proyecto-grado-green.vercel.app/**
https://proyecto-grado-green.vercel.app/auth/callback
https://proyecto-grado-green.vercel.app/auth/confirmed
```

**¿Por qué estas URLs?**
- `localhost:3000/**` - Para desarrollo local
- `proyecto-grado-green.vercel.app/**` - Para producción
- `/auth/callback` - Para procesar la confirmación
- `/auth/confirmed` - Para mostrar el mensaje de éxito

✅ Haz clic en **"Save"**

---

### 4️⃣ Verificar Email Templates (Opcional)

1. Ve a **Authentication** → **Email Templates**
2. Busca **"Confirm signup"**
3. Verifica que el link use: `{{ .ConfirmationURL }}`
4. El template por defecto está bien, pero puedes personalizarlo

**Template sugerido:**

```html
<h2>Confirma tu email para INN</h2>

<p>Hola,</p>

<p>Gracias por registrarte en el Sistema de Inventario INN.</p>

<p>Por favor confirma tu dirección de correo haciendo clic en el siguiente enlace:</p>

<p><a href="{{ .ConfirmationURL }}">Confirmar mi email</a></p>

<p>O copia y pega este enlace en tu navegador:</p>
<p>{{ .ConfirmationURL }}</p>

<p>Si no te registraste en INN, puedes ignorar este mensaje.</p>

<p>Saludos,<br>
Equipo INN</p>
```

---

## 🔄 Flujo de Confirmación

### Cómo funciona ahora:

1. **Usuario se registra** en `/login`
2. **Supabase envía email** con link de confirmación
3. **Usuario hace clic** en el link del email
4. **Supabase redirige** a `/auth/callback`
5. **Callback procesa** la confirmación
6. **Redirige** a `/auth/confirmed`
7. **Muestra mensaje** de éxito ✅
8. **Redirige automáticamente** a `/login` en 5 segundos

---

## 🧪 Probar la Configuración

### Paso 1: Registrar un usuario de prueba

1. Ve a: https://proyecto-grado-green.vercel.app/login
2. Haz clic en **"¿No tienes cuenta? Regístrate"**
3. Ingresa un email real que puedas revisar
4. Ingresa una contraseña
5. Haz clic en **"Crear Cuenta"**

### Paso 2: Revisar email

1. Ve a tu bandeja de entrada
2. Busca el email de Supabase
3. Haz clic en **"Confirmar mi email"** o el link de confirmación

### Paso 3: Verificar confirmación

Deberías ver:
- ✅ Página con mensaje **"¡Email Confirmado!"**
- ✅ Ícono verde de verificación
- ✅ Contador regresivo de 5 segundos
- ✅ Redirección automática a `/login`

---

## ⚠️ Solución de Problemas

### "Link de confirmación inválido o expirado"

**Causa:** Las URLs no están configuradas en Supabase

**Solución:**
1. Verifica que agregaste las Redirect URLs
2. Asegúrate de incluir `https://` en las URLs
3. Guarda los cambios en Supabase

### "Error de autenticación"

**Causa:** Site URL incorrecta

**Solución:**
1. Verifica que la Site URL sea exactamente: `https://proyecto-grado-green.vercel.app`
2. Sin barra final `/`
3. Con `https://`

### No llega el email

**Causa:** Email en spam o configuración de email

**Solución:**
1. Revisa la carpeta de spam
2. Espera unos minutos (puede tardar)
3. Verifica en Supabase → Authentication → Users si aparece el usuario
4. Si está "unconfirmed", reenvía el email

### Redirige a localhost

**Causa:** Site URL todavía apunta a localhost

**Solución:**
1. Cambia Site URL a producción
2. Guarda los cambios
3. Intenta de nuevo

---

## 📊 Variables de Entorno en Vercel

Asegúrate de tener configuradas estas variables en Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://evkklwfxnonsajneoxcn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

**Para verificar:**
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Confirma que están ahí

---

## 🎯 Checklist de Configuración

- [ ] Site URL cambiada a `https://proyecto-grado-green.vercel.app`
- [ ] Redirect URLs agregadas
- [ ] Variables de entorno configuradas en Vercel
- [ ] Código actualizado con las nuevas rutas
- [ ] Probado el flujo completo de registro y confirmación
- [ ] Email de confirmación recibido y funciona
- [ ] Mensaje de confirmación exitosa se muestra

---

## 🚀 Desplegar los Cambios

Después de configurar Supabase, actualiza el código en GitHub:

```bash
git add .
git commit -m "feat: agregar páginas de confirmación de email"
git push
```

Vercel desplegará automáticamente los cambios en unos minutos.

---

**¡Listo! Ahora tus usuarios verán un mensaje de confirmación exitosa después de verificar su email. ✅**

