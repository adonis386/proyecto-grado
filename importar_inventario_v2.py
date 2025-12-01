#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script mejorado para importar el inventario desde Inventario_Jascia.csv
"""

import csv
import json
from datetime import datetime

def parsear_inventario(archivo_csv):
    """
    Parsea el CSV con formato especial de Jascia
    """
    equipos = []
    
    with open(archivo_csv, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter=';')
        filas = list(reader)
    
    i = 0
    while i < len(filas):
        fila = filas[i]
        
        # Buscar fila que contiene "Equipo:"
        if len(fila) > 0 and fila[0] == 'Equipo:':
            # Procesar hasta 4 equipos en esta fila
            for offset in [0, 6, 12, 18]:  # Cada equipo ocupa ~6 columnas
                if offset + 1 < len(fila):
                    try:
                        num_equipo = fila[offset + 1].strip() if fila[offset + 1] else None
                        usuario = fila[offset + 3].strip() if offset + 3 < len(fila) and fila[offset + 3] else None
                        
                        if not num_equipo or not num_equipo.isdigit():
                            continue
                        
                        # Leer las siguientes 5 filas para obtener componentes
                        if i + 5 >= len(filas):
                            continue
                        
                        # Fila 1: Headers (CPU, Monitor, Teclado, Mouse)
                        headers = filas[i + 1][offset:offset+5] if offset+5 <= len(filas[i + 1]) else []
                        
                        # Fila 2: Marcas
                        marcas = filas[i + 2][offset:offset+5] if offset+5 <= len(filas[i + 2]) else []
                        
                        # Fila 3: Modelos
                        modelos = filas[i + 3][offset:offset+5] if offset+5 <= len(filas[i + 3]) else []
                        
                        # Fila 4: Placas
                        placas = filas[i + 4][offset:offset+5] if offset+5 <= len(filas[i + 4]) else []
                        
                        # Fila 5: Seriales
                        seriales = filas[i + 5][offset:offset+5] if offset+5 <= len(filas[i + 5]) else []
                        
                        # Procesar cada componente (CPU, Monitor, Teclado, Mouse)
                        tipos_componente = ['CPU', 'Monitor', 'Teclado', 'Mouse']
                        
                        for j in range(1, 5):  # Columnas 1-4 son los componentes
                            if j < len(headers) and headers[j]:
                                tipo = headers[j].strip()
                                
                                marca = marcas[j].strip() if j < len(marcas) and marcas[j] else ''
                                modelo = modelos[j].strip() if j < len(modelos) and modelos[j] else ''
                                placa = placas[j].strip() if j < len(placas) and placas[j] else ''
                                serial = seriales[j].strip() if j < len(seriales) and seriales[j] else ''
                                
                                # Solo agregar si tiene información mínima
                                if marca or modelo or serial or placa:
                                    dispositivo = {
                                        'equipo_numero': num_equipo,
                                        'usuario': usuario if usuario else 'Sin asignar',
                                        'tipo_componente': tipo,
                                        'marca': marca if marca else None,
                                        'modelo': modelo if modelo else None,
                                        'numero_serie': serial if serial else None,
                                        'placa': placa if placa else None,
                                        'estado': 'En Uso' if usuario and usuario != 'SIN USUARIO' else 'Disponible',
                                        'asignado_a': usuario if usuario and usuario != 'SIN USUARIO' else None,
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
                                    
                                    if not nombre_partes:
                                        nombre_partes = [tipo, f"Equipo {num_equipo}"]
                                    
                                    dispositivo['nombre'] = ' '.join(nombre_partes)
                                    
                                    equipos.append(dispositivo)
                    except Exception as e:
                        print(f"Error procesando equipo en offset {offset}: {e}")
                        continue
        
        i += 1
    
    return equipos

def generar_sql_insert(equipos):
    """
    Genera script SQL para insertar los dispositivos
    """
    sql = "-- Script generado automaticamente desde Inventario_Jascia.csv\n"
    sql += f"-- Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
    sql += f"-- Total de dispositivos: {len(equipos)}\n\n"
    
    # Mapeo de categorías
    categorias_map = {
        'CPU': 'Computadoras de Escritorio',
        'Monitor': 'Periféricos',
        'Teclado': 'Periféricos',
        'Mouse': 'Periféricos'
    }
    
    sql += "-- IMPORTANTE: Asegurate de que las categorias existan\n"
    sql += "-- Si no existen, ejecuta primero: supabase-schema-dispositivos.sql\n\n"
    
    for equipo in equipos:
        categoria = categorias_map.get(equipo['tipo_componente'], 'Otros Equipos')
        
        sql += f"-- {equipo['nombre']} (Equipo {equipo['equipo_numero']})\n"
        sql += "INSERT INTO public.dispositivos (\n"
        sql += "    nombre, descripcion, categoria_id, marca, modelo, numero_serie,\n"
        sql += "    estado, ubicacion, asignado_a, departamento, observaciones\n"
        sql += ") VALUES (\n"
        
        nombre_esc = equipo['nombre'].replace("'", "''")
        tipo_comp = equipo['tipo_componente']
        num_eq = equipo['equipo_numero']
        descripcion = f"{tipo_comp} del Equipo {num_eq}"
        
        sql += f"    '{nombre_esc}',\n"
        sql += f"    '{descripcion}',\n"
        sql += f"    (SELECT id FROM public.categorias WHERE nombre = '{categoria}' LIMIT 1),\n"
        
        if equipo['marca']:
            marca_esc = equipo['marca'].replace("'", "''")
            sql += f"    '{marca_esc}',\n"
        else:
            sql += "    NULL,\n"
            
        if equipo['modelo']:
            modelo_esc = equipo['modelo'].replace("'", "''")
            sql += f"    '{modelo_esc}',\n"
        else:
            sql += "    NULL,\n"
            
        if equipo['numero_serie']:
            serial_esc = equipo['numero_serie'].replace("'", "''")
            sql += f"    '{serial_esc}',\n"
        else:
            sql += "    NULL,\n"
            
        sql += f"    '{equipo['estado']}',\n"
        sql += f"    '{equipo['ubicacion']}',\n"
        
        if equipo['asignado_a']:
            asignado_esc = equipo['asignado_a'].replace("'", "''")
            sql += f"    '{asignado_esc}',\n"
        else:
            sql += "    NULL,\n"
            
        sql += f"    '{equipo['departamento']}',\n"
        
        if equipo['placa']:
            placa_esc = equipo['placa'].replace("'", "''")
            sql += f"    'Placa: {placa_esc}'\n"
        else:
            sql += "    NULL\n"
            
        sql += ")\n"
        sql += "ON CONFLICT (numero_serie) DO NOTHING;\n\n"
    
    return sql

def generar_json(equipos):
    """Genera archivo JSON"""
    return json.dumps(equipos, indent=2, ensure_ascii=False)

# Procesar
print("=" * 80)
print("IMPORTADOR DE INVENTARIO JASCIA v2")
print("=" * 80)
print("\nProcesando archivo: Inventario_Jascia.csv\n")

try:
    equipos = parsear_inventario('Inventario_Jascia.csv')
    
    print(f"[OK] Total de dispositivos encontrados: {len(equipos)}\n")
    
    if len(equipos) == 0:
        print("[ADVERTENCIA] No se encontraron dispositivos.")
        print("Revisando formato del archivo...\n")
        
        # Debug: mostrar primeras filas
        with open('Inventario_Jascia.csv', 'r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter=';')
            print("Primeras 10 filas del CSV:")
            for i, fila in enumerate(reader):
                if i < 10:
                    print(f"Fila {i}: {fila[:10]}")
                else:
                    break
    else:
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
        print("ESTADISTICAS:")
        print("=" * 80)
        print(f"\nPor tipo de componente:")
        for tipo, cantidad in sorted(por_tipo.items()):
            print(f"  - {tipo}: {cantidad}")
        
        print(f"\nPor usuario:")
        for usuario, cantidad in sorted(por_usuario.items()):
            print(f"  - {usuario}: {cantidad}")
        
        print(f"\nDispositivos con numero de serie: {con_serial}/{len(equipos)}")
        
        # Generar archivos
        print("\n" + "=" * 80)
        print("GENERANDO ARCHIVOS DE IMPORTACION...")
        print("=" * 80)
        
        sql_content = generar_sql_insert(equipos)
        with open('importar_dispositivos.sql', 'w', encoding='utf-8') as f:
            f.write(sql_content)
        print("[OK] Creado: importar_dispositivos.sql")
        
        json_content = generar_json(equipos)
        with open('dispositivos_importar.json', 'w', encoding='utf-8') as f:
            f.write(json_content)
        print("[OK] Creado: dispositivos_importar.json")
        
        # CSV
        if equipos:
            with open('dispositivos_importar.csv', 'w', encoding='utf-8', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=equipos[0].keys())
                writer.writeheader()
                writer.writerows(equipos)
            print("[OK] Creado: dispositivos_importar.csv")
        
        print("\n" + "=" * 80)
        print("PROXIMOS PASOS:")
        print("=" * 80)
        print("\n1. Revisa el archivo 'importar_dispositivos.sql'")
        print("2. Ejecuta el script en Supabase SQL Editor")
        print("3. Verifica que los dispositivos se importaron correctamente")
        print("\nNOTA: El script usa ON CONFLICT para evitar duplicados por numero de serie")
        
except FileNotFoundError:
    print("[ERROR] No se encontro el archivo 'Inventario_Jascia.csv'")
except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()

