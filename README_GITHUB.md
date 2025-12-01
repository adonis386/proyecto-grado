# 🌱 Sistema de Inventario INN

![Version](https://img.shields.io/badge/version-1.0.0-green)
![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-2.39-green)

Sistema de gestión de inventario de equipos informáticos desarrollado como proyecto de grado para la organización INN.

---

## 🚀 Características

- ✅ **Autenticación de usuarios** con Supabase Auth
- 📦 **Gestión completa de productos/equipos informáticos**
- 📁 **Categorización de equipos**
- 🖼️ **Gestión de imágenes:** Subir archivos o usar URLs externas
- 🔍 **Búsqueda y filtrado avanzado**
- 📊 **Dashboard con estadísticas en tiempo real**
- 🎨 **Interfaz moderna con tema INN**
- 🔐 **Row Level Security (RLS)** para seguridad de datos
- 📱 **Diseño responsive**

---

## 🛠️ Tecnologías

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Despliegue:** Vercel (recomendado)

---

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Cuenta de Supabase (gratis)

---

## ⚡ Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/inn-inventario.git
cd inn-inventario
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

**Obtén tus credenciales:**
1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Crea un proyecto o selecciona uno existente
3. Settings → API
4. Copia "Project URL" y "anon/public key"

### 4. Configurar la base de datos

1. Ve a Supabase Dashboard → SQL Editor
2. Crea una nueva query
3. Copia todo el contenido de `supabase-schema.sql`
4. Ejecuta el script
5. **Configura Storage:**
   - Ve a Storage → Create bucket: `productos-imagenes`
   - Marca como público
   - Configura políticas (ver `CONFIGURACION_SUPABASE.md`)

### 5. Iniciar el servidor

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📚 Documentación

- **[INSTRUCCIONES.md](INSTRUCCIONES.md)** - Guía paso a paso detallada
- **[CONFIGURACION_SUPABASE.md](CONFIGURACION_SUPABASE.md)** - Configuración de Supabase
- **[SUBIR_A_GITHUB.md](SUBIR_A_GITHUB.md)** - Guía para GitHub
- **[IMAGENES_PRODUCTOS.md](IMAGENES_PRODUCTOS.md)** - Gestión de imágenes
- **[DESPLIEGUE.md](DESPLIEGUE.md)** - Despliegue en producción
- **[RESUMEN_PROYECTO.md](RESUMEN_PROYECTO.md)** - Resumen técnico

---

## 📦 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run start        # Servidor de producción
npm run lint         # Linter
```

---

## 🎨 Estructura del Proyecto

```
inn-inventario/
├── app/                    # Aplicación Next.js (App Router)
│   ├── dashboard/          # Panel de administración
│   │   ├── categorias/    # Gestión de categorías
│   │   └── productos/     # Gestión de productos
│   ├── login/             # Autenticación
│   └── ...
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuración
├── public/                # Archivos estáticos
├── supabase-schema.sql    # Script de base de datos
└── ...
```

---

## 🔐 Seguridad

- ✅ Autenticación requerida para todas las operaciones
- ✅ Row Level Security (RLS) en Supabase
- ✅ Variables de entorno para credenciales
- ✅ `.env.local` en `.gitignore`

**⚠️ IMPORTANTE:** Nunca subas archivos `.env.local` al repositorio.

---

## 🚀 Despliegue

### Vercel (Recomendado)

1. Importa el repositorio en [Vercel](https://vercel.com)
2. Configura las variables de entorno
3. Despliega

Ver [DESPLIEGUE.md](DESPLIEGUE.md) para más opciones.

---

## 👥 Contribuir

Este es un proyecto de grado. Si eres parte del equipo:

1. Clona el repositorio
2. Pide las credenciales al administrador
3. Configura tu `.env.local`
4. ¡Empieza a desarrollar!

---

## 📸 Capturas de Pantalla

_(Agrega capturas de pantalla de tu aplicación aquí)_

---

## 🎓 Créditos

**Proyecto de Grado** - Sistema de Inventario INN  
**Año:** 2025  
**Versión:** 1.0.0

---

## 📄 Licencia

Este proyecto es privado y exclusivo para uso de INN.

---

## 📞 Soporte

Para soporte o preguntas:
- Lee la documentación en la carpeta del proyecto
- Contacta al equipo de desarrollo

---

**Desarrollado con ❤️ para INN**

