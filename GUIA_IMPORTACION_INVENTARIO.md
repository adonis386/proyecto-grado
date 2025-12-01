# 📥 Guía de Importación del Inventario Jascia

Esta guía te explica cómo importar el inventario existente de INN al nuevo sistema.

---

## 📊 **Datos a Importar:**

- ✅ **20 equipos completos**
- ✅ **51 componentes** (CPU, Monitor, Teclado, Mouse)
- ✅ **13 usuarios** con equipos asignados
- ✅ **7 equipos** sin asignar

---

## 🚀 **Pasos para Importar:**

### **PASO 1: Ejecutar el Esquema de Base de Datos**

1. Ve a **Supabase Dashboard** → **SQL Editor**
2. Crea una nueva query
3. Abre el archivo: `supabase-schema-equipos.sql`
4. **Copia TODO el contenido**
5. Pégalo en el editor SQL
6. Haz clic en **"Run"**

**Esto creará:**
- ✅ Tabla `equipos`
- ✅ Tabla `componentes`
- ✅ Índices y triggers
- ✅ Políticas de seguridad (RLS)

---

### **PASO 2: Importar los Datos**

1. En **SQL Editor**, crea otra nueva query
2. Abre el archivo: `importar_equipos_jascia.sql`
3. **Copia TODO el contenido**
4. Pégalo en el editor SQL
5. Haz clic en **"Run"**

**Esto importará:**
- ✅ 20 equipos con sus números y usuarios
- ✅ 51 componentes asociados a cada equipo
- ✅ Toda la información (marcas, modelos, series, placas)

---

### **PASO 3: Verificar la Importación**

1. Ve a **Table Editor** en Supabase
2. Selecciona la tabla **`equipos`**
3. Deberías ver **20 filas**
4. Selecciona la tabla **`componentes`**
5. Deberías ver **51 filas**

---

## 📋 **Estructura de los Datos:**

### **Equipos:**
```
Equipo #1 - Flor Suarez (Operativo)
Equipo #2 - Marlene de Mata (Operativo)
Equipo #3 - Sin Usuario (Disponible)
...
Equipo #20 - Sin Usuario (Disponible)
```

### **Componentes por Equipo:**
Cada equipo puede tener:
- **CPU** (obligatorio)
- **Monitor** (opcional)
- **Teclado** (opcional)
- **Mouse** (opcional)

---

## ✅ **Verificación Post-Importación:**

### **En el Sistema Web:**

1. Inicia sesión en: https://proyecto-grado-green.vercel.app
2. Ve a **Dashboard** → **Equipos**
3. Deberías ver **20 equipos** listados
4. Haz clic en cualquier equipo para ver sus componentes
5. Verifica que los usuarios estén asignados correctamente

---

## 🔍 **Consultas Útiles en Supabase:**

### **Ver todos los equipos:**
```sql
SELECT * FROM public.equipos ORDER BY numero_equipo;
```

### **Ver equipos con sus componentes:**
```sql
SELECT 
    e.numero_equipo,
    e.usuario_asignado,
    e.estado,
    json_agg(c.tipo || ': ' || COALESCE(c.marca, 'N/A') || ' ' || COALESCE(c.modelo, ''))
FROM public.equipos e
LEFT JOIN public.componentes c ON c.equipo_id = e.id
GROUP BY e.id, e.numero_equipo, e.usuario_asignado, e.estado
ORDER BY e.numero_equipo;
```

### **Contar componentes por tipo:**
```sql
SELECT tipo, COUNT(*) as cantidad
FROM public.componentes
GROUP BY tipo
ORDER BY tipo;
```

---

## ⚠️ **Si Algo Sale Mal:**

### **Error: "relation equipos does not exist"**
**Solución:** Ejecuta primero `supabase-schema-equipos.sql`

### **Error: "duplicate key value violates unique constraint"**
**Solución:** Los equipos ya están importados. Usa `DELETE FROM public.equipos;` para limpiar y volver a importar

### **No se ven los equipos en la web**
**Solución:**
1. Verifica que ejecutaste ambos scripts SQL
2. Verifica que estás autenticado
3. Revisa la consola del navegador (F12)

---

## 📊 **Estadísticas de la Importación:**

- **Equipos Operativos:** 12
- **Equipos Disponibles:** 7
- **Equipos No Operativos:** 1
- **Con Usuario Asignado:** 13
- **Sin Usuario:** 7

**Componentes:**
- CPU: 15
- Monitor: 15
- Teclado: 13
- Mouse: 8

---

## 🎯 **Después de Importar:**

Una vez importados los datos:

1. ✅ **Revisa** que todos los equipos aparecen en la lista
2. ✅ **Verifica** que los componentes están asociados correctamente
3. ✅ **Comprueba** que los usuarios están asignados
4. ✅ **Prueba** crear un nuevo equipo para verificar que funciona
5. ✅ **Edita** un equipo existente para verificar la edición

---

## 📝 **Notas Importantes:**

- El script usa `ON CONFLICT` para evitar duplicados
- Si ejecutas el script dos veces, actualizará los datos existentes
- Los números de serie únicos previenen duplicados de componentes
- Cada equipo puede tener máximo 1 componente de cada tipo (CPU, Monitor, Teclado, Mouse)

---

**¡Con esto tendrás todo el inventario de INN en el sistema! 🎉**

