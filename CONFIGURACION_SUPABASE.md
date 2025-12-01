# ⚙️ CONFIGURACIÓN DE SUPABASE - Guía Paso a Paso

Esta guía te muestra exactamente qué hacer en Supabase para que el sistema funcione.

---

## 📋 PASO 1: Ejecutar el Script SQL

### ¿Dónde?
1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Inicia sesión
3. Selecciona tu proyecto: **evkklwfxnonsajneoxcn**
4. En el menú lateral izquierdo, busca **"SQL Editor"**
5. Haz clic en **"SQL Editor"**

### ¿Qué hacer?
1. Haz clic en el botón **"New Query"** (arriba a la derecha)
2. Abre el archivo `supabase-schema.sql` de este proyecto con Bloc de notas
3. **Selecciona TODO el contenido** (Ctrl+A)
4. **Copia** (Ctrl+C)
5. **Pega** en el editor SQL de Supabase (Ctrl+V)
6. Haz clic en el botón **"Run"** (o presiona Ctrl+Enter)

### ¿Qué verás?
✅ Si todo sale bien, verás:
```
Success. No rows returned
```

❌ Si hay error:
- Verifica que copiaste TODO el contenido
- Asegúrate que no haya contenido previo en el editor
- Intenta ejecutar de nuevo

### ¿Qué hace este script?
- ✅ Crea la tabla `categorias`
- ✅ Crea la tabla `productos`
- ✅ Crea índices para mejorar el rendimiento
- ✅ Crea trigger para actualizar fechas automáticamente
- ✅ Configura políticas de seguridad (RLS)
- ✅ Inserta 6 categorías iniciales

---

## 📋 PASO 2: Verificar que se crearon las tablas

### ¿Dónde?
1. En el menú lateral de Supabase, haz clic en **"Table Editor"**

### ¿Qué verás?
Deberías ver estas tablas:
- ✅ `categorias` (con 6 filas)
- ✅ `productos` (con 0 filas al inicio)

### Verificar tabla categorias:
1. Haz clic en la tabla `categorias`
2. Deberías ver estas categorías:
   - Computadoras
   - Periféricos
   - Redes
   - Servidores
   - Almacenamiento
   - Otros

✅ Si las ves, **¡perfecto!** El script funcionó correctamente.

---

## 📋 PASO 3: Verificar Row Level Security (RLS)

### ¿Dónde?
1. Table Editor → Selecciona tabla `categorias`
2. Haz clic en el ícono de **escudo** (🛡️) a la derecha
3. O ve a: Authentication → Policies

### ¿Qué verás?
Deberías ver políticas como:
- ✅ "Permitir lectura de categorías a usuarios autenticados"
- ✅ "Permitir inserción de categorías a usuarios autenticados"
- ✅ "Permitir actualización de categorías a usuarios autenticados"
- ✅ "Permitir eliminación de categorías a usuarios autenticados"

Lo mismo para la tabla `productos`.

---

## 📋 PASO 4: Configurar Autenticación

### ¿Dónde?
1. En el menú lateral, haz clic en **"Authentication"**
2. Luego haz clic en **"Settings"**

### Configuración Recomendada:

#### Enable Email Signups
- **✅ Activado** (para permitir que tus compañeros se registren)
- **O desactivado** (si solo tú crearás las cuentas manualmente)

#### Confirm email
- **✅ Activado** (obligar confirmación por email)
- **Recomendado:** Activado para mayor seguridad

#### Enable email confirmations
- **✅ Activado**

---

## 📋 PASO 5: Configurar URL del Sitio

### ¿Dónde?
1. Authentication → **URL Configuration**

### ¿Qué hacer?
1. En **"Site URL"**, por ahora déjalo como está
2. Cuando despliegues en producción, agrégalo aquí

**Desarrollo:**
```
http://localhost:3000
```

**Producción (ejemplo):**
```
https://tu-proyecto.vercel.app
```

---

## 📋 PASO 6: Configurar Storage (OBLIGATORIO - para imágenes de productos)

> **⚠️ IMPORTANTE:** Este paso ES NECESARIO para que puedas subir imágenes de productos.

### ¿Dónde?
1. En el menú lateral de Supabase, haz clic en **"Storage"**

### ¿Qué hacer?

#### 1. Crear el Bucket:
1. Haz clic en **"Create a new bucket"** (botón verde)
2. En el formulario:
   - **Name:** `productos-imagenes` (exactamente así, con guión)
   - **Public bucket:** ✅ Marca la casilla (debe estar en "Yes")
3. Haz clic en **"Create bucket"**
4. ✅ Deberías ver el bucket "productos-imagenes" en la lista

#### 2. Configurar Políticas de Seguridad:

**Opción A - Interfaz Gráfica (Más fácil):**

1. Haz clic en el bucket **"productos-imagenes"**
2. Ve a la pestaña **"Policies"**
3. Haz clic en **"New Policy"**

**Primera Política - Lectura Pública:**
- Haz clic en **"Create policy"** desde cero
- **Policy name:** `Permitir lectura pública`
- **Allowed operation:** SELECT (marca solo esta)
- **Target roles:** public
- En **Policy definition**, selecciona: `true` (permitir todos)
- Haz clic en **"Review"** y luego **"Save policy"**

**Segunda Política - Subida Autenticada:**
- Haz clic en **"New Policy"** de nuevo
- **Policy name:** `Permitir carga a usuarios autenticados`
- **Allowed operation:** INSERT (marca solo esta)
- **Target roles:** authenticated
- En **Policy definition**, selecciona: `true` (permitir todos)
- Haz clic en **"Review"** y luego **"Save policy"**

**Tercera Política - Actualización Autenticada:**
- Haz clic en **"New Policy"** de nuevo
- **Policy name:** `Permitir actualización a usuarios autenticados`
- **Allowed operation:** UPDATE (marca solo esta)
- **Target roles:** authenticated
- En **Policy definition**, selecciona: `true`
- Haz clic en **"Review"** y luego **"Save policy"**

**Cuarta Política - Eliminación Autenticada:**
- Haz clic en **"New Policy"** de nuevo
- **Policy name:** `Permitir eliminación a usuarios autenticados`
- **Allowed operation:** DELETE (marca solo esta)
- **Target roles:** authenticated
- En **Policy definition**, selecciona: `true`
- Haz clic en **"Review"** y luego **"Save policy"**

---

**Opción B - SQL (Más rápido):**

Si prefieres usar SQL:

1. Ve a **SQL Editor** en Supabase
2. **New Query**
3. Copia y pega este código:

```sql
-- Políticas para el bucket de imágenes de productos

-- Permitir lectura pública de todas las imágenes
CREATE POLICY "Permitir lectura pública"
ON storage.objects FOR SELECT
USING (bucket_id = 'productos-imagenes');

-- Permitir subida de imágenes a usuarios autenticados
CREATE POLICY "Permitir carga a usuarios autenticados"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'productos-imagenes');

-- Permitir actualización de imágenes a usuarios autenticados
CREATE POLICY "Permitir actualización a usuarios autenticados"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'productos-imagenes');

-- Permitir eliminación de imágenes a usuarios autenticados
CREATE POLICY "Permitir eliminación a usuarios autenticados"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'productos-imagenes');
```

4. Haz clic en **"Run"**
5. ✅ Deberías ver "Success"

---

### ✅ Verificar que funciona:

1. Ve a **Storage** → **productos-imagenes**
2. Intenta subir un archivo de prueba manualmente
3. Si puedes subir, ¡todo está correcto! 🎉
4. Puedes eliminar el archivo de prueba

### 📝 Formatos de imagen soportados:
- ✅ PNG
- ✅ JPEG / JPG
- ✅ WEBP
- 📏 Tamaño máximo: **5MB por imagen**

---

## 📋 PASO 7: Obtener las Credenciales

### ¿Dónde?
1. En el menú lateral, haz clic en **"Settings"** (⚙️)
2. Luego haz clic en **"API"**

### ¿Qué necesitas copiar?

#### Project URL:
```
https://evkklwfxnonsajneoxcn.supabase.co
```
✅ Ya la tienes (está en tu .env.local)

#### anon/public key:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2a2tsd2Z4bm9uc2FqbmVveGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODg5MTYsImV4cCI6MjA4MDE2NDkxNn0.LyNanxpjVt334hpxqYLRRo92TK1u7FkAwB35lvKNL6U
```
✅ Ya la tienes (está en tu .env.local)

---

## ✅ CHECKLIST FINAL

Antes de iniciar el sistema, verifica:

- [ ] ✅ Script SQL ejecutado sin errores
- [ ] ✅ Tabla `categorias` existe y tiene 6 filas
- [ ] ✅ Tabla `productos` existe (puede estar vacía)
- [ ] ✅ RLS habilitado en ambas tablas
- [ ] ✅ Políticas de seguridad creadas en las tablas
- [ ] ✅ Bucket `productos-imagenes` creado
- [ ] ✅ Bucket marcado como público
- [ ] ✅ Políticas de Storage creadas (4 políticas)
- [ ] ✅ Email confirmation configurado
- [ ] ✅ Credenciales copiadas correctamente

---

## 🎯 ¿Listo para probar?

Si todos los pasos anteriores están completos:

1. Abre PowerShell en la carpeta del proyecto
2. Ejecuta: `npm run dev`
3. Abre: http://localhost:3000
4. Crea tu cuenta de administrador
5. ¡Empieza a agregar productos!

---

## 🐛 Problemas Comunes

### "relation productos does not exist"
❌ No ejecutaste el script SQL  
✅ Ve al PASO 1 y ejecuta `supabase-schema.sql`

### "Invalid API key"
❌ Las credenciales en `.env.local` son incorrectas  
✅ Copia de nuevo desde Settings → API en Supabase

### "Email not confirmed"
❌ No confirmaste tu email  
✅ Revisa tu bandeja de entrada (y spam)

### No puedo ver productos/categorías
❌ RLS bloqueando el acceso  
✅ Verifica que las políticas se crearon (PASO 3)

### No puedo subir imágenes
❌ Bucket no creado o políticas faltantes  
✅ Verifica el PASO 6 - crea el bucket y las políticas

### Error "Failed to upload image"
❌ Bucket no es público o no tiene políticas  
✅ Marca el bucket como público y crea las 4 políticas

---

## 📞 Más Ayuda

Si algo no funciona:
1. Verifica que seguiste TODOS los pasos en orden
2. Revisa los logs en: Supabase → Database → Logs
3. Revisa la consola del navegador (F12)
4. Lee el archivo `INSTRUCCIONES.md` para la guía completa

---

**¡Con esto Supabase está 100% configurado! 🎉**

