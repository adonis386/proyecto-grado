# Guía de Flujo de Trabajo - Sistema de Inventario IT INN

## 🎯 Objetivo del Sistema

Este sistema está diseñado específicamente para el **Departamento de Sistemas del INN**, permitiendo gestionar equipos de cómputo con información crítica para el soporte técnico diario.

## 🔑 Funcionalidades Clave

### 1. **Búsqueda por Usuario → Rack → Departamento**

**Caso de Uso Real:**
> "Juan Pérez no tiene internet. ¿Dónde está su equipo y a qué Rack está conectado?"

**Cómo resolverlo:**
1. Ve a **Equipos** en el dashboard
2. En la sección **"Búsqueda Rápida"**, escribe "Juan Pérez" en "Buscar por Usuario"
3. El sistema mostrará:
   - Equipo asignado a Juan Pérez
   - Departamento donde trabaja
   - **Rack donde está conectado** 🔌
   - Componentes del equipo

**Resultado:** Sabes exactamente dónde ir físicamente para revisar la conexión de red.

---

### 2. **Filtro por Modelo de Componente**

**Caso de Uso Real:**
> "Llegó un lote de teclados nuevos. ¿Quiénes tienen modelos viejos para cambiarlos?"

**Cómo resolverlo:**
1. Ve a **Equipos**
2. Haz clic en **"Mostrar Filtros Avanzados"**
3. En **"Modelo Componente"**, selecciona el modelo viejo (ej: "KB0225")
4. El sistema mostrará **todos los usuarios** que tienen ese modelo

**Resultado:** Lista completa de usuarios que necesitan actualización de teclado.

---

### 3. **Filtro por Marca de Componente**

**Caso de Uso Real:**
> "Necesito identificar todos los equipos con monitores VIT para mantenimiento preventivo"

**Cómo resolverlo:**
1. Ve a **Equipos**
2. Activa **"Filtros Avanzados"**
3. En **"Marca Componente"**, selecciona "VIT"
4. Filtra por tipo de componente si es necesario (Monitor)

**Resultado:** Lista de todos los equipos con componentes de esa marca.

---

### 4. **Búsqueda por Rack**

**Caso de Uso Real:**
> "El Rack-01 tiene problemas. ¿Qué equipos están conectados allí?"

**Cómo resolverlo:**
1. Ve a **Equipos**
2. En **"Búsqueda Rápida"**, escribe "Rack-01" en "Buscar por Rack"
3. O usa el filtro **"Rack"** en filtros avanzados

**Resultado:** Todos los equipos conectados a ese rack, con sus usuarios y departamentos.

---

### 5. **Filtro por Departamento**

**Caso de Uso Real:**
> "El departamento de Contabilidad necesita un inventario de sus equipos"

**Cómo resolverlo:**
1. Ve a **Equipos**
2. En **"Filtros Avanzados"**, selecciona el departamento
3. El sistema mostrará todos los equipos de ese departamento

**Resultado:** Inventario completo del departamento con usuarios, racks y componentes.

---

## 📊 Filtros Disponibles

### Filtros Básicos
- **Búsqueda General:** Busca en usuario, rack, marca, modelo, número de serie
- **Estado:** Operativo, Disponible, No Operativo, En Reparación, En Mantenimiento
- **Usuario:** Todos, Con Usuario, Sin Usuario, o usuario específico

### Filtros Avanzados
- **Rack:** Todos, Sin Rack, o rack específico
- **Departamento:** Todos o departamento específico
- **Marca Componente:** Todas las marcas de componentes registradas
- **Modelo Componente:** Todos los modelos de componentes registrados

---

## 🔍 Ejemplos de Búsquedas Comunes

### Ejemplo 1: Problema de Red
**Problema:** "María no tiene internet"

**Pasos:**
1. Buscar "María" en búsqueda rápida
2. Ver rack asignado (ej: "Rack-03")
3. Ir físicamente al rack y revisar conexión

### Ejemplo 2: Actualización Masiva
**Problema:** "Cambiar todos los teclados modelo KB0225"

**Pasos:**
1. Filtros Avanzados → Modelo Componente → "KB0225"
2. Ver lista de usuarios afectados
3. Generar reporte o planificar cambio

### Ejemplo 3: Mantenimiento de Rack
**Problema:** "Revisar todos los equipos del Rack-02"

**Pasos:**
1. Buscar "Rack-02" en búsqueda rápida
2. Ver todos los equipos conectados
3. Contactar usuarios si es necesario

---

## 📝 Campos Importantes

### Información del Equipo
- **Número de Equipo:** Identificador único (1, 2, 3...)
- **Usuario Asignado:** Persona que usa el equipo
- **Departamento:** Área donde trabaja el usuario
- **Rack:** 🔌 **Punto de conexión de red** (CRÍTICO para soporte)
- **Estado:** Operativo, Disponible, etc.
- **Ubicación:** Lugar físico del equipo

### Componentes
- **CPU:** Procesador (obligatorio)
- **Monitor:** Pantalla (opcional)
- **Teclado:** Teclado (opcional)
- **Mouse:** Ratón (opcional)

Cada componente tiene:
- Marca
- Modelo
- Número de Serie
- Placa

---

## 🚀 Próximos Pasos

### Para Usar el Sistema:

1. **Ejecutar Migración SQL:**
   - Ejecuta `supabase-migration-rack.sql` en Supabase SQL Editor
   - Esto agrega el campo `rack` a la tabla `equipos`

2. **Actualizar Equipos Existentes:**
   - Edita cada equipo y agrega el rack donde está conectado
   - O usa el script de importación si tienes esa información

3. **Usar los Filtros:**
   - Explora las búsquedas rápidas
   - Prueba los filtros avanzados
   - Familiarízate con las búsquedas comunes

---

## 💡 Tips

- **Usa la búsqueda rápida** para casos urgentes (problemas de red)
- **Usa filtros avanzados** para reportes y mantenimiento preventivo
- **El campo Rack es crítico** - asegúrate de mantenerlo actualizado
- **Los filtros se pueden combinar** para búsquedas muy específicas

---

## 📞 Casos de Uso Documentados

Este sistema resuelve los siguientes problemas comunes del departamento IT:

✅ **"¿Dónde está conectado el equipo de [Usuario]?"**
→ Buscar usuario → Ver rack

✅ **"¿Quién tiene el modelo [X]?"**
→ Filtrar por modelo → Ver lista de usuarios

✅ **"¿Qué equipos están en el [Rack]?"**
→ Buscar rack → Ver todos los equipos

✅ **"¿Qué equipos tiene el departamento [X]?"**
→ Filtrar por departamento → Ver inventario completo

---

**Sistema desarrollado para el Departamento de Sistemas del INN** 🏢

