-- IMPORTANTE: Ejecuta este script en el SQL Editor de Supabase
-- Dashboard de Supabase > SQL Editor > New Query > Pega y ejecuta este código

-- 1. Crear tabla de categorías
CREATE TABLE IF NOT EXISTS public.categorias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Crear tabla de productos/equipos
CREATE TABLE IF NOT EXISTS public.productos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria_id UUID NOT NULL REFERENCES public.categorias(id) ON DELETE RESTRICT,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    numero_serie VARCHAR(100) UNIQUE,
    estado VARCHAR(50) DEFAULT 'Disponible' NOT NULL,
    ubicacion VARCHAR(200),
    fecha_adquisicion DATE,
    precio DECIMAL(10, 2),
    imagen_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON public.productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_estado ON public.productos(estado);
CREATE INDEX IF NOT EXISTS idx_productos_numero_serie ON public.productos(numero_serie);

-- 4. Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Trigger para actualizar updated_at en productos
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON public.productos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Habilitar Row Level Security (RLS)
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- 7. Políticas RLS - Permitir lectura a todos los usuarios autenticados
CREATE POLICY "Permitir lectura de categorías a usuarios autenticados"
ON public.categorias FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Permitir lectura de productos a usuarios autenticados"
ON public.productos FOR SELECT
TO authenticated
USING (true);

-- 8. Políticas RLS - Permitir escritura a usuarios autenticados
CREATE POLICY "Permitir inserción de categorías a usuarios autenticados"
ON public.categorias FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Permitir actualización de categorías a usuarios autenticados"
ON public.categorias FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir eliminación de categorías a usuarios autenticados"
ON public.categorias FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Permitir inserción de productos a usuarios autenticados"
ON public.productos FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Permitir actualización de productos a usuarios autenticados"
ON public.productos FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir eliminación de productos a usuarios autenticados"
ON public.productos FOR DELETE
TO authenticated
USING (true);

-- 9. Insertar categorías iniciales
INSERT INTO public.categorias (nombre, descripcion) VALUES
('Computadoras', 'Equipos de cómputo como laptops, desktops, all-in-one'),
('Periféricos', 'Teclados, ratones, monitores, impresoras'),
('Redes', 'Routers, switches, access points, cables'),
('Servidores', 'Servidores físicos y virtuales'),
('Almacenamiento', 'Discos duros, SSD, NAS, sistemas de backup'),
('Otros', 'Otros equipos informáticos')
ON CONFLICT (nombre) DO NOTHING;

-- 10. Crear bucket de Storage para imágenes de productos (ejecutar en Storage, no en SQL)
-- Ve a Storage > Create Bucket > nombre: "productos-imagenes" > público: sí

