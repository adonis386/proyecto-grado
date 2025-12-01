#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para importar equipos completos desde Inventario_Jascia.csv
Genera SQL para estructura de equipos + componentes
"""

import csv
import json
from datetime import datetime

def parsear_inventario(archivo_csv):
    """Parsea el CSV y extrae equipos con sus componentes"""
    equipos = []
    
    with open(archivo_csv, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter=';')
        filas = list(reader)
    
    i = 0
    while i < len(filas):
        fila = filas[i]
        
        if len(fila) > 0 and fila[0] == 'Equipo:':
            # Procesar hasta 4 equipos en esta fila
            for offset in [0, 6, 12, 18]:
                if offset + 1 < len(fila):
                    try:
                        num_equipo = fila[offset + 1].strip() if fila[offset + 1] else None
                        usuario = fila[offset + 3].strip() if offset + 3 < len(fila) and fila[offset + 3] else None
                        
                        if not num_equipo or not num_equipo.isdigit():
                            continue
                        
                        if i + 5 >= len(filas):
                            continue
                        
                        # Leer componentes
                        headers = filas[i + 1][offset:offset+5] if offset+5 <= len(filas[i + 1]) else []
                        marcas = filas[i + 2][offset:offset+5] if offset+5 <= len(filas[i + 2]) else []
                        modelos = filas[i + 3][offset:offset+5] if offset+5 <= len(filas[i + 3]) else []
                        placas = filas[i + 4][offset:offset+5] if offset+5 <= len(filas[i + 4]) else []
                        seriales = filas[i + 5][offset:offset+5] if offset+5 <= len(filas[i + 5]) else []
                        
                        # Determinar estado
                        if usuario and usuario.upper() != 'SIN USUARIO':
                            estado = 'Operativo' if usuario != 'No Operativo' else 'No Operativo'
                        else:
                            estado = 'Disponible'
                        
                        componentes = []
                        tipos_componente = ['CPU', 'Monitor', 'Teclado', 'Mouse']
                        
                        for j in range(1, 5):
                            if j < len(headers) and headers[j]:
                                tipo = headers[j].strip()
                                
                                marca = marcas[j].strip() if j < len(marcas) and marcas[j] else ''
                                modelo = modelos[j].strip() if j < len(modelos) and modelos[j] else ''
                                placa = placas[j].strip() if j < len(placas) and placas[j] else ''
                                serial = seriales[j].strip() if j < len(seriales) and seriales[j] else ''
                                
                                if marca or modelo or serial or placa:
                                    componentes.append({
                                        'tipo': tipo,
                                        'marca': marca if marca else None,
                                        'modelo': modelo if modelo else None,
                                        'numero_serie': serial if serial else None,
                                        'placa': placa if placa else None,
                                    })
                        
                        equipos.append({
                            'numero_equipo': int(num_equipo),
                            'usuario_asignado': usuario if usuario and usuario.upper() != 'SIN USUARIO' else None,
                            'estado': estado,
                            'ubicacion': 'Oficina Principal',
                            'departamento': 'Informática',
                            'componentes': componentes
                        })
                    except Exception as e:
                        print(f"Error procesando equipo en offset {offset}: {e}")
                        continue
        
        i += 1
    
    return equipos

def generar_sql(equipos):
    """Genera script SQL completo"""
    sql = "-- Script generado desde Inventario_Jascia.csv\n"
    sql += f"-- Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
    sql += f"-- Total: {len(equipos)} equipos\n\n"
    
    sql += "-- IMPORTANTE: Ejecuta primero supabase-schema-equipos.sql\n\n"
    sql += "BEGIN;\n\n"
    
    # Insertar equipos
    sql += "-- ============================================================================\n"
    sql += "-- EQUIPOS\n"
    sql += "-- ============================================================================\n\n"
    
    for equipo in equipos:
        usuario_val = f"'{equipo['usuario_asignado'].replace("'", "''")}'" if equipo['usuario_asignado'] else 'NULL'
        
        sql += f"-- Equipo {equipo['numero_equipo']}"
        if equipo['usuario_asignado']:
            sql += f" - {equipo['usuario_asignado']}"
        sql += "\n"
        sql += "INSERT INTO public.equipos (numero_equipo, usuario_asignado, estado, ubicacion, departamento)\n"
        sql += f"VALUES ({equipo['numero_equipo']}, {usuario_val}, '{equipo['estado']}', '{equipo['ubicacion']}', '{equipo['departamento']}')\n"
        sql += "ON CONFLICT (numero_equipo) DO UPDATE SET usuario_asignado = EXCLUDED.usuario_asignado, estado = EXCLUDED.estado;\n\n"
    
    # Insertar componentes
    sql += "-- ============================================================================\n"
    sql += "-- COMPONENTES\n"
    sql += "-- ============================================================================\n\n"
    
    for equipo in equipos:
        if equipo['componentes']:
            sql += f"-- Componentes del Equipo {equipo['numero_equipo']}\n"
            sql += "INSERT INTO public.componentes (equipo_id, tipo, marca, modelo, numero_serie, placa)\n"
            sql += "VALUES\n"
            
            valores = []
            for comp in equipo['componentes']:
                marca_val = f"'{comp['marca'].replace("'", "''")}'" if comp['marca'] else 'NULL'
                modelo_val = f"'{comp['modelo'].replace("'", "''")}'" if comp['modelo'] else 'NULL'
                serie_val = f"'{comp['numero_serie'].replace("'", "''")}'" if comp['numero_serie'] else 'NULL'
                placa_val = f"'{comp['placa'].replace("'", "''")}'" if comp['placa'] else 'NULL'
                
                valores.append(
                    f"    ((SELECT id FROM public.equipos WHERE numero_equipo = {equipo['numero_equipo']}), "
                    f"'{comp['tipo']}', {marca_val}, {modelo_val}, {serie_val}, {placa_val})"
                )
            
            sql += ',\n'.join(valores) + "\n"
            sql += "ON CONFLICT (equipo_id, tipo) DO UPDATE SET\n"
            sql += "    marca = EXCLUDED.marca,\n"
            sql += "    modelo = EXCLUDED.modelo,\n"
            sql += "    numero_serie = EXCLUDED.numero_serie,\n"
            sql += "    placa = EXCLUDED.placa;\n\n"
    
    sql += "COMMIT;\n"
    sql += "\n-- ============================================================================\n"
    sql += f"-- FIN: {len(equipos)} equipos importados\n"
    sql += "-- ============================================================================\n"
    
    return sql

# Procesar
print("=" * 80)
print("IMPORTADOR DE EQUIPOS COMPLETOS")
print("=" * 80)

try:
    equipos = parsear_inventario('Inventario_Jascia.csv')
    
    print(f"\n[OK] Total de equipos encontrados: {len(equipos)}")
    
    total_componentes = sum(len(eq['componentes']) for eq in equipos)
    print(f"[OK] Total de componentes: {total_componentes}\n")
    
    # Estadísticas
    print("Estadisticas:")
    usuarios = {}
    estados = {}
    for eq in equipos:
        usuario = eq['usuario_asignado'] or 'Sin asignar'
        usuarios[usuario] = usuarios.get(usuario, 0) + 1
        estados[eq['estado']] = estados.get(eq['estado'], 0) + 1
    
    print(f"\nPor estado:")
    for estado, cantidad in sorted(estados.items()):
        print(f"  - {estado}: {cantidad}")
    
    print(f"\nPor usuario:")
    for usuario, cantidad in sorted(usuarios.items()):
        print(f"  - {usuario}: {cantidad}")
    
    # Generar SQL
    sql_content = generar_sql(equipos)
    with open('importar_equipos_jascia.sql', 'w', encoding='utf-8') as f:
        f.write(sql_content)
    print(f"\n[OK] Creado: importar_equipos_jascia.sql")
    
    # JSON
    with open('equipos_importar.json', 'w', encoding='utf-8') as f:
        json.dump(equipos, f, indent=2, ensure_ascii=False)
    print("[OK] Creado: equipos_importar.json")
    
    print("\n" + "=" * 80)
    print("PROXIMOS PASOS:")
    print("=" * 80)
    print("\n1. Ejecuta supabase-schema-equipos.sql en Supabase")
    print("2. Ejecuta importar_equipos_jascia.sql en Supabase")
    print("3. Verifica que los equipos se importaron correctamente")
    
except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()

