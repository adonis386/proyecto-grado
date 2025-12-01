# 🌱 Sistema de Inventario INN

Sistema de gestión de inventario de equipos informáticos para la organización INN. Proyecto de grado desarrollado con Next.js 14, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características

- ✅ **Autenticación de usuarios** con Supabase Auth
- 📦 **Gestión de productos/equipos informáticos**
- 📁 **Categorización de equipos**
- 🖼️ **Gestión de imágenes:** Subir archivos (PNG, JPEG, WEBP) o usar URLs externas
- 🔍 **Búsqueda y filtrado avanzado**
- 📊 **Dashboard con estadísticas en tiempo real**
- 🎨 **Interfaz moderna con tema INN**
- 🔐 **Row Level Security (RLS)** para seguridad de datos
- 📱 **Diseño responsive**

## 📋 Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Cuenta de Supabase

## 🛠️ Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` basado en el ejemplo:

```bash
cp .env.example .env.local
```

Luego edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

**Obtén tus credenciales en:** Supabase Dashboard → Settings → API

### 3. Configurar la base de datos en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Dirígete a **SQL Editor**
3. Crea una nueva query
4. Copia y pega todo el contenido del archivo `supabase-schema.sql`
5. Ejecuta el script (Run)

Esto creará:
- ✅ Tabla `categorias`
- ✅ Tabla `productos`
- ✅ Índices para optimización
- ✅ Políticas RLS (Row Level Security)
- ✅ Triggers para actualización automática
- ✅ Categorías iniciales

### 4. Configurar Storage (OBLIGATORIO - para imágenes de productos)

1. Ve a **Storage** en Supabase Dashboard
2. Crea un nuevo bucket llamado `productos-imagenes`
3. Márcalo como **público**
4. Configura las políticas de seguridad (ver `CONFIGURACION_SUPABASE.md`)

**Formatos soportados:** PNG, JPEG, WEBP (máximo 5MB)

## 🚀 Ejecución en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Compilación para producción

```bash
npm run build
npm start
```

## 🏗️ Estructura del proyecto

```
inn-inventario/
├── app/
│   ├── dashboard/           # Panel de administración
│   │   ├── categorias/      # Gestión de categorías
│   │   ├── productos/       # Gestión de productos
│   │   │   ├── [id]/        # Detalle y edición de producto
│   │   │   └── nuevo/       # Crear nuevo producto
│   │   ├── layout.tsx       # Layout del dashboard
│   │   └── page.tsx         # Página principal del dashboard
│   ├── login/               # Página de autenticación
│   ├── layout.tsx           # Layout raíz
│   ├── page.tsx             # Página de inicio
│   └── globals.css          # Estilos globales
├── lib/
│   └── supabase.ts          # Cliente y tipos de Supabase
├── public/
│   └── logo.png             # Logo de INN
├── supabase-schema.sql      # Script SQL para base de datos
└── README.md
```

## 🎨 Tema y Colores

El sistema utiliza los colores corporativos de INN:

- **Verde Oliva** (#6B8E23) - Color principal
- **Verde Claro** (#9ACD32) - Color secundario
- **Marrón/Rojo** (#A0522D) - Color de acento

## 👥 Uso del Sistema

### Primera vez

1. **Registro de usuario:**
   - Accede a la aplicación
   - Haz clic en "¿No tienes cuenta? Regístrate"
   - Ingresa tu email y contraseña
   - Confirma tu email (revisa tu bandeja de entrada)

2. **Inicio de sesión:**
   - Ingresa con tu email y contraseña
   - Serás redirigido al dashboard

### Gestión de Categorías

- Crear, editar y eliminar categorías de equipos
- Cada producto debe estar asociado a una categoría
- Categorías iniciales ya creadas por el script SQL

### Gestión de Productos

- **Crear:** Registra nuevos equipos con toda su información
- **Ver:** Consulta detalles completos de cada equipo
- **Editar:** Actualiza información de equipos existentes
- **Eliminar:** Elimina equipos del inventario
- **Buscar:** Filtra por nombre, marca, modelo o número de serie
- **Filtrar:** Por estado (Disponible, En Uso, En Reparación, Dado de Baja)

## 🔐 Seguridad

- Autenticación requerida para acceder al sistema
- Row Level Security (RLS) activado en todas las tablas
- Solo usuarios autenticados pueden leer y escribir datos
- Políticas de seguridad configuradas en Supabase

## 📱 Funcionalidades

### Dashboard
- Estadísticas en tiempo real
- Resumen de inventario
- Accesos rápidos

### Productos
- Información completa del equipo
- Estado del equipo
- Ubicación física
- Número de serie único
- Historial de fechas

### Categorías
- Organización del inventario
- Descripción de cada categoría
- Gestión flexible

## 🤝 Colaboradores

Este proyecto es desarrollado como proyecto de grado para INN.

## 📄 Licencia

Este proyecto es privado y exclusivo para uso de INN.

## 🐛 Solución de Problemas

### Error de conexión a Supabase
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que el proyecto de Supabase esté activo

### No puedo ver los productos
- Verifica que hayas ejecutado el script SQL completo
- Asegúrate de estar autenticado en el sistema
- Revisa las políticas RLS en Supabase

### Error al crear productos
- Verifica que existan categorías en el sistema
- Asegúrate de llenar todos los campos requeridos (*)
- Verifica que el número de serie no esté duplicado

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para INN - 2025**

