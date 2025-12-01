-- MIGRACIÓN: Agregar campo RACK a la tabla equipos
-- Ejecutar después de supabase-schema-equipos.sql
-- Fecha: 2025-12-01

-- Agregar columna rack a la tabla equipos
ALTER TABLE public.equipos 
ADD COLUMN IF NOT EXISTS rack VARCHAR(100);

-- Crear índice para búsquedas rápidas por rack
CREATE INDEX IF NOT EXISTS idx_equipos_rack ON public.equipos(rack);

-- Crear índice para búsquedas por departamento
CREATE INDEX IF NOT EXISTS idx_equipos_departamento ON public.equipos(departamento);

-- Actualizar la vista equipos_completos para incluir rack
DROP VIEW IF EXISTS equipos_completos;

CREATE OR REPLACE VIEW equipos_completos AS
SELECT 
    e.id,
    e.numero_equipo,
    e.usuario_asignado,
    e.estado,
    e.ubicacion,
    e.departamento,
    e.rack,
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
         e.departamento, e.rack, e.observaciones, e.created_at, e.updated_at;

-- Comentario
COMMENT ON COLUMN public.equipos.rack IS 'Rack o punto de conexión de red donde está conectado el equipo';

