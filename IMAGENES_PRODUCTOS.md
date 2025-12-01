# 📷 Guía para Imágenes de Productos

Esta guía te explica cómo funcionan las imágenes en el sistema de inventario.

---

## ✅ Características de las Imágenes

### Formatos Soportados:
- ✅ **PNG** - Mejor para logos y transparencias
- ✅ **JPEG / JPG** - Mejor para fotos
- ✅ **WEBP** - Formato moderno y optimizado

### Límites:
- 📏 **Tamaño máximo:** 5MB por imagen
- 🎯 **Recomendación:** Usa imágenes de máximo 2MB para mejor rendimiento

### Opcional:
- Las imágenes **NO son obligatorias**
- Puedes crear productos sin imagen
- Puedes agregar/cambiar/eliminar imágenes después

---

## 📤 Cómo Agregar Imágenes

Tienes **2 opciones** para agregar imágenes a los productos:

### **Opción 1: Subir Archivo** (📤)

1. Ve a **Productos** → **Nuevo Producto**
2. Llena los datos básicos (nombre, categoría, etc.)
3. En la sección **"Imagen del Producto"**:
   - Asegúrate que esté seleccionada la pestaña **"📤 Subir Archivo"**
   - Haz clic en **"📷 Seleccionar Imagen"**
   - Elige una imagen de tu computadora
   - Verás una **vista previa**
   - Si no te gusta, haz clic en **"🗑️ Eliminar"** y selecciona otra
4. Guarda el producto

### **Opción 2: URL de Imagen** (🔗)

¡Perfecto para imágenes del fabricante o ya alojadas en internet!

1. Ve a **Productos** → **Nuevo Producto**
2. Llena los datos básicos
3. En la sección **"Imagen del Producto"**:
   - Haz clic en la pestaña **"🔗 URL de Imagen"**
   - Pega la URL completa de la imagen
   - Ejemplo: `https://www.dell.com/imagen-producto.jpg`
   - Verás una **vista previa automática**
   - Si no es correcta, borra la URL e ingresa otra
4. Guarda el producto

**💡 Ventajas de usar URL:**
- ✅ No ocupa espacio en Supabase
- ✅ Más rápido (no hay que subir)
- ✅ Ideal para imágenes del fabricante
- ✅ Siempre actualizada desde la fuente

**⚠️ Consideraciones de URL:**
- La URL debe ser pública y accesible
- Debe terminar en .jpg, .jpeg, .png o .webp
- Si el sitio elimina la imagen, dejará de verse

### Al Editar un Producto:

1. Ve al detalle del producto
2. Haz clic en **"✏️ Editar"**
3. En la sección de imagen:
   - **Si ya tiene imagen:** Verás la imagen actual
   - **Para cambiarla por archivo:** Tab "📤 Subir Archivo" → selecciona nueva imagen
   - **Para cambiarla por URL:** Tab "🔗 URL de Imagen" → pega nueva URL
   - **Para eliminarla:** Haz clic en **"🗑️ Eliminar"** o **"🗑️ Eliminar URL"**
4. Guarda los cambios

**Nota:** Al cambiar de una imagen subida a una URL (o viceversa), la anterior se elimina automáticamente.

---

## 👀 Dónde se Muestran las Imágenes

### 1. Lista de Productos
- Miniatura pequeña (64x64px)
- Si no hay imagen, muestra un ícono 📦

### 2. Detalle del Producto
- Imagen grande y completa
- Se muestra en una columna lateral
- Mantiene proporciones originales

### 3. Formularios
- Vista previa mientras seleccionas la imagen

---

## 🖼️ Mejores Prácticas

### Tamaño Recomendado:
- **Mínimo:** 400x400 píxeles
- **Óptimo:** 800x800 píxeles
- **Máximo:** 2000x2000 píxeles

### Relación de Aspecto:
- **Preferible:** Cuadrado (1:1)
- También funciona: Rectangular (4:3, 16:9)

### Calidad:
- **Buena iluminación**
- **Fondo neutro** (blanco o gris)
- **Producto centrado**
- **Enfoque nítido**

### Optimización:
- Comprime las imágenes antes de subirlas
- Herramientas recomendadas:
  - TinyPNG (https://tinypng.com)
  - Squoosh (https://squoosh.app)
  - Compressor.io (https://compressor.io)

---

## 🎨 Dónde Conseguir Imágenes

### 1. Fotos Propias (Recomendado) - Subir Archivo
- Toma fotos de tus equipos reales
- Usa buena luz natural
- Fondo uniforme
- **Método:** 📤 Subir Archivo

### 2. Imágenes del Fabricante (URL) - Usar URL 🌟
- Sitio web oficial de la marca
- Catálogos digitales online
- Hojas de especificaciones
- **Método:** 🔗 URL de Imagen

**Ejemplo - Dell Laptop:**
```
1. Ve a: https://www.dell.com
2. Busca el modelo específico
3. Clic derecho en la imagen del producto
4. "Copiar dirección de imagen"
5. Pega en el campo URL
```

### 3. Bancos de Imágenes Gratuitas
- **Unsplash** (https://unsplash.com)
- **Pexels** (https://pexels.com)
- **Pixabay** (https://pixabay.com)
- Busca: "laptop", "computer", "server", etc.
- **Método:** Descarga y usa 📤 Subir Archivo, o copia URL de la imagen

### 4. Búsqueda de Google
- Busca: "nombre del producto"
- Haz clic en "Imágenes"
- Clic derecho → "Copiar dirección de imagen"
- **Método:** 🔗 URL de Imagen

---

## 🔧 Solución de Problemas

### ❌ "Tipo de archivo no permitido"
**Solución:** Solo usa PNG, JPEG o WEBP. No subas GIF, BMP, SVG u otros formatos.

### ❌ "El archivo es muy grande"
**Solución:** 
1. Usa una herramienta de compresión (TinyPNG, Squoosh)
2. Reduce las dimensiones de la imagen
3. Convierte a JPEG si es PNG grande

### ❌ La imagen no se ve
**Solución:**

**Si es imagen subida:**
1. Verifica que el bucket de Supabase esté creado
2. Verifica que el bucket sea **público**
3. Verifica que las políticas estén configuradas
4. Lee: `CONFIGURACION_SUPABASE.md` paso 6

**Si es URL externa:**
1. Verifica que la URL sea correcta
2. Intenta abrir la URL en una nueva pestaña del navegador
3. Asegúrate que la imagen sea pública (no requiera login)
4. Verifica que el sitio permita hotlinking (mostrar imágenes en otros sitios)

### ❌ Error al subir imagen
**Solución:**
1. Verifica tu conexión a internet
2. Asegúrate de estar autenticado
3. Verifica las políticas del bucket en Supabase

---

## 📊 Almacenamiento

### Imágenes Subidas (📤):
**En Supabase:**
- Las imágenes se guardan en el bucket `productos-imagenes`
- Estructura: `productos/timestamp-random.extension`
- Ejemplo: `productos/1704123456789-abc123.jpg`

**Plan Gratuito de Supabase:**
- ✅ **1GB de almacenamiento** incluido
- Aproximadamente **500-1000 imágenes** (dependiendo del tamaño)

**Eliminación:**
- Al eliminar un producto, su imagen **se elimina automáticamente**
- Al cambiar la imagen, la anterior **se elimina automáticamente**
- Esto mantiene tu almacenamiento limpio

### URLs Externas (🔗):
**Ventajas:**
- ✅ **No ocupa espacio en Supabase** - almacenamiento ilimitado
- ✅ Más rápido de configurar
- ✅ No hay que administrar archivos

**Consideraciones:**
- ⚠️ Dependen del sitio externo
- ⚠️ Si el sitio cae, la imagen no se verá
- ⚠️ Si cambian o eliminan la imagen, afecta tu sistema

**Recomendación:**
- **URLs:** Para productos nuevos o imágenes oficiales del fabricante
- **Subir archivo:** Para tu propio inventario físico o imágenes importantes

---

## 🎯 Recomendaciones Finales

### ✅ Hacer:
- Usar imágenes de buena calidad
- Comprimir antes de subir
- Usar nombres descriptivos en los archivos
- Mantener estilo consistente (mismo fondo, iluminación)

### ❌ Evitar:
- Subir imágenes muy pesadas (>5MB)
- Usar imágenes borrosas
- Fondos muy cargados o distractores
- Marcas de agua visibles

---

## 💡 Ejemplos de Buenas Prácticas

### ✅ BIEN - Archivo Subido:
```
✓ Imagen cuadrada 800x800px
✓ Fondo blanco o gris
✓ Producto centrado
✓ Buena iluminación
✓ 200KB - 500KB de tamaño
✓ Formato JPEG o WEBP
```

### ✅ BIEN - URL Externa:
```
✓ URL de sitio confiable (fabricante oficial)
✓ URL directa a la imagen (.jpg, .png)
✓ Imagen de alta calidad
✓ Sitio estable y permanente
Ejemplo: https://www.dell.com/images/productos/laptop-xyz.jpg
```

### ❌ MAL - Archivo Subido:
```
✗ Imagen muy pesada (10MB)
✗ Muy oscura o borrosa
✗ Producto cortado o mal encuadrado
✗ Fondo desordenado
✗ Marca de agua grande
```

### ❌ MAL - URL Externa:
```
✗ URL de Google Images o Pinterest
✗ URL acortada (bit.ly, etc.)
✗ URL que requiere login
✗ URL de sitios temporales
✗ URL que no termina en extensión de imagen
```

## 🎯 ¿Cuándo usar cada método?

### Usa **📤 Subir Archivo** cuando:
- ✅ Tienes fotos propias de tus equipos
- ✅ Necesitas control total de la imagen
- ✅ Quieres garantizar que siempre esté disponible
- ✅ La imagen es única o personalizada

### Usa **🔗 URL de Imagen** cuando:
- ✅ La imagen ya está en internet (fabricante)
- ✅ Quieres ahorrar espacio en Supabase
- ✅ Es una imagen oficial del producto
- ✅ El sitio fuente es confiable y permanente
- ✅ Tienes muchos productos y poco espacio

---

**¡Con estas recomendaciones, tus productos lucirán profesionales! 📸**

