# 📋 Estado Actual del Sistema - Antes de Adaptar al Modelo de Negocios

> Documento de referencia para comparar con el modelo de negocios a implementar.
> **Fecha:** Enero 2025

---

## 🏗️ Entidades Actuales

### 1. **Categorías** (`categorias`)
- `id`, `nombre`, `descripcion`, `created_at`
- Usada para clasificar productos/dispositivos

### 2. **Productos** (`productos`) — Inventario original
- `nombre`, `descripcion`, `categoria_id`, `marca`, `modelo`, `numero_serie`
- `estado` (Disponible, En Uso, En Reparación, Dado de Baja)
- `ubicacion`, `fecha_adquisicion`, `precio`, `imagen_url`
- Tabla base del inventario original

### 3. **Dispositivos** (`dispositivos`) — Inventario IT extendido
- Todo lo de productos +:
- `proveedor`, `numero_factura`
- `garantia_meses`, `fecha_vencimiento_garantia`
- `asignado_a`, `departamento`
- `especificaciones` (JSONB), `observaciones`

### 4. **Equipos** (`equipos`) — Estaciones de trabajo completas
- `numero_equipo` (único)
- `usuario_asignado`, `estado`, `ubicacion`, `departamento`
- `rack` (campo agregado vía migración)
- `observaciones`

### 5. **Componentes** (`componentes`) — Partes de cada equipo
- `equipo_id`, `tipo` (CPU, Monitor, Teclado, Mouse)
- `marca`, `modelo`, `numero_serie`, `placa`
- Un equipo = 1 CPU + opcionalmente Monitor, Teclado, Mouse

### 6. **Tickets** (`tickets`) — Soporte técnico
- `numero_ticket`, `usuario_solicitante`, `equipo_id`
- `tipo` (Falla, Cambio, Mantenimiento, Consulta, Otro)
- `estado` (Abierto, En Proceso, Resuelto, Cerrado, Cancelado)
- `prioridad` (Baja, Media, Alta, Urgente)
- `titulo`, `descripcion`, `asignado_a`, `solucion`, `observaciones`
- `fecha_resolucion`

---

## 📱 Módulos de la UI (Dashboard)

| Ruta | Módulo | Descripción |
|------|--------|-------------|
| `/dashboard` | Inicio | Estadísticas, accesos rápidos |
| `/dashboard/equipos` | Equipos | CRUD equipos + componentes, búsqueda por usuario/rack/departamento |
| `/dashboard/tickets` | Tickets | CRUD tickets de soporte |
| `/dashboard/inventario` | Inventario | Gestión de inventario (dispositivos) |
| `/dashboard/categorias` | Categorías | Gestión de categorías |
| `/dashboard/productos` | Productos | CRUD productos (existe pero no en menú principal) |

---

## 🔗 Relaciones Actuales

```
categorias ← productos (categoria_id)
categorias ← dispositivos (categoria_id)
equipos ← componentes (equipo_id)
equipos ← tickets (equipo_id)
```

**Nota:** Hay solapamiento conceptual entre `productos`, `dispositivos` e `inventario`. Los equipos se componen de componentes (CPU, Monitor, etc.) pero no hay relación explícita entre componentes y dispositivos/productos.

---

## 📂 Archivos Clave

- **Schema BD:** `supabase-schema.sql`, `supabase-schema-equipos.sql`, `supabase-schema-tickets.sql`, `supabase-schema-dispositivos.sql`
- **Tipos:** `lib/supabase-types.ts` (Dispositivo, Categoria, EstadoDispositivo)
- **Libs:** `lib/supabase-equipos.ts`, `lib/supabase-tickets.ts`, `lib/supabase.ts`
- **Layout:** `app/dashboard/layout.tsx` (menú de navegación)

---

## ✅ Flujos Documentados (GUIA_FLUJO_TRABAJO_IT.md)

1. Buscar por usuario → rack → departamento
2. Filtrar por modelo de componente
3. Filtrar por marca de componente
4. Búsqueda por rack
5. Filtro por departamento

---

## 📄 Documentos relacionados

- **COMPARACION_MODELO_NEGOCIOS.md** — Análisis de brechas vs modelo de negocios del Depto. Redes y Sistemas INN
- **GUIA_FLUJO_TRABAJO_IT.md** — Flujos de uso documentados

---

*Última actualización: Enero 2025*
