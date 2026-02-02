# 📖 Guía de Usuario - Sistema de Inventario IT INN

> Sistema de gestión de incidencias e inventario para el Departamento de Redes y Sistemas del INN

---

## Índice

1. [Acceso al sistema](#1-acceso-al-sistema)
2. [Panel principal](#2-panel-principal)
3. [Empleados](#3-empleados)
4. [Equipos](#4-equipos)
5. [Tickets (incidencias)](#5-tickets-incidencias)
6. [Cableado](#6-cableado)
7. [Reportes](#7-reportes)
8. [Base de conocimiento (guías)](#8-base-de-conocimiento-guías)
9. [Roles y permisos](#9-roles-y-permisos)
10. [Casos de uso frecuentes](#10-casos-de-uso-frecuentes)

---

## 1. Acceso al sistema

### Iniciar sesión

1. Abre el sistema en tu navegador
2. Ingresa tu **correo electrónico** y **contraseña**
3. Haz clic en **Iniciar sesión**
4. Serás redirigido al panel principal

### Primera vez (registro)

1. Haz clic en **"¿No tienes cuenta? Regístrate"**
2. Ingresa tu email y contraseña
3. Revisa tu correo y confirma tu cuenta
4. Vuelve a la aplicación e inicia sesión

> **Nota:** Si no ves el menú completo, es posible que debas solicitar a un Administrador que vincule tu cuenta con un perfil de empleado y asigne tu rol.

---

## 2. Panel principal

El **Dashboard** muestra:

- **Estadísticas rápidas:** Total de equipos, operativos, con usuario asignado, disponibles
- **Acciones rápidas:** Enlaces para registrar empleados, agregar equipos, ver reportes y guías
- **Estado del sistema**

---

## 3. Empleados

### ¿Quién puede gestionar empleados?

Solo **Administradores** y **Gerentes** pueden crear, editar o eliminar empleados.

### Ver lista de empleados

1. Menú lateral → **Empleados**
2. Usa los filtros: **Buscar**, **Departamento**, **Rol**, **Activo**
3. Haz clic en **Ver** para ver el detalle de un empleado

### Registrar nuevo empleado (Admin/Gerente)

1. **Empleados** → **➕ Nuevo Empleado**
2. Completa:
   - Nombre completo *
   - Cargo
   - Email, teléfono
   - Dirección IP
   - Acceso a internet / llamadas
   - Rack, departamento
   - Rol en el sistema
3. **Opcional:** Marca "Crear cuenta de acceso" e ingresa una contraseña para que el empleado pueda ingresar al sistema con su email
4. Guardar

### Crear cuenta o cambiar contraseña (Admin/Gerente)

1. **Empleados** → Editar un empleado
2. Si no tiene cuenta: marca "Crear cuenta de acceso ahora", ingresa contraseña y clic en **Crear cuenta ahora**
3. Si ya tiene cuenta: ingresa nueva contraseña y clic en **Cambiar contraseña**

### Editar empleado

1. En la lista, clic en **Editar**
2. Modifica los datos necesarios
3. Guardar

---

## 4. Equipos

### Ver equipos

1. Menú → **Equipos**
2. **Búsqueda rápida:** por usuario o por rack
3. **Filtros:** Estado, Usuario, Rack, Departamento, Marca y Modelo de componentes

### Crear nuevo equipo

1. **Equipos** → **➕ Nuevo Equipo**
2. **Información del equipo:**
   - Número de equipo *
   - Empleado asignado (selecciona de la lista o escribe nombre manual)
   - Estado, ubicación, departamento, rack
3. **Componentes:** CPU, Monitor, Teclado, Mouse (marca, modelo, número de serie)
4. Guardar

### Ver detalle de un equipo

- Clic en **Ver** → se muestra la información completa, componentes y conexiones en racks

---

## 5. Tickets (incidencias)

### Crear un ticket (todos los usuarios)

1. Menú → **Tickets**
2. **➕ Nuevo Ticket**
3. Completa:
   - Usuario solicitante
   - Equipo (opcional)
   - **Tipo:** Conectividad, Telefonía IP, Cableado Estructural, Falla, Mantenimiento, etc.
   - Prioridad: Baja, Media, Alta, Urgente
   - Título y descripción
4. Guardar

### Gestionar tickets (Técnicos, Gerentes, Administradores)

1. En la lista, clic en **Ver** o **Editar**
2. Puedes:
   - Cambiar **estado** (Abierto → En Proceso → Resuelto/Cerrado)
   - **Asignar** a un técnico
   - Registrar **solución**
   - Agregar **observaciones**

### Estados de un ticket

| Estado     | Significado                    |
|-----------|---------------------------------|
| Abierto   | Recién creado, pendiente        |
| En Proceso| Alguien lo está atendiendo      |
| Resuelto  | Problema solucionado            |
| Cerrado   | Ticket finalizado               |
| Cancelado | No se atendió o no aplica       |

---

## 6. Cableado

Registro de conexiones de equipos en racks (puertos de red, energía, VoIP).

### Ver cableado

1. Menú → **Cableado**
2. Las conexiones se muestran **agrupadas por rack**
3. Filtra por **Rack** o **Tipo** (Red, Energía, VoIP)

### Registrar nueva conexión

1. **Cableado** → **➕ Nueva Conexión**
2. Ingresa:
   - Rack (ej: Rack-01, Switch-01)
   - Puerto (ej: Puerto 5, 1/0/24)
   - Equipo conectado
   - Tipo de conexión
3. Guardar

---

## 7. Reportes

1. Menú → **Reportes**

### Contenido

- **Incidencias:** Total de tickets, abiertos, en proceso, resueltos. Desglose por tipo y prioridad.
- **Tiempos de respuesta:** Promedio de resolución y tickets resueltos en los últimos 30 días.
- **Inventario:** Equipos, empleados, componentes.
- **Últimos tickets:** Lista de los más recientes con enlaces.

---

## 8. Base de conocimiento (guías)

Guías para que los técnicos resuelvan problemas de forma remota.

### Ver guías

1. Menú → **Guías**
2. Busca por título, contenido o palabras clave
3. Filtra por **Categoría** (Resetear equipo, Revisar rack, Conectividad, etc.)
4. Clic en **Ver** para leer el procedimiento completo

### Crear o editar guías (solo staff)

1. **Guías** → **➕ Nueva Guía**
2. Título, categoría, contenido paso a paso
3. Palabras clave para facilitar la búsqueda
4. Guardar

---

## 9. Roles y permisos

| Rol           | Ver todo | Crear tickets | Gestionar equipos, tickets, guías, cableado | Gestionar empleados |
|---------------|----------|---------------|---------------------------------------------|---------------------|
| Administrador | ✅       | ✅            | ✅                                           | ✅                  |
| Gerente       | ✅       | ✅            | ✅                                           | ✅                  |
| Técnico       | ✅       | ✅            | ✅                                           | ❌                  |
| Empleado      | ✅       | ✅            | ❌                                           | ❌                  |

- **Empleado:** Puede ver la información y **crear tickets** para solicitar ayuda.
- **Técnico, Gerente, Administrador:** Acceso completo según la tabla.

---

## 10. Casos de uso frecuentes

### "¿Dónde está conectado el equipo de Juan?"

1. **Equipos** → Búsqueda rápida, escribe "Juan"
2. Revisa el **Rack** asignado
3. Opcional: **Cableado** → filtra por ese rack para ver puertos y conexiones

### "Juan no tiene internet"

1. **Equipos** → busca "Juan"
2. Ver **rack** y **equipo** asignado
3. **Cableado** → filtra por ese rack para localizar la conexión
4. Ir físicamente al rack y revisar

### "Necesito reportar un problema"

1. **Tickets** → **➕ Nuevo Ticket**
2. Tipo: **Conectividad**, **Telefonía IP** o el que corresponda
3. Describe el problema
4. Guardar

### "¿Cómo reseteo un equipo VIT?"

1. **Guías** → buscar "VIT" o "reset"
2. O filtrar por categoría **Resetear equipo**
3. Seguir los pasos indicados

### "¿Quiénes tienen el modelo de teclado X?"

1. **Equipos** → Filtros avanzados
2. **Modelo Componente** → selecciona el modelo
3. Se muestra la lista de equipos (y usuarios) con ese componente

### "¿Qué equipos están en el Rack-02?"

1. **Equipos** → Búsqueda rápida "Rack-02"
2. O **Cableado** → filtra por Rack-02

---

## Soporte

Para dudas o problemas con el sistema, contacta al Departamento de Redes y Sistemas del INN.

---

**Sistema desarrollado para el Departamento de Redes y Sistemas del INN - Alianza UNEXCA**
