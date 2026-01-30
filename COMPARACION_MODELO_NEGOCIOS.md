# 📊 Comparación: Modelo de Negocios vs Sistema Actual

> **Departamento de Redes y Sistemas del INN**  
> Análisis de brechas y plan de adaptación

---

## ✅ Lo que YA tenemos cubierto

| Requerimiento del modelo | Estado actual | Notas |
|--------------------------|---------------|-------|
| Gestión de incidencias | ✅ Implementado | Tabla `tickets` con tipos, estados, prioridad |
| Inventario de equipos | ✅ Implementado | Tablas `equipos`, `componentes`, `dispositivos` |
| Asignación de tickets a técnico | ✅ Parcial | Campo `asignado_a` (texto libre) |
| Actualización estado de ticket | ✅ Implementado | Estados: Abierto, En Proceso, Resuelto, etc. |
| Registro de equipos en inventario | ✅ Implementado | CRUD equipos + componentes |
| Clasificación de prioridad | ✅ Implementado | Baja, Media, Alta, Urgente |
| Búsqueda por usuario/rack/departamento | ✅ Implementado | Filtros en módulo Equipos |
| Interfaz web | ✅ Implementado | Dashboard Next.js |

---

## ❌ Brechas identificadas (a implementar)

### 1. **Registro de Usuarios/Empleados** — CRÍTICO
**Modelo exige:** Cada empleado del INN registrado con:
- Nombre completo
- Cargo
- Información de contacto (correo, teléfono)
- Equipos asignados
- Dirección IP
- Acceso a internet y llamadas
- Rack y departamento

**Estado actual:** Solo autenticación Supabase (email/password). El campo `usuario_asignado` en equipos es texto libre, no hay FK a perfil de empleado.

**Acción:** Crear tabla `empleados` vinculada a `auth.users`, y relacionar equipos → empleado_id.

---

### 2. **Sistema de Roles**
**Modelo exige:** Administradores, Técnicos, Gerentes, Empleados.

**Estado actual:** Todos los usuarios autenticados tienen los mismos permisos.

**Acción:** Tabla `roles` o campo `rol` en perfil de empleado; RLS según rol.

---

### 3. **Adquisición de Equipos Nuevos**
**Modelo exige:**
- Registro de nuevos equipos (CPU, mouse, teclado, etc.)
- Indicar si se asignan a usuario o quedan como **sustitutos para reemplazo**

**Estado actual:** Equipos y componentes se registran, pero no hay concepto de "stock/sustituto".

**Acción:** Campo `tipo_asignacion` (Asignado | Sustituto/Disponible) en equipos o inventario.

---

### 4. **Información Básica / Base de Conocimiento**
**Modelo exige:** Técnicos deben acceder a:
- Cómo resetear equipos
- Qué rack revisar para resolver problemas remotos

**Estado actual:** No existe.

**Acción:** Módulo de "Guías" o "Base de conocimiento" (artículos por equipo/rack/procedimiento).

---

### 5. **Reportes**
**Modelo exige:**
- Informes de solicitudes (incidencias)
- Tiempos de respuesta
- Estado del inventario

**Estado actual:** No existe módulo de reportes.

**Acción:** Página de Reportes con gráficos, exportación, métricas de SLA.

---

### 6. **Organización del Cableado**
**Modelo exige:** Registro de conexiones y su ubicación en racks.

**Estado actual:** Solo campo `rack` en equipos. No hay detalle de puertos, cableado, conexiones.

**Acción:** Tabla `conexiones_rack` o `cableado` (rack, puerto, equipo, tipo_conexion).

---

### 7. **Tipos de Solicitud Específicos**
**Modelo exige (solicitudes más frecuentes):**
- Conectividad a internet
- Problemas de telefonía IP
- Requerimientos de cableado estructural

**Estado actual:** Tipos genéricos: Falla, Cambio, Mantenimiento, Consulta, Otro.

**Acción:** Ampliar o ajustar tipos de ticket para incluir estos casos.

---

### 8. **Notificaciones por Email**
**Modelo exige:** Notificaciones automáticas sobre estado de solicitudes.

**Estado actual:** No implementado.

**Acción:** Supabase Edge Functions o triggers para enviar email al cambiar estado del ticket.

---

## 📋 Resumen de entidades a crear/modificar

| Entidad | Acción |
|---------|--------|
| `empleados` | **CREAR** — Perfil de empleado con todos los datos |
| `roles` | **CREAR** o campo en empleados |
| `equipos` | **MODIFICAR** — empleado_id (FK), tipo_asignacion |
| `tickets` | **MODIFICAR** — Tipos específicos, empleado_solicitante_id |
| `guias` / `base_conocimiento` | **CREAR** — Guías para técnicos |
| `conexiones_rack` / `cableado` | **CREAR** — Organización de cableado |
| Reportes | **CREAR** — Módulo/página nueva |

---

## 📐 Diagrama de relaciones propuesto

```
auth.users ← empleados (user_id)
empleados ← equipos (empleado_id)
empleados ← tickets (solicitante_id)
equipos ← componentes
equipos ← tickets (equipo_id)
racks ← conexiones_rack
equipos ← conexiones_rack
guias (independiente o por categoría)
```

---

## 🎯 Priorización sugerida

1. **Alta:** Empleados + vinculación equipos
2. **Alta:** Tipos de ticket específicos
3. **Media:** Reportes básicos
4. **Media:** Tipo asignación (sustituto/asignado)
5. **Media:** Sistema de roles
6. **Baja:** Base de conocimiento
7. **Baja:** Organización cableado
8. **Baja:** Notificaciones email
