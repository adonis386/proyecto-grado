-- Script de importación de equipos desde Inventario_Jascia.csv
-- Generado automáticamente
-- Fecha: 2025-12-01
-- Total: 20 equipos con 51 componentes

-- IMPORTANTE: Ejecuta primero supabase-schema-equipos.sql

-- ============================================================================
-- EQUIPOS
-- ============================================================================

-- Equipo 1 - Flor Suarez
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES (1, 'Flor Suarez', 'Operativo', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- Equipo 2 - Marlene de Mata
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES (2, 'Marlene de Mata', 'Operativo', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- Equipo 3 - SIN USUARIO
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES (3, NULL, 'Disponible', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- Equipo 4 - Wendy Diaz
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES (4, 'Wendy Diaz', 'Operativo', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- Equipo 5 - Noris Rondon
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES (5, 'Noris Rondon', 'Operativo', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- Equipo 6 - Alexis Arias
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES (6, 'Alexis Arias', 'Operativo', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- Equipo 7 - Genesis Galvis
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES (7, 'Genesis Galvis', 'Operativo', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- Equipo 8 - Yesenia Rengifo
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES (8, 'Yesenia Rengifo', 'Operativo', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- Equipo 9 - No Operativo
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES (9, NULL, 'No Operativo', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- Equipo 10 - Sin Usuario
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES (10, NULL, 'Disponible', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- Equipo 11 - Sin Usuario
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES (11, NULL, 'Disponible', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- Equipo 12 - Marian Leon
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES (12, 'Marian Leon', 'Operativo', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- Equipo 13 - Rebeca Lares
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES (13, 'Rebeca Lares', 'Operativo', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- Equipo 14 - Rita Balsamiro
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES (14, 'Rita Balsamiro', 'Operativo', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- Equipo 15 - Isbely Barasarte
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES (15, 'Isbely Barasarte', 'Operativo', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- Equipo 16 - Gisella Rondon
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES (16, 'Gisella Rondon', 'Operativo', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- Equipos 17, 18, 19, 20 - Sin Usuario
INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)
VALUES 
    (17, NULL, 'Disponible', 'Oficina Principal', 'Informática'),
    (18, NULL, 'Disponible', 'Oficina Principal', 'Informática'),
    (19, NULL, 'Disponible', 'Oficina Principal', 'Informática'),
    (20, NULL, 'Disponible', 'Oficina Principal', 'Informática')
ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado;

-- ============================================================================
-- COMPONENTES
-- ============================================================================

-- Equipo 1 - Flor Suarez
INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)
VALUES 
    ((SELECT id FROM public.equipos WHERE numero_equipo = 1), 'CPU', 'VIT', 'VITE-1210-01', 'A000877892', '01-32385'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 1), 'Monitor', 'VIT', NULL, '70065-97D266-01722', '116576'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 1), 'Teclado', NULL, NULL, 'XP1315824944', '01-24237'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 1), 'Mouse', NULL, NULL, NULL, 'X76607204954')
ON CONFLICT (equipo_id, tipo) DO UPDATE SET
    marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    numero_serie = EXCLUDED.numero_serie,
    placa = EXCLUDED.placa;

-- Equipo 2 - Marlene de Mata
INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)
VALUES 
    ((SELECT id FROM public.equipos WHERE numero_equipo = 2), 'CPU', 'VIT', 'VIT-E210-001', 'A000877906', '127236'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 2), 'Monitor', 'VIT', 'TFT19W80PS', 'V1980LW-B', '01-20200'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 2), 'Teclado', 'VIT', 'KB2971', 'KBB316Q4222A002', '01-19883'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 2), 'Mouse', NULL, NULL, '4748', NULL)
ON CONFLICT (equipo_id, tipo) DO UPDATE SET
    marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    numero_serie = EXCLUDED.numero_serie,
    placa = EXCLUDED.placa;

-- Equipo 3 - SIN USUARIO
INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)
VALUES 
    ((SELECT id FROM public.equipos WHERE numero_equipo = 3), 'CPU', 'VIT', 'VITE1210-01', 'A000873235', '01-26694'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 3), 'Monitor', 'LG', 'W19425T', '807MXG1133319', '01-18521'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 3), 'Teclado', 'VIT', 'DOK-K5313', 'KBE801K11422H', '01-26696')
ON CONFLICT (equipo_id, tipo) DO UPDATE SET
    marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    numero_serie = EXCLUDED.numero_serie,
    placa = EXCLUDED.placa;

-- Equipo 4 - Wendy Diaz
INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)
VALUES 
    ((SELECT id FROM public.equipos WHERE numero_equipo = 4), 'CPU', 'VIT', NULL, NULL, '01-31290'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 4), 'Monitor', 'VIT', NULL, 'C18DABA001760', '01-27159'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 4), 'Teclado', 'VIT', 'DOK-K5313', 'KBE808K10571A', '126353'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 4), 'Mouse', 'PHILIPS', NULL, NULL, NULL)
ON CONFLICT (equipo_id, tipo) DO UPDATE SET
    marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    numero_serie = EXCLUDED.numero_serie,
    placa = EXCLUDED.placa;

-- Equipo 5 - Noris Rondon
INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)
VALUES 
    ((SELECT id FROM public.equipos WHERE numero_equipo = 5), 'CPU', 'VIT', 'VITE1210-01', 'A000877980', '126331'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 5), 'Monitor', 'VIT', 'TFT19W80PS', 'V1980LWB', '01-20245'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 5), 'Teclado', 'VIT', 'KB2971', 'KBB316Q423914', '01-19850'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 5), 'Mouse', NULL, NULL, 'X76607204845', NULL)
ON CONFLICT (equipo_id, tipo) DO UPDATE SET
    marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    numero_serie = EXCLUDED.numero_serie,
    placa = EXCLUDED.placa;

-- Equipo 6 - Alexis Arias
INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)
VALUES 
    ((SELECT id FROM public.equipos WHERE numero_equipo = 6), 'CPU', 'VIT', 'VIT2810-02', 'A000136313', '01-20424'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 6), 'Monitor', 'VIT', 'TFT19W80PS', 'V1980LW-B', '01-20365'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 6), 'Teclado', 'VIT', 'DOK-K5313', 'KBE808K102B7A', '01-26424')
ON CONFLICT (equipo_id, tipo) DO UPDATE SET
    marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    numero_serie = EXCLUDED.numero_serie,
    placa = EXCLUDED.placa;

-- Equipo 7 - Genesis Galvis
INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)
VALUES 
    ((SELECT id FROM public.equipos WHERE numero_equipo = 7), 'CPU', 'VIT', 'VIT2810-02', '596012', '01-26167'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 7), 'Teclado', 'IBM', 'KB0225', '114137', NULL),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 7), 'Mouse', 'VIT', 'DOK-M696', 'M56711K1044OA', NULL)
ON CONFLICT (equipo_id, tipo) DO UPDATE SET
    marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    numero_serie = EXCLUDED.numero_serie,
    placa = EXCLUDED.placa;

-- Equipo 8 - Yesenia Rengifo
INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)
VALUES 
    ((SELECT id FROM public.equipos WHERE numero_equipo = 8), 'CPU', 'VIT', 'VIT-2810-02', 'A000136444', '01-019884'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 8), 'Monitor', 'VIT', 'TFT19W80P3', 'V1980LW-13', '01-20032'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 8), 'Teclado', 'IBM', 'KB0225', '597678', '01-14035'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 8), 'Mouse', 'VIT', 'DOK-M696', 'MS0808K1036114', NULL)
ON CONFLICT (equipo_id, tipo) DO UPDATE SET
    marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    numero_serie = EXCLUDED.numero_serie,
    placa = EXCLUDED.placa;

-- Equipo 9 - No Operativo
INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)
VALUES 
    ((SELECT id FROM public.equipos WHERE numero_equipo = 9), 'CPU', 'VIT', 'VIT28110-2', 'A00136390', '01-20382'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 9), 'Monitor', 'VIT', '1901-M00006', 'V19EW-B', '01-26674')
ON CONFLICT (equipo_id, tipo) DO UPDATE SET
    marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    numero_serie = EXCLUDED.numero_serie,
    placa = EXCLUDED.placa;

-- Equipo 10 - Sin Usuario
INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)
VALUES 
    ((SELECT id FROM public.equipos WHERE numero_equipo = 10), 'CPU', 'VIT', 'VIT2810-02', 'A000136336', '01-32286'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 10), 'Monitor', 'VIT', 'TFT19W80P5', 'V1980LW-B', '01-19909'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 10), 'Teclado', 'VIT', 'DOK-K5313', 'KBE8081110572A', '01-26335')
ON CONFLICT (equipo_id, tipo) DO UPDATE SET
    marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    numero_serie = EXCLUDED.numero_serie,
    placa = EXCLUDED.placa;

-- Equipo 11 - Sin Usuario
INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)
VALUES 
    ((SELECT id FROM public.equipos WHERE numero_equipo = 11), 'CPU', 'VIT', 'VIT-2811002', 'A000136374', '01-18851'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 11), 'Monitor', 'VIT', '19DMT620AMLUNN2', 'C18D7BA010197', '01-27216'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 11), 'Teclado', 'VIT', 'DOK-R5313', 'KBR808K10583A', '01-26531'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 11), 'Mouse', 'VIT', 'VC066', 'MS7020C10277A', NULL)
ON CONFLICT (equipo_id, tipo) DO UPDATE SET
    marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    numero_serie = EXCLUDED.numero_serie,
    placa = EXCLUDED.placa;

-- Equipo 12 - Marian Leon
INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)
VALUES 
    ((SELECT id FROM public.equipos WHERE numero_equipo = 12), 'CPU', 'VIT', 'VIT-E1210-01', 'A000877943', '01-26340'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 12), 'Monitor', 'VIT', 'TFT19W80PS', 'V1980LW-B', '01-20413')
ON CONFLICT (equipo_id, tipo) DO UPDATE SET
    marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    numero_serie = EXCLUDED.numero_serie,
    placa = EXCLUDED.placa;

-- Equipo 13 - Rebeca Lares
INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)
VALUES 
    ((SELECT id FROM public.equipos WHERE numero_equipo = 13), 'CPU', 'VIT', 'VIT2810-02', 'A000136074', '619854'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 13), 'Monitor', 'VIT', 'TFT19W80PS', 'V-1980LW-B', '01-19840'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 13), 'Teclado', 'VIT', NULL, 'KRB316Q440U3A', 'KB-2971')
ON CONFLICT (equipo_id, tipo) DO UPDATE SET
    marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    numero_serie = EXCLUDED.numero_serie,
    placa = EXCLUDED.placa;

-- Equipo 14 - Rita Balsamiro
INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)
VALUES 
    ((SELECT id FROM public.equipos WHERE numero_equipo = 14), 'CPU', NULL, NULL, NULL, NULL)
ON CONFLICT (equipo_id, tipo) DO UPDATE SET
    marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    numero_serie = EXCLUDED.numero_serie,
    placa = EXCLUDED.placa;

-- Equipo 15 - Isbely Barasarte
INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)
VALUES 
    ((SELECT id FROM public.equipos WHERE numero_equipo = 15), 'CPU', 'VIT', 'Vit-E1210-01', '7000-877952', '01-26427'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 15), 'Monitor', 'VIT', 'TFT19W80P3', 'T9AKMSNQH4LUNN3', 'V-198OLW-B'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 15), 'Teclado', 'VIT', 'KB-2971', 'KBB214B40700A', 'C09150402020A002')
ON CONFLICT (equipo_id, tipo) DO UPDATE SET
    marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    numero_serie = EXCLUDED.numero_serie,
    placa = EXCLUDED.placa;

-- Equipo 16 - Gisella Rondon
INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)
VALUES 
    ((SELECT id FROM public.equipos WHERE numero_equipo = 16), 'CPU', 'VIT', 'Vit-E1210-01', '7000-878019', '01-26867'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 16), 'Monitor', 'Samsung', 'LS16CMYSFUZM', 'EN164915131421W', '01-21224'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 16), 'Teclado', 'VIT', 'DOK-K5313', 'KBE808K10672A', '0090N0E020000003'),
    ((SELECT id FROM public.equipos WHERE numero_equipo = 16), 'Mouse', NULL, NULL, NULL, '01-27157')
ON CONFLICT (equipo_id, tipo) DO UPDATE SET
    marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    numero_serie = EXCLUDED.numero_serie,
    placa = EXCLUDED.placa;

-- ============================================================================
-- FIN DE IMPORTACIÓN
-- ============================================================================
-- Total: 20 equipos, 51 componentes importados

