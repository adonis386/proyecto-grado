# Informe Técnico: Base de Datos del Sistema de Gestión IT INN

**Proyecto:** Sistema integral para el Departamento de Redes y Sistemas del INN  
**Motor:** PostgreSQL (Supabase)  
**Fecha del informe:** Enero 2025

---

## 1. Introducción

La base de datos del sistema de gestión IT del INN es de tipo relacional y está alojada en **Supabase**, plataforma que utiliza **PostgreSQL** como motor. Su diseño permite gestionar empleados, equipos informáticos, incidencias (tickets), organización del cableado y una base de conocimiento para técnicos.

El informe describe la estructura de tablas, relaciones, restricciones, índices, vistas, funciones, triggers y políticas de seguridad (Row Level Security).

---

## 2. Tecnología

| Aspecto | Detalle |
|---------|---------|
| **Motor** | PostgreSQL |
| **Plataforma** | Supabase (BaaS) |
| **Autenticación** | Supabase Auth (`auth.users`) |
| **Esquema principal** | `public` |
| **Tipos de datos** | UUID, VARCHAR, TEXT, INTEGER, BOOLEAN, DATE, DECIMAL, JSONB, TIMESTAMP WITH TIME ZONE |

---

## 3. Diagrama de Relaciones (modelo entidad-relación)

```
                    auth.users (Supabase)
                           │
                           │ user_id
                           ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          empleados                                        │
│  id (PK), user_id (FK→auth.users), nombre_completo, cargo, email,        │
│  telefono, direccion_ip, acceso_internet, acceso_llamadas,                │
│  rack, departamento, rol, activo, observaciones, created_at, updated_at   │
└──────────────────────────────────────────────────────────────────────────┘
        │
        │ empleado_id
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                            equipos                                        │
│  id (PK), numero_equipo (UNIQUE), empleado_id (FK→empleados),             │
│  usuario_asignado, estado, ubicacion, departamento, rack,                 │
│  observaciones, created_at, updated_at                                    │
└──────────────────────────────────────────────────────────────────────────┘
        │                                    │
        │ equipo_id                          │ equipo_id
        ▼                                    ▼
┌──────────────────────┐          ┌────────────────────────────────────────┐
│    componentes       │          │           conexiones_rack               │
│  id (PK), equipo_id  │          │  id (PK), rack, puerto, equipo_id (FK), │
│  tipo, marca, modelo │          │  tipo_conexion, descripcion,            │
│  numero_serie, placa │          │  UNIQUE(rack, puerto)                   │
└──────────────────────┘          └────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                            tickets                                        │
│  id (PK), numero_ticket (SERIAL), usuario_solicitante, equipo_id (FK),    │
│  tipo, estado, prioridad, titulo, descripcion, asignado_a, solucion,      │
│  fecha_resolucion, created_at, updated_at                                 │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                            categorias                                     │
│  id (PK), nombre (UNIQUE), descripcion, created_at                        │
└──────────────────────────────────────────────────────────────────────────┘
        │
        │ categoria_id
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  productos / dispositivos (inventario alternativo)                         │
│  id, nombre, categoria_id (FK), marca, modelo, numero_serie, estado, ...  │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                            guias                                          │
│  id (PK), titulo, categoria, contenido, palabras_clave, activo,           │
│  created_at, updated_at                                                   │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Descripción de Tablas

### 4.1 empleados

Registra a los empleados del INN con datos de contacto y conectividad.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Identificador único |
| user_id | UUID | FK → auth.users(id), ON DELETE SET NULL | Vincula con usuario de autenticación |
| nombre_completo | VARCHAR(200) | NOT NULL | Nombre completo |
| cargo | VARCHAR(100) | | Cargo en la organización |
| email | VARCHAR(255) | | Correo electrónico |
| telefono | VARCHAR(50) | | Teléfono |
| direccion_ip | VARCHAR(45) | | IP asignada al equipo |
| acceso_internet | BOOLEAN | DEFAULT true | Si tiene acceso a internet |
| acceso_llamadas | BOOLEAN | DEFAULT true | Si tiene acceso a llamadas |
| rack | VARCHAR(100) | | Rack al que está conectado |
| departamento | VARCHAR(100) | DEFAULT 'Informática' | Departamento |
| rol | VARCHAR(50) | CHECK (Admin, Técnico, Gerente, Empleado) | Rol en el sistema |
| activo | BOOLEAN | DEFAULT true | Si está activo |
| observaciones | TEXT | | Notas adicionales |
| created_at | TIMESTAMPTZ | NOT NULL | Fecha de creación |
| updated_at | TIMESTAMPTZ | NOT NULL | Fecha de última actualización |

---

### 4.2 equipos

Equipos completos de cómputo asignados a usuarios o áreas.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK | Identificador único |
| numero_equipo | INTEGER | NOT NULL, UNIQUE | Número del equipo (1, 2, 3…) |
| empleado_id | UUID | FK → empleados(id), ON DELETE SET NULL | Empleado asignado |
| usuario_asignado | VARCHAR(200) | | Nombre texto (compatibilidad) |
| estado | VARCHAR(50) | DEFAULT 'Operativo' | Estado del equipo |
| ubicacion | VARCHAR(200) | DEFAULT 'Oficina Principal' | Ubicación física |
| departamento | VARCHAR(100) | DEFAULT 'Informática' | Departamento |
| rack | VARCHAR(100) | | Rack de conexión |
| observaciones | TEXT | | Notas |
| created_at | TIMESTAMPTZ | NOT NULL | Fecha de creación |
| updated_at | TIMESTAMPTZ | NOT NULL | Fecha de actualización |

---

### 4.3 componentes

Componentes individuales de cada equipo (CPU, Monitor, Teclado, Mouse).

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK | Identificador único |
| equipo_id | UUID | FK → equipos(id), ON DELETE CASCADE | Equipo al que pertenece |
| tipo | VARCHAR(50) | CHECK (CPU, Monitor, Teclado, Mouse) | Tipo de componente |
| marca | VARCHAR(100) | | Marca |
| modelo | VARCHAR(100) | | Modelo |
| numero_serie | VARCHAR(100) | | Número de serie |
| placa | VARCHAR(100) | | Placa o identificador |
| created_at | TIMESTAMPTZ | NOT NULL | Fecha de creación |
| updated_at | TIMESTAMPTZ | NOT NULL | Fecha de actualización |

**Restricción:** UNIQUE(equipo_id, tipo) — un equipo solo puede tener un componente de cada tipo.

---

### 4.4 tickets

Solicitudes e incidencias reportadas por los usuarios.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK | Identificador único |
| numero_ticket | SERIAL | UNIQUE | Número secuencial del ticket |
| usuario_solicitante | VARCHAR(200) | NOT NULL | Quien reporta |
| equipo_id | UUID | FK → equipos(id), ON DELETE SET NULL | Equipo relacionado |
| tipo | VARCHAR(50) | NOT NULL, CHECK | Conectividad, Telefonía IP, Cableado Estructural, Falla, Cambio, Mantenimiento, Consulta, Otro |
| estado | VARCHAR(50) | DEFAULT 'Abierto', CHECK | Abierto, En Proceso, Resuelto, Cerrado, Cancelado |
| prioridad | VARCHAR(50) | DEFAULT 'Media', CHECK | Baja, Media, Alta, Urgente |
| titulo | VARCHAR(200) | NOT NULL | Título del ticket |
| descripcion | TEXT | NOT NULL | Descripción detallada |
| asignado_a | VARCHAR(200) | | Técnico asignado |
| solucion | TEXT | | Solución aplicada |
| observaciones | TEXT | | Notas adicionales |
| fecha_resolucion | TIMESTAMPTZ | | Fecha de cierre/resolución |
| created_at | TIMESTAMPTZ | NOT NULL | Fecha de creación |
| updated_at | TIMESTAMPTZ | NOT NULL | Fecha de actualización |

---

### 4.5 conexiones_rack

Registro de conexiones y puertos en los racks de red.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK | Identificador único |
| rack | VARCHAR(100) | NOT NULL | Nombre del rack |
| puerto | VARCHAR(100) | NOT NULL | Puerto (ej. Puerto 5, 1/0/24) |
| equipo_id | UUID | FK → equipos(id), ON DELETE SET NULL | Equipo conectado |
| tipo_conexion | VARCHAR(50) | DEFAULT 'Red', CHECK | Red, Energía, VoIP, Otro |
| descripcion | TEXT | | Descripción opcional |
| created_at | TIMESTAMPTZ | NOT NULL | Fecha de creación |
| updated_at | TIMESTAMPTZ | NOT NULL | Fecha de actualización |

**Restricción:** UNIQUE(rack, puerto) — cada combinación rack–puerto es única.

---

### 4.6 guias

Base de conocimiento para técnicos.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK | Identificador único |
| titulo | VARCHAR(200) | NOT NULL | Título de la guía |
| categoria | VARCHAR(100) | DEFAULT 'Procedimiento' | Categoría (Resetear equipo, Revisar rack, etc.) |
| contenido | TEXT | NOT NULL | Contenido de la guía |
| palabras_clave | TEXT | | Palabras clave para búsqueda |
| activo | BOOLEAN | DEFAULT true | Si está activa |
| created_at | TIMESTAMPTZ | NOT NULL | Fecha de creación |
| updated_at | TIMESTAMPTZ | NOT NULL | Fecha de actualización |

---

### 4.7 categorias

Categorías para productos o dispositivos del inventario.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK | Identificador único |
| nombre | VARCHAR(100) | NOT NULL, UNIQUE | Nombre de la categoría |
| descripcion | TEXT | | Descripción |
| created_at | TIMESTAMPTZ | NOT NULL | Fecha de creación |

---

### 4.8 productos

Inventario de productos (esquema base, puede coexistir con dispositivos).

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK | Identificador único |
| nombre | VARCHAR(200) | NOT NULL | Nombre del producto |
| descripcion | TEXT | | Descripción |
| categoria_id | UUID | FK → categorias(id), ON DELETE RESTRICT | Categoría |
| marca | VARCHAR(100) | | Marca |
| modelo | VARCHAR(100) | | Modelo |
| numero_serie | VARCHAR(100) | UNIQUE | Número de serie |
| estado | VARCHAR(50) | DEFAULT 'Disponible' | Disponible, En Uso, etc. |
| ubicacion | VARCHAR(200) | | Ubicación |
| fecha_adquisicion | DATE | | Fecha de compra |
| precio | DECIMAL(10,2) | | Precio |
| imagen_url | TEXT | | URL de imagen |
| created_at | TIMESTAMPTZ | NOT NULL | Fecha de creación |
| updated_at | TIMESTAMPTZ | NOT NULL | Fecha de actualización |

---

### 4.9 dispositivos

Inventario extendido de dispositivos IT (garantías, proveedores, etc.).

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK | Identificador único |
| nombre | VARCHAR(200) | NOT NULL | Nombre |
| descripcion | TEXT | | Descripción |
| categoria_id | UUID | FK → categorias(id) | Categoría |
| marca | VARCHAR(100) | | Marca |
| modelo | VARCHAR(100) | | Modelo |
| numero_serie | VARCHAR(100) | UNIQUE | Número de serie |
| estado | VARCHAR(50) | DEFAULT 'Disponible' | Estado |
| ubicacion | VARCHAR(200) | | Ubicación |
| fecha_adquisicion | DATE | | Fecha de adquisición |
| proveedor | VARCHAR(200) | | Proveedor |
| numero_factura | VARCHAR(100) | | Número de factura |
| garantia_meses | INTEGER | | Meses de garantía |
| fecha_vencimiento_garantia | DATE | | Vencimiento de garantía |
| asignado_a | VARCHAR(200) | | Asignado a |
| departamento | VARCHAR(100) | | Departamento |
| especificaciones | JSONB | | Especificaciones técnicas |
| observaciones | TEXT | | Notas |
| imagen_url | TEXT | | URL de imagen |
| created_at | TIMESTAMPTZ | NOT NULL | Fecha de creación |
| updated_at | TIMESTAMPTZ | NOT NULL | Fecha de actualización |

---

## 5. Vista: equipos_completos

Vista que combina equipos, empleados y componentes en una sola consulta.

**Columnas principales:**
- Datos del equipo: id, numero_equipo, estado, ubicacion, rack, departamento
- Datos del empleado (si existe): empleado_nombre, empleado_cargo, empleado_email, empleado_rack
- Rack y departamento: se toman del empleado si está vinculado; si no, del equipo
- componentes: agregado JSON con CPU, Monitor, Teclado y Mouse ordenados

**Uso:** Consultas de equipos con toda la información relacionada en una sola lectura.

---

## 6. Índices

Los índices están pensados para búsquedas y filtros frecuentes:

| Tabla | Índice | Columna(s) |
|-------|--------|------------|
| empleados | idx_empleados_user_id | user_id |
| empleados | idx_empleados_departamento | departamento |
| empleados | idx_empleados_rack | rack |
| empleados | idx_empleados_nombre | nombre_completo |
| empleados | idx_empleados_email | email |
| empleados | idx_empleados_activo | activo |
| equipos | idx_equipos_numero | numero_equipo |
| equipos | idx_equipos_usuario | usuario_asignado |
| equipos | idx_equipos_estado | estado |
| equipos | idx_equipos_empleado | empleado_id |
| equipos | idx_equipos_rack | rack |
| equipos | idx_equipos_departamento | departamento |
| componentes | idx_componentes_equipo | equipo_id |
| componentes | idx_componentes_tipo | tipo |
| componentes | idx_componentes_serie | numero_serie |
| tickets | idx_tickets_numero | numero_ticket |
| tickets | idx_tickets_usuario | usuario_solicitante |
| tickets | idx_tickets_equipo | equipo_id |
| tickets | idx_tickets_estado | estado |
| tickets | idx_tickets_tipo | tipo |
| tickets | idx_tickets_prioridad | prioridad |
| tickets | idx_tickets_asignado | asignado_a |
| conexiones_rack | idx_conexiones_rack | rack |
| conexiones_rack | idx_conexiones_equipo | equipo_id |
| conexiones_rack | idx_conexiones_tipo | tipo_conexion |
| guias | idx_guias_categoria | categoria |
| guias | idx_guias_titulo | titulo |
| guias | idx_guias_activo | activo |

---

## 7. Funciones y Triggers

### 7.1 Función update_updated_at_column()

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';
```

Actualiza el campo `updated_at` antes de cada `UPDATE`. Se usa en tablas con auditoría de modificaciones.

### 7.2 Triggers asociados

| Tabla | Trigger | Momento |
|-------|---------|---------|
| productos | update_productos_updated_at | BEFORE UPDATE |
| equipos | update_equipos_updated_at | BEFORE UPDATE |
| componentes | update_componentes_updated_at | BEFORE UPDATE |
| tickets | update_tickets_updated_at | BEFORE UPDATE |
| empleados | update_empleados_updated_at | BEFORE UPDATE |
| guias | update_guias_updated_at | BEFORE UPDATE |
| conexiones_rack | update_conexiones_rack_updated_at | BEFORE UPDATE |
| dispositivos | update_dispositivos_updated_at | BEFORE UPDATE |

### 7.3 Funciones de roles (RLS)

| Función | Retorno | Descripción |
|---------|---------|-------------|
| get_user_rol() | VARCHAR(50) | Rol del usuario actual desde la tabla empleados |
| is_staff() | BOOLEAN | TRUE si el rol es Administrador, Técnico o Gerente |
| can_write() | BOOLEAN | TRUE si es staff o no tiene empleado vinculado (compatibilidad) |
| can_manage_empleados() | BOOLEAN | TRUE si es Administrador, Gerente o no tiene empleado vinculado |

---

## 8. Row Level Security (RLS)

RLS está habilitado en todas las tablas del esquema `public`. Las políticas controlan qué operaciones puede realizar cada usuario según su autenticación y rol.

### 8.1 Lectura (SELECT)

Todas las tablas permiten lectura a usuarios autenticados (`authenticated`).

### 8.2 Escritura (INSERT, UPDATE, DELETE)

| Tabla | Insert | Update | Delete |
|-------|--------|--------|--------|
| empleados | can_manage_empleados() | can_manage_empleados() | can_manage_empleados() |
| tickets | true (todos) | can_write() | can_write() |
| categorias | can_write() | can_write() | can_write() |
| equipos | can_write() | can_write() | can_write() |
| componentes | can_write() | can_write() | can_write() |
| guias | can_write() | can_write() | can_write() |
| conexiones_rack | can_write() | can_write() | can_write() |
| productos | can_write() | can_write() | can_write() |
| dispositivos | can_write() | can_write() | can_write() |

**Resumen:**
- Solo **Administrador** y **Gerente** gestionan empleados.
- Todos los autenticados pueden crear tickets.
- Solo **staff** (Administrador, Técnico, Gerente) puede modificar equipos, componentes, categorías, guías, cableado, productos y dispositivos.

---

## 9. Orden de Ejecución de Migraciones

Para una instalación desde cero se recomienda ejecutar los scripts en este orden:

1. `supabase-schema.sql` — categorias, productos, función update_updated_at
2. `supabase-schema-equipos.sql` — equipos, componentes, vista inicial
3. `supabase-migration-rack.sql` — columna rack en equipos
4. `supabase-schema-tickets.sql` — tickets
5. `supabase-migration-empleados.sql` — empleados
6. `supabase-migration-equipos-empleado.sql` — empleado_id en equipos, vista actualizada
7. `supabase-migration-tipos-ticket.sql` — tipos de ticket actualizados
8. `supabase-migration-guias.sql` — guias
9. `supabase-migration-cableado.sql` — conexiones_rack
10. `supabase-migration-roles-rls.sql` — funciones de roles y políticas RLS
11. `supabase-schema-dispositivos.sql` — dispositivos (opcional)
12. `supabase-schema-dispositivos.sql` — productos/inventario alternativo (opcional)

---

## 10. Integridad Referencial

| Tabla origen | FK | Tabla destino | ON DELETE |
|--------------|----|---------------|-----------|
| empleados | user_id | auth.users | SET NULL |
| equipos | empleado_id | empleados | SET NULL |
| componentes | equipo_id | equipos | CASCADE |
| tickets | equipo_id | equipos | SET NULL |
| conexiones_rack | equipo_id | equipos | SET NULL |
| productos | categoria_id | categorias | RESTRICT |
| dispositivos | categoria_id | categorias | RESTRICT |

- **CASCADE:** al eliminar un equipo, se eliminan sus componentes.
- **SET NULL:** al eliminar empleado o equipo, las referencias se ponen en NULL para conservar historial.
- **RESTRICT:** no se puede eliminar una categoría si tiene productos o dispositivos asociados.

---

## 11. Conclusiones

La base de datos está estructurada para soportar:

- Gestión de empleados con vinculación a autenticación.
- Inventario de equipos y componentes.
- Gestión de incidencias con tipos específicos del departamento de redes.
- Organización del cableado en racks.
- Base de conocimiento para técnicos.
- Seguridad por roles mediante RLS.
- Auditoría con `created_at` y `updated_at`.
- Integridad referencial coherente y migraciones ordenadas.

El diseño permite ampliaciones futuras (nuevas tablas, columnas o políticas) sin comprometer la estructura actual.
