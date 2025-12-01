-- Script generado automaticamente desde Inventario_Jascia.csv
-- Fecha: 2025-12-01 16:06:05
-- Total de dispositivos: 51

-- IMPORTANTE: Asegurate de que las categorias existan
-- Si no existen, ejecuta primero: supabase-schema-dispositivos.sql

-- VIT VITE-1210-01 CPU (Equipo 1)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT VITE-1210-01 CPU',
    'CPU del Equipo 1',
    (SELECT id FROM public.categorias WHERE nombre = 'Computadoras de Escritorio' LIMIT 1),
    'VIT',
    'VITE-1210-01',
    'A000877892',
    'En Uso',
    'Oficina Principal',
    'Flor Suarez',
    'Informática',
    'Placa: 01-32385'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT Monitor (Equipo 1)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT Monitor',
    'Monitor del Equipo 1',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    NULL,
    '70065-97D266-01722',
    'En Uso',
    'Oficina Principal',
    'Flor Suarez',
    'Informática',
    'Placa: 116576'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- Teclado (Equipo 1)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'Teclado',
    'Teclado del Equipo 1',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    NULL,
    NULL,
    'XP1315824944',
    'En Uso',
    'Oficina Principal',
    'Flor Suarez',
    'Informática',
    'Placa: 01-24237'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- Mouse (Equipo 1)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'Mouse',
    'Mouse del Equipo 1',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    NULL,
    NULL,
    NULL,
    'En Uso',
    'Oficina Principal',
    'Flor Suarez',
    'Informática',
    'Placa: X76607204954'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT VIT2810-02 CPU (Equipo 6)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT VIT2810-02 CPU',
    'CPU del Equipo 6',
    (SELECT id FROM public.categorias WHERE nombre = 'Computadoras de Escritorio' LIMIT 1),
    'VIT',
    'VIT2810-02',
    'A000136313',
    'En Uso',
    'Oficina Principal',
    'Alexis Arias',
    'Informática',
    'Placa: 01-20424'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT TFT19W80PS Monitor (Equipo 6)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT TFT19W80PS Monitor',
    'Monitor del Equipo 6',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'TFT19W80PS',
    'V1980LW-B',
    'En Uso',
    'Oficina Principal',
    'Alexis Arias',
    'Informática',
    'Placa: 01-20365'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT DOK-K5313 Teclado (Equipo 6)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT DOK-K5313 Teclado',
    'Teclado del Equipo 6',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'DOK-K5313',
    'KBE808K102B7A',
    'En Uso',
    'Oficina Principal',
    'Alexis Arias',
    'Informática',
    'Placa: 01-26424'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT VIT-2811002 CPU (Equipo 11)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT VIT-2811002 CPU',
    'CPU del Equipo 11',
    (SELECT id FROM public.categorias WHERE nombre = 'Computadoras de Escritorio' LIMIT 1),
    'VIT',
    'VIT-2811002',
    'A000136374',
    'Disponible',
    'Oficina Principal',
    NULL,
    'Informática',
    'Placa: 01-18851'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT 19DMT620AMLUNN2 Monitor (Equipo 11)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT 19DMT620AMLUNN2 Monitor',
    'Monitor del Equipo 11',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    '19DMT620AMLUNN2',
    'C18D7BA010197',
    'Disponible',
    'Oficina Principal',
    NULL,
    'Informática',
    'Placa: 01-27216'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT DOK-R5313 Teclado (Equipo 11)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT DOK-R5313 Teclado',
    'Teclado del Equipo 11',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'DOK-R5313',
    'KBR808K10583A',
    'Disponible',
    'Oficina Principal',
    NULL,
    'Informática',
    'Placa: 01-26531'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT VC066 Mouse (Equipo 11)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT VC066 Mouse',
    'Mouse del Equipo 11',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'VC066',
    'MS7020C10277A',
    'Disponible',
    'Oficina Principal',
    NULL,
    'Informática',
    NULL
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT Vit-E1210-01 CPU (Equipo 16)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT Vit-E1210-01 CPU',
    'CPU del Equipo 16',
    (SELECT id FROM public.categorias WHERE nombre = 'Computadoras de Escritorio' LIMIT 1),
    'VIT',
    'Vit-E1210-01',
    '7000-878019',
    'En Uso',
    'Oficina Principal',
    'Gisella Rondon',
    'Informática',
    'Placa: 01-26867'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- Samsung LS16CMYSFUZM Monitor (Equipo 16)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'Samsung LS16CMYSFUZM Monitor',
    'Monitor del Equipo 16',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'Samsung',
    'LS16CMYSFUZM',
    'EN164915131421W',
    'En Uso',
    'Oficina Principal',
    'Gisella Rondon',
    'Informática',
    'Placa: 01-21224'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT DOK-K5313 Teclado (Equipo 16)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT DOK-K5313 Teclado',
    'Teclado del Equipo 16',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'DOK-K5313',
    'KBE808K10672A',
    'En Uso',
    'Oficina Principal',
    'Gisella Rondon',
    'Informática',
    'Placa: 0090N0E020000003'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- Mouse (Equipo 16)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'Mouse',
    'Mouse del Equipo 16',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    NULL,
    NULL,
    NULL,
    'En Uso',
    'Oficina Principal',
    'Gisella Rondon',
    'Informática',
    'Placa: 01-27157'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT VIT-E210-001 CPU (Equipo 2)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT VIT-E210-001 CPU',
    'CPU del Equipo 2',
    (SELECT id FROM public.categorias WHERE nombre = 'Computadoras de Escritorio' LIMIT 1),
    'VIT',
    'VIT-E210-001',
    'A000877906',
    'En Uso',
    'Oficina Principal',
    'Marlene de Mata',
    'Informática',
    'Placa: 127236'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT TFT19W80PS Monitor (Equipo 2)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT TFT19W80PS Monitor',
    'Monitor del Equipo 2',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'TFT19W80PS',
    'V1980LW-B',
    'En Uso',
    'Oficina Principal',
    'Marlene de Mata',
    'Informática',
    'Placa: 01-20200'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT KB2971 Teclado (Equipo 2)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT KB2971 Teclado',
    'Teclado del Equipo 2',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'KB2971',
    'KBB316Q4222A002',
    'En Uso',
    'Oficina Principal',
    'Marlene de Mata',
    'Informática',
    'Placa: 01-19883'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- Mouse (Equipo 2)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'Mouse',
    'Mouse del Equipo 2',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    NULL,
    NULL,
    '4748',
    'En Uso',
    'Oficina Principal',
    'Marlene de Mata',
    'Informática',
    NULL
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT VIT2810-02 CPU (Equipo 7)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT VIT2810-02 CPU',
    'CPU del Equipo 7',
    (SELECT id FROM public.categorias WHERE nombre = 'Computadoras de Escritorio' LIMIT 1),
    'VIT',
    'VIT2810-02',
    '596012',
    'En Uso',
    'Oficina Principal',
    'Genesis Galvis',
    'Informática',
    'Placa: 01-26167'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT Monitor (Equipo 7)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT Monitor',
    'Monitor del Equipo 7',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    NULL,
    NULL,
    'En Uso',
    'Oficina Principal',
    'Genesis Galvis',
    'Informática',
    NULL
)
ON CONFLICT (numero_serie) DO NOTHING;

-- IBM KB0225 Teclado (Equipo 7)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'IBM KB0225 Teclado',
    'Teclado del Equipo 7',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'IBM',
    'KB0225',
    NULL,
    'En Uso',
    'Oficina Principal',
    'Genesis Galvis',
    'Informática',
    'Placa: 114137'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT DOK-M696 Mouse (Equipo 7)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT DOK-M696 Mouse',
    'Mouse del Equipo 7',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'DOK-M696',
    NULL,
    'En Uso',
    'Oficina Principal',
    'Genesis Galvis',
    'Informática',
    'Placa: M56711K1044OA'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT VIT-E1210-01 CPU (Equipo 12)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT VIT-E1210-01 CPU',
    'CPU del Equipo 12',
    (SELECT id FROM public.categorias WHERE nombre = 'Computadoras de Escritorio' LIMIT 1),
    'VIT',
    'VIT-E1210-01',
    'A000877943',
    'En Uso',
    'Oficina Principal',
    'Marian Leon',
    'Informática',
    'Placa: 01-26340'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT TFT19W80PS Monitor (Equipo 12)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT TFT19W80PS Monitor',
    'Monitor del Equipo 12',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'TFT19W80PS',
    'V1980LW-B',
    'En Uso',
    'Oficina Principal',
    'Marian Leon',
    'Informática',
    'Placa: 01-20413'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT VITE1210-01 CPU (Equipo 3)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT VITE1210-01 CPU',
    'CPU del Equipo 3',
    (SELECT id FROM public.categorias WHERE nombre = 'Computadoras de Escritorio' LIMIT 1),
    'VIT',
    'VITE1210-01',
    'A000873235',
    'Disponible',
    'Oficina Principal',
    NULL,
    'Informática',
    'Placa: 01-26694'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- LG W19425T Monitor (Equipo 3)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'LG W19425T Monitor',
    'Monitor del Equipo 3',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'LG',
    'W19425T',
    '807MXG1133319',
    'Disponible',
    'Oficina Principal',
    NULL,
    'Informática',
    'Placa: 01-18521'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT DOK-K5313 Teclado (Equipo 3)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT DOK-K5313 Teclado',
    'Teclado del Equipo 3',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'DOK-K5313',
    'KBE801K11422H',
    'Disponible',
    'Oficina Principal',
    NULL,
    'Informática',
    'Placa: 01-26696'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT VIT-2810-02 CPU (Equipo 8)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT VIT-2810-02 CPU',
    'CPU del Equipo 8',
    (SELECT id FROM public.categorias WHERE nombre = 'Computadoras de Escritorio' LIMIT 1),
    'VIT',
    'VIT-2810-02',
    'A000136444',
    'En Uso',
    'Oficina Principal',
    'Yesenia Rengifo',
    'Informática',
    'Placa: 01-019884'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT TFT19W80P3 Monitor (Equipo 8)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT TFT19W80P3 Monitor',
    'Monitor del Equipo 8',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'TFT19W80P3',
    'V1980LW-13',
    'En Uso',
    'Oficina Principal',
    'Yesenia Rengifo',
    'Informática',
    'Placa: 01-20032'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- IBM KB0225 Teclado (Equipo 8)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'IBM KB0225 Teclado',
    'Teclado del Equipo 8',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'IBM',
    'KB0225',
    '597678',
    'En Uso',
    'Oficina Principal',
    'Yesenia Rengifo',
    'Informática',
    'Placa: 01-14035'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT DOK-M696 Mouse (Equipo 8)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT DOK-M696 Mouse',
    'Mouse del Equipo 8',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'DOK-M696',
    'MS0808K1036114',
    'En Uso',
    'Oficina Principal',
    'Yesenia Rengifo',
    'Informática',
    NULL
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT VIT2810-02 CPU (Equipo 13)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT VIT2810-02 CPU',
    'CPU del Equipo 13',
    (SELECT id FROM public.categorias WHERE nombre = 'Computadoras de Escritorio' LIMIT 1),
    'VIT',
    'VIT2810-02',
    'A000136074',
    'En Uso',
    'Oficina Principal',
    'Rebeca Lares',
    'Informática',
    'Placa: 619854'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT TFT19W80PS Monitor (Equipo 13)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT TFT19W80PS Monitor',
    'Monitor del Equipo 13',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'TFT19W80PS',
    'V-1980LW-B',
    'En Uso',
    'Oficina Principal',
    'Rebeca Lares',
    'Informática',
    'Placa: 01-19840'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT C0915504020020A002 Teclado (Equipo 13)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT C0915504020020A002 Teclado',
    'Teclado del Equipo 13',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'C0915504020020A002',
    'KRB316Q440U3A',
    'En Uso',
    'Oficina Principal',
    'Rebeca Lares',
    'Informática',
    'Placa: KB-2971'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT CPU (Equipo 4)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT CPU',
    'CPU del Equipo 4',
    (SELECT id FROM public.categorias WHERE nombre = 'Computadoras de Escritorio' LIMIT 1),
    'VIT',
    NULL,
    NULL,
    'En Uso',
    'Oficina Principal',
    'Wendy Diaz',
    'Informática',
    'Placa: 01-31290'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT Monitor (Equipo 4)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT Monitor',
    'Monitor del Equipo 4',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    NULL,
    'C18DABA001760',
    'En Uso',
    'Oficina Principal',
    'Wendy Diaz',
    'Informática',
    'Placa: 01-27159'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT DOK-K5313 Teclado (Equipo 4)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT DOK-K5313 Teclado',
    'Teclado del Equipo 4',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'DOK-K5313',
    'KBE808K10571A',
    'En Uso',
    'Oficina Principal',
    'Wendy Diaz',
    'Informática',
    'Placa: 126353'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- PHILIPS Mouse (Equipo 4)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'PHILIPS Mouse',
    'Mouse del Equipo 4',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'PHILIPS',
    NULL,
    NULL,
    'En Uso',
    'Oficina Principal',
    'Wendy Diaz',
    'Informática',
    NULL
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT VIT28110-2 CPU (Equipo 9)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT VIT28110-2 CPU',
    'CPU del Equipo 9',
    (SELECT id FROM public.categorias WHERE nombre = 'Computadoras de Escritorio' LIMIT 1),
    'VIT',
    'VIT28110-2',
    'A00136390',
    'En Uso',
    'Oficina Principal',
    'No Operativo',
    'Informática',
    'Placa: 01-20382'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT 1901-M00006 Monitor (Equipo 9)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT 1901-M00006 Monitor',
    'Monitor del Equipo 9',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    '1901-M00006',
    'V19EW-B',
    'En Uso',
    'Oficina Principal',
    'No Operativo',
    'Informática',
    'Placa: 01-26674'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT VITE1210-01 CPU (Equipo 5)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT VITE1210-01 CPU',
    'CPU del Equipo 5',
    (SELECT id FROM public.categorias WHERE nombre = 'Computadoras de Escritorio' LIMIT 1),
    'VIT',
    'VITE1210-01',
    'A000877980',
    'En Uso',
    'Oficina Principal',
    'Noris Rondon',
    'Informática',
    'Placa: 126331'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT TFT19W80PS Monitor (Equipo 5)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT TFT19W80PS Monitor',
    'Monitor del Equipo 5',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'TFT19W80PS',
    'V1980LWB',
    'En Uso',
    'Oficina Principal',
    'Noris Rondon',
    'Informática',
    'Placa: 01-20245'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT KB2971 Teclado (Equipo 5)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT KB2971 Teclado',
    'Teclado del Equipo 5',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'KB2971',
    'KBB316Q423914',
    'En Uso',
    'Oficina Principal',
    'Noris Rondon',
    'Informática',
    'Placa: 01-19850'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- Mouse (Equipo 5)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'Mouse',
    'Mouse del Equipo 5',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    NULL,
    NULL,
    'X76607204845',
    'En Uso',
    'Oficina Principal',
    'Noris Rondon',
    'Informática',
    NULL
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT VIT2810-02 CPU (Equipo 10)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT VIT2810-02 CPU',
    'CPU del Equipo 10',
    (SELECT id FROM public.categorias WHERE nombre = 'Computadoras de Escritorio' LIMIT 1),
    'VIT',
    'VIT2810-02',
    'A000136336',
    'Disponible',
    'Oficina Principal',
    NULL,
    'Informática',
    'Placa: 01-32286'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT TFT19W80P5 Monitor (Equipo 10)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT TFT19W80P5 Monitor',
    'Monitor del Equipo 10',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'TFT19W80P5',
    'V1980LW-B',
    'Disponible',
    'Oficina Principal',
    NULL,
    'Informática',
    'Placa: 01-19909'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT DOK-K5313 Teclado (Equipo 10)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT DOK-K5313 Teclado',
    'Teclado del Equipo 10',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'DOK-K5313',
    'KBE8081110572A',
    'Disponible',
    'Oficina Principal',
    NULL,
    'Informática',
    'Placa: 01-26335'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT Vit-E1210-01 CPU (Equipo 15)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT Vit-E1210-01 CPU',
    'CPU del Equipo 15',
    (SELECT id FROM public.categorias WHERE nombre = 'Computadoras de Escritorio' LIMIT 1),
    'VIT',
    'Vit-E1210-01',
    '7000-877952',
    'En Uso',
    'Oficina Principal',
    'Isbely Barasarte',
    'Informática',
    'Placa: 01-26427'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT TFT19W80P3 Monitor (Equipo 15)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT TFT19W80P3 Monitor',
    'Monitor del Equipo 15',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'TFT19W80P3',
    'T9AKMSNQH4LUNN3',
    'En Uso',
    'Oficina Principal',
    'Isbely Barasarte',
    'Informática',
    'Placa: V-198OLW-B'
)
ON CONFLICT (numero_serie) DO NOTHING;

-- VIT KB-2971 Teclado (Equipo 15)
INSERT INTO public.dispositivos (
    nombre, descripcion, categoria_id, marca, modelo, numero_serie,
    estado, ubicacion, asignado_a, departamento, observaciones
) VALUES (
    'VIT KB-2971 Teclado',
    'Teclado del Equipo 15',
    (SELECT id FROM public.categorias WHERE nombre = 'Periféricos' LIMIT 1),
    'VIT',
    'KB-2971',
    'KBB214B40700A',
    'En Uso',
    'Oficina Principal',
    'Isbely Barasarte',
    'Informática',
    'Placa: C09150402020A002'
)
ON CONFLICT (numero_serie) DO NOTHING;

