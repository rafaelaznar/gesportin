# CLAUDE.md — Gesportín · Feature: Dashboard

> Antes de escribir cualquier línea de código, lee los siguientes archivos en este orden:
> 1. `ANALISIS_APLICACION.md` — descripción funcional, entidades y roles
> 2. `MAIN_TASK.md` — especificación detallada de la feature a implementar
>
> ⚠️ `ANALISIS_APLICACION.md` describe el proyecto a alto nivel; la **estructura real de carpetas
> y archivos** está documentada en este mismo CLAUDE.md más abajo (sección *Arquitectura real*).
> Si hay conflicto entre los documentos, manda el código real del repositorio.

---

## Contexto del proyecto

Gesportín es una plataforma de gestión de clubes deportivos.
Stack: **Angular 20** (frontend) + **Spring Boot** (backend) + **MySQL**.

```
/
├── frontsportin/          # Frontend Angular
└── gesportin/             # Backend Spring Boot
```

---

## Comandos de desarrollo

```bash
# Frontend
cd frontsportin
npm start          # Servidor dev → http://localhost:4200
npm run build      # Build de producción
npm test           # Tests unitarios (Jasmine/Karma)

# Backend
cd gesportin
./mvnw spring-boot:run   # Backend → http://localhost:8080
```

---

## Arquitectura real (verificada en el repositorio)

### Frontend — estructura por capas, NO por feature

```
frontsportin/src/app/
├── model/                   # Interfaces TS planas, una por entidad
│   ├── equipo.ts            # exporta IEquipo
│   ├── pago.ts              # exporta IPago
│   └── ...
├── service/                 # Servicios HTTP planos, uno por entidad
│   ├── equipo.ts            # exporta class EquipoService
│   ├── pago.ts              # exporta class PagoService
│   ├── session.ts           # JWT, getClubId(), isClubAdmin(), isAdmin()
│   ├── security.service.ts
│   └── ...
├── guards/
│   ├── admin.guard.ts          # AdminGuard      → usertype === 1
│   ├── club-admin.guard.ts     # ClubAdminGuard  → usertype === 2 (teamadmin)
│   ├── usuario.guard.ts        # UsuarioGuard    → usertype === 3
│   └── auth.guard.ts
├── page/                    # ⬅️ AQUÍ viven las páginas enrutadas
│   └── <feature>/
│       ├── admin/{plist,view,new,edit,delete}/{plist,view,...}.ts
│       ├── teamadmin/{plist,view,new,edit,delete}/{plist,view,...}.ts
│       └── usuario/{plist,view,...}/{plist,view,...}.ts
├── component/               # Componentes compartidos / standalone reutilizables
│   └── shared/
│       ├── sidebar/         # Menú lateral (lógica de rutas según rol)
│       ├── dashboard/       # ⚠️ YA EXISTE: dashboard de contadores (no tocar)
│       ├── kpi-card/        # ← AÑADIR aquí el componente KPI
│       └── ...
└── app.routes.ts            # ⬅️ TODAS las rutas registradas en un solo archivo
```

### Backend — paquetes reales

```
gesportin/src/main/java/net/ausiasmarch/gesportin/
├── api/             # Controllers REST  →  clases XxxApi.java   (ej: EquipoApi)
├── service/         # Lógica de negocio →  clases XxxService.java
├── entity/          # JPA entities      →  clases XxxEntity.java
├── repository/      # Repos Spring Data →  interfaces XxxRepository
├── dto/             # DTOs
└── bean/            # Beans auxiliares (SessionBean, etc.)
```

> ⚠️ No existe paquete `/controller/`. Los controllers REST se llaman `XxxApi`.

---

## Convenciones de código (obligatorio seguirlas)

### Naming en frontend

| Tipo | Archivo | Clase / interfaz exportada | Ejemplo |
|---|---|---|---|
| Modelo | `model/<entidad>.ts` | `I<Entidad>` | `model/equipo.ts` → `IEquipo` |
| Servicio | `service/<entidad>.ts` | `<Entidad>Service` | `service/equipo.ts` → `EquipoService` |
| Página plist | `page/<entidad>/<rol>/plist/plist.ts` | `<Entidad><Rol>PlistPage` | `EquipoTeamadminPlistPage` |
| Página view | `.../view/view.ts` | `<Entidad><Rol>ViewPage` | `EquipoTeamadminViewPage` |

### Servicios

Antes de crear un servicio nuevo, inspecciona `service/equipo.ts`:
- `@Injectable({ providedIn: 'root' })`
- Inyecta `HttpClient` y `PayloadSanitizerService`
- URL base desde `../environment/environment` (`serverURL`)
- Devuelve `Observable<T>`
- No añade headers de autenticación manualmente (el interceptor ya lo hace)

### Routing

**No existe** un `*.routes.ts` por feature. Toda ruta nueva se añade a `src/app/app.routes.ts`:
- Rutas admin → bajo `protectedRoutes` (protegidas globalmente con `AdminGuard`)
- Rutas teamadmin → en el array `routes`, con `canActivate: [ClubAdminGuard]`
- Rutas usuario → en `routes`, con `canActivate: [UsuarioGuard]`

### Identificar el club actual (rol teamadmin)

```typescript
private session = inject(SessionService);
const idClub = this.session.getClubId();   // lee del JWT
if (this.session.isClubAdmin()) { ... }
```

### Menú lateral

`component/shared/sidebar/sidebar.ts` construye el menú según rol con `session.isAdmin()` /
`session.isClubAdmin()`. Para añadir un enlace de teamadmin, mete un item dentro de la
rama `if (isClubAdmin)` siguiendo el mismo patrón que el resto.

---

## Reglas de código (se evalúan con IA — 70% de la nota)

- **Sin lógica en plantillas HTML.** Todo cálculo va en el componente TypeScript.
- **Una responsabilidad por clase.** El servicio solo hace HTTP; el componente solo gestiona estado visual.
- **Nombres descriptivos en español.** `obtenerResumenClub()` no `getData()`. `totalJugadores` no `count`.
- **DRY.** Usar `KpiCardComponent` para todas las tarjetas — sin copiar HTML.
- **Responsivo.** Grid de Bootstrap: `col-12 col-md-6 col-xl-3`. Nunca anchos fijos en píxeles.
- **Sin `console.log`** en código de producción.
- **Sin imports sin usar.**
- **Componentes standalone** (es el estilo del proyecto, ver cualquier `*.component.ts` existente).

---

## Qué NO tocar

```
❌ No modificar componentes, servicios, modelos ni guards existentes
❌ No cambiar rutas existentes — solo añadir nuevas en app.routes.ts
❌ No tocar component/shared/dashboard/ (el dashboard antiguo de contadores)
❌ No tocar el interceptor ni la lógica de autenticación / SessionService
❌ No añadir lógica de stats a APIs existentes del backend
❌ No modificar el esquema de base de datos
```

Todo el trabajo es **solo aditivo**: archivos nuevos + nuevas rutas en `app.routes.ts` +
items nuevos en el sidebar y el home del usuario.

> Excepciones mínimas permitidas:
> 1. Añadir 1 item al menú en `component/shared/sidebar/sidebar.ts` dentro de la rama
>    `if (isClubAdmin)` **y otro dentro de la rama `if (isAdmin)`** (necesario para
>    exponer la feature a esos roles, que sí usan el sidebar).
> 2. Añadir 1 tarjeta en `component/shared/user-dashboard/user-dashboard.html` que
>    enlace a `/mi/dashboard` (el rol usuario no tiene sidebar, navega por tiles desde
>    `MiHomePage`).

---

## Scope de esta feature

Ver especificación completa, tabla de datos y plan de dos fases en `MAIN_TASK.md`.

Resumen ejecutivo:
- Dashboard **nuevo y separado** disponible para **tres roles**, con dos variantes:
  - `Administrador global` (`tipousuario.id = 1`) → `/dashboard/admin` con `AdminGuard` (dashboard completo + dropdown extra de club)
  - `Administrador de Club` (`tipousuario.id = 2`) → `/dashboard/teamadmin` con `ClubAdminGuard` (dashboard completo, scope a su club)
  - `Usuario / Jugador` (`tipousuario.id = 3`) → `/mi/dashboard` con `UsuarioGuard` (dashboard reducido y personal, sin datos financieros del club)
- **Dropdown de temporada** en la cabecera del dashboard admin/teamadmin (por defecto la
  primera devuelta por `TemporadaService.getPage`). El dashboard del rol usuario **no
  tiene dropdowns**: muestra agregados sobre todos sus equipos.
- **Dropdown extra de club** solo para el admin global (el teamadmin toma el `idClub` del
  JWT; el admin lo elige). Por defecto el primer club devuelto por `ClubService.getPage`.
- Librería de gráficos: **`chart.js`** + wrapper Angular **`ng2-charts`** + controller **`chartjs-chart-treemap`** (para G6)
- Tarjetas KPI reutilizables (`KpiCardComponent`) compartidas entre las tres variantes
- 6 gráficos (bar, doughnut, mixed bar+line, line/area, gauge a partir de doughnut, treemap)
  en admin/teamadmin + 1 donut propio en usuario (estado de sus cuotas)
- Tabla resumen de equipos de la temporada seleccionada (solo admin/teamadmin)
- 8 endpoints GET en el backend (`/api/stats/club/{id}/...?temporada=X`) en `StatsApi.java`
  — **ya implementados**. El dashboard usuario usa los servicios existentes filtrando por
  `userId` (no necesita backend nuevo, y de hecho `StatsService.verificarAcceso` rechaza
  al rol usuario).

### Plan de dos fases (ver detalle en `MAIN_TASK.md`)

- **Fase 1 — sin backend nuevo:** estructura, rutas (teamadmin + admin), sidebar, dropdowns,
  5 KPI conectados a servicios existentes (`jugadorService`, `equipoService`, etc. con
  `.getPage(0,1).totalElements`), 1 gráfico bar con `groupBy` en frontend. Resto =
  skeleton/placeholder. **Dashboard navegable y demoable en ambos roles.**
- **Fase 2 — con backend:** 8 endpoints nuevos, swap de mocks en `DashboardService`, KPIs y
  gráficas restantes activadas, K1–K5 migrados para respetar también la temporada.

---

## Orden de prioridad si el tiempo es limitado

Ver lista detallada de 12 pasos al final de `MAIN_TASK.md`.

---

## Checklist antes del Pull Request

- [ ] Rama: `feature/dashboard` o `feature/vlad/dashboard` (nunca desde `main` ni `master`)
- [ ] `npm run build` sin errores
- [ ] Dashboard accesible desde el menú de navegación de teamadmin **y de admin**
- [ ] Dashboard usuario accesible desde una tarjeta en `MiHomePage` (rol 3)
- [ ] En la página admin, el dropdown extra de club funciona y al cambiar recarga todo
- [ ] Todas las tarjetas KPI con datos reales de la API (o mocks claramente marcados con TODO)
- [ ] Al menos 2 gráficos renderizando en admin/teamadmin + 1 donut en usuario
- [ ] Layout responsivo (verificar en 375px de ancho)
- [ ] Sin `console.log` en el código
- [ ] Sin imports sin usar
- [ ] Naming consistente con el proyecto: `IDashboardResumen`, `DashboardService`,
      `DashboardTeamadminPlistPage`, `DashboardAdminPlistPage`, `DashboardUsuarioPlistPage`
