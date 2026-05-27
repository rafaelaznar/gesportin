# Reto 6 — Feature: Dashboard
**Gesportín** | Angular 20 + Spring Boot 4.0.1 + MySQL

---

## Fechas clave

| Evento | Fecha |
|---|---|
| Pull Request (rama ≠ main/master) | Miércoles 27 de mayo |
| Demostración en vivo | Jueves 28 de mayo, 9:00h — aula DAW S09 |

---

## Criterios de evaluación

| Peso | Criterio |
|---|---|
| 30% | Exposición oral + demostración en vivo |
| 70% | Análisis del código con IA: filosofía Gesportín, clean code (KISS, DRY, YAGNI), responsividad, complejidad |

---

## Descripción de la feature

Página Dashboard **nueva** disponible para **tres roles**, con dos variantes de
contenido:

- **Administrador global** (`tipousuario.id = 1`) y **Administrador de Club**
  (`tipousuario.id = 2`) — comparten el **mismo dashboard completo** (KPIs financieros,
  6 gráficas y tabla resumen). El teamadmin ve los datos de su club; el admin global
  elige club mediante un dropdown adicional. Ambos eligen temporada con un dropdown.
- **Usuario / Jugador** (`tipousuario.id = 3`) — ve un dashboard **reducido y personal**
  con los datos básicos relacionados con su actividad y club. **No tiene acceso a datos
  financieros del club** (€ ingresos / € deudas globales) ni a estadísticas internas
  (estado de pagos por equipo, ingresos mensuales, deuda por equipo, etc.). Solo ve
  datos *públicos del club* + datos *propios del usuario*.

Rutas:
- `/dashboard/admin` protegida por `AdminGuard`
- `/dashboard/teamadmin` protegida por `ClubAdminGuard`
- `/mi/dashboard` protegida por `UsuarioGuard` (usa el patrón existente `/mi/*` del
  rol usuario)

Convive con (no reemplaza) el `DashboardComponent` antiguo en `component/shared/dashboard/`,
que sigue siendo el dashboard de contadores genérico.

---

## Decisión arquitectónica clave: dropdown de temporada

El schema de BD no tiene flag de «temporada activa» ni fechas en `temporada`:

```sql
CREATE TABLE `temporada` (
  `id` bigint NOT NULL,
  `descripcion` varchar(256) NOT NULL,
  `id_club` bigint NOT NULL
);
```

No hay forma fiable de determinar la temporada activa desde el código actual sin
modificar el schema (prohibido) o usar heurísticas frágiles (`MAX(id)`, parsing de
`descripcion`).

**Solución:** dropdown de temporadas en la cabecera del dashboard. El teamadmin elige.
Por defecto se selecciona la primera devuelta por `TemporadaService.getPage` (que ya
filtra por su club vía `SecurityService.clubFilter`). Todas las métricas y gráficas
reaccionan al cambio de selección.

**Para el admin global** se añade un dropdown extra de **club** delante del de
temporada. Al cambiar el club seleccionado se recarga el listado de temporadas
(`temporadaService.getPage(0, 100)` filtrado por `id_club` en frontend tras la
llamada, o usando un filtro server-side existente). Por defecto se selecciona el
primer club devuelto por `clubService.getPage(0, 100)` y luego su primera temporada.

---

## Contenido visual del dashboard

### KPIs (9 tarjetas)

| # | Título | Valor | Fuente | Sparkline (mini trend 6m) |
|---|---|---|---|---|
| K1 | Jugadores | total | `jugadorService.getPage(0,1).totalElements` (o resumen) | — |
| K2 | Equipos | total | `equipoService.getPage(0,1).totalElements` (o resumen) | — |
| K3 | Partidos | total | `partidoService.getPage(0,1).totalElements` (o resumen) | — |
| K4 | Noticias | total | `noticiaService.getPage(0,1).totalElements` (o resumen) | — |
| K5 | Pagos (uds.) | total | `pagoService.getPage(0,1).totalElements` (o resumen) | — |
| K6 | Pagos recibidos | € | endpoint `/resumen` | **✅ línea ingresos últimos 6 meses** |
| K7 | Deudas pendientes | € | endpoint `/resumen` | **✅ línea deuda últimos 6 meses** |
| K8 | Partidos jugados | total | endpoint `/resumen` | — |
| K9 | Partidos pendientes | total | endpoint `/resumen` | — |

### Gráficas (6) + tabla (1)

| # | Tipo Chart | Título | Fuente |
|---|---|---|---|
| G1 | Bar (vertical) | Equipos por categoría | endpoint `/equipos-por-categoria` |
| G2 | Donut | Estado de pagos (pagados vs pendientes) | endpoint `/pagos-estado` |
| G3 | **Mixed (column + line)** | Partidos por mes con % de victorias | endpoint `/partidos-mensuales` |
| G4 | Area | Ingresos mensuales | endpoint `/ingresos-mensuales` |
| G5 | **Radial bar (gauge)** | % de cobranza | derivado de G2 en frontend |
| G6 | **Treemap** | Deuda pendiente por equipo | endpoint `/deuda-por-equipo` |
| T1 | Tabla HTML | Equipos detalle (nombre, categoría, nº jug., partidos jug., victorias) | endpoint `/equipos-detalle` |

> **Notas sobre los gráficos nuevos** (todos con Chart.js / `ng2-charts`)
> - **G3 (mixed)**: dataset tipo `bar` para `jugados` + dataset tipo `line` para `% victorias` en eje Y secundario (`yAxisID: 'y1'` en Chart.js). En un solo gráfico se ve volumen y calidad. Reemplaza la HBar V/E/D plana.
> - **G5 (radial)**: Chart.js no trae `radialBar` nativo; se implementa con un `doughnut` configurado como gauge — `circumference: 180`, `rotation: 270`, dos segmentos (`[porcentaje, 100 - porcentaje]`) y un texto centrado con plugin `afterDraw`. Valor: `(pagados / total) * 100`, sin endpoint propio.
> - **G6 (treemap)**: usar el controller oficial **`chartjs-chart-treemap`**. Cada rectángulo = un equipo, tamaño proporcional al € de deuda. Permite ver de un vistazo qué equipos arrastran la cobranza.
> - **Sparklines K6/K7**: mini gráficos Chart.js tipo `line` con `responsive: true`, ejes, leyenda y tooltips ocultos (`scales: { x: { display: false }, y: { display: false } }`, `plugins: { legend: { display: false } }`), sin puntos. K6 reutiliza los 6 últimos meses de `/ingresos-mensuales`; K7 usa `/deuda-mensual`.

---

## Contenido visual del dashboard — variante Usuario (rol jugador)

El usuario (rol 3) **no usa los endpoints `/api/stats/...`** porque el backend ya
los protege (`StatsService.verificarAcceso` lanza `UnauthorizedException` cuando
`isUsuario()` es true). En su lugar usa los servicios estándar existentes filtrando
por su `userId` (vía JWT) y su `clubId`. No necesita backend nuevo.

### KPIs (4 tarjetas, sin importes en €)

| # | Título | Valor | Fuente (servicios existentes) |
|---|---|---|---|
| U1 | Mis Equipos | total | `equipoService.getPage(0, 1, 'id', 'asc', '', 0, userId).totalElements` |
| U2 | Cuotas Pagadas | total | `pagoService.getPage(0, 1, 'id', 'asc', 0, jugadorId)` filtrado por `abonado=1` en frontend |
| U3 | Cuotas Pendientes | total | derivado de la misma carga: pagos con `abonado=0` |
| U4 | Noticias del Club | total | `noticiaService.getPage(0, 1, 'id', 'asc', '', clubId).totalElements` |

> U2/U3 implican cargar los `jugador` del usuario primero (`jugadorService.getPage(... id_usuario=uid)`)
> y después los `pago` por cada `jugador.id` (forkJoin). El total de cuotas pagadas/pendientes
> se calcula en el componente, **no en el HTML**.

### Gráfica (1 mínima)

| # | Tipo Chart | Título | Fuente |
|---|---|---|---|
| GU1 | Donut | Estado de mis cuotas (pagadas vs pendientes) | derivado en frontend de los `pagos` cargados para U2/U3 |

### Lista (1)

| # | Tipo | Título | Fuente |
|---|---|---|---|
| LU1 | Lista simple | Mis próximos partidos | derivado de los equipos del usuario + `partidoService.getPage` filtrado por `id_liga` de cada equipo, mostrando los partidos con `id_estadopartido IN (1, 2)` (no jugado / aplazado). Máximo 5 entradas. |

### Layout sugerido

```
Cabecera: "Mi Dashboard" + saludo con el username del JWT
Fila 1 (KPI):    col-12 col-md-6 col-xl-3  → 4 cards
Fila 2 (chart):  GU1 col-12 col-md-6   |   LU1 col-12 col-md-6
```

### Qué NO ve el usuario

- Ningún importe en € (ni ingresos, ni deudas, ni totalPagosRecibidos)
- Ninguna gráfica del dashboard admin/teamadmin (G1–G6) salvo GU1 (donut propio)
- Ningún dato de otros usuarios o equipos en los que no esté inscrito
- Sin tabla `equipos-detalle` (información agregada del club)
- Sin dropdowns de temporada/club (vería todos sus equipos a la vez)

---

## Datos: disponibles ahora vs requieren backend nuevo

> Los servicios marcados como "disponibles ahora" ya están en `src/app/service/*.ts`,
> y para teamadmin **ya están scoped al club del JWT** vía `SecurityService`.

| Bloque | ¿Disponible sin backend nuevo? | Cómo se obtiene |
|---|---|---|
| Dropdown temporadas | ✅ Sí | `temporadaService.getPage(0, 100)` (ya scoped al club) |
| K1–K5 (totales club) | ✅ Sí | `*.getPage(0, 1).totalElements` por servicio |
| K6 «Pagos recibidos €» | ❌ Backend | `SUM(cuota.cantidad) JOIN pago WHERE abonado=1 AND temporada.id=X` |
| K7 «Deudas pendientes €» | ❌ Backend | Igual que K6 pero `abonado=0` |
| K8 / K9 partidos jugados/pendientes | ❌ Backend | `PartidoService` actual no filtra por `id_estadopartido` |
| G1 Bar equipos/categoría | ⚠️ Parcial sin backend | `equipoService.getPage(0, 500)` + `groupBy(e => e.categoria.descripcion)` en frontend (carga todo, no filtra temporada server-side) |
| G2 Donut estado pagos | ❌ Backend | `PagoService` actual no filtra por `abonado` |
| G3 Mixed partidos/mes + win % | ❌ Backend | `COUNT(*) GROUP BY YEAR/MONTH(fecha)` + `COUNT(estadopartido=3) / COUNT(jugados)` |
| G4 Area ingresos mensuales | ❌ Backend | `SUM(cuota.cantidad) GROUP BY YEAR/MONTH(pago.fecha) WHERE abonado=1` |
| G5 Radial % cobranza | ✅ Derivado | `(G2.pagados / (G2.pagados + G2.pendientes)) * 100` en el componente |
| G6 Treemap deuda por equipo | ❌ Backend | `SUM(cuota.cantidad) GROUP BY equipo WHERE abonado=0` |
| T1 Tabla equipos-detalle | ❌ Backend | Requiere JOINs y conteos agregados (N+1 si se hace en frontend) |
| Sparkline K6 (ingresos 6m) | ❌ Backend | Reutiliza últimas 6 entradas de G4 |
| Sparkline K7 (deuda 6m) | ❌ Backend | Endpoint nuevo `/deuda-mensual` |

**Total endpoints nuevos:** 8 (ver sección Backend).

> Mientras el backend no esté listo, `DashboardService` devuelve `of(MOCK).pipe(delay(200))`
> con la forma exacta del JSON esperado y un `// TODO: reemplazar mock por this.oHttp.get(...)`.
> Los bloques pendientes se muestran con un **placeholder simple**: la gráfica/tarjeta
> renderizada con datos mock y una etiqueta sutil «datos mock» en la esquina.

---

## Frontend — Angular

### Librería de gráficas

```bash
cd frontsportin
npm install chart.js ng2-charts chartjs-chart-treemap
```

- `chart.js` — motor de gráficas.
- `ng2-charts` — wrapper Angular con la directiva `<canvas baseChart ...>` y el
  componente `BaseChartDirective` (importable en componentes standalone).
- `chartjs-chart-treemap` — controller adicional necesario para G6.

En el componente standalone del dashboard:

```typescript
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { TreemapController, TreemapElement } from 'chartjs-chart-treemap';

Chart.register(...registerables, TreemapController, TreemapElement);
```

`BaseChartDirective` se añade al array `imports` del componente standalone.

---

### Estructura de archivos

```
frontsportin/src/app/
├── model/
│   └── dashboard-stats.ts            # interfaces I... (ver más abajo)
├── service/
│   └── dashboard.ts                  # exporta class DashboardService (solo admin/teamadmin)
├── page/
│   └── dashboard/
│       ├── teamadmin/
│       │   └── plist/
│       │       ├── plist.ts          # exporta DashboardTeamadminPlistPage
│       │       ├── plist.html
│       │       └── plist.css
│       ├── admin/
│       │   └── plist/
│       │       ├── plist.ts          # exporta DashboardAdminPlistPage
│       │       ├── plist.html
│       │       └── plist.css
│       └── usuario/
│           └── plist/
│               ├── plist.ts          # exporta DashboardUsuarioPlistPage
│               ├── plist.html
│               └── plist.css
└── component/
    └── shared/
        └── kpi-card/
            ├── kpi-card.ts           # exporta KpiCardComponent (acepta sparkline opcional)
            ├── kpi-card.html
            └── kpi-card.css
```

---

### Rutas nuevas

Añadir a `src/app/app.routes.ts` (NO crear `*.routes.ts` por feature — no es el patrón):

```typescript
import { DashboardTeamadminPlistPage } from './page/dashboard/teamadmin/plist/plist';
import { DashboardAdminPlistPage } from './page/dashboard/admin/plist/plist';
import { DashboardUsuarioPlistPage } from './page/dashboard/usuario/plist/plist';
// ...
// Dentro del array `routes` (NO en `protectedRoutes`):
{ path: 'dashboard/teamadmin', component: DashboardTeamadminPlistPage, canActivate: [ClubAdminGuard] },
{ path: 'mi/dashboard',        component: DashboardUsuarioPlistPage,   canActivate: [UsuarioGuard] },
// Y en `protectedRoutes` (protegidas globalmente por AdminGuard):
{ path: 'dashboard/admin',     component: DashboardAdminPlistPage },
```

---

### Enlaces de navegación

**Sidebar (admin / teamadmin)** — editar `component/shared/sidebar/sidebar.ts` y
añadir un item en **cada rama** de rol:

```typescript
// dentro de if (isClubAdmin):
items.push({ label: 'Dashboard', icon: 'speedometer2', route: '/dashboard/teamadmin' });

// dentro de if (isAdmin):
items.push({ label: 'Dashboard', icon: 'speedometer2', route: '/dashboard/admin' });
```

**Tile en home de usuario** — editar
`component/shared/user-dashboard/user-dashboard.html` y añadir una sexta tarjeta
apuntando a `/mi/dashboard` con icono `speedometer2`. El usuario no tiene sidebar,
solo el grid de tarjetas de `MiHomePage`.

Son las únicas modificaciones permitidas a ficheros existentes.

---

### Identificar el club actual

**Teamadmin** — viene del JWT:

```typescript
private session = inject(SessionService);
const idClub = this.session.getClubId();   // lee `club` del JWT
```

**Admin global** — viene del dropdown de club que él selecciona:

```typescript
clubes   = signal<IClub[]>([]);
clubSel  = signal<number | null>(null);   // el id elegido en el dropdown

// en ngOnInit
this.clubService.getPage(0, 100).subscribe(p => {
  this.clubes.set(p.content);
  if (p.content.length > 0) this.clubSel.set(p.content[0].id);
});
```

El resto del componente usa `clubSel()` en lugar de `session.getClubId()`.

---

### Dropdown de temporadas

```typescript
// en ngOnInit
this.temporadaService.getPage(0, 100).subscribe(p => {
  this.temporadas.set(p.content);
  if (p.content.length > 0) {
    this.temporadaSel.set(p.content[0].id);   // por defecto: primera
  }
});
```

`TemporadaService.getPage` ya aplica `SecurityService.clubFilter` → para teamadmin
devuelve solo las temporadas de su club. No hay que pasar `id_club`.

---

### Patrón de estado (signals + effect)

```typescript
// Estado común a ambas páginas
temporadas      = signal<ITemporada[]>([]);
temporadaSel    = signal<number | null>(null);
stats           = signal<IDashboardState | null>(null);
cargando        = signal(false);

// Solo en la página admin: dropdown de club
// clubes  = signal<IClub[]>([]);
// clubSel = signal<number | null>(null);

// Reaccionar al cambio de temporada (y, en admin, también de club)
constructor() {
  effect(() => {
    const idClub = this.session.isAdmin() ? this.clubSel() : this.session.getClubId();
    const idTemp = this.temporadaSel();
    if (idClub == null || idTemp == null) return;
    this.cargarDatos(idClub, idTemp);
  });
}

private cargarDatos(idClub: number, idTemporada: number): void {
  this.cargando.set(true);
  forkJoin({
    resumen:        this.dashboardService.obtenerResumen(idClub, idTemporada),
    pagosEstado:    this.dashboardService.obtenerEstadoPagos(idClub, idTemporada),
    equiposCat:     this.dashboardService.obtenerEquiposPorCategoria(idClub, idTemporada),
    partidosMes:    this.dashboardService.obtenerPartidosMensuales(idClub, idTemporada),
    ingresos:       this.dashboardService.obtenerIngresosMensuales(idClub, idTemporada),
    deudaEquipo:    this.dashboardService.obtenerDeudaPorEquipo(idClub, idTemporada),
    deudaMensual:   this.dashboardService.obtenerDeudaMensual(idClub, idTemporada),
    equiposDetalle: this.dashboardService.obtenerEquiposDetalle(idClub, idTemporada),
  }).subscribe(s => {
    this.stats.set(s);
    this.cargando.set(false);
  });
}
```

---

### Layout (Bootstrap grid)

```
Cabecera (teamadmin): título + dropdown de temporada              → d-flex justify-content-between
Cabecera (admin):     título + dropdown club + dropdown temporada → d-flex justify-content-between
Fila 1 (KPI):     col-12 col-md-6 col-xl-3  → 9 cards (3 filas en xl, más en mobile)
Fila 2 (charts):  G1, G2 en col-12 col-md-6
Fila 3 (charts):  G3 (full width) col-12
Fila 4 (charts):  G4, G5 en col-12 col-md-6 (G5 más estrecho, ej col-md-4)
Fila 5 (charts):  G6 col-12
Fila 6 (tabla):   T1 col-12
```

Variar a gusto siempre que se mantenga responsive en 375px.

---

### Modelos TypeScript

Fichero único `src/app/model/dashboard-stats.ts`:

```typescript
export interface IClubResumen {
  totalJugadores: number;
  totalEquipos: number;
  totalPartidos: number;
  totalNoticias: number;
  totalPagos: number;
  totalPagosRecibidos: number;    // €
  totalDeudas: number;            // €
  partidosJugados: number;
  partidosPendientes: number;
}

export interface IEstadoPagos {
  pagados: number;
  pendientes: number;
}

export interface IEquiposPorCategoria {
  categoria: string;
  totalEquipos: number;
}

export interface IPartidoMensual {
  mes: string;          // 'YYYY-MM'
  jugados: number;
  victorias: number;
  // winRate se calcula en el componente: victorias / jugados * 100
}

export interface IIngresoMensual {
  mes: string;          // 'YYYY-MM'
  total: number;
}

export interface IDeudaPorEquipo {
  equipo: string;
  deuda: number;        // €
}

export interface IDeudaMensual {
  mes: string;          // 'YYYY-MM'
  total: number;        // € adeudados acumulados ese mes
}

export interface IEquipoDetalle {
  equipo: string;
  categoria: string;
  numJugadores: number;
  partidosJugados: number;
  victorias: number;
}

export interface IDashboardState {
  resumen:        IClubResumen;
  pagosEstado:    IEstadoPagos;
  equiposCat:     IEquiposPorCategoria[];
  partidosMes:    IPartidoMensual[];
  ingresos:       IIngresoMensual[];
  deudaEquipo:    IDeudaPorEquipo[];
  deudaMensual:   IDeudaMensual[];
  equiposDetalle: IEquipoDetalle[];
}
```

---

### Servicio

`src/app/service/dashboard.ts` siguiendo el patrón de `service/equipo.ts`:

```typescript
@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private oHttp: HttpClient) {}

  obtenerResumen(idClub: number, idTemporada: number): Observable<IClubResumen> { ... }
  obtenerEstadoPagos(idClub: number, idTemporada: number): Observable<IEstadoPagos> { ... }
  obtenerEquiposPorCategoria(idClub: number, idTemporada: number): Observable<IEquiposPorCategoria[]> { ... }
  obtenerPartidosMensuales(idClub: number, idTemporada: number): Observable<IPartidoMensual[]> { ... }
  obtenerIngresosMensuales(idClub: number, idTemporada: number): Observable<IIngresoMensual[]> { ... }
  obtenerDeudaPorEquipo(idClub: number, idTemporada: number): Observable<IDeudaPorEquipo[]> { ... }
  obtenerDeudaMensual(idClub: number, idTemporada: number): Observable<IDeudaMensual[]> { ... }
  obtenerEquiposDetalle(idClub: number, idTemporada: number): Observable<IEquipoDetalle[]> { ... }
}
```

Mientras `/api/stats/...` no exista, cada método devuelve `of(MOCK).pipe(delay(200))`
con un comentario `// TODO: reemplazar mock por this.oHttp.get(...)`.

---

## Backend — Spring Boot

### Archivos nuevos

```
gesportin/src/main/java/net/ausiasmarch/gesportin/
├── api/
│   └── StatsApi.java               # @RestController @RequestMapping("/api/stats")
├── service/
│   └── StatsService.java
└── dto/
    ├── ClubResumenDTO.java
    ├── EstadoPagosDTO.java
    ├── EquiposPorCategoriaDTO.java
    ├── PartidoMensualDTO.java
    ├── IngresoMensualDTO.java
    ├── DeudaPorEquipoDTO.java
    ├── DeudaMensualDTO.java
    └── EquipoDetalleDTO.java
```

> El proyecto usa `api/` con nombres `XxxApi.java`, **no** `controller/` ni `XxxController`.

### Endpoints (8 en total, todos GET)

Todos aceptan `?temporada={id}` obligatorio. Todos retornan datos scoped al `{club}`
de la URL **y** verificados contra `JWT.club`.

| Endpoint | Respuesta |
|---|---|
| `GET /api/stats/club/{id}/resumen?temporada=X` | `IClubResumen` |
| `GET /api/stats/club/{id}/pagos-estado?temporada=X` | `IEstadoPagos` |
| `GET /api/stats/club/{id}/equipos-por-categoria?temporada=X` | `IEquiposPorCategoria[]` |
| `GET /api/stats/club/{id}/partidos-mensuales?temporada=X` | `IPartidoMensual[]` |
| `GET /api/stats/club/{id}/ingresos-mensuales?temporada=X` | `IIngresoMensual[]` |
| `GET /api/stats/club/{id}/deuda-por-equipo?temporada=X` | `IDeudaPorEquipo[]` |
| `GET /api/stats/club/{id}/deuda-mensual?temporada=X` | `IDeudaMensual[]` |
| `GET /api/stats/club/{id}/equipos-detalle?temporada=X` | `IEquipoDetalle[]` |

#### Ejemplos JSON

`/resumen`:
```json
{
  "totalJugadores": 42,
  "totalEquipos": 8,
  "totalPartidos": 21,
  "totalNoticias": 12,
  "totalPagos": 47,
  "totalPagosRecibidos": 3200.00,
  "totalDeudas": 450.00,
  "partidosJugados": 15,
  "partidosPendientes": 6
}
```

`/pagos-estado`:
```json
{ "pagados": 38, "pendientes": 9 }
```

`/equipos-por-categoria`:
```json
[
  { "categoria": "Benjamín", "totalEquipos": 3 },
  { "categoria": "Alevín",   "totalEquipos": 2 }
]
```

`/partidos-mensuales`:
```json
[
  { "mes": "2025-09", "jugados": 4, "victorias": 2 },
  { "mes": "2025-10", "jugados": 5, "victorias": 3 }
]
```
> Estados de partido en BD: `1=No jugado, 2=Aplazado, 3=Ganado, 4=Perdido, 5=Empatado`.
> «jugados» = estadopartido IN (3, 4, 5). «victorias» = estadopartido = 3.

`/ingresos-mensuales`:
```json
[
  { "mes": "2025-01", "total": 1200.00 },
  { "mes": "2025-02", "total": 950.00 }
]
```

`/deuda-por-equipo`:
```json
[
  { "equipo": "Atlético A", "deuda": 180.00 },
  { "equipo": "Atlético B", "deuda": 120.00 }
]
```

`/deuda-mensual`:
```json
[
  { "mes": "2025-01", "total": 450.00 },
  { "mes": "2025-02", "total": 380.00 }
]
```

`/equipos-detalle`:
```json
[
  { "equipo": "Atlético A", "categoria": "Benjamín", "numJugadores": 14, "partidosJugados": 8, "victorias": 5 }
]
```

### Seguridad

- Acceso a `/api/stats/**` solo para usuarios autenticados con `usertype IN (1, 2)`.
- `StatsApi` debe verificar `JWT.club === {id}` para `usertype = 2` (teamadmin) → 403 en caso contrario.
- Para `usertype = 1` (admin global) no se aplica el check de club: puede consultar cualquier `{id}` de club.
- El `temporada` debe pertenecer al `club`, si no → 400 o 404.

---

## Pasos de desarrollo (orden recomendado)

Lista única, sin separación por fases. Cada paso es independientemente verificable.

1. **Setup**
   - `cd frontsportin && npm install chart.js ng2-charts chartjs-chart-treemap`
   - Crear rama `feature/dashboard`

2. **Modelos** — crear `src/app/model/dashboard-stats.ts` con las 9 interfaces.

3. **Servicio** — crear `src/app/service/dashboard.ts` con los 8 métodos, todos
   devolviendo `of(MOCK).pipe(delay(200))`. Los mocks deben tener la forma exacta
   del JSON esperado (ver ejemplos arriba) para que el swap a HTTP sea trivial.

4. **Rutas** — añadir en `app.routes.ts` dos entradas:
   - `/dashboard/teamadmin` con `ClubAdminGuard`
   - `/dashboard/admin` dentro de `protectedRoutes` (ya protegidas por `AdminGuard`)

5. **Sidebar** — añadir item «Dashboard» en la rama `if (isClubAdmin)` y en la rama
   `if (isAdmin)` de `sidebar.ts`, apuntando cada uno a su ruta. Verificar que
   aparece al loguearse con cada rol.

6. **KpiCardComponent** — crear en `component/shared/kpi-card/`. Inputs:
   `titulo`, `valor`, `icono`, `claseColor`, `sparklineData?` (opcional, array
   de números). Si llega `sparklineData`, renderizar mini ApexCharts dentro.

7. **Página dashboard — esqueleto (teamadmin y admin)** — crear ambos `plist.ts/html/css`
   standalone. Comparten contenido; difieren solo en la cabecera y la fuente de `idClub`:
   - Inyección de `SessionService`, `TemporadaService`, `DashboardService` (+ `ClubService` en admin)
   - Signals de estado
   - `effect()` que recarga al cambiar `temporadaSel` (y `clubSel` en admin)
   - Layout Bootstrap completo con placeholders (sin datos)

8. **Dropdowns** —
   - Teamadmin: cargar temporadas al iniciar, seleccionar la primera.
   - Admin: cargar clubes al iniciar, seleccionar el primero; al cambiar de club,
     recargar temporadas y seleccionar la primera. Verificar que el effect se dispara.

9. **KPIs K1–K9** — 9 `<app-kpi-card>` conectados al signal `stats()`. Para K6 y K7
   pasar también los datos para sparkline desde `stats().ingresos.slice(-6).map(i => i.total)`
   y `stats().deudaMensual.slice(-6).map(d => d.total)` respectivamente.

10. **G1 Bar — equipos por categoría** — `<canvas baseChart type="bar">` con
    `labels = equiposCat.map(e => e.categoria)` y un dataset `data = equiposCat.map(e => e.totalEquipos)`.

11. **G2 Doughnut — estado de pagos** — `type="doughnut"`, `labels = ['Pagados', 'Pendientes']`,
    `data = [pagosEstado.pagados, pagosEstado.pendientes]`.

12. **G5 Gauge (doughnut configurado) — % cobranza** — `type="doughnut"` con
    `options = { circumference: 180, rotation: 270, cutout: '75%' }`, dataset
    `[porcentaje, 100 - porcentaje]`. Porcentaje calculado en el componente:
    `(pagados / (pagados + pendientes)) * 100`. Texto central con plugin `afterDraw`. Sin endpoint propio.

13. **G3 Mixed — partidos por mes + win rate** — Chart.js con dos datasets en el
    mismo `<canvas baseChart type="bar">`: dataset 1 `type: 'bar', data: jugados` en eje `y`,
    dataset 2 `type: 'line', data: winRate, yAxisID: 'y1'`. Configurar `options.scales.y1`
    como eje secundario (`position: 'right'`, `min: 0`, `max: 100`). `winRate` calculado en
    el componente: `p.jugados > 0 ? p.victorias / p.jugados * 100 : 0`.

14. **G4 Area — ingresos mensuales** — `type="line"` con un único dataset y
    `fill: true` + `tension: 0.3` para efecto área.

15. **G6 Treemap — deuda por equipo** — `<canvas baseChart type="treemap">` (requiere
    `chartjs-chart-treemap` registrado). Dataset `tree: deudaEquipo`, `key: 'deuda'`,
    `labels: { display: true, formatter: ctx => ctx.raw._data.equipo }`.

16. **T1 Tabla — equipos detalle** — tabla HTML simple (`<table class="table table-striped">`)
    iterando sobre `stats().equiposDetalle`.

17. **Verificación responsive** — DevTools en 375px: todo apilable, ningún overflow,
    todas las gráficas con `options.responsive = true` y `maintainAspectRatio = false`,
    `<canvas>` envuelto en un contenedor con altura fija (`height: 280px` o similar).

18. **Polish visual** — colores coherentes, `colorClass` distintivos en KPIs
    (success / danger / info / warning), tooltips claros en gráficas.

19. **Backend `StatsApi`** — crear los 8 endpoints. Cada uno verifica que el
    `temporada` pertenece al club. Si `JWT.usertype = 2` (teamadmin) además debe
    cumplir `JWT.club === {id}`; si es `1` (admin global), puede consultar cualquier club.

20. **Swap mocks → HTTP** — en `DashboardService` reemplazar `of(MOCK)` por
    `this.oHttp.get<...>(serverURL + '/api/stats/club/${idClub}/...?temporada=${idTemp}')`.
    Un único PR/commit, fácil de revisar.

21. **Pruebas e2e manuales**
    - Login como teamadmin de Club A → ve solo sus temporadas y datos
    - Cambiar temporada → todo se recarga
    - Login como teamadmin de Club B → no puede acceder por URL a `/api/stats/club/A/...`
      (debe recibir 403)
    - Login como admin global → ve dropdown de club + dropdown de temporada; al cambiar
      cualquiera de los dos, todo se recarga. Puede consultar cualquier club sin 403.

22. **Checklist final** (ver siguiente sección).

23. **Push + PR a `main`** antes del 27 de mayo.

---

## Checklist de calidad

- [ ] `KpiCardComponent` reutilizable, sin HTML duplicado, sparkline opcional funciona
- [ ] `DashboardService` único punto de entrada HTTP de la feature
- [ ] Nombres en español: `obtenerResumen()`, no `getData()`
- [ ] Sin lógica en plantillas HTML (incluido cálculo de win rate y % cobranza en el componente)
- [ ] `StatsApi` y `StatsService` separados del código existente
- [ ] Grid responsivo: `col-12 col-md-6 col-xl-3` (KPI) + col adaptados (gráficas)
- [ ] Chart.js con `responsive: true` y `maintainAspectRatio: false` en todas las configs
- [ ] `Chart.register(...registerables, TreemapController, TreemapElement)` ejecutado una vez
- [ ] G3 mixed con dos datasets (bar + line) y eje secundario `y1` para win %
- [ ] G5 gauge (doughnut con `circumference: 180`) calculado desde G2, no endpoint propio
- [ ] G6 treemap con tooltip que muestre € formato moneda
- [ ] Sparklines K6/K7 visibles dentro de la tarjeta (ejes y leyenda ocultos)
- [ ] Dropdown de temporada visible y funcional (teamadmin y admin)
- [ ] Dropdown de club visible y funcional en la página admin
- [ ] Naming coherente: `IClubResumen`, `DashboardService`, `DashboardTeamadminPlistPage`, `DashboardAdminPlistPage`
- [ ] Sin `console.log`
- [ ] Sin imports sin usar
- [ ] `npm run build` sin errores
- [ ] Verificado responsive en 375px

---

## Flujo Git

```bash
git checkout -b feature/dashboard
# desarrollar...
git push -u origin feature/dashboard
# Abrir PR → main antes del 27 de mayo
```

❌ Se rechazarán PRs desde `main` o `master`.
