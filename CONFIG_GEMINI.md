# Configuración de Gemini IA

El módulo de IA usa **Google Gemini** para sugerir soluciones en tickets.

## 1. Obtener API Key

1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Inicia sesión con tu cuenta Google
3. Crea o selecciona un proyecto
4. Ve a **API Keys** → **Create API Key**
5. Copia la clave generada

> ⚠️ **Importante:** Revoca y regenera la clave si la compartiste por error. No la subas a GitHub.

## 2. Configurar variables de entorno

En tu archivo `.env.local` (o `.env`), agrega:

```
GEMINI_API_KEY=tu_clave_aqui
```

Opcional (modelo por defecto es `gemini-3-flash-preview`):

```
GEMINI_MODEL=gemini-2.5-flash-preview
```

## 3. Dónde se usa

- **Editar Ticket** → Botón "Sugerir con IA" junto al campo Solución
- **Guías (Nueva / Editar)** → Botón "Generar con IA" junto al campo Contenido (genera borrador a partir del título y categoría)

## 4. Producción

En Vercel u otro hosting, agrega `GEMINI_API_KEY` en las variables de entorno del proyecto.
