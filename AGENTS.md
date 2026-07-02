# Reference Guide

## Description of the Gesportín project

Gesportín es una aplicación de gestión deportiva diseñada para optimizar la administración de clubes y organizaciones deportivas.

Gesportín tiene como objetivo mejorar la eficiencia de la gestión deportiva, facilitando la colaboración y manteniendo informados a los miembros de los clubes sobre sus clubes.

Gesportín proporciona una plataforma integral para gestionar diversos aspectos de las actividades deportivas:

- gestión de clubes,
- la gestión de miembros de los clubes: presidente, secretario, entrenador, jugador, etc.
- gestión de pagos y cuotas de los miembros de los clubes
- gestión de eventos deportivos: programación y seguimiento de partidos
- comunicación de noticias e interacción informativa con los miembros del club
- venta a nivel de club de productos relacionados con el deporte, como equipamiento deportivo, ropa deportiva, etc.

La aplicación Gesportín está construida utilizando una tecnología moderna, que incluye:

- una base de datos relacional (MySQL) para almacenar y gestionar los datos de la aplicación, cuyo archivo de creación está situado en database.sql,
- una API de backend desarrollada en java con Spring Boot, que accede a la base de datos relacional para almacenar y gestionar los datos de la aplicación, situada en el directorio /gesportin,
- una interfaz de usuario frontend desarrollada en Angular y typescript, situada en el directorio /frontsportin.

### Compilación y ejecución del backend

Para compilar el backend, es necesario tener instalado Java y Maven. Luego, se puede ejecutar el siguiente comando en la terminal desde el directorio raíz del proyecto:

```bash
mvn clean install
```

Para ejecutar el backend, se puede ejecutar el siguiente comando en la terminal desde el directorio raíz del proyecto:

```bash
mvn spring-boot:run
```

El punto de entrada (main) para ejecutar el backend es la clase `GesportinApplication` situada en /gesportin/src/main/java/net/ausiasmarch/gesportin/GesportinApplication.java

NOTA: Recuerda que tras clonar el proyecto, es necesario ejecutar `mvn clean install` en el directorio del backend para instalar las dependencias necesarias antes de compilarlo.

Por defecto el backend se ejecuta en el puerto 8080, Según se especifica en el fichero application.properties, situado en /gesportin/src/main/resources/application.properties, modificando la propiedad `server.port`.

### Compilación y ejecución del frontend

Para compilar el frontend, es necesario tener instalado Node.js y Angular CLI. Luego, se puede ejecutar el siguiente comando en la terminal desde el directorio raíz del proyecto:

```bash
ng build
```

Para ejecutar el frontend, se puede ejecutar el siguiente comando en la terminal desde el directorio raíz del proyecto:

```bash
ng serve
```

NOTA: Recuerda que tras clonar el proyecto, es necesario ejecutar `npm install` en el directorio del frontend para instalar las dependencias necesarias antes de compilarlo.

Por defecto el frontend se ejecuta en el puerto 4200, Según se especifica en el fichero angular.json, situado en /frontsportin/angular.json, en la propiedad `serve.options.port`.

### Entorno de ejecución de la base de datos

Para ejecutar la base de datos, se usa MySQL. Normalmente la base de datos se ejecuta en un contenedor Docker, que se puede encontrar en los siguientes directorios, dependiendo de las preferencias de cada desarrollador:
- ~/docker-compose-lamp-master
- ~/Docker/docker-compose-lamp-master
Dentro de estos directorios hay un fichero .env y un fichero docker-compose.yml que se puede ejecutar con el siguiente comando en la terminal:

```bash
docker-compose up -d
```

Normalmente la base de datos se ejecuta en el puerto 3306, con el nombre de usuario "root" y la contraseña "tiger", según se especifica en el fichero .env, modificando las variables `MYSQL_ROOT_PASSWORD` y `HOST_MACHINE_MYSQL_PORT`.

El nombre de la base de datos es "gesportin".

### Security

En todas las modificaciones y adiciones de código, debes garantizar que el proyecto Gesportín implemente medidas de seguridad efectivas para proteger los datos y garantizar la integridad de los datos de la aplicación.

El proyecto usa tokens JWT para la autenticación y autorización de usuarios. Es importante asegurarse de que los tokens JWT se generen y validen correctamente, y que se implementen medidas de seguridad adecuadas para proteger los tokens JWT contra ataques como el robo de tokens o la manipulación de tokens.

Asmismo, es importante implementar medidas de seguridad adecuadas para garantizar la integridad de los datos de la aplicación. Esto incluye:
* la implementación de validaciones de entrada para evitar ataques de inyección de SQL o ataques de inyección de código, sobretodo en el servidor, pero tambien en el frontend, para evitar que los usuarios puedan introducir datos maliciosos que puedan comprometer la seguridad de la aplicación,
* el cumplimineto de restricciones de integridad referencial para asegurar que los datos estén relacionados correctamente
* la implementación de permisos adecuados para garantizar que los usuarios solo puedan acceder a los datos y funcionalidades que les correspondan según su tipo de usuario (tipousuario id=1,2,3).

### Shared files 

En las adiciones y modificaciones del código NO debes tocar los ficheros compartidos de entorno servidor y entorno cliente ya que estos ficheros son utilizados por el equipo de desarrollo para configurar el entorno de ejecución del backend y del frontend, y cualquier cambio en estos ficheros podría afectar a todos los desarrolladores. 

Cuando desees modificar la configuración del entorno de ejecución, debes comunicarlo al equipo de desarrollo para tomar una decisión conjunta sobre cómo proceder. 

### Git & Github workflow

El flujo de trabajo de Git y Github debes dejarlo en manos de los desarrolladores.

## Backend

El backend sigue una arquitectura en capas típica de **Spring Boot**, con separación clara de responsabilidades. A continuación se describe cada capa y su finalidad:

---

### 1. `entity/` — Capa de Entidad (Modelo de Dominio)

**Ficheros**: UsuarioEntity.java, `ClubEntity.java`, `EquipoEntity.java`, etc.

**Finalidad**: Representar las tablas de la base de datos MySQL como objetos Java (ORM con JPA/Hibernate). Cada clase anotada con `@Entity` y `@Table` mapea directamente a una tabla. Definen:

- La estructura de datos (columnas, claves primarias con `@Id`, claves foráneas con `@ManyToOne`)
- Validaciones básicas de datos (`@NotBlank`, `@NotNull`)
- Formato de serialización JSON (`@JsonFormat`)
- Relaciones entre entidades (p.ej., `UsuarioEntity` → `@ManyToOne ClubEntity`)

---

### 2. `repository/` — Capa de Acceso a Datos (DAO)

**Ficheros**: UsuarioRepository.java, `ClubRepository.java`, etc. (23 repositorios, una interfaz por entidad)

**Finalidad**: Abstraer el acceso a la base de datos mediante **Spring Data JPA**. Cada interfaz extiende `JpaRepository<Entity, Long>`, lo que proporciona operaciones CRUD automáticas (`findAll`, `findById`, `save`, `delete`). Además, define:

- **Consultas personalizadas** mediante convención de nombres (`findByNombreContainingIgnoreCase`, `findByClubId`)
- **Consultas JPQL** con `@Query` para conteos (p.ej., `countComentariosByUsuarioId`), que alimentan los contadores del DTO
- **Consultas nativas** con `@Query(nativeQuery = true)` para operaciones complejas o específicas de MySQL

---

### 3. `dto/` — Capa de Objetos de Transferencia de Datos

**Ficheros**: UsuarioDTO.java, `ClubDTO.java`, etc. (22 DTOs)

**Finalidad**: Desacoplar la entidad interna (JPA) de lo que se expone al cliente. Los DTOs **extienden** la entidad correspondiente y añaden **campos calculados (contadores)**:

- `UsuarioDTO` añade: `comentarios`, `puntuaciones`, `comentarioarts`, `carritos`, `facturas`, `equiposentrenados`, `jugadores`
- Las colecciones `@OneToMany` **no se serializan** en la API; en su lugar se exponen como **enteros** que cuentan el número de elementos relacionados

Esto evita exponer la estructura interna de la base de datos y reduce el tamaño de las respuestas JSON.

---

### 4. `dtoconverter/` — Capa de Conversión Entity ↔ DTO

**Ficheros**: UsuarioConverter.java, `ClubConverter.java`, etc. (22 converters)

**Finalidad**: Transformar entidades JPA en DTOs. Cada converter es un `@Component` de Spring que:

- Recibe un `Entity` y devuelve un `DTO` con los campos calculados poblados
- Maneja la conversión de páginas (`Page<Entity>` → `Page<DTO>`)
- Usa los repositorios para ejecutar las queries de conteo necesarias

---

### 5. `service/` — Capa de Lógica de Negocio

**Ficheros**: UsuarioService.java, `ClubService.java`, `SessionService.java`, `JWTService.java`, `AleatorioService.java`, `SeedService.java`, etc. (27 servicios)

**Finalidad**: Contiene **toda la lógica de negocio** de la aplicación:

- **CRUD con reglas de negocio**: `get`, `getPage`, `create`, `update`, `delete`
- **Autorización y control de acceso**: comprobaciones de permisos basadas en el tipo de usuario (`isAdmin()`, `isEquipoAdmin()`, `isUsuario()`), validación de pertenencia al mismo club (`checkSameClub()`)
- **Autenticación JWT**: `SessionService` gestiona login/logout; `JWTService` genera y valida tokens
- **Generación de datos**: `AleatorioService` y `SeedService` para poblar la BD con datos de prueba (`fill`/`empty`)
- Cada `create`/`update` fuerza las restricciones de integridad referencial (p.ej., un equipo-admin solo puede crear usuarios de tipo "usuario" para su propio club)

Es la capa más importante: **orquesta** repositorios, converters, y el servicio de sesión.

---

### 6. `api/` — Capa de Controladores REST

**Ficheros**: UsuarioApi.java, `ClubApi.java`, `SessionApi.java`, etc. (25 controladores)

**Finalidad**: Exponer los **endpoints HTTP REST** al frontend. Cada controlador es un `@RestController` con `@RequestMapping`. Sus responsabilidades son:

- Mapear rutas HTTP a métodos del service (`@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping`)
- Recibir parámetros de query (`@RequestParam`), path (`@PathVariable`), body (`@RequestBody`), y archivos (`@RequestPart` para imágenes)
- Configurar paginación (`@PageableDefault(size = 1000)`)
- **No contiene lógica de negocio**: delega inmediatamente al `Service` correspondiente

---

### 7. `filter/` — Capa de Filtros y Aspectos

**Ficheros**: JwtFilter.java, AdminCrudGuardAspect.java

**Finalidad**:

- **`JwtFilter`**: Intercepta **todas** las peticiones HTTP. Extrae el token JWT del header `Authorization: Bearer <token>`, lo valida mediante `JWTService`, e inyecta el `username` como atributo del request. También añade headers CORS. Protege el backend de accesos no autenticados.
- **`AdminCrudGuardAspect`**: Un **AspectJ `@Aspect`** que intercepta las operaciones `fill()` y `empty()` de todos los servicios y las bloquea si el usuario no es administrador. Implementa control de acceso transversal sin modificar cada servicio individualmente.

---

### 8. `exception/` — Capa de Manejo de Excepciones

**Ficheros**: ApplicationExceptionHandler.java, `ResourceNotFoundException.java`, `UnauthorizedException.java`, `ResourceNotAllowedException.java`, `ResourceNotModifiedException.java`, `GeneralException.java`

**Finalidad**:

- **Excepciones personalizadas** que representan distintos escenarios de error (404, 403, 304, 500)
- **`ApplicationExceptionHandler`** (`@ControllerAdvice`): Captura todas las excepciones lanzadas desde los servicios y las traduce a respuestas HTTP con código de estado y un `ExceptionBean` (JSON con `code`, `message`, `timestamp`)

---

### 9. `bean/` — Beans Auxiliares

**Ficheros**: `TokenBean.java`, `SessionBean.java`, `ExceptionBean.java`

**Finalidad**: Clases POJO simples usadas como contenedores de datos para:

- `TokenBean`: encapsula el token JWT en la respuesta de login
- `ExceptionBean`: estructura estándar de respuesta de error (`code`, `message`, `timestamp`)
- `SessionBean`: datos de la sesión activa

---

### 10. `util/` — Utilidades

**Fichero**: `ImageValidator.java`

**Finalidad**: Contiene helpers transversales como la validación de imágenes (`isValidPicture`) usada en los servicios que manejan upload de imágenes (usuarios, artículos).

---

## Descripción Funcional del Frontend (Angular)

El frontend de Gesportín está construido con **Angular 22+**: usa obligatoriamente standalone components, signals, zoneless change detection y TypeScript.

---

### 1. Arquitectura General

El frontend sigue una estructura de **dos niveles de componentes por entidad**:

```
page/           →  Shell/página (ruteable, mínimo código)
component/      →  Componente funcional (no ruteable, con toda la lógica y plantilla, reusables en otros componentes)
```

Cada entidad del dominio (usuario, equipo, partido, etc.) tiene dos directorios:
- **`page/entidad/`**: Componentes **ruteables** por rol (`admin/`, `teamadmin/`, `usuario/`). Son shells ligeros que importan el componente funcional.
- **`component/entidad/`**: Componentes **funcionales** con toda la lógica: `plist/`, `detail/`, `form/`, `finder/`.

---

### 2. Capa `page/` — Páginas Ruteables (Shell)

**Estructura**: `page/entidad/{rol}/{accion}/`
Cada subdirectorio contiene plist.ts, `plist.html`, `plist.css` (o `view`, `new`, `edit`, `delete`).

**Roles**:
| Rol         | Directorio          | Significado                          |
| ----------- | ------------------- | ------------------------------------ |
| `admin`     | `page/*/admin/`     | Administrador global (tipousuario=1) |
| `teamadmin` | `page/*/teamadmin/` | Admin de club (tipousuario=2)        |
| `usuario`   | `page/*/usuario/`   | Usuario normal (tipousuario=3)       |

**Patrón CRUD**: `plist` (listado paginado), `view` (detalle), `new` (crear), `edit` (editar), `delete` (borrar).

**Ejemplo** — `UsuarioAdminPlistPage`:
```typescript
// page/usuario/admin/plist/plist.ts
@Component({
  selector: 'app-usuario-admin-plist-page',
  imports: [UsuarioAdminPlist],  // importa el componente funcional
  templateUrl: './plist.html',
})
export class UsuarioAdminPlistPage {
  constructor(private route: ActivatedRoute) {} // solo inyecta la ruta
}
```

---

### 3. Capa `component/` — Componentes Funcionales

Aquí reside **toda la lógica real**. Se organiza por entidad y contiene:

| Subdirectorio | Propósito                                                           |
| ------------- | ------------------------------------------------------------------- |
| `plist/`      | Listado paginado con búsqueda, ordenación, RPP, acciones            |
| `detail/`     | Vista de detalle de un registro                                     |
| `form/`       | Formulario compartido para crear/editar                             |
| `finder/`     | Selector/buscador de entidades relacionadas (p.ej., elegir un club) |

---

### 4. `service/` — Servicios de Acceso a la API

**Ficheros**: `usuarioService.ts`, equipo.ts, `club.ts`, session.ts, etc. (~30 servicios)

Cada servicio encapsula las llamadas HTTP al backend. Patrón típico:

```typescript
@Injectable({ providedIn: 'root' })
export class EquipoService {
  getPage(page, rpp, order, direction, nombre, id_categoria, ...): Observable<IPage<IEquipo>>
  get(id: number): Observable<IEquipo>
  create(equipo): Observable<number>
  update(equipo): Observable<number>
  delete(id: number): Observable<number>
}
```

**Servicios clave**:
| Servicio                  | Función                                                           |
| ------------------------- | ----------------------------------------------------------------- |
| `SessionService`          | Gestión de sesión JWT, roles (`isAdmin`, `isClubAdmin`, `isUser`) |
| `SecurityService`         | Seguridad y autorización                                          |
| `NotificacionService`     | Notificaciones toast al usuario                                   |
| `ImageUploadService`      | Subida de imágenes                                                |
| `PayloadSanitizerService` | Limpieza de payloads antes de enviar al backend                   |
| `AdminDataToolsService`   | Fill/empty para datos de prueba                                   |

---

### 5. `model/` — Interfaces TypeScript

**Ficheros**: usuario.ts, equipo.ts, `club.ts`, plist.ts, `token.ts`, etc.

Un fichero para cada entidad del dominio.

Definen la forma de los datos que vienen del backend. Todos son **interfaces TypeScript** (no clases):

---

### 6. `guards/` — Guardianes de Rutas

| Guard                 | Función                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| `AuthGuard`           | Redirige a `/login` si no hay sesión activa                                                              |
| `AdminGuard`          | Solo permite tipousuario=1. También permite teamadmins si la ruta tiene `data: { allowClubAdmin: true }` |
| `ClubAdminGuard`      | Solo permite tipousuario=2 (admin de club)                                                               |
| `UsuarioGuard`        | Solo permite tipousuario=3 (usuario normal)                                                              |
| `PendingChangesGuard` | Previene navegación si hay cambios sin guardar en formularios                                            |

Los guards se aplican en app.routes.ts:

---

### 7. `interceptor/` — Interceptor HTTP

**`JWTInterceptor`**: Añade automáticamente el header `Authorization: Bearer <token>` a todas las peticiones HTTP salientes. También gestiona errores globales:
- **401** → Sesión expirada, redirige a `/login`
- **503** → Base de datos no disponible
- **Status 0** → Backend caído

Se registra en app.config.ts:
```typescript
{ provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true }
```

---

### 8. `component/shared/` — Componentes Compartidos

| Componente                | Función                                             |
| ------------------------- | --------------------------------------------------- |
| `menu/`                   | Barra de navegación superior                        |
| `sidebar/`                | Sidebar lateral (solo visible para admin)           |
| `breadcrumb/`             | Migas de pan contextuales                           |
| `paginacion/`             | Control de paginación reutilizable                  |
| `botonera-rpp/`           | Selector de registros por página (5, 10, 100, 1000) |
| `botonera-actions-plist/` | Botones de acción por fila (ver, editar, borrar)    |
| `confirm-dialog/`         | Diálogo de confirmación                             |
| `confirmacion-borrado/`   | Confirmación específica para borrado                |
| `modal/`                  | Modal genérico                                      |
| `notificacion/`           | Sistema de notificaciones toast                     |
| `login/`                  | Formulario de login                                 |
| `logout/`                 | Componente de cierre de sesión                      |
| `landing/`                | Página de aterrizaje pública                        |
| `home/`                   | Dashboard post-login para admin                     |
| `user-dashboard/`         | Dashboard para usuario normal                       |
| `dashboard/`              | Dashboard genérico                                  |
| `result-dialog/`          | Diálogo de resultado de operación                   |

---

### 9. `pipe/` — Pipes Personalizados

| Pipe            | Función            |
| --------------- | ------------------ |
| `datetime-pipe` | Formateo de fechas |
| `trim-pipe`     | Recorte de texto   |

---

### 10. `environment/` y `utils/`

- **environment.ts**: Configuración centralizada: `serverURL` (`http://localhost:8089`), `debounceTimeSearch` (800ms), `rpp` (opciones de paginación), flags de debug, duración de notificaciones.
- **`utils/`**: Utilidades como `date-utils.ts`.

---

### 11. Sistema de Rutas

Definido en app.routes.ts. Tres niveles:

| Nivel         | Rutas                                                                                          | Acceso                           |
| ------------- | ---------------------------------------------------------------------------------------------- | -------------------------------- |
| **Públicas**  | `/`, `/login`, `/logout`                                                                       | Sin autenticación                |
| **Admin**     | `/admin`, `/usuario`, `/equipo`, `/club`, etc.                                                 | `AdminGuard` (tipousuario=1)     |
| **TeamAdmin** | `/usuario/teamadmin`, `/equipo/teamadmin`, `/noticia/teamadmin`, etc.                          | `ClubAdminGuard` (tipousuario=2) |
| **Usuario**   | `/mi`, `/mi/noticias`, `/mi/equipos`, `/mi/cuotas`, `/mi/tienda`, `/mi/facturas`, `/mi/perfil` | `UsuarioGuard` (tipousuario=3)   |

Algunas rutas admin permiten teamadmin con `data: { allowClubAdmin: true }`:
```typescript
{ path: 'jugador', component: JugadorAdminPlistPage, data: { allowClubAdmin: true } }
```

---

### 12. Patrón de Navegación con Breadcrumbs

Para el perfil 2 teamadmin las páginas usan el componente `breadcrumb/` para mostrar la ruta de navegación contextual. Por ejemplo, al ver un equipo de una categoría concreta:

```
Equipos > Categoría "Alevín" > Equipo "Alevín A"
```

---

# Diseño de UI 

Guía de referencia exhaustiva del diseño visual y de marcado HTML para todas las vistas
(`plist`, `detail` y `form`) del perfil **Administrador** en la aplicación frontsportin.

---

## Principios generales del frontend para agentes de IA

### Stack tecnológico

- UI basada en **Bootstrap 5.3**, **Bootstrap Icons 1.13** y **Angular Material 20+**.
- Angular standalone components con signals, zoneless change detection y TypeScript.
- Escala de fuentes reducida (`small`, `fs-5`, `fw-semibold`) para maximizar densidad de información.
- Diseño responsive first usando clases Bootstrap. No crees CSS ad-hoc para responsive.

---

### Estructura de directorios

- Cada entidad del dominio tiene directorio propio en `component/` y `page/`, organizado por rol: `admin/`, `teamadmin/`, `usuario/`.
- Los componentes funcionales en `component/entidad/` se dividen en cuatro subdirectorios: `plist/`, `detail/`, `form/` y `finder/`. No los mezcles ni crees otros.
- Las páginas en `page/` son solo shells que importan y renderizan el componente funcional. No pongas lógica de negocio en ellas.
- Cada entidad tiene exactamente un servicio en `service/` y una interfaz en `model/`. No dupliques ni fragmentes.

---

### Navegación y rutas

- Las rutas del perfil usuario (tipousuario=3) van bajo la ruta `/mi`.
- Las rutas del perfil teamadmin (tipousuario=2) llevan el sufijo `/teamadmin`.
- Las rutas admin que también permite teamadmin llevan `data: { allowClubAdmin: true }`. No crees rutas separadas duplicadas para ello.
- El perfil propio (`/mi/perfil`) es accesible para todos los usuarios autenticados con `AuthGuard`. No le pongas un guard más restrictivo.
- El breadcrumb se usa principalmente en la navegación teamadmin para mostrar contexto jerárquico de navegación.
- CRUD completo por entidad y rol: plist, view, new, edit, delete. Si una acción no aplica al dominio, simplemente no la implementes.

---

### Gestión de estado y reactividad

- El estado reactivo se maneja exclusivamente con signals (`signal()`, `computed()`). No uses `BehaviorSubject` para estado local de componentes.
- No uses `*ngIf` ni `*ngFor` en los templates HTML. Usa el bloque `@if` / `@for` de Angular 17+.
- Usa `inject()` en lugar de constructor injection. No declares propiedades como noinyectadas manualmente.
- La inyección de dependencias usa `providedIn: 'root'` en todos los servicios. No registres servicios en módulos ni en arrays de componentes.
- Los componentes usan detección de cambios zoneless. No invoques `ChangeDetectorRef` ni `NgZone.run()`.

---

### Patrones de paginación y búsqueda

- El buscador en los plist usa un `Subject` con `debounceTime(800)` y `distinctUntilChanged()`. No implementes búsquedas sin debounce.
- La paginación se gestiona con las signals `numPage`, `numRpp` y `oPage`. No uses variables sueltas ni lógica de paginación ad-hoc.
- La ordenación de columnas usa las signals `orderField` y `orderDirection`. No implementes ordenación manual.
- Los valores de RPP se definen en environment.ts. No los hardcodees en componentes.

---

### Capa de servicios y comunicación HTTP

- Todas las llamadas HTTP pasan por `JWTInterceptor`, que inyecta automáticamente el token Bearer. No añadas cabeceras de autorización manualmente en los servicios.
- Todos los servicios usan `PayloadSanitizerService.sanitize()` antes de enviar datos al backend para limpiar el payload.
- Los errores HTTP globales (401, 503, status 0) los gestiona el interceptor. No dupliques esa gestión en cada servicio.
- La URL del backend se define únicamente en environment.ts. No la hardcodees en servicios ni componentes.

---

### Sesión y seguridad

- La sesión se gestiona únicamente desde `SessionService`. No almacenes, leas ni manipules tokens fuera de este servicio.
- No accedas a `localStorage` directamente para el token. Usa siempre `SessionService.getToken()` y `SessionService.setToken()`.
- Las notificaciones al usuario se muestran mediante `NotificacionService`. No uses `alert()`, `console.log` ni `window` para informar al usuario.

---

### Formularios e interacciones

- Los formularios abren un componente plist en modo diálogo para seleccionar registros de entidades relacionadas. Al hacer clic en una fila, el plist cierra el modal devolviendo el registro seleccionado.
- Las fechas se muestran en formato `dd/MM/yyyy HH:mm:ss` usando el calendario desplegable nativo del navegador.
- El menú y la barra lateral se adaptan automáticamente al rol del usuario. No crees navegación duplicada por rol.

---

### Consistencia y reutilización

- Mantén la consistencia visual y funcional siguiendo los patrones de diseño existentes. No introduzcas estilos o componentes que rompan la coherencia.
- Antes de crear un nuevo componente, revisa si ya existe uno compartido en `component/shared/` que puedas reutilizar.
- Antes de crear cualquier componente, servicio o interfaz, busca uno similar en el mismo perfil de usuario y sigue su patrón de diseño exacto.
- Los pipes personalizados disponibles son `datetime-pipe` y `trim-pipe`. Úsalos en lugar de formatear fechas o texto manualmente en los templates.

---

## Principios generales del backend para agentes de IA

### Stack tecnológico

- Spring Boot 3+ con Jakarta EE, Maven y Java 17+.
- Base de datos MySQL con acceso vía Spring Data JPA / Hibernate.
- Autenticación stateless mediante tokens JWT (io.jsonwebtoken).
- Lombok para reducir boilerplate (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Getter`, `@Setter`).

---

### Estructura de capas

- El backend se organiza en 10 capas estrictas: `entity/`, `repository/`, `dto/`, `dtoconverter/`, `service/`, `api/`, `filter/`, `exception/`, `bean/`, `util/`. No añadas capas nuevas ni mezcles responsabilidades.
- Cada entidad del dominio tiene ficheros en todas las capas: Entity, Repository, DTO, Converter, Service y Api. Si una capa no aplica (por ejemplo, entidad sin DTO), simplemente no la implementes.
- Las capas siguen una dependencia unidireccional: `api` → `service` → `dtoconverter` + `repository` → `entity`. Un controlador nunca accede directamente a un repositorio.
- El punto de entrada es `GesportinApplication` con `@SpringBootApplication`. No modifiques esta clase.

---

### Capa entity/ — Entidades JPA

- Cada entidad es una clase POJO anotada con `@Entity`, `@Table(name = "...")`, `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`.
- El nombre de la tabla en `@Table` coincide exactamente con el nombre de la tabla en MySQL.
- El sufijo del nombre de clase es `Entity` (ej. `UsuarioEntity`). No lo omitas ni uses otro sufijo.
- El ID es `Long` con `@Id` y `@GeneratedValue(strategy = GenerationType.IDENTITY)`.
- Las columnas se mapean con `@Column(name = "...", nullable = false)`.
- Las columnas con guion bajo en MySQL (ej. `fecha_alta`) se mapean como `fechaAlta` en Java. Usa `@Column(name = "fecha_alta")` si el nombre difiere.
- Las relaciones ManyToOne usan `@ManyToOne(fetch = FetchType.EAGER)` y `@JoinColumn(name = "id_...")`.
- Las colecciones OneToMany no se declaran en la entidad. Se exponen como contadores en el DTO.
- Validaciones Jakarta: `@NotBlank` para strings, `@NotNull` para objetos, `@Size` para longitudes.
- Fechas con `LocalDateTime`, anotadas con `@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", shape = JsonFormat.Shape.STRING)`.
- Las imágenes se almacenan como `byte[]` con `@Lob` y `@Column(nullable = true)`.

---

### Capa repository/ — Acceso a datos

- Cada repositorio es una interfaz que extiende `JpaRepository<Entity, Long>`. No uses implementaciones personalizadas.
- Las consultas por filtro siguen la convención de nombres de Spring Data: `findByCampoContainingIgnoreCase(String campo, Pageable pageable)`.
- Los métodos de conteo usan `@Query("SELECT COUNT(...) FROM Entity e WHERE e.relacion.id = :id")` con `@Param("id")`.
- Las consultas que navegan por relaciones profundas usan convención de nombres: `findByCategoriaTemporadaClubId(Long clubId, Pageable pageable)`.
- Las consultas nativas (MySQL puro) se usan solo cuando es estrictamente necesario, con `@Query(value = "...", nativeQuery = true)`.
- Los métodos query devuelven `Page<Entity>` cuando se usa paginación, o `Optional<Entity>` para búsquedas por campo único.

---

### Capa dto/ — Objetos de transferencia

- Cada DTO extiende la entidad correspondiente (`class UsuarioDTO extends UsuarioEntity`). Esto hereda todos los campos simples y relaciones.
- Los campos adicionales son exclusivamente contadores enteros (`private int comentarios;`). No añadas lógica ni métodos complejos en DTOs.
- El constructor del DTO recibe la entidad y los contadores como parámetros, y copia campo a campo desde la entidad con los setters heredados.
- Anotaciones: `@Getter`, `@Setter`, `@NoArgsConstructor`. No añadas `@Data` (entra en conflicto con la herencia).
- No serialices colecciones OneToMany. Siempre se exponen como contadores.

---

### Capa dtoconverter/ — Conversores Entity↔DTO

- Cada converter es un `@Component` de Spring con un `@Autowired` al repositorio correspondiente para ejecutar las queries de conteo.
- Implementa exactamente dos métodos: `toDTO(Entity entity)` y `toPageDTO(Page<Entity> page)`.
- `toDTO` retorna null si recibe null. No lances excepción.
- `toPageDTO` usa `page.map(this::toDTO)`. Retorna null si recibe null.
- El converter es la única capa que invoca los métodos `count*` del repositorio. Los servicios no llaman a esos count directamente.

---

### Capa service/ — Lógica de negocio

- Cada servicio es un `@Service` de Spring. Anotación obligatoria.
- **Esta es la capa más importante**. Contiene toda la lógica de negocio, autorización y validación.
- Todo servicio CRUD tiene: `get(id)`, `getPage(...)`, `create(entity)`, `update(entity)`, `delete(id)`.
- Métodos adicionales opcionales: `count()`, `fill(cantidad)`, `empty()`.
- Convención de nomenclatura de variables: los campos inyectados llevan prefijo `o` (ej. `oUsuarioRepository`, `oSessionService`, `oUsuarioConverter`).
- El control de acceso se aplica al inicio de cada método público:
  - `oSessionService.denyUsuario()` — bloquea a usuarios normales (tipousuario=3).
  - `oSessionService.isAdmin()` — true solo para tipousuario=1.
  - `oSessionService.isEquipoAdmin()` — true para tipousuario=2.
  - `oSessionService.isUsuario()` — true para tipousuario=3.
  - `oSessionService.checkSameClub(clubId)` — lanza excepción si el club no coincide con el del usuario en sesión.
- En get() y getPage(), los usuarios tipo 2 y 3 solo pueden ver datos de su propio club. Filtra siempre por club.
- En create() y update(), fuerza las restricciones de integridad referencial (club, tipo de usuario, etc.) ignorando lo que envió el cliente.
- Las excepciones de negocio se lanzan con las clases personalizadas: `ResourceNotFoundException` (404), `UnauthorizedException` (403), `ResourceNotAllowedException` (403), `ResourceNotModifiedException` (304).
- Las operaciones fill/empty llaman a `oSessionService.requireAdmin()` para verificar permisos (además del aspect).

---

### Capa api/ — Controladores REST

- Cada controlador es un `@RestController` con `@RequestMapping("/entidad")` y `@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)`.
- Los controladores NO contienen lógica de negocio. Delegan inmediatamente al servicio correspondiente.
- Endpoints estándar:
  - `GET /entidad/{id}` → `ResponseEntity<DTO>`
  - `GET /entidad` → `ResponseEntity<Page<DTO>>` con `@PageableDefault(size = 1000)` y `@RequestParam(required = false)` para filtros.
  - `POST /entidad` → `ResponseEntity<DTO>` (crear, recibe la entidad en el body)
  - `PUT /entidad` → `ResponseEntity<DTO>` (actualizar)
  - `DELETE /entidad/{id}` → `ResponseEntity<Long>`
  - `GET /entidad/count` → `ResponseEntity<Long>`
- Para imágenes: `@PatchMapping("/picture/{id}")` con `@RequestPart("image") MultipartFile`.
- El `size` por defecto de paginación es 1000. No lo cambies sin justificación.

---

### Capa filter/ — Filtros y aspectos

- `JwtFilter`: implementa `Filter` de Jakarta Servlet. Intercepta todas las peticiones, extrae el token Bearer del header Authorization, lo valida con `JWTService` e inyecta el `username` como atributo del request.
- El filtro también añade headers CORS en todas las respuestas.
- Las peticiones OPTIONS (preflight CORS) se responden con 200 sin validar token.
- Si el token no es válido o ha expirado, responde con 401.
- `AdminCrudGuardAspect`: aspect AOP que intercepta `fill()` y `empty()` de todos los servicios y bloquea si el usuario no es admin. No necesitas añadir control de acceso manual para fill/empty en cada servicio.

---

### Capa exception/ — Manejo de errores

- `ApplicationExceptionHandler` es un `@ControllerAdvice` que captura excepciones y las traduce a `ResponseEntity<ExceptionBean>` con código HTTP adecuado.
- Mapeo de excepciones:
  - `ResourceNotFoundException` → 404
  - `UnauthorizedException` → 403
  - `ResourceNotAllowedException` → 403
  - `ResourceNotModifiedException` → 304
  - `DataAccessException` → 503
  - `GeneralException` → 500
  - `RuntimeException` genérica → 500
- Todas las excepciones personalizadas extienden `RuntimeException`. Solo necesitan un constructor que reciba el mensaje.

---

### Capa bean/ — Beans auxiliares

- Clases POJO simples con `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`.
- `TokenBean`: contiene el token JWT (`String token`).
- `SessionBean`: contiene `String username` y `String password` para login.
- `ExceptionBean`: contiene `Integer status`, `String message`, `Long timestamp`.

---

### Capa util/ — Utilidades

- `ImageValidator`: clase estática con método `isValidPicture(byte[])` que valida formato, tamaño máximo (1.5MB) y dimensiones máximas (300x300 píxeles).
- Cualquier utilidad transversal nueva debe ir aquí. No disperses helpers en otras capas.

---

### Servicios transversales

- `SessionService`: gestiona la sesión del usuario autenticado. Proporciona: `login()`, `getUsername()`, `getIdUsuario()`, `getIdClub()`, `isAdmin()`, `isEquipoAdmin()`, `isUsuario()`, `isSessionActive()`, `checkSameClub()`, `denyUsuario()`, `requireAdmin()`.
- `JWTService`: genera y valida tokens JWT. Configuración vía application.properties (`jwt.secret`, `jwt.issuer`, `jwt.subject`).
- `AleatorioService`: genera datos aleatorios para poblar la base de datos (nombres, apellidos, descripciones, etc.).
- `SeedService`: servicio transaccional que orquesta el poblado completo de la BD con `reset()` y `fill()`.

---

### Seguridad e integridad referencial

- Todos los endpoints (excepto login) requieren token JWT válido. El `JwtFilter` lo garantiza.
- Las operaciones fill/empty están protegidas por `AdminCrudGuardAspect`. Solo admin (tipousuario=1) puede ejecutarlas.
- Los servicios de entidades que pertenecen a un club deben comprobar que el usuario en sesión pertenece al mismo club antes de operar.
- Un equipo-admin (tipousuario=2) solo puede crear usuarios de tipo "usuario" (tipousuario=3) y forzar su club al suyo propio.
- Un usuario normal (tipousuario=3) no puede crear, modificar ni eliminar registros de otros usuarios. Usa `oSessionService.denyUsuario()`.
- Los datos enviados por el cliente en create/update no son de fiar. El servicio debe sobreescribir club, tipousuario y cualquier campo sensible según el usuario en sesión.

---

### Convenciones generales

- Prefijo `o` en todas las variables inyectadas (ej. `oUsuarioRepository`, `oSessionService`). No uses otro prefijo ni lo omitas.
- Los mensajes de excepción van en español. Sé descriptivo: `"Usuario no encontrado con id: " + id`.
- Las queries JPQL usan parámetros nombrados con `@Param`. No uses parámetros posicionales (`?1`).
- Las fechas se almacenan como `LocalDateTime`. No uses `Date`, `Timestamp` ni strings.
- Las contraseñas se almacenan hasheadas con SHA-256 (o algoritmo definido). No almacenes contraseñas en texto plano.
- El application.properties contiene la configuración de BD, pool HikariCP y JWT. No modifiques este fichero sin coordinación del equipo.
- El `pom.xml` contiene todas las dependencias del proyecto. No lo modifiques sin coordinación del equipo.

## Restricciones de integridad referencial

* Un jugador está asociado a un club mediante usuario. 
* Un equipo está asociado a un club mediante categoría y temporada.
* Un jugador no puede estar asociado a un club y jugar en un equipo de otro club.

* Un equipo tiene cuotas.
* Un jugador sólo puede realizar pagos de cuotas de su club.

* Una noticia está asociada a un club.
* Un usuario está asociado a un club.
* Un usuario sólo puede comentar y valorar noticias de su club.

* Un artículo de venta está asociado a un club emdiante el tipo de artículo.
* Un usuario sólo puede meter en el carrito, comentar o comprar artículos de su club.
* Una factura sólo puede contener artículos de un mismo usuario.
* Las compras dentro de una factura sólo pueden ser de artículos del club del usuario de la factura.
* Las facturas tienen que contener al menos un artículo.

--

* Las noticias de un club C deben de estar comentadassólo por usuarios del club C.
* Las puntuaciones de un club C deben ser realizadas sólo por usuarios del club C.
* El usuario de un equipo debe pertenecer al club en el que está el equipo.
* Los artículos de tipos de artículos de un club C sólo pueden ser comentados por usuarios del club C.
* Los artículos de tipos de artículos de un club C sólo pueden ser valorados por usuarios del club C.
* Los artículos de tipos de artículos de un club C sólo pueden ser introducidos en el carrito por usuarios del club C.  
* Los jugadores de un equipo de un club C sólo pueden estar asociados a usuarios del club C.
* Los pagos de las cuotas de un equipo E sólo pueden ser realizadas por jugadores de ese equipo E. Los jugadores no pueden pagar una cuota dos veces.
* Las facturas de un usuario de un club C sólo pueden contener compras de artículos del mismo club C.
* Las facturas tienen que contener al menos un artículo.

---

* Todos los usuarios deben ser de un tipo.
* Todos los usuarios deben pertenecer a un club.
* Todos los jugadores deben estar asociados a un usuario.
* Todos los articulos deben pertenecer a un tipo de artículo.

## Roles

En gesportin, los perfiles y permisos se gestionan a través de roles. Cada rol tiene un conjunto de permisos asociados que determinan qué acciones pueden realizar los usuarios asignados a ese rol. A continuación, se describen los roles y permisos disponibles en gesportin:

### 1. **Administrador**

* (tabla: tipousuario, id:1)
* Tiene acceso completo a todas las funcionalidades del sistema, incluyendo la gestión de usuarios, configuración del sistema y acceso a todos los datos. 
* No puede crear ni borrar tipos de usuario en la tabla tipousuario.

### 2. **Administrador de club**

* (tabla: tipousuario, id:2)
* Puede gestionar:
  * Las temporadas de su club (crud completo pero sólo de temporadas de su club),
  * Las categorías de cada temporada de su club (crud completo pero sólo de categorias de su club),
  * Los equipos de cada categoría de su club (crud completo pero sólo de equipos de su club),
  * Las ligas en las que participan los equipos de su club (crud completo pero sólo de ligas de su club),
  * Los partidos que se juegan dentro de las ligas de su club (crud completo pero sólo de partidos de su club)
    * Puede editar el comentario de cualquier partido de su club
  * Los jugadores de su club (crud completo pero sólo de jugadores de su club)
  * Las cuotas que pagan los jugadores de su club (crud completo pero sólo de cuotas de su club)
  * Los pagos de los jugadores de su club (crud completo pero sólo de pagos de su club)
  * Las noticias de su club (crud completo pero sólo de noticias de su club)
  * Los tipos de articulo de su club (crud completo pero sólo de tipos de articulo de su club)
  * Los artículos de su club (crud completo pero sólo de artículos de tipos de artículo de su club)
  * Las facturas de su club (crud completo excepto borrar pero sólo de facturas de su club)
  * Los jugadores de su club (crud completo pero sólo de jugadores de su club)
  * Las cuotas que pagan los jugadores de su club (crud completo pero sólo de cuotas de su club)
  * Los usuarios pero sólo de su club:
    * puede ver sólo usuarios de su club
    * puede crear usuarios del tipo usuario sólo en su club
    * puede modificar usuarios del tipo usuario sólo de su club sin cambiar su club
    * puede eliminar usuarios del tipo usuario sólo de su club
  * Los pagos de los jugadores de su club (crud completo pero sólo de pagos de su club)
* Puede ver:
  * Puede ver los datos de los usuarios de su club pero no puede modificarlos ni borrarlos. No puede ver los datos de los usuarios de otros clubes.
  * Puede ver los datos de su club pero no puede modificarlos ni borrarlos.
  * Sólo puede ver las facturas y las compras de su club, no puede crearlas ni modificarlas ni borrarlas.  
  * No puede gestionar el carrito de la compra de los usuarios de su club.
  * Puede ver comentarios y puntuaciones de noticias ni de artículos de su club.
  * No puede gestionar comentarios ni puntuaciones de noticias ni de artículos de su club.
  * No tiene permisos de ningún tipo para gestionar nada de otros clubes.

### 3. **Usuario**

* (tabla: tipousuario, id:3 Perfil "Usuario")
* Puede ver:
  * Roles de usuario
  * Tipos de usuario
  * Los datos de su club.
  * Las temporadas de su club,
  * Las categorías de cada temporada de su club,
  * Los equipos de cada categoría de su club,
  * Las ligas en las que participan los equipos de su club,
  * Los partidos que se juegan dentro de las ligas de su club,
  * Las cuotas que pagan los jugadores de equipo en su club,
  * Las noticias de su club,
  * La media de las puntuaciones de las noticias de su club,
  * Los tipos de articulo de su club,
  * Los artículos de su club,  
  * Sus facturas con las compras.
  * Los datos de usuario de usuarios de su club excepto el password.
* Puede crear y modificar: 
  * sólo sus comentarios de las noticias de su club.
  * sólo sus puntuaciones de sus noticias de su club.
  * sólo sus comentarios de artículos sólo de los tipos de articulos de su club.
* Puede introducir, borrar o modificar productos de su club en su carrito de la compra, lo que equivale a que tiene que poder escribir, borrar o modificar productos de su club en la tabla de carrito de la compra.
* Puede comprar productos de su carrito de la compra. Para comprar se debe ejecutar el siguiente proceso:
  1 El sistema comprueba que el usuario tiene productos en su carrito de la compra.
  2 Si el usuario no tiene productos en su carrito de la compra, se emite una excepción  indicando que no se pueden realizar compras sin productos en el carrito.
  3 Si el usuario tiene productos en su carrito de la compra, se procede a realizar la compra.
    4 Se crea una nueva factura con id=x asociada al usuario en la fecha y hora actuales.
    5 Se copian las referencias de los artículos y cantidades a la tabla compra, incluyendo el precio actual de cada artículo en el momento de la compra y se vinculan todas las líneas creadas con el id=x de la factura creada en el paso anterior.
    6 Se borran los registros del carrito de la compra del usuario.
* No tiene permisos para ver nada de otros clubes.
* No tiene permisos para crear modificar o borrar fuera de lo mencionado anteriormente.
* Puede registrar el pago de sus propias cuotas (crear un pago con `abonado=1` para su propio jugador, solo en cuotas de su club). No puede modificar ni borrar pagos.

## Excepciones

Aquí tienes el resumen simplificado:

---

## Gestión de errores: backend y frontend

### Estructura del error

Todos los errores del backend se serializan como `ExceptionBean`:
```
{ status: int, message: string, timestamp: long }
```
En Angular se accede como `err.error.status`, `err.error.message`, `err.error.timestamp`. Los errores de red sin conexión dan `err.status === 0`.

---

### Mapeo excepción → HTTP

| Excepción                               | Código  | Mensaje típico                                              |
| --------------------------------------- | ------- | ----------------------------------------------------------- |
| `JwtFilter` (token inválido)            | **401** | Sin cuerpo — solo código HTTP                               |
| `UnauthorizedException`                 | **403** | "Usuario o contraseña incorrectos" / "Acceso denegado: ..." |
| `ResourceNotFoundException`             | **404** | "X no encontrado con id: Y"                                 |
| `ResourceNotModifiedException`          | **304** | Mensaje descriptivo                                         |
| `DataAccessException`                   | **503** | "Backend can't access to database"                          |
| `RuntimeException` / `GeneralException` | **500** | Mensaje de la excepción                                     |

---

### Gestión en frontend

**JWTInterceptor** (global):
- **401** → sesión expirada → limpia token, notifica y redirige a `/login`
- **403** → acceso denegado → notifica y redirige a `/`
- **503** → BD caída → notifica con flag de deduplicación
- **Status 0** → backend caído → notifica con flag de deduplicación
- Siempre propaga el error con `throwError`

**LoginComponent** (antes del interceptor):
- **Status 0** → "Backend not alive"
- **503** → "Backend can't access to database"
- **403** → "Auth error" (credenciales incorrectas)
- Otros → `err.error?.message || err.statusText`

---

### Tabla rápida

| `status`            | Causa                    | Acción en frontend                 |
| ------------------- | ------------------------ | ---------------------------------- |
| 0                   | Backend caído            | "Backend not alive"                |
| 401                 | Token inválido/expirado  | Redirigir a login                  |
| 403 (login)         | Credenciales incorrectas | "Auth error"                       |
| 403 (sesión activa) | Acceso denegado          | Mostrar mensaje + redirigir        |
| 404                 | Recurso no encontrado    | "No encontrado"                    |
| 304                 | Sin cambios              | Ignorar o notificar                |
| 503                 | BD inaccesible           | "Backend can't access to database" |
| 500                 | Error interno            | Mensaje de la excepción            |

---

### Notificaciones al usuario

- `success()` — autoCierre 2500ms
- `error()` — autoCierre 0 (requiere acción del usuario)
- `warning()` — autoCierre 2500ms
- `info()` — autoCierre 2500ms