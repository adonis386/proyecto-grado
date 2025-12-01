-- ESQUEMA PARA SISTEMA DE INVENTARIO DE EQUIPOS IT
-- Basado en la estructura real de INN (Equipos con componentes)
-- EJECUTAR EN SQL EDITOR DE SUPABASE

-- 1. Eliminar tablas antiguas si es instalación nueva
-- DROP TABLE IF EXISTS public.componentes CASCADE;
-- DROP TABLE IF EXISTS public.equipos CASCADE;
-- DROP TABLE IF EXISTS public.categorias CASCADE;

-- 2. Crear tabla de equipos (equipos completos asignados a usuarios)
CREATE TABLE IF NOT EXISTS public.equipos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_equipo INTEGER NOT NULL UNIQUE,
    usuario_asignado VARCHAR(200),
    estado VARCHAR(50) DEFAULT 'Operativo' NOT NULL,
    ubicacion VARCHAR(200) DEFAULT 'Oficina Principal',
    departamento VARCHAR(100) DEFAULT 'Informática',
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Crear tabla de componentes (CPU, Monitor, Teclado, Mouse de cada equipo)
CREATE TABLE IF NOT EXISTS public.componentes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    equipo_id UUID NOT NULL REFERENCES public.equipos(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('CPU', 'Monitor', 'Teclado', 'Mouse')),
    marca VARCHAR(100),
    modelo VARCHAR(100),
    numero_serie VARCHAR(100),
    placa VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Un equipo solo puede tener un componente de cada tipo
    UNIQUE(equipo_id, tipo)
);

-- 4. Crear índices
CREATE INDEX IF NOT EXISTS idx_equipos_numero ON public.equipos(numero_equipo);
CREATE INDEX IF NOT EXISTS idx_equipos_usuario ON public.equipos(usuario_asignado);
CREATE INDEX IF NOT EXISTS idx_equipos_estado ON public.equipos(estado);
CREATE INDEX IF NOT EXISTS idx_componentes_equipo ON public.componentes(equipo_id);
CREATE INDEX IF NOT EXISTS idx_componentes_tipo ON public.componentes(tipo);
CREATE INDEX IF NOT EXISTS idx_componentes_serie ON public.componentes(numero_serie);

-- 5. Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Triggers para updated_at
DROP TRIGGER IF EXISTS update_equipos_updated_at ON public.equipos;
CREATE TRIGGER update_equipos_updated_at BEFORE UPDATE ON public.equipos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_componentes_updated_at ON public.componentes;
CREATE TRIGGER update_componentes_updated_at BEFORE UPDATE ON public.componentes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Habilitar Row Level Security
ALTER TABLE public.equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.componentes ENABLE ROW LEVEL SECURITY;

-- 8. Políticas RLS para equipos
DROP POLICY IF EXISTS "Permitir lectura de equipos a usuarios autenticados" ON public.equipos;
DROP POLICY IF EXISTS "Permitir inserción de equipos a usuarios autenticados" ON public.equipos;
DROP POLICY IF EXISTS "Permitir actualización de equipos a usuarios autenticados" ON public.equipos;
DROP POLICY IF EXISTS "Permitir eliminación de equipos a usuarios autenticados" ON public.equipos;

CREATE POLICY "Permitir lectura de equipos a usuarios autenticados"
ON public.equipos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir inserción de equipos a usuarios autenticados"
ON public.equipos FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Permitir actualización de equipos a usuarios autenticados"
ON public.equipos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir eliminación de equipos a usuarios autenticados"
ON public.equipos FOR DELETE TO authenticated USING (true);

-- 9. Políticas RLS para componentes
DROP POLICY IF EXISTS "Permitir lectura de componentes a usuarios autenticados" ON public.componentes;
DROP POLICY IF EXISTS "Permitir inserción de componentes a usuarios autenticados" ON public.componentes;
DROP POLICY IF EXISTS "Permitir actualización de componentes a usuarios autenticados" ON public.componentes;
DROP POLICY IF EXISTS "Permitir eliminación de componentes a usuarios autenticados" ON public.componentes;

CREATE POLICY "Permitir lectura de componentes a usuarios autenticados"
ON public.componentes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir inserción de componentes a usuarios autenticados"
ON public.componentes FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Permitir actualización de componentes a usuarios autenticados"
ON public.componentes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir eliminación de componentes a usuarios autenticados"
ON public.componentes FOR DELETE TO authenticated USING (true);

-- 10. Vista útil: Equipos con sus componentes
CREATE OR REPLACE VIEW equipos_completos AS
SELECT 
    e.id,
    e.numero_equipo,
    e.usuario_asignado,
    e.estado,
    e.ubicacion,
    e.departamento,
    e.observaciones,
    e.created_at,
    e.updated_at,
    json_agg(
        json_build_object(
            'tipo', c.tipo,
            'marca', c.marca,
            'modelo', c.modelo,
            'numero_serie', c.numero_serie,
            'placa', c.placa
        ) ORDER BY 
            CASE c.tipo 
                WHEN 'CPU' THEN 1
                WHEN 'Monitor' THEN 2
                WHEN 'Teclado' THEN 3
                WHEN 'Mouse' THEN 4
            END
    ) FILTER (WHERE c.id IS NOT NULL) as componentes
FROM public.equipos e
LEFT JOIN public.componentes c ON c.equipo_id = e.id
GROUP BY e.id, e.numero_equipo, e.usuario_asignado, e.estado, e.ubicacion, 
         e.departamento, e.observaciones, e.created_at, e.updated_at;

-- 11. Comentarios
COMMENT ON TABLE public.equipos IS 'Equipos completos de cómputo asignados a usuarios del departamento IT';
COMMENT ON TABLE public.componentes IS 'Componentes individuales (CPU, Monitor, Teclado, Mouse) de cada equipo';
COMMENT ON COLUMN public.equipos.numero_equipo IS 'Número único del equipo (1, 2, 3, etc.)';
COMMENT ON COLUMN public.componentes.tipo IS 'Tipo de componente: CPU, Monitor, Teclado o Mouse';

