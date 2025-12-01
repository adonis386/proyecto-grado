-- ESQUEMA ACTUALIZADO PARA INVENTARIO DE DISPOSITIVOS IT
-- Sistema de Inventario - Departamento de Informática INN
-- EJECUTAR EN SQL EDITOR DE SUPABASE

-- 1. Eliminar tablas antiguas si existen (CUIDADO: esto borra datos)
-- DROP TABLE IF EXISTS public.productos CASCADE;
-- DROP TABLE IF EXISTS public.categorias CASCADE;

-- Si ya tienes datos, mejor hacer ALTER TABLE y agregar columnas nuevas
-- Para instalación nueva, usa este script completo

-- 2. Crear tabla de categorías para dispositivos IT
CREATE TABLE IF NOT EXISTS public.categorias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Crear tabla de dispositivos informáticos
CREATE TABLE IF NOT EXISTS public.dispositivos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria_id UUID NOT NULL REFERENCES public.categorias(id) ON DELETE RESTRICT,
    
    -- Información del fabricante
    marca VARCHAR(100),
    modelo VARCHAR(100),
    numero_serie VARCHAR(100) UNIQUE,
    
    -- Estado y ubicación
    estado VARCHAR(50) DEFAULT 'Disponible' NOT NULL,
    ubicacion VARCHAR(200),
    
    -- Información de adquisición
    fecha_adquisicion DATE,
    proveedor VARCHAR(200),
    numero_factura VARCHAR(100),
    
    -- Garantía
    garantia_meses INTEGER,
    fecha_vencimiento_garantia DATE,
    
    -- Asignación
    asignado_a VARCHAR(200),
    departamento VARCHAR(100) DEFAULT 'Informática',
    
    -- Especificaciones técnicas (opcional, en JSON)
    especificaciones JSONB,
    
    -- Observaciones
    observaciones TEXT,
    
    -- Multimedia
    imagen_url TEXT,
    
    -- Control de cambios
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Si estás migrando de productos a dispositivos (OPCIONAL)
-- INSERT INTO public.dispositivos (
--     nombre, descripcion, categoria_id, marca, modelo, numero_serie,
--     estado, ubicacion, fecha_adquisicion, imagen_url, created_at, updated_at
-- )
-- SELECT 
--     nombre, descripcion, categoria_id, marca, modelo, numero_serie,
--     estado, ubicacion, fecha_adquisicion, imagen_url, created_at, updated_at
-- FROM public.productos;

-- 5. Crear índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_dispositivos_categoria ON public.dispositivos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_dispositivos_estado ON public.dispositivos(estado);
CREATE INDEX IF NOT EXISTS idx_dispositivos_numero_serie ON public.dispositivos(numero_serie);
CREATE INDEX IF NOT EXISTS idx_dispositivos_asignado ON public.dispositivos(asignado_a);
CREATE INDEX IF NOT EXISTS idx_dispositivos_departamento ON public.dispositivos(departamento);

-- 6. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_dispositivos_updated_at ON public.dispositivos;
CREATE TRIGGER update_dispositivos_updated_at BEFORE UPDATE ON public.dispositivos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Habilitar Row Level Security (RLS)
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispositivos ENABLE ROW LEVEL SECURITY;

-- 9. Políticas RLS para categorías
DROP POLICY IF EXISTS "Permitir lectura de categorías a usuarios autenticados" ON public.categorias;
DROP POLICY IF EXISTS "Permitir inserción de categorías a usuarios autenticados" ON public.categorias;
DROP POLICY IF EXISTS "Permitir actualización de categorías a usuarios autenticados" ON public.categorias;
DROP POLICY IF EXISTS "Permitir eliminación de categorías a usuarios autenticados" ON public.categorias;

CREATE POLICY "Permitir lectura de categorías a usuarios autenticados"
ON public.categorias FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir inserción de categorías a usuarios autenticados"
ON public.categorias FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Permitir actualización de categorías a usuarios autenticados"
ON public.categorias FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir eliminación de categorías a usuarios autenticados"
ON public.categorias FOR DELETE TO authenticated USING (true);

-- 10. Políticas RLS para dispositivos
DROP POLICY IF EXISTS "Permitir lectura de dispositivos a usuarios autenticados" ON public.dispositivos;
DROP POLICY IF EXISTS "Permitir inserción de dispositivos a usuarios autenticados" ON public.dispositivos;
DROP POLICY IF EXISTS "Permitir actualización de dispositivos a usuarios autenticados" ON public.dispositivos;
DROP POLICY IF EXISTS "Permitir eliminación de dispositivos a usuarios autenticados" ON public.dispositivos;

CREATE POLICY "Permitir lectura de dispositivos a usuarios autenticados"
ON public.dispositivos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir inserción de dispositivos a usuarios autenticados"
ON public.dispositivos FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Permitir actualización de dispositivos a usuarios autenticados"
ON public.dispositivos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir eliminación de dispositivos a usuarios autenticados"
ON public.dispositivos FOR DELETE TO authenticated USING (true);

-- 11. Insertar categorías específicas para departamento de informática
INSERT INTO public.categorias (nombre, descripcion) VALUES
('Computadoras de Escritorio', 'PCs de escritorio, workstations y all-in-one'),
('Laptops', 'Computadoras portátiles y notebooks'),
('Servidores', 'Servidores físicos y virtuales, equipos de rack'),
('Equipos de Red', 'Routers, switches, access points, firewalls'),
('Almacenamiento', 'Discos duros, SSD, NAS, sistemas de backup'),
('Periféricos', 'Monitores, teclados, ratones, impresoras, scanners'),
('Equipos de Videoconferencia', 'Cámaras, micrófonos, sistemas de audio/video'),
('UPS y Energía', 'UPS, reguladores, PDUs'),
('Telefonía IP', 'Teléfonos IP, centralitas'),
('Equipos Móviles', 'Tablets, smartphones corporativos'),
('Componentes', 'RAM, discos, tarjetas de red, fuentes de poder'),
('Otros Equipos', 'Otros dispositivos informáticos')
ON CONFLICT (nombre) DO NOTHING;

-- 12. Estados comunes para dispositivos IT
COMMENT ON COLUMN public.dispositivos.estado IS 'Estados: Disponible, En Uso, En Reparación, En Mantenimiento, Dado de Baja, En Garantía';

-- 13. Comentarios para documentación
COMMENT ON TABLE public.dispositivos IS 'Inventario de dispositivos informáticos del departamento de IT';
COMMENT ON COLUMN public.dispositivos.asignado_a IS 'Usuario o área a quien está asignado el dispositivo';
COMMENT ON COLUMN public.dispositivos.garantia_meses IS 'Duración de la garantía en meses';
COMMENT ON COLUMN public.dispositivos.especificaciones IS 'Especificaciones técnicas en formato JSON (CPU, RAM, Disco, etc)';

