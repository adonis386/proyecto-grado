-- ESQUEMA PARA SISTEMA DE TICKETS
-- Gestión de solicitudes y reportes de fallas de equipos
-- EJECUTAR EN SQL EDITOR DE SUPABASE

-- Crear tabla de tickets
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_ticket SERIAL UNIQUE,
    usuario_solicitante VARCHAR(200) NOT NULL,
    equipo_id UUID REFERENCES public.equipos(id) ON DELETE SET NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Falla', 'Cambio', 'Mantenimiento', 'Consulta', 'Otro')),
    estado VARCHAR(50) DEFAULT 'Abierto' NOT NULL CHECK (estado IN ('Abierto', 'En Proceso', 'Resuelto', 'Cerrado', 'Cancelado')),
    prioridad VARCHAR(50) DEFAULT 'Media' NOT NULL CHECK (prioridad IN ('Baja', 'Media', 'Alta', 'Urgente')),
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    asignado_a VARCHAR(200),
    solucion TEXT,
    observaciones TEXT,
    fecha_resolucion TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_tickets_numero ON public.tickets(numero_ticket);
CREATE INDEX IF NOT EXISTS idx_tickets_usuario ON public.tickets(usuario_solicitante);
CREATE INDEX IF NOT EXISTS idx_tickets_equipo ON public.tickets(equipo_id);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON public.tickets(estado);
CREATE INDEX IF NOT EXISTS idx_tickets_tipo ON public.tickets(tipo);
CREATE INDEX IF NOT EXISTS idx_tickets_prioridad ON public.tickets(prioridad);
CREATE INDEX IF NOT EXISTS idx_tickets_asignado ON public.tickets(asignado_a);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_tickets_updated_at ON public.tickets;
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tickets
DROP POLICY IF EXISTS "Permitir lectura de tickets a usuarios autenticados" ON public.tickets;
DROP POLICY IF EXISTS "Permitir inserción de tickets a usuarios autenticados" ON public.tickets;
DROP POLICY IF EXISTS "Permitir actualización de tickets a usuarios autenticados" ON public.tickets;
DROP POLICY IF EXISTS "Permitir eliminación de tickets a usuarios autenticados" ON public.tickets;

CREATE POLICY "Permitir lectura de tickets a usuarios autenticados"
ON public.tickets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir inserción de tickets a usuarios autenticados"
ON public.tickets FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Permitir actualización de tickets a usuarios autenticados"
ON public.tickets FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir eliminación de tickets a usuarios autenticados"
ON public.tickets FOR DELETE TO authenticated USING (true);

-- Comentarios
COMMENT ON TABLE public.tickets IS 'Sistema de tickets para solicitudes y reportes de fallas de equipos';
COMMENT ON COLUMN public.tickets.numero_ticket IS 'Número único autoincremental del ticket';
COMMENT ON COLUMN public.tickets.tipo IS 'Tipo de ticket: Falla, Cambio, Mantenimiento, Consulta, Otro';
COMMENT ON COLUMN public.tickets.estado IS 'Estado del ticket: Abierto, En Proceso, Resuelto, Cerrado, Cancelado';
COMMENT ON COLUMN public.tickets.prioridad IS 'Prioridad: Baja, Media, Alta, Urgente';

