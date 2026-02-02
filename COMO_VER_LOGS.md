# Cómo ver logs cuando algo falla o queda cargando

Cuando el sistema se queda cargando o algo no funciona, revisa los logs en estos sitios:

---

## 1. Consola del navegador (más importante)

1. Abre la aplicación en Chrome, Edge o Firefox.
2. Pulsa **F12** (o clic derecho → "Inspeccionar").
3. Ve a la pestaña **Console** (Consola).
4. Recarga la página (**F5** o Ctrl+R).
5. Busca mensajes en **rojo** (errores) o **amarillo** (advertencias).

**Qué buscar:**
- `[Dashboard] Error al verificar sesión` → problema al obtener la sesión.
- `[useRol]` → problema al cargar el rol (tabla empleados o sin empleado vinculado).
- `[Inventario] stock_almacen:` → la tabla de almacén no existe o hay error de permisos.
- Errores de red (Failed to fetch, 404, 500) → Supabase o conexión.

---

## 2. Terminal donde corre el proyecto

Si iniciaste el servidor con `npm run dev`:

1. Mira la **ventana de PowerShell o CMD** donde ejecutaste `npm run dev`.
2. Ahí aparecen errores de compilación y, a veces, logs del servidor.
3. Si ves errores en rojo al cargar una página, ese archivo o ruta puede estar fallando.

---

## 3. Red (peticiones a Supabase)

1. F12 → pestaña **Network** (Red).
2. Recarga la página.
3. Filtra por **Fetch/XHR**.
4. Revisa las peticiones a `supabase.co`: si salen en **rojo** (failed) o con código 4xx/5xx, el fallo está en la API o en la base de datos.

---

## 4. Supabase Dashboard

1. Entra en [app.supabase.com](https://app.supabase.com) → tu proyecto.
2. **Logs** (menú lateral):
   - **API Logs** → peticiones a la API y errores.
   - **Postgres Logs** → errores de la base de datos.
3. **Table Editor** → comprueba que existan las tablas que usa la app (por ejemplo `empleados`, `stock_almacen` si usas inventario).

---

## Si se queda en "Cargando..." sin avanzar

1. Abre la **consola del navegador (F12 → Console)** y recarga.
2. Si no hay errores:
   - Puede ser que **Supabase tarde** (red lenta o proyecto dormido).
   - Prueba en otra red o espera unos segundos.
3. Si ves error de **tabla no existe** (p. ej. `stock_almacen`, `empleados`):
   - Ejecuta en Supabase → SQL Editor el script de migración correspondiente.
4. Si ves **Failed to fetch** o **CORS**:
   - Revisa que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local` sean correctos.
   - Reinicia el servidor (`npm run dev`) después de cambiar variables.

---

## Resumen rápido

| Dónde              | Cómo                          |
|--------------------|--------------------------------|
| Errores en la app  | F12 → Console                 |
| Peticiones fallidas| F12 → Network → Fetch/XHR     |
| Servidor Next.js   | Terminal donde corre `npm run dev` |
| Base de datos / API| Supabase Dashboard → Logs     |

---

## Error: 404 en `_next/static/...` (layout.css, main-app.js, etc.)

**Qué significa:** El navegador pide archivos que Next.js genera al compilar, pero no los encuentra (caché vieja o carpeta de build desincronizada).

**Solución:**

1. **Cierra el servidor** (en la terminal donde corre `npm run dev`, pulsa **Ctrl+C**).
2. **Borra la carpeta de build** y vuelve a iniciar:
   ```bash
   rmdir /s /q .next
   npm run dev
   ```
   (En PowerShell: `Remove-Item -Recurse -Force .next` si prefieres.)
3. **Refresco forzado en el navegador:** **Ctrl+Shift+R** (o Ctrl+F5) en http://localhost:3000 para no usar caché.
4. Si sigue igual, cierra la pestaña, abre una nueva y entra de nuevo a http://localhost:3000.

Asegúrate de entrar siempre a **http://localhost:3000** (donde corre `npm run dev`), no a un archivo .html abierto directamente.
