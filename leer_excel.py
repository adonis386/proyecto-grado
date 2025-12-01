#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para leer el archivo Excel de inventario
"""

try:
    import pandas as pd
    
    # Leer el archivo Excel
    df = pd.read_excel('Inventario_Jascia.xlsx')
    
    print("=" * 80)
    print("CONTENIDO DEL ARCHIVO: Inventario_Jascia.xlsx")
    print("=" * 80)
    print(f"\nTotal de filas: {len(df)}")
    print(f"Total de columnas: {len(df.columns)}")
    print("\n" + "=" * 80)
    print("COLUMNAS:")
    print("=" * 80)
    for i, col in enumerate(df.columns, 1):
        print(f"{i}. {col}")
    
    print("\n" + "=" * 80)
    print("PRIMERAS 20 FILAS:")
    print("=" * 80)
    print(df.head(20).to_string())
    
    print("\n" + "=" * 80)
    print("INFORMACIÓN DEL DATAFRAME:")
    print("=" * 80)
    print(df.info())
    
    print("\n" + "=" * 80)
    print("ESTADÍSTICAS:")
    print("=" * 80)
    print(df.describe())
    
except ImportError:
    print("ERROR: pandas no está instalado")
    print("\nPara instalar pandas ejecuta:")
    print("pip install pandas openpyxl")
    print("\nO ejecuta este script después de instalar las dependencias")
    
except Exception as e:
    print(f"ERROR al leer el archivo: {e}")
    print("\nAsegúrate de que el archivo 'Inventario_Jascia.xlsx' existe en el directorio actual")

