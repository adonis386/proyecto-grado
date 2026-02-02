# 👤 Crear Usuarios y Contraseñas (Admin)

Los **Administradores** y **Gerentes** pueden crear cuentas de acceso para empleados y asignarles contraseña, sin que el empleado tenga que auto-registrarse.

---

## Configuración requerida

### 1. Obtener la Service Role Key

1. Ve a [Supabase Dashboard](https://app.supabase.com) → tu proyecto
2. **Settings** (engranaje) → **API**
3. En **Project API keys**, copia la **`service_role`** (⚠️ secreta, no la anon key)

### 2. Agregar a variables de entorno

En tu archivo `.env.local`, agrega:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **IMPORTANTE:** Esta clave NUNCA debe subirse a GitHub. Ya está en `.gitignore` (archivos `.env*`). En producción (Vercel, etc.), agrégalas como variable de entorno.

---

## Cómo usar

### Crear empleado CON cuenta de acceso (al registrar)

1. **Empleados** → **➕ Nuevo Empleado**
2. Completa todos los datos (nombre, cargo, email, rol, etc.)
3. Marca **"Crear cuenta de acceso (usuario y contraseña para ingresar al sistema)"**
4. Ingresa una **contraseña** (mínimo 6 caracteres)
5. El **email** del empleado será el usuario para iniciar sesión
6. Clic en **Crear Empleado y Cuenta**

→ Se crea el empleado Y una cuenta en el sistema. El empleado puede ingresar con su email y la contraseña que definiste.

### Crear cuenta para empleado existente

1. **Empleados** → selecciona un empleado que **no tenga cuenta**
2. **Editar**
3. En la sección **"Cuenta de acceso"**, marca **"Crear cuenta de acceso ahora"**
4. Asegúrate que el empleado tenga **email** en el formulario
5. Ingresa la **contraseña**
6. Clic en **Crear cuenta ahora**

### Cambiar contraseña de un empleado

1. **Empleados** → selecciona un empleado que **ya tenga cuenta**
2. **Editar**
3. En **"Cuenta de acceso"**, escribe la **nueva contraseña**
4. Clic en **Cambiar contraseña**

---

## Resumen

| Acción | Dónde |
|--------|-------|
| Crear empleado + cuenta | Nuevo Empleado → marcar "Crear cuenta de acceso" |
| Crear cuenta a empleado existente | Editar Empleado → "Crear cuenta de acceso ahora" |
| Cambiar contraseña | Editar Empleado → nueva contraseña → "Cambiar contraseña" |

---

## Solución de problemas

### "SUPABASE_SERVICE_ROLE_KEY no configurada"

→ Agrega la variable en `.env.local` y reinicia el servidor (`npm run dev`)

### "Este email ya está registrado"

→ Ese email ya tiene cuenta. Usa "Cambiar contraseña" si es el mismo empleado.

### "Sin permisos"

→ Solo Administrador y Gerente pueden crear usuarios. Verifica tu rol en la tabla empleados.
