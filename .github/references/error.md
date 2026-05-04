# Gestión de errores: backend y frontend

## Principios generales

- El backend serializa todos los errores como `ExceptionBean { status: int, message: string, timestamp: long }`.
- El frontend recibe el error en `err.error` (objeto `ExceptionBean`) o en `err.status` (código HTTP).
- Los errores de red que impiden la conexión devuelven `err.status === 0` (sin respuesta del servidor).
- El `JWTInterceptor` intercepta globalmente los códigos 401 y 403.
- El `LoginComponent` gestiona los errores específicos del login antes de que lleguen al interceptor (el interceptor propaga `throwError`, por lo que ambos pueden actuar).

---

## Backend: excepciones y códigos HTTP

### HTTP 401 — Token JWT inválido o expirado

- Lanzado directamente por `JwtFilter` (no pasa por `ApplicationExceptionHandler`).
- Se produce cuando el token `Authorization: Bearer <token>` no es válido o ha expirado.
- La respuesta NO lleva cuerpo `ExceptionBean`; solo el código de estado.
- Escenario típico: el usuario tenía sesión activa y el token caducó en el servidor.

### HTTP 403 — Acceso denegado (UnauthorizedException)

- Lanzado por `UnauthorizedException` → mapeado a `403 Forbidden` en `ApplicationExceptionHandler`.
- Devuelve `ExceptionBean` con `status=403` y el mensaje descriptivo.
- Mensajes posibles:
  - `"Usuario o contraseña incorrectos"` — credenciales de login incorrectas.
  - `"Acceso denegado: solo puede operar sobre su propio club"` — `checkSameClub()` fallido.
  - `"Acceso denegado: no tiene permisos en esta operación"` — `denyEquipoAdmin()` o `denyUsuario()`.
  - `"Acceso denegado: esta operación requiere permisos de administrador"` — `requireAdmin()`.
  - `"Acceso denegado: solo los administradores pueden realizar operaciones de llenado o vaciado."` — `AdminCrudGuardAspect`.
  - Mensajes específicos de recurso en servicios (p.ej. comentarios, cuotas, pagos).
- Nota: el login fallido devuelve 403 (no 401), porque `SessionService.login()` lanza `UnauthorizedException`.

### HTTP 404 — Recurso no encontrado (ResourceNotFoundException)

- Lanzado por `ResourceNotFoundException` → mapeado a `404 Not Found`.
- Devuelve `ExceptionBean` con `status=404` y el mensaje de qué recurso no se encontró.
- Escenario típico: `findById()` sin resultado, acceso a entidad por ID inexistente.

### HTTP 304 — No modificado (ResourceNotModifiedException)

- Lanzado por `ResourceNotModifiedException` → mapeado a `304 Not Modified`.
- Devuelve `ExceptionBean` con `status=304`.
- Escenario típico: operación de actualización que no cambia ningún dato.

### HTTP 503 — Base de datos inaccesible (DataAccessException)

- Lanzado cuando Spring/JPA/HikariCP no pueden obtener o mantener una conexión con la base de datos.
- Capturado por `@ExceptionHandler(DataAccessException.class)` en `ApplicationExceptionHandler`, mapeado a `503 Service Unavailable`.
- Devuelve `ExceptionBean` con `status=503` y `message="Backend can't access to database"`.
- El handler de `DataAccessException` tiene prioridad sobre el de `RuntimeException` porque es más específico.
- Cubre: `CannotGetJdbcConnectionException` (HikariCP sin conexión), `JpaSystemException`, `DataIntegrityViolationException`, y cualquier otro hijo de `DataAccessException`.

### HTTP 500 — Error interno del servidor (RuntimeException / GeneralException)

- Tanto `RuntimeException` como `GeneralException` se mapean a `500 Internal Server Error`.
- Devuelve `ExceptionBean` con `status=500` y el mensaje de la excepción.
- Escenarios típicos: NullPointerException, errores de lógica no controlados.
- Ya NO incluye errores de BD (esos producen 503).

---

## Errores de infraestructura (no controlados por ApplicationExceptionHandler)

### Backend no disponible (ERR_CONNECTION_REFUSED)

- Se produce cuando el servidor Spring Boot no está en marcha.
- En Angular, `err.status === 0` y `err.error instanceof ProgressEvent` o `err.error` es nulo.
- No hay `ExceptionBean` porque no hay servidor que responda.
- Mensaje que debe mostrarse al usuario: `"Backend not alive"`.

### Backend disponible pero base de datos inaccesible

- El servidor Spring Boot arranca pero no puede conectar a MySQL.
- Las peticiones llegan al backend y devuelven **HTTP 503** con `ExceptionBean.message = "Backend can't access to database"`.
- **IMPORTANTE**: `spring.datasource.hikari.connection-timeout` debe ser corto (3000 ms). Con el valor por defecto (300000 ms = 5 min), cada hilo de Tomcat bloquea hasta 5 minutos esperando conexión; si llegan peticiones concurrentes, el thread pool se agota y Tomcat deja de aceptar nuevas conexiones TCP → Angular recibe `status: 0` en lugar de `status: 503`.
- `err.status === 503` en Angular.
- Capturado globalmente por el `JWTInterceptor` con flag de deduplicación `dbDownHandled`.
- Mensaje que debe mostrarse al usuario: `"Backend can't access to database"`.

### Error de autenticación (login fallido)

- El backend devuelve HTTP 403 con `ExceptionBean.message = "Usuario o contraseña incorrectos"`.
- `err.status === 403` en el `LoginComponent`.
- Mensaje que debe mostrarse al usuario: `"Auth error"`.
- Nota: distinguir este caso del 403 genérico (acceso denegado a recurso ya autenticado) usando el contexto: si el token no existía antes de la petición, es un error de login.

---

## Frontend: gestión de errores

### JWTInterceptor (`jwt.interceptor.ts`)

- Intercepta todas las peticiones HTTP globalmente.
- `err.status === 401` con token presente → sesión expirada:
  - Limpia el token (`oSessionService.clearToken()`).
  - Muestra notificación `warning`: `"Lo siento, la sesión ha expirado."`.
  - Redirige a `/login`.
  - Usa flag `sessionExpiredHandled` para evitar notificaciones duplicadas cuando hay múltiples peticiones concurrentes.
- `err.status === 403` → acceso denegado:
  - Muestra notificación `warning`: `"No tienes permiso para acceder a este recurso."`.
  - Redirige a `/`.
  - Ojo: el login fallido también devuelve 403, pero el `LoginComponent` lo maneja antes mediante su propio `error` callback; el interceptor también lo recibe vía `throwError`.
- Siempre hace `throwError(() => err)` para propagar el error a los suscriptores.

### LoginComponent (`login.component.ts`)

- `err.status === 0` → backend no disponible:
  - El interceptor ya muestra la notificación global; solo actualiza el error inline: `"Backend not alive"`.
- `err.status === 503` → base de datos inaccesible:
  - El interceptor ya muestra la notificación global; solo actualiza el error inline: `"Backend can't access to database"`.
- `err.status === 403` → credenciales incorrectas:
  - Mostrar: `"Auth error"`.
- Para otros errores: mostrar `err.error?.message || err.statusText || 'Login failed'`.

### NotificacionService (`service/notificacion.ts`)

- `success(mensaje, titulo?, opts?)` — autoCierre por defecto: 2500 ms.
- `error(mensaje, titulo?, opts?)` — autoCierre por defecto: 0 (no cierra solo, requiere acción del usuario).
- `warning(mensaje, titulo?, opts?)` — autoCierre por defecto: 2500 ms.
- `info(mensaje, titulo?, opts?)` — autoCierre por defecto: 2500 ms.
- `autoCierre: 0` significa que el modal no se cierra automáticamente.

### ModalComponent y NotificacionComponent

- `ModalComponent` reenvía cada propiedad de `data()` como `@Input()` del componente contenido via `contentRef.setInput(key, value)`.
- `NotificacionComponent` usa `inject(MODAL_DATA)` para leer los datos; los `input()` signals (`tipo`, `titulo`, `mensaje`) son para compatibilidad.
- `autoCierre` se lee desde `this.data.autoCierre`, NO desde un `input()` signal, por eso no lanza `NG0303` para ese campo.
- Si se declara una propiedad en `data` que no existe como `input()` en el componente contenido, `setInput()` lanza error `NG0303`. El bloque `try/catch` en `ModalComponent` lo suprime silenciosamente.

---

## ExceptionBean: estructura de respuesta de error

```json
{
  "status": 403,
  "message": "Usuario o contraseña incorrectos",
  "timestamp": 1714493200000
}
```

- `status`: código HTTP duplicado en el cuerpo (entero).
- `message`: mensaje legible por humanos.
- `timestamp`: epoch en milisegundos del momento del error.
- En el frontend se accede como `err.error.status`, `err.error.message`, `err.error.timestamp`.

---

## Tabla resumen de errores

- `status === 0` / `ERR_CONNECTION_REFUSED` → backend no arrancado → mostrar "Backend not alive"
- `status === 401` → token JWT inválido/expirado → sesión expirada → redirigir a login
- `status === 403` (sin token previo, en login) → credenciales incorrectas → mostrar "Auth error"
- `status === 403` (con token, fuera del login) → acceso denegado → mostrar mensaje de permiso
- `status === 404` → recurso no encontrado → mostrar "No encontrado"
- `status === 304` → sin cambios → ignorar o notificar "No se realizaron cambios"
- `status === 503` → base de datos inaccesible → mostrar "Backend can't access to database"
- `status === 500` → error interno del servidor (no de BD) → mostrar el mensaje o genérico
