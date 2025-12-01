# 🔄 Migración a Sistema de Inventario IT

El sistema se ha transformado en un **sistema especializado para el Departamento de Informática**.

---

## ✨ **Cambios Principales:**

### **1. Enfoque Específico IT**
- ❌ Antes: "Sistema de Inventario de Productos"
- ✅ Ahora: "Sistema de Inventario de Dispositivos IT"

### **2. Nuevos Campos Agregados:**

**Información de Adquisición:**
- ✅ `proveedor` - Proveedor del equipo
- ✅ `numero_factura` - Número de factura

**Control de Garantía:**
- ✅ `garantia_meses` - Duración de garantía
- ✅ `fecha_vencimiento_garantia` - Cuándo vence la garantía

**Asignación:**
- ✅ `asignado_a` - Usuario/persona asignada
- ✅ `departamento` - Departamento (default: "Informática")

**Técnico:**
- ✅ `especificaciones` - Specs técnicas en JSON (CPU, RAM, etc.)
- ✅ `observaciones` - Notas y observaciones del técnico

### **3. Estados Actualizados:**
```
✅ Disponible
✅ En Uso
✅ En Reparación
✅ En Mantenimiento (NUEVO)
✅ Dado de Baja
✅ En Garantía (NUEVO)
```

### **4. Categorías IT Específicas:**

**Antes** (6 categorías genéricas):
- Computadoras, Periféricos, Redes, Servidores, Almacenamiento, Otros

**Ahora** (12 categorías especializadas):
- Computadoras de Escritorio
- Laptops
- Servidores
- Equipos de Red
- Almacenamiento
- Periféricos
- Equipos de Videoconferencia (NUEVO)
- UPS y Energía (NUEVO)
- Telefonía IP (NUEVO)
- Equipos Móviles (NUEVO)
- Componentes (NUEVO)
- Otros Equipos

---

## 📋 **IMPORTANTE: Actualizar Base de Datos**

### **Opción 1: Instalación Nueva (Sin datos)**

Si NO tienes productos registrados todavía:

1. Ve a Supabase → SQL Editor
2. **BORRA** las tablas actuales:
```sql
DROP TABLE IF EXISTS public.productos CASCADE;
DROP TABLE IF EXISTS public.categorias CASCADE;
```

3. Ejecuta el nuevo script: `supabase-schema-dispositivos.sql`

### **Opción 2: Migración (CON datos existentes)**

Si YA tienes productos y quieres conservarlos:

1. **PRIMERO haz backup:**
   - Supabase → Database → Backups → Create backup

2. **Ejecuta este script de migración:**

```sql
-- Agregar nuevas columnas a la tabla productos
ALTER TABLE public.productos 
ADD COLUMN IF NOT EXISTS proveedor VARCHAR(200),
ADD COLUMN IF NOT EXISTS numero_factura VARCHAR(100),
ADD COLUMN IF NOT EXISTS garantia_meses INTEGER,
ADD COLUMN IF NOT EXISTS fecha_vencimiento_garantia DATE,
ADD COLUMN IF NOT EXISTS asignado_a VARCHAR(200),
ADD COLUMN IF NOT EXISTS departamento VARCHAR(100) DEFAULT 'Informática',
ADD COLUMN IF NOT EXISTS especificaciones JSONB,
ADD COLUMN IF NOT EXISTS observaciones TEXT;

-- Actualizar índices
CREATE INDEX IF NOT EXISTS idx_productos_asignado ON public.productos(asignado_a);
CREATE INDEX IF NOT EXISTS idx_productos_departamento ON public.productos(departamento);

-- Insertar nuevas categorías
INSERT INTO public.categorias (nombre, descripcion) VALUES
('Computadoras de Escritorio', 'PCs de escritorio, workstations y all-in-one'),
('Laptops', 'Computadoras portátiles y notebooks'),
('Equipos de Videoconferencia', 'Cámaras, micrófonos, sistemas de audio/video'),
('UPS y Energía', 'UPS, reguladores, PDUs'),
('Telefonía IP', 'Teléfonos IP, centralitas'),
('Equipos Móviles', 'Tablets, smartphones corporativos'),
('Componentes', 'RAM, discos, tarjetas de red, fuentes de poder')
ON CONFLICT (nombre) DO NOTHING;

-- Actualizar categorías existentes
UPDATE public.categorias SET nombre = 'Equipos de Red' WHERE nombre = 'Redes';
UPDATE public.categorias SET nombre = 'Otros Equipos' WHERE nombre = 'Otros';
```

3. **Renombrar tabla (OPCIONAL):**
```sql
-- Si quieres renombrar de productos a dispositivos
ALTER TABLE public.productos RENAME TO dispositivos;
```

---

## 🔄 **Actualizar el Código**

El código ya está actualizado en GitHub y se desplegará automáticamente en Vercel.

**Pero DEBES actualizar la base de datos primero para que funcione correctamente.**

---

## ✅ **Checklist de Migración:**

- [ ] Hacer backup de Supabase
- [ ] Decidir: ¿Instalación nueva o migración?
- [ ] Ejecutar script SQL correspondiente
- [ ] Verificar que se crearon las nuevas columnas
- [ ] Verificar que las categorías IT están creadas
- [ ] Probar creación de dispositivo con nuevos campos
- [ ] Verificar que todo funciona en producción

---

## 🎯 **Ventajas del Nuevo Sistema:**

### **Para el Departamento de IT:**
✅ Control de garantías con fechas de vencimiento  
✅ Registro de proveedores y facturas  
✅ Asignación clara de equipos a usuarios  
✅ Observaciones técnicas para cada dispositivo  
✅ Especificaciones detalladas  
✅ Estados específicos de IT (En Mantenimiento, En Garantía)  

### **Para la Organización:**
✅ Mejor control de activos tecnológicos  
✅ Trazabilidad completa de equipos  
✅ Información centralizada del departamento IT  
✅ Facilita auditorías  
✅ Mejora toma de decisiones  

---

## 📊 **Nuevos Campos en Formularios:**

Cuando actualices la base de datos, los formularios mostrarán:

**Información Básica:**
- Nombre, Descripción, Categoría
- Marca, Modelo, Número de Serie
- Estado, Ubicación

**Adquisición y Garantía:**
- Fecha de Adquisición
- Proveedor
- Número de Factura
- Garantía (meses)
- Fecha de Vencimiento de Garantía

**Asignación:**
- Asignado a
- Departamento

**Técnico:**
- Especificaciones (JSON)
- Observaciones

**Visual:**
- Imagen (archivo o URL)

---

## ⚠️ **IMPORTANTE:**

**NO uses el sistema hasta actualizar la base de datos**, de lo contrario habrá errores.

**Pasos:**
1. ✅ Hacer backup en Supabase
2. ✅ Ejecutar script de migración
3. ✅ Esperar deploy de Vercel (ya en proceso)
4. ✅ Probar el sistema actualizado

---

**¡El sistema ahora es un verdadero sistema de inventario IT profesional! 💻✨**

