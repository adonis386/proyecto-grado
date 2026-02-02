# Aplicación del Modelo de Negocio al Sistema INN-INVENTARIO

Documento que describe qué se implementó según el Modelo de Negocio y qué queda pendiente.

---

## ✅ Implementado

### BR-02: No cerrar ticket sin solución
- **Validación:** Al marcar un ticket como **Resuelto** o **Cerrado**, el campo "Solución" es obligatorio.
- **Ubicación:** Formulario editar ticket. Si se intenta guardar sin solución, se muestra error.
- **Archivos:** `app/dashboard/tickets/[id]/editar/page.tsx`

### Estados del ticket (ciclo de vida)
- **Nuevos estados:** **Asignado**, **Pendiente** (pausa por falta de repuestos).
- **Flujo:** Abierto → Asignado → En Proceso → [Pendiente] → Resuelto → Cerrado
- **Migración:** `supabase-migration-modelo-negocio.sql`
- **Archivos:** `lib/supabase-tickets.ts`, páginas de tickets

### BR-03: Reportes solo para Gerencia/Admin
- **Restricción:** El módulo **Reportes** solo es visible para Administrador y Gerente.
- **Menú:** "Reportes" y "Ver Reportes" ocultos para Empleado y Técnico.
- **Protección:** Redirección a dashboard si acceden por URL directa.
- **Archivos:** `app/dashboard/layout.tsx`, `app/dashboard/reportes/page.tsx`, `app/dashboard/page.tsx`

### BR-01: Trazabilidad (parcial)
- **Recordatorio:** En el formulario de equipos se indica que debe vincularse a empleado, rack y conexión en Cableado.
- **Estructura existente:** empleado_id, conexiones_rack (rack, puerto, equipo_id). Falta validación estricta obligatoria.

---

## ⏳ Pendiente (brechas)

### BR-04: Alertas de mantenimiento preventivo
- **Requerimiento:** Alertas automáticas según estándares ASHRAE y tiempo desde última intervención.
- **Acción:** Crear tabla `mantenimientos_preventivos` y lógica de alertas. Requiere diseño de ciclos de mantenimiento.

### AUDITORÍA: Log de transacciones
- **Requerimiento:** Tabla de auditoría (ID_Transacción, Fecha, Usuario_ID, Acción) para registro inmutable.
- **Acción:** Triggers en PostgreSQL que registren INSERT/UPDATE/DELETE en tablas críticas.

### Validación estricta BR-01
- **Requerimiento:** Todo activo debe estar vinculado obligatoriamente a usuario, IP y puerto en Rack.
- **Acción:** Validación a nivel de base de datos o formulario que impida guardar equipo sin empleado + conexión en rack.

### Histórico de tickets en solo lectura
- **Requerimiento:** Tickets en estado CERRADO no deben modificarse.
- **Acción:** RLS o validación que bloquee UPDATE de tickets con estado Cerrado.

---

## Ejecutar migración

Para aplicar los nuevos estados de ticket, ejecuta en Supabase → SQL Editor:

```
supabase-migration-modelo-negocio.sql
```

---

*Última actualización: Enero 2025*
