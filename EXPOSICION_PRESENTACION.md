# 🎤 Guión de Exposición – Sistema de Gestión IT INN

> **Sistema integral para el Departamento de Redes y Sistemas del INN**  
> Presentación para proyecto de grado / defensa

---

## 📌 DURACIÓN ESTIMADA: 15–20 minutos

---

# SECCIÓN 1: Portada e introducción (≈1 min)

**Qué decir:**

> Buenas tardes/días. Hoy presento el **Sistema de Gestión de Incidencias e Inventario para el Departamento de Redes y Sistemas del INN**.
>
> Este sistema fue desarrollado para centralizar la gestión de equipos, incidencias y usuarios en un solo lugar, facilitando el trabajo diario del departamento de TI.

---

# SECCIÓN 2: El problema (≈2 min)

**Qué decir:**

> Los departamentos de redes y sistemas suelen tener varios problemas:
>
> - La información de equipos está dispersa en hojas de cálculo o papeles
> - No hay un registro claro de qué empleado tiene qué equipo
> - Las incidencias se reportan por WhatsApp o correo, sin seguimiento
> - Los técnicos no saben rápidamente qué rack revisar o cómo resetear un equipo
> - No hay reportes sobre tiempos de respuesta o estado del inventario

**Diapositiva sugerida:**

| Problema | Impacto |
|----------|---------|
| Información dispersa | Búsquedas lentas, errores |
| Sin registro de asignaciones | Equipos perdidos o duplicados |
| Incidencias sin seguimiento | Usuarios insatisfechos |
| Falta de procedimientos | Dependencia de personal clave |
| Sin reportes | Decisiones sin datos |

---

# SECCIÓN 3: Objetivo y solución (≈1–2 min)

**Objetivo general:**

> Desarrollar un sistema web integral que optimice la gestión de incidencias y el inventario de equipos del departamento de redes y sistemas del INN.

**Solución propuesta:**

> Una aplicación web centralizada que permite:
>
> - Registrar empleados con sus datos de conectividad (IP, rack, departamento)
> - Gestionar equipos y asignarlos a empleados
> - Crear y dar seguimiento a tickets de incidencias (conectividad, telefonía IP, cableado)
> - Organizar el cableado en racks (puerto, equipo, tipo de conexión)
> - Consultar una base de conocimiento con procedimientos
> - Generar reportes de incidencias e inventario

---

# SECCIÓN 4: Tecnologías (≈2 min)

**Qué decir:**

> El sistema está desarrollado con tecnologías actuales y escalables:

| Capa | Tecnología | Uso |
|------|------------|-----|
| **Frontend** | Next.js 14, React 18, TypeScript | Interfaz web y lógica de cliente |
| **Estilos** | Tailwind CSS | Diseño responsive y moderno |
| **Backend** | Supabase | Base de datos, autenticación y APIs |
| **Base de datos** | PostgreSQL | Datos relacionales con RLS |
| **Hosting** | Vercel (opcional) | Despliegue en la nube |

**Puntos a resaltar:**

- **Next.js** permite renderizado del lado del servidor y rutas dinámicas
- **Supabase** ofrece base de datos, auth y storage sin montar servidor propio
- **Row Level Security (RLS)** protege los datos según el rol del usuario

---

# SECCIÓN 5: Arquitectura del sistema (≈2 min)

**Qué decir:**

> La arquitectura es cliente–servidor:
>
> - El usuario accede desde el navegador
> - La aplicación Next.js se ejecuta en el cliente y en el servidor
> - Supabase proporciona la base de datos, autenticación y almacenamiento
> - No hay backend propio: usamos Supabase como Backend as a Service

**Diagrama simple (explicar en voz):**

```
Usuario → Navegador → Next.js (Vercel) → Supabase (BD + Auth + Storage)
```

---

# SECCIÓN 6: Módulos principales (≈5–6 min)

**Orden sugerido para la demostración:**

### 6.1 Autenticación y roles

> El sistema requiere inicio de sesión. Existen cuatro roles:
>
> - **Administrador** y **Gerente**: pueden gestionar empleados y crear cuentas
> - **Técnico**: puede gestionar equipos, tickets, cableado y guías
> - **Empleado**: puede crear tickets y consultar información

*(Mostrar login y cambio de vistas según rol si aplica.)*

---

### 6.2 Empleados

> Aquí se registran todos los empleados del INN con:
>
> - Datos personales y de contacto
> - Dirección IP, acceso a internet y llamadas
> - Rack y departamento
> - Rol en el sistema
>
> Los administradores pueden crear cuentas de acceso (email + contraseña) para que el empleado ingrese al sistema.

*(Mostrar lista de empleados, filtros y formulario de nuevo empleado.)*

---

### 6.3 Equipos

> Cada equipo es un conjunto de componentes (CPU, monitor, teclado, mouse). Se puede asignar a un empleado registrado.
>
> Incluye número de equipo, estado, ubicación, rack y departamento. Los componentes tienen marca, modelo y número de serie.

*(Mostrar lista de equipos, detalle y formulario de nuevo equipo.)*

---

### 6.4 Tickets (incidencias)

> Cualquier usuario puede abrir un ticket. Los tipos incluyen:
>
> - **Conectividad** – problemas de internet
> - **Telefonía IP** – problemas de teléfono
> - **Cableado Estructural** – instalación o cambios de cableado
> - Falla, Cambio, Mantenimiento, Consulta, Otro
>
> Cada ticket tiene prioridad (Baja, Media, Alta, Urgente) y estado (Abierto, En proceso, Resuelto, etc.).

*(Mostrar creación de ticket, estados y prioridades.)*

---

### 6.5 Cableado

> Se registran las conexiones en los racks: qué equipo está en qué puerto y qué tipo de conexión es (Red, Energía, VoIP).
>
> Esto permite a los técnicos localizar rápidamente la conexión de un equipo sin revisar físicamente el rack.

*(Mostrar vista por rack y formulario de nueva conexión.)*

---

### 6.6 Base de conocimiento (Guías)

> Los técnicos pueden consultar guías como:
>
> - Cómo resetear equipos
> - Qué rack revisar para problemas de conectividad
> - Procedimientos de telefonía IP o cableado
>
> Se organizan por categoría y son buscables.

*(Mostrar lista de guías y detalle de una guía.)*

---

### 6.7 Reportes

> El módulo de reportes muestra:
>
> - Resumen de incidencias (por tipo, estado, prioridad)
> - Tiempo promedio de resolución
> - Estado del inventario (equipos, empleados, componentes)
> - Últimos tickets

*(Mostrar página de reportes.)*

---

# SECCIÓN 7: Seguridad (≈1 min)

**Qué decir:**

> La seguridad se maneja en varios niveles:
>
> - **Autenticación**: solo usuarios registrados pueden entrar
> - **Roles**: permisos según rol (Admin, Gerente, Técnico, Empleado)
> - **Row Level Security**: la base de datos aplica las reglas a nivel de fila
> - **Variables de entorno**: credenciales no se guardan en el código
> - **HTTPS**: comunicación cifrada en producción

---

# SECCIÓN 8: Demostración en vivo (≈3–4 min)

**Orden sugerido:**

1. Iniciar sesión
2. Mostrar Dashboard
3. Ir a **Empleados** → lista y filtros
4. Ir a **Equipos** → detalle de un equipo con componentes
5. Ir a **Tickets** → crear un ticket de ejemplo
6. Ir a **Reportes** → resumen de incidencias
7. Ir a **Guías** → abrir una guía

**Consejos:**

- Ten la aplicación abierta y pre-cargada
- Usa datos de ejemplo coherentes
- Si algo falla, explica qué harías para corregirlo

---

# SECCIÓN 9: Conclusiones (≈1–2 min)

**Qué decir:**

> Este sistema cubre los requerimientos del modelo de negocios del departamento:
>
> - Gestión de empleados y asignación de equipos
> - Registro y seguimiento de incidencias
> - Tipos de ticket específicos (Conectividad, Telefonía IP, Cableado)
> - Organización del cableado en racks
> - Base de conocimiento para técnicos
> - Reportes de incidencias e inventario
> - Roles y permisos diferenciados
> - Creación de cuentas por parte de administradores
>
> Se utilizaron tecnologías actuales y escalables, con una arquitectura que facilita el mantenimiento y la evolución futura.

---

# SECCIÓN 10: Trabajo futuro (≈1 min)

**Mejoras posibles:**

- Notificaciones por email al cambiar estado de un ticket
- Exportación de reportes a Excel/PDF
- Códigos QR en equipos para consulta rápida
- Integración con sistemas de monitoreo de red
- App móvil para técnicos en campo

---

# SECCIÓN 11: Cierre y preguntas (≈1 min)

**Qué decir:**

> Con esto finalizo la presentación. Quedo atento a sus preguntas y comentarios.
>
> El código está disponible en GitHub y existe documentación técnica y de usuario en el repositorio.

---

## 📋 Checklist antes de presentar

- [ ] Tener la aplicación funcionando (local o en producción)
- [ ] Usuarios de prueba con diferentes roles
- [ ] Datos de ejemplo (empleados, equipos, tickets)
- [ ] Navegador en pantalla completa o modo presentación
- [ ] Probar conexión a internet si la demo es en línea

---

## 📁 Documentos de apoyo

- `GUIA_USUARIOS.md` – Uso del sistema
- `ADMIN_CREAR_USUARIOS.md` – Gestión de usuarios (Admin)
- `README.md` – Instalación y configuración
- `PASOS_IMPLEMENTACION.md` – Detalle técnico de la implementación

---

**¡Éxito en tu presentación.**
