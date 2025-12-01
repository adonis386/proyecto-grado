#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para importar el inventario desde Inventario_Jascia.csv
al sistema de inventario IT
"""

import csv
import json
from datetime import datetime

def parsear_inventario(archivo_csv):
    """
    Parsea el CSV y extrae la información de equipos y componentes
    """
    equipos = []
    
    with open(archivo_csv, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter=';')
        filas = list(reader)
    
    equipo_actual = None
    i = 0
    
    while i < len(filas):
        fila = filas[i]
        
        # Buscar inicio de equipo (fila que contiene "Equipo:")
        if len(fila) > 0 and 'Equipo:' in fila[0]:
            # Procesar hasta 4 equipos por fila
            for col_idx in range(0, len(fila), 6):  # Cada equipo ocupa ~6 columnas
                if col_idx < len(fila) and fila[col_idx] == 'Equipo:':
                    try:
                        num_equipo = fila[col_idx + 1] if col_idx + 1 < len(fila) else None
                        usuario = fila[col_idx + 3] if col_idx + 3 < len(fila) else None
                        
                        if num_equipo:
                            # Leer componentes del equipo (siguientes filas)
                            componentes = {}
                            
                            # Fila de headers (CPU, Monitor, Teclado, Mouse)
                            if i + 1 < len(filas):
                                headers = filas[i + 1]
                                headers_equipo = headers[col_idx:col_idx+5] if col_idx+5 <= len(headers) else []
                            
                            # Fila de marcas
                            if i + 2 < len(filas):
                                marcas = filas[i + 2]
                                marcas_equipo = marcas[col_idx:col_idx+5] if col_idx+5 <= len(marcas) else []
                            
                            # Fila de modelos
                            if i + 3 < len(filas):
                                modelos = filas[i + 3]
                                modelos_equipo = modelos[col_idx:col_idx+5] if col_idx+5 <= len(modelos) else []
                            
                            # Fila de placas
                            if i + 4 < len(filas):
                                placas = filas[i + 4]
                                placas_equipo = placas[col_idx:col_idx+5] if col_idx+5 <= len(placas) else []
                            
                            # Fila de seriales
                            if i + 5 < len(filas):
                                seriales = filas[i + 5]
                                seriales_equipo = seriales[col_idx:col_idx+5] if col_idx+5 <= len(seriales) else []
                            
                            # Procesar cada componente
                            tipos_componente = ['CPU', 'Monitor', 'Teclado', 'Mouse']
                            
                            for j, tipo in enumerate(tipos_componente):
                                if j < len(headers_equipo) and headers_equipo[j] == tipo:
                                    marca = marcas_equipo[j] if j < len(marcas_equipo) and marcas_equipo[j] else None
                                    modelo = modelos_equipo[j] if j < len(modelos_equipo) and modelos_equipo[j] else None
                                    placa = placas_equipo[j] if j < len(placas_equipo) and placas_equipo[j] else None
                                    serial = seriales_equipo[j] if j < len(seriales_equipo) and seriales_equipo[j] else None
                                    
                                    # Solo agregar si tiene información mínima
                                    if marca or modelo or serial:
                                        dispositivo = {
                                            'equipo_numero': num_equipo,
                                            'usuario': usuario if usuario else 'Sin asignar',
                                            'tipo_componente': tipo,
                                            'marca': marca.strip() if marca else None,
                                            'modelo': modelo.strip() if modelo else None,
                                            'numero_serie': serial.strip() if serial else None,
                                            'placa': placa.strip() if placa else None,
                                            'estado': 'En Uso' if usuario else 'Disponible',
                                            'asignado_a': usuario if usuario else None,
                                            'departamento': 'Informática',
                                            'ubicacion': 'Oficina Principal'
                                        }
                                        
                                        # Generar nombre del dispositivo
                                        nombre_partes = []
                                        if marca:
                                            nombre_partes.append(marca)
                                        if modelo:
                                            nombre_partes.append(modelo)
                                        if tipo:
                                            nombre_partes.append(tipo)
                                        if num_equipo:
                                            nombre_partes.append(f"Equipo {num_equipo}")
                                        
                                        dispositivo['nombre'] = ' '.join(nombre_partes) if nombre_partes else f"{tipo} - Equipo {num_equipo}"
                                        
                                        equipos.append(dispositivo)
                    except Exception as e:
                        print(f"Error procesando equipo en columna {col_idx}: {e}")
                        continue
        
        i += 1
    
    return equipos

def generar_sql_insert(equipos):
    """
    Genera script SQL para insertar los dispositivos
    """
    sql = "-- Script generado automáticamente desde Inventario_Jascia.csv\n"
    sql += f"-- Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
    sql += "-- Total de dispositivos: {}\n\n".format(len(equipos))
    
    # Primero necesitamos las categorías
    categorias_map = {
        'CPU': 'Computadoras de Escritorio',
        'Monitor': 'Periféricos',
        'Teclado': 'Periféricos',
        'Mouse': 'Periféricos'
    }
    
    sql += "-- IMPORTANTE: Asegúrate de que las categorías existan en la tabla categorias\n"
    sql += "-- Si no existen, ejecuta primero el script supabase-schema-dispositivos.sql\n\n"
    
    for equipo in equipos:
        categoria = categorias_map.get(equipo['tipo_componente'], 'Otros Equipos')
        
        sql += f"-- {equipo['nombre']}\n"
        sql += "INSERT INTO public.dispositivos (\n"
        sql += "    nombre, descripcion, categoria_id, marca, modelo, numero_serie,\n"
        sql += "    estado, ubicacion, asignado_a, departamento, observaciones\n"
        sql += ") VALUES (\n"
        nombre_esc = equipo['nombre'].replace("'", "''")
        tipo_comp = equipo['tipo_componente']
        num_eq = equipo['equipo_numero']
        marca_esc = equipo['marca'].replace("'", "''") if equipo['marca'] else None
        modelo_esc = equipo['modelo'].replace("'", "''") if equipo['modelo'] else None
        serial_esc = equipo['numero_serie'].replace("'", "''") if equipo['numero_serie'] else None
        asignado_esc = equipo['asignado_a'].replace("'", "''") if equipo['asignado_a'] else None
        
        sql += f"    '{nombre_esc}',\n"
        sql += f"    '{tipo_comp} del Equipo {num_eq}',\n"
        sql += f"    (SELECT id FROM public.categorias WHERE nombre = '{categoria}' LIMIT 1),\n"
        
        if marca_esc:
            sql += f"    '{marca_esc}',\n"
        else:
            sql += "    NULL,\n"
            
        if modelo_esc:
            sql += f"    '{modelo_esc}',\n"
        else:
            sql += "    NULL,\n"
            
        if serial_esc:
            sql += f"    '{serial_esc}',\n"
        else:
            sql += "    NULL,\n"
            
        sql += f"    '{equipo['estado']}',\n"
        sql += f"    '{equipo['ubicacion']}',\n"
        
        if asignado_esc:
            sql += f"    '{asignado_esc}',\n"
        else:
            sql += "    NULL,\n"
            
        sql += f"    '{equipo['departamento']}',\n"
        
        if equipo['placa']:
            sql += f"    'Placa: {equipo['placa']}'\n"
        else:
            sql += "    NULL\n"
        sql += ")\n"
        sql += "ON CONFLICT (numero_serie) DO NOTHING;\n\n"
    
    return sql

def generar_json(equipos):
    """
    Genera archivo JSON con los datos para importación manual
    """
    return json.dumps(equipos, indent=2, ensure_ascii=False)

# Procesar el archivo
print("=" * 80)
print("IMPORTADOR DE INVENTARIO JASCIA")
print("=" * 80)
print("\nProcesando archivo: Inventario_Jascia.csv\n")

try:
    equipos = parsear_inventario('Inventario_Jascia.csv')
    
    print(f"[OK] Total de dispositivos encontrados: {len(equipos)}\n")
    
    # Estadísticas
    por_tipo = {}
    por_usuario = {}
    con_serial = 0
    
    for eq in equipos:
        tipo = eq['tipo_componente']
        por_tipo[tipo] = por_tipo.get(tipo, 0) + 1
        
        usuario = eq['asignado_a'] or 'Sin asignar'
        por_usuario[usuario] = por_usuario.get(usuario, 0) + 1
        
        if eq['numero_serie']:
            con_serial += 1
    
    print("=" * 80)
    print("ESTADÍSTICAS:")
    print("=" * 80)
    print(f"\nPor tipo de componente:")
    for tipo, cantidad in sorted(por_tipo.items()):
        print(f"  - {tipo}: {cantidad}")
    
    print(f"\nPor usuario:")
    for usuario, cantidad in sorted(por_usuario.items()):
        print(f"  - {usuario}: {cantidad}")
    
    print(f"\nDispositivos con número de serie: {con_serial}/{len(equipos)}")
    
    # Generar archivos de salida
    print("\n" + "=" * 80)
    print("GENERANDO ARCHIVOS DE IMPORTACIÓN...")
    print("=" * 80)
    
    # SQL
    sql_content = generar_sql_insert(equipos)
    with open('importar_dispositivos.sql', 'w', encoding='utf-8') as f:
        f.write(sql_content)
    print("[OK] Creado: importar_dispositivos.sql")
    
    # JSON
    json_content = generar_json(equipos)
    with open('dispositivos_importar.json', 'w', encoding='utf-8') as f:
        f.write(json_content)
    print("[OK] Creado: dispositivos_importar.json")
    
    # CSV limpio
    with open('dispositivos_importar.csv', 'w', encoding='utf-8', newline='') as f:
        if equipos:
            writer = csv.DictWriter(f, fieldnames=equipos[0].keys())
            writer.writeheader()
            writer.writerows(equipos)
    print("[OK] Creado: dispositivos_importar.csv")
    
    print("\n" + "=" * 80)
    print("PRÓXIMOS PASOS:")
    print("=" * 80)
    print("\n1. Revisa el archivo 'importar_dispositivos.sql'")
    print("2. Ejecuta el script en Supabase SQL Editor")
    print("3. Verifica que los dispositivos se importaron correctamente")
    print("\nNOTA: El script usa ON CONFLICT para evitar duplicados por número de serie")
    
except FileNotFoundError:
    print("[ERROR] No se encontro el archivo 'Inventario_Jascia.csv'")
    print("   Asegurate de que el archivo este en el mismo directorio")
except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()

