# Pasos de Implementación - Modelo de Negocios INN

Seguimiento del avance paso a paso.

---

## ✅ Paso 1: Tabla de Empleados — COMPLETADO

**Archivo:** `supabase-migration-empleados.sql`

**Qué hace:**
- Crea la tabla `empleados` con todos los campos del modelo de negocios
- Vincula opcionalmente con `auth.users` (user_id)
- Incluye: nombre, cargo, email, teléfono, IP, acceso internet/llamadas, rack, departamento, rol

**Cómo ejecutar:**
1. Abre Supabase Dashboard → SQL Editor
2. Pega el contenido de `supabase-migration-empleados.sql`
3. Ejecuta (Run)

**Siguiente paso:** Vincular equipos a empleados (empleado_id en equipos)

---

## ✅ Paso 2: Vincular Equipos a Empleados — COMPLETADO

**Archivo:** `supabase-migration-equipos-empleado.sql`

**Qué hace:**
- Agrega columna `empleado_id` en tabla `equipos` (FK a empleados)
- Mantiene `usuario_asignado` para compatibilidad con datos existentes
- Actualiza vista `equipos_completos` con datos del empleado (nombre, cargo, email, rack, etc.)
- Usa COALESCE: si hay empleado, toma rack/departamento del empleado

**Cómo ejecutar:**
1. Supabase Dashboard → SQL Editor
2. Pega contenido de `supabase-migration-equipos-empleado.sql`
3. Ejecuta (Run)

---

## ✅ Paso 4: Selector Empleado en Equipos — COMPLETADO

**Archivos modificados:**
- `app/dashboard/equipos/nuevo/page.tsx` — Selector de empleado (empleados activos)
- `app/dashboard/equipos/[id]/editar/page.tsx` — Selector de empleado
- `app/dashboard/equipos/[id]/page.tsx` — Muestra empleado y enlace a ficha

**Funcionalidad:**
- Al crear/editar equipo: elegir empleado del listado o escribir nombre manual
- Se guarda `empleado_id` y `usuario_asignado` (para compatibilidad)
- En detalle de equipo: enlace "Ver empleado" cuando está asignado

---

## ✅ Paso 5: Tipos de Ticket Específicos — COMPLETADO

**Archivo:** `supabase-migration-tipos-ticket.sql`

**Tipos agregados (prioridad según solicitudes frecuentes):**
- Conectividad (internet)
- Telefonía IP
- Cableado Estructural
- Falla, Cambio, Mantenimiento, Consulta, Otro (existentes)

**Archivos modificados:** `lib/supabase-tickets.ts`, formularios ticket nuevo/editar, schema base

**Cómo ejecutar:** Supabase Dashboard → SQL Editor → pegar y ejecutar `supabase-migration-tipos-ticket.sql`

---

## ✅ Paso 6: Módulo de Reportes — COMPLETADO

**Archivo:** `app/dashboard/reportes/page.tsx`

**Secciones:**
- **Reporte de Incidencias:** Total, abiertos, en proceso, resueltos. Desglose por tipo y prioridad.
- **Tiempos de Respuesta:** Tiempo promedio de resolución, tickets resueltos en 30 días.
- **Estado del Inventario:** Total equipos, empleados, componentes. Equipos por estado.
- **Últimos Tickets:** Tabla con los 10 tickets más recientes con enlaces.

**Menú:** Agregado "Reportes" en el dashboard.

---

## ✅ Paso 7: Base de Conocimiento — COMPLETADO

**Archivo migración:** `supabase-migration-guias.sql`

**Archivos creados:**
- `app/dashboard/guias/page.tsx` — Lista con búsqueda y filtro por categoría
- `app/dashboard/guias/nuevo/page.tsx` — Crear guía
- `app/dashboard/guias/[id]/page.tsx` — Ver guía
- `app/dashboard/guias/[id]/editar/page.tsx` — Editar guía
- `lib/supabase-guias.ts` — Tipos y categorías

**Categorías:** Resetear equipo, Revisar rack, Conectividad, Telefonía IP, Cableado, Procedimiento, Otro

**Cómo ejecutar:** Supabase Dashboard → SQL Editor → `supabase-migration-guias.sql`

**Menú:** Agregado "Guías" en el dashboard.

---

## ✅ Paso 8: Organización del Cableado — COMPLETADO

**Archivo migración:** `supabase-migration-cableado.sql`

**Tabla:** `conexiones_rack` (rack, puerto, equipo_id, tipo_conexion, descripcion)
**Tipos de conexión:** Red, Energía, VoIP, Otro
**Constraint:** UNIQUE(rack, puerto)

**Archivos creados:**
- `app/dashboard/cableado/page.tsx` — Vista agrupada por rack
- `app/dashboard/cableado/nuevo/page.tsx` — Registrar conexión
- `app/dashboard/cableado/[id]/editar/page.tsx` — Editar conexión
- `lib/supabase-cableado.ts` — Tipos

**En equipo detalle:** Muestra conexiones del equipo con enlace a Cableado.

**Menú:** Agregado "Cableado" en el dashboard.

---

## ✅ Paso 9: Sistema de Roles y Permisos (RLS) — COMPLETADO

**Archivo migración:** `supabase-migration-roles-rls.sql`

**Funciones:** `get_user_rol()`, `is_staff()`, `can_write()`, `can_manage_empleados()`

**Permisos:**
- **Empleados:** Solo Admin y Gerente pueden crear/editar/eliminar
- **Tickets:** Todos pueden crear (solicitar ayuda), solo staff actualizar/eliminar
- **Resto (equipos, categorías, guías, cableado, etc.):** Solo staff puede escribir

**UI:** Menú Empleados y botones crear/editar ocultos para Empleados. Rol desde tabla empleados (user_id).

**Cómo ejecutar:** Supabase Dashboard → SQL Editor → `supabase-migration-roles-rls.sql`

---

## ✅ Paso 3: Módulo UI de Empleados — COMPLETADO

**Archivos creados:**
- `app/dashboard/empleados/page.tsx` — Lista con filtros (buscar, departamento, rol, activo)
- `app/dashboard/empleados/nuevo/page.tsx` — Formulario crear empleado
- `app/dashboard/empleados/[id]/page.tsx` — Detalle + equipos asignados
- `app/dashboard/empleados/[id]/editar/page.tsx` — Editar empleado
- `lib/supabase-empleados.ts` — Tipos Empleado, RolEmpleado
- Menú: agregado "Empleados" al dashboard

**Siguiente paso:** Agregar selector de empleado en formularios de Equipos (nuevo/editar)

---

## ⏳ Pasos posteriores

4. Selector empleado en Equipos (nuevo/editar)
5. Tipos de ticket específicos
5. Reportes básicos
6. (Opcional) Base de conocimiento, cableado, notificaciones
