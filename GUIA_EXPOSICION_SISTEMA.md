# Guía de Exposición – Sistema de Gestión IT INN

> **Cómo exponer y explicar el sistema desde su despliegue en Vercel hasta cada detalle funcional**  
> Para presentaciones, defensas de proyecto o capacitaciones.

---

## PARTE 1: El sistema está en Vercel

### 1.1 Acceso a la aplicación

El sistema está desplegado en **Vercel** (plataforma de hosting para Next.js). La URL de producción tiene el formato:

```
https://[nombre-del-proyecto].vercel.app
```

Por ejemplo: `https://inn-inventario.vercel.app` o la URL personalizada que hayas configurado.

**Qué explicar:**
- La aplicación es una SPA (Single Page Application) web accesible desde cualquier navegador.
- Funciona en escritorio, tablet y móvil (diseño responsive).
- Requiere conexión a internet para funcionar (conecta con Supabase en la nube).

---

### 1.2 Página de inicio

Al abrir la URL del proyecto, el usuario llega a la **página de inicio** (`/`). Desde ahí puede:

- Ver la presentación del sistema (logos INN y UNEXCA).
- Ser redirigido a **Login** si intenta acceder al dashboard sin sesión.
- Si ya está autenticado, ir directo al **Dashboard**.

**Qué explicar:**
- El sistema es privado: solo usuarios registrados pueden entrar.
- La ruta raíz (`/`) muestra la landing y enlaces para iniciar sesión.

---

### 1.3 Inicio de sesión

**Ruta:** `/login`

**Qué mostrar y explicar:**

1. **Formulario de Login**
   - Campo **Email**
   - Campo **Contraseña**
   - Botón **Iniciar sesión**
   - Enlace para cambiar a **Registrarse** (crear cuenta)

2. **Registro de usuarios**
   - Los usuarios pueden registrarse por su cuenta (si el administrador lo permite).
   - La cuenta debe confirmarse por email (Supabase envía el enlace).
   - Los **Administradores** y **Gerentes** pueden crear cuentas directamente desde el módulo de Empleados, sin que el usuario pase por el registro público.

3. **Autenticación**
   - La autenticación la gestiona **Supabase Auth**.
   - Las credenciales no se almacenan en el código ni en Vercel.
   - Si las credenciales son incorrectas, se muestra un mensaje de error.

4. **Después del login**
   - El usuario es redirigido a `/dashboard`.

---

## PARTE 2: Dashboard principal

**Ruta:** `/dashboard`

### 2.1 Barra superior (header)

- **Logos:** INN y UNEXCA.
- **Título:** "Inventario IT - Alianza UNEXCA".
- **Email del usuario** logueado.
- **Botón "Cerrar Sesión"**.

En móvil hay un menú hamburguesa para abrir/cerrar el menú lateral.

### 2.2 Menú lateral (sidebar)

El menú depende del **rol** del usuario:

| Opción      | Visible para                          |
|-------------|---------------------------------------|
| Inicio      | Todos                                 |
| Empleados   | Administrador, Gerente                |
| Equipos     | Todos                                 |
| Tickets     | Todos                                 |
| Reportes    | Administrador, Gerente                |
| Guías       | Todos                                 |
| Cableado    | Todos                                 |
| Inventario  | Todos                                 |
| Categorías  | Todos                                 |

**Qué explicar:**
- Los roles se definen en la tabla `empleados` y se usan con **Row Level Security (RLS)** en la base de datos.
- El menú se adapta según permisos: Administrador y Gerente ven más opciones que Empleado o Técnico.

### 2.3 Tarjetas de estadísticas

En la parte superior del dashboard hay **4 tarjetas**:

1. **Total Equipos** – Número total de equipos registrados.
2. **Equipos Operativos** – Equipos con estado "Operativo".
3. **Con Usuario** – Equipos asignados a un empleado.
4. **Disponibles** – Equipos en estado "Disponible" (stock disponible).

Cada tarjeta es clicable y lleva a la vista de Equipos con el filtro correspondiente.

### 2.4 Alerta de stock bajo

Si hay **menos de 3 equipos disponibles**, aparece una **alerta** (banner rojo):

- Mensaje: "Equipos bajos en stock".
- Indica cuántos equipos disponibles hay.
- Enlace a la lista de equipos disponibles.

**Qué explicar:**
- Es una ayuda visual para que el personal de TI gestione el inventario y reponga equipos.

### 2.5 Acciones rápidas

- **Registrar Empleado** (solo Admin/Gerente).
- **Agregar Nuevo Equipo**.
- **Ver Todos los Equipos**.
- **Ver Reportes** (solo Admin/Gerente).
- **Base de Conocimiento** (Guías).

### 2.6 Información del sistema

- Estado: Operativo.
- Base de datos: Conectada.
- Versión: 1.0.0.

---

## PARTE 3: Módulo Empleados

**Ruta:** `/dashboard/empleados`  
**Visible para:** Administrador, Gerente.

### 3.1 Lista de empleados

- Tabla con empleados del INN.
- Campos típicos: nombre, cargo, email, teléfono, departamento, rack, rol, estado (activo/inactivo).
- Opciones para **Ver**, **Editar** y filtros de búsqueda.

### 3.2 Crear empleado

**Ruta:** `/dashboard/empleados/nuevo`

**Campos del formulario:**

- Nombre completo
- Cargo
- Email
- Teléfono
- Dirección
- Dirección IP
- Acceso a internet (Sí/No)
- Acceso a llamadas (Sí/No)
- Rack
- Departamento
- **Rol** (Administrador, Técnico, Gerente, Empleado)
- Observaciones
- **Crear cuenta de acceso** (checkbox): si se marca, se piden email y contraseña para crear la cuenta en Supabase.

**Qué explicar:**
- Los empleados son la base para asignar equipos, tickets y permisos.
- El rack indica el punto de conexión de red del empleado.
- Los Administradores pueden crear cuentas para que los empleados entren al sistema.

### 3.3 Editar empleado

- Mismos campos que en creación.
- Si ya tiene cuenta: opción para **Cambiar contraseña**.
- Si no tiene cuenta: opción para **Crear cuenta de acceso** en ese momento.

---

## PARTE 4: Módulo Equipos

**Ruta:** `/dashboard/equipos`

### 4.1 Lista de equipos

- Tabla con: número de equipo, usuario asignado, departamento, rack, estado, ubicación.
- Búsqueda rápida por usuario, rack, marca, modelo, número de serie.
- Filtros avanzados: estado, rack, departamento, marca y modelo de componentes.

### 4.2 Detalle de equipo

**Ruta:** `/dashboard/equipos/[id]`

- Información completa del equipo.
- Componentes (CPU, Monitor, Teclado, Mouse) con marca, modelo, número de serie.
- Empleado asignado (si existe).
- Conexiones en rack asociadas.
- Botones para editar y navegar.

### 4.3 Nuevo equipo

**Ruta:** `/dashboard/equipos/nuevo`

**Campos principales:**

- Número de equipo
- Usuario asignado (selector de empleados)
- Estado (Operativo, Disponible, No Operativo, En Reparación, En Mantenimiento)
- Ubicación
- Rack
- Departamento
- Componentes: CPU (obligatorio), Monitor, Teclado, Mouse, cada uno con marca, modelo, número de serie, placa

**Qué explicar:**
- El modelo de negocio pide vincular equipos a empleados, IP, rack y cableado.
- El campo Rack es clave para localizar la conexión en el soporte técnico.

### 4.4 Editar equipo

- Mismos campos que en creación, con valores actuales.
- Permite cambiar empleado asignado, componentes, etc.

---

## PARTE 5: Módulo Tickets (Incidencias)

**Ruta:** `/dashboard/tickets`

### 5.1 Lista de tickets

- Tabla con: número, título, tipo, estado, prioridad, solicitante, fecha.
- Colores según estado (Abierto, Asignado, En Proceso, Pendiente, Resuelto, Cerrado, Cancelado).
- Filtros por estado, tipo, prioridad.
- Acceso a ver y editar cada ticket.

### 5.2 Crear ticket

**Ruta:** `/dashboard/tickets/nuevo`

**Campos:**

- Usuario solicitante
- Equipo (opcional, selector)
- **Tipo:** Conectividad, Telefonía IP, Cableado Estructural, Falla, Cambio, Mantenimiento, Consulta, Otro
- **Prioridad:** Baja, Media, Alta, Urgente
- Título
- Descripción
- Asignado a (técnico responsable)

**Qué explicar:**
- Los tipos Conectividad, Telefonía IP y Cableado Estructural responden a las solicitudes más frecuentes del modelo de negocio.

### 5.3 Editar ticket

**Ruta:** `/dashboard/tickets/[id]/editar`

- Todos los campos editables.
- **Regla BR-02:** Para marcar como Resuelto o Cerrado, el campo **Solución** es obligatorio.
- **Botón "Sugerir con IA":** Genera una sugerencia de solución a partir del título, descripción y tipo del ticket.
  - Requiere `GEMINI_API_KEY` configurada.
  - El técnico puede ajustar o completar la sugerencia antes de guardar.

### 5.4 Estados de ticket

- **Abierto** – Recién creado.
- **Asignado** – Asignado a un técnico.
- **En Proceso** – En atención.
- **Pendiente** – Esperando algo (usuario, repuesto, etc.).
- **Resuelto** – Resuelto con solución documentada.
- **Cerrado** – Cerrado formalmente.
- **Cancelado** – No se atenderá.

---

## PARTE 6: Módulo Reportes

**Ruta:** `/dashboard/reportes`  
**Visible para:** Administrador, Gerente.

### 6.1 Contenido

- Resumen de incidencias (por tipo, estado, prioridad).
- Tiempo promedio de resolución.
- Estado del inventario (equipos, empleados, componentes).
- Lista de últimos tickets.

**Qué explicar:**
- Sirve para tomar decisiones con datos.
- Solo Gerencia y Administración tienen acceso (BR-03 del modelo de negocio).

---

## PARTE 7: Módulo Guías (Base de conocimiento)

**Ruta:** `/dashboard/guias`

### 7.1 Lista de guías

- Lista de guías con título, categoría y estado (activa/inactiva).
- Acciones: Ver, Editar, Nueva guía.

### 7.2 Categorías de guía

- Resetear equipo
- Revisar rack
- Conectividad
- Telefonía IP
- Cableado
- Procedimiento
- Otro

### 7.3 Nueva guía

**Ruta:** `/dashboard/guias/nuevo`

**Campos:**

- Título
- Categoría
- **Contenido** (procedimiento paso a paso)
- Palabras clave (separadas por coma)

**Botón "Generar con IA":**
- Genera un borrador del contenido a partir del título y la categoría.
- También sugiere palabras clave.
- Requiere `GEMINI_API_KEY` configurada.
- El usuario puede editar el borrador antes de guardar.

### 7.4 Editar guía

- Mismos campos que en creación.
- Mismo botón "Generar con IA" para regenerar o ampliar el contenido.
- Checkbox "Guía activa" para mostrar u ocultar la guía.

### 7.5 Detalle de guía

**Ruta:** `/dashboard/guias/[id]`

- Título, categoría, palabras clave.
- Contenido completo (procedimiento).
- Fecha de actualización.

**Sección "¿Tienes dudas sobre esta guía?":**
- Campo de texto para escribir la pregunta.
- Botón **"Preguntar a la IA"**.
- La IA responde usando solo el contenido de esa guía.
- Si la guía no tiene la información, la IA lo indica y sugiere revisar el procedimiento o contactar a un técnico.

**Qué explicar:**
- Las guías permiten resolver problemas de forma remota sin depender de una sola persona.
- La IA ayuda a crear guías y a responder dudas sobre cada guía concreta.

---

## PARTE 8: Módulo Cableado

**Ruta:** `/dashboard/cableado`

### 8.1 Lista de conexiones

- Tabla por rack: puerto, equipo conectado, tipo de conexión (Red, Energía, VoIP).
- Filtro por rack.

### 8.2 Nueva conexión

**Ruta:** `/dashboard/cableado/nuevo`

- Rack
- Puerto
- Equipo (selector)
- Tipo de conexión

### 8.3 Editar conexión

- Modificar rack, puerto, equipo o tipo de conexión.

**Qué explicar:**
- Facilita localizar qué equipo está en qué puerto de cada rack.
- Reduce tiempo de revisión física del cableado.

---

## PARTE 9: Módulo Inventario

**Ruta:** `/dashboard/inventario`

### 9.1 Vista general

El inventario combina dos fuentes:

1. **En uso:** componentes asignados a equipos (desde tabla `componentes`).
2. **En almacén:** cantidades en bodega (desde tabla `stock_almacen`).

### 9.2 Columnas de la tabla

- **Tipo:** CPU, Monitor, Teclado, Mouse.
- **Marca**
- **Modelo**
- **En uso:** cantidad asignada a equipos.
- **En almacén:** cantidad en bodega (editable).
- Detalle de equipos que usan cada tipo (enlace opcional).

### 9.3 Edición de stock en almacén

- Se puede editar la columna "En almacén" directamente.
- Al guardar, se actualiza la tabla `stock_almacen`.
- Sirve para mantener el inventario de repuestos y equipos disponibles.

### 9.4 Filtros y orden

- Por tipo, marca, búsqueda de texto.
- Orden por en uso, en almacén, tipo, marca o modelo.

**Qué explicar:**
- "En uso" = componentes en equipos asignados.
- "En almacén" = stock disponible en bodega para repuestos o nuevos equipos.

---

## PARTE 10: Módulo Categorías

**Ruta:** `/dashboard/categorias`

### 10.1 Funcionalidad

- Lista de categorías de productos (ej.: Computadoras, Periféricos, Redes, Servidores, Almacenamiento, Otros).
- Crear, editar y eliminar categorías.
- Se usan en el módulo de Productos (legacy o complementario a Equipos).

---

## PARTE 11: Integración con IA (Gemini)

### 11.1 Dónde se usa

1. **Tickets – Sugerir solución**  
   - En editar ticket, junto al campo Solución.  
   - Genera texto sugerido a partir del título, descripción y tipo del ticket.

2. **Guías – Generar borrador**  
   - En nueva guía y editar guía, junto al campo Contenido.  
   - Genera procedimiento paso a paso y palabras clave a partir del título y categoría.

3. **Guías – Preguntar sobre una guía**  
   - En el detalle de cada guía, sección "¿Tienes dudas?".  
   - El usuario escribe una pregunta y la IA responde usando solo el contenido de esa guía.

### 11.2 Requisitos técnicos

- Variable de entorno `GEMINI_API_KEY` en Vercel (y en desarrollo en `.env.local`).
- Opcional: `GEMINI_MODEL` para cambiar el modelo (por defecto `gemini-3-flash-preview`).
- Las llamadas a Gemini se hacen desde rutas API en Next.js (`/api/ai/...`), sin exponer la clave en el frontend.

---

## PARTE 12: Seguridad y arquitectura

### 12.1 Flujo de datos

```
Usuario (navegador) 
  → Next.js en Vercel 
    → Supabase (PostgreSQL + Auth) 
  ← Respuestas
```

- **Vercel:** Hosting de la aplicación Next.js.
- **Supabase:** Base de datos, autenticación y políticas RLS.
- **Google Gemini:** Usado solo desde las rutas API del servidor.

### 12.2 Row Level Security (RLS)

- Las políticas RLS en PostgreSQL limitan qué filas puede ver/modificar cada usuario según su rol.
- Los roles se obtienen desde la tabla `empleados` vinculada a `auth.users`.

### 12.3 Variables de entorno en Vercel

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY` (para funciones de IA)
- En producción, `SUPABASE_SERVICE_ROLE_KEY` solo si se usan operaciones administrativas desde el servidor.

---

## PARTE 13: Orden sugerido para la demo

1. Abrir la URL de Vercel.
2. Iniciar sesión con un usuario de prueba.
3. Mostrar el Dashboard (estadísticas, alerta de stock, acciones rápidas).
4. Empleados: lista y crear empleado (si el rol lo permite).
5. Equipos: lista, detalle, filtros por rack/usuario.
6. Tickets: crear ticket, editar y usar "Sugerir con IA".
7. Reportes: resumen (si el rol tiene acceso).
8. Guías: lista, crear guía con "Generar con IA", abrir una guía y usar "Preguntar a la IA".
9. Cableado: lista de conexiones por rack.
10. Inventario: vista en uso vs en almacén y edición de stock.
11. Cerrar sesión.

---

## PARTE 14: Preguntas frecuentes durante la exposición

**P: ¿Dónde se aloja el código?**  
R: En un repositorio Git (por ejemplo, GitHub). Vercel se conecta al repositorio y despliega automáticamente en cada push.

**P: ¿Qué pasa si no hay internet?**  
R: El sistema no funciona sin conexión, porque depende de Supabase y, para la IA, de la API de Gemini.

**P: ¿Cómo se crean los usuarios?**  
R: Por registro público en Login o por creación desde Empleados por un Administrador/Gerente.

**P: ¿La IA siempre responde correctamente?**  
R: La IA da sugerencias que el usuario debe revisar. En guías, responde solo con el contenido de la guía; si no tiene la información, lo indica.

**P: ¿Cómo se actualiza el sistema en producción?**  
R: Con `git push` al repositorio. Vercel detecta el cambio y ejecuta un nuevo despliegue.

---

**Documento de apoyo para la exposición del Sistema de Gestión IT INN.**  
Versión 1.0 – Enero 2025
