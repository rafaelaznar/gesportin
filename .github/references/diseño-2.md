# Diseño de UI para el perfil Administrador de club (tipousuario id=2)

Guía de referencia exhaustiva del diseño visual y de marcado HTML para todas las vistas
(`plist`, `detail` y `form`) del perfil **Administrador de club** (teamadmin) en la aplicación
frontsportin. Debe aplicarse de forma uniforme a todas las entidades gestionadas por este perfil.

---

## 1. Principios generales

- El stack de UI es **Bootstrap 5.3** + **Bootstrap Icons 1.13** + **Angular Material 20**.
  Angular Material se usa exclusivamente para diálogos (`MatDialog` vía `ModalService`) y
  notificaciones (`MatSnackBar`). No se usan componentes Material para maquetación de páginas.
- El perfil teamadmin **no dispone de menú lateral ni sidebar propio**. Toda la navegación se
  realiza mediante **breadcrumbs contextuales** que reflejan la jerarquía de entidades y
  **enlaces directos** en tarjetas y contadores.
- Rutas: todos los segmentos de URL incluyen el sufijo `/teamadmin` para distinguirlos de las
  rutas del Administrador global. Ejemplo: `/equipo/teamadmin`, `/equipo/teamadmin/view/5`.
- Guard de acceso: todas las rutas teamadmin se protegen con `ClubAdminGuard`, que verifica
  sesión activa y `tipousuario.id === 2`.
- Restricción de datos: el backend filtra automáticamente los datos al club del usuario
  autenticado (🔒). El frontend no necesita enviar el `id_club`; simplemente confía en el
  filtrado del servidor.
- Paleta de colores: idéntica a la del Administrador (Sección 1 del perfil id=1).
- Los componentes son **standalone**; importar solo lo que se usa.
- Estado del componente manejado con **Angular Signals** (`signal`, `computed`).
- Escala de fuente reducida (`small`, `fs-5`, `fw-semibold`) para maximizar la densidad de
  información, igual que en el perfil Administrador.

---

## 2. Navegación por breadcrumbs (sin menú)

### 2.1 Componente compartido `app-breadcrumb`

- **Selector**: `<app-breadcrumb [items]="breadcrumbItems()"></app-breadcrumb>`.
- **Interfaz del modelo**:
  ```typescript
  export interface BreadcrumbItem {
    label: string;
    route?: string;   // undefined → elemento activo (sin enlace)
  }
  ```
- **Renderizado**: `<nav aria-label="breadcrumb">` → `<ol class="breadcrumb mb-0">` con
  `<li class="breadcrumb-item">` por cada ítem. El último ítem (sin `route`) lleva
  `class="breadcrumb-item active" aria-current="page"`.
- **Estilos**: fuente `0.85rem`, sin fondo, enlaces de color primario con subrayado al hover.

### 2.2 Construcción dinámica de la miga de pan

#### Regla arquitectónica fundamental

> **Los breadcrumbs viven exclusivamente en `app/page`, nunca en `app/component`.**
>
> El componente `app-breadcrumb` se importa y se renderiza desde la **página wrapper**
> (`page/<entidad>/teamadmin/plist/plist.ts` + `.html`). El componente de presentación
> (`component/<entidad>/teamadmin/plist/`) no conoce ni importa nada relacionado con
> breadcrumbs.

#### Patrón canónico de construcción del breadcrumb

El patrón se extrae de `app/page/usuario/teamadmin/plist/plist.ts`:

1. **Signal del ID padre inicializado a `0`** (no `undefined`):
   ```typescript
   id_club = signal<number>(0);
   ```

2. **Signal `breadcrumbItems` con valor preliminar estático** (usando el ID del signal como
   placeholder):
   ```typescript
   breadcrumbItems = signal<BreadcrumbItem[]>([
     { label: 'Mis Clubes', route: '/club/teamadmin' },
     { label: '' + this.id_club(), route: '/club/teamadmin/' + this.id_club() },
     { label: 'Usuarios' },
   ]);
   ```

3. **`ngOnInit()` en tres pasos**:
   a. Leer el parámetro de ruta y actualizar el signal del ID padre.
   b. Llamar al servicio del padre para obtener su nombre real.
   c. En el callback `next`, llamar a `this.breadcrumbItems.set([...])` con los etiquetas
      reales (nombres de entidad, no IDs) y las rutas correctas.

   ```typescript
   ngOnInit(): void {
     const idParam = this.route.snapshot.paramMap.get('id_club');
     if (idParam) {
       this.id_club.set(Number(idParam));
     }
     this.clubService.get(this.id_club()).subscribe(club => {
       this.breadcrumbItems.set([
         { label: 'Mis Clubes', route: '/club/teamadmin' },
         { label: club.nombre, route: '/club/teamadmin/' + this.id_club() },
         { label: 'Usuarios' },
       ]);
     });
   }
   ```

#### Regla sobre los nombres de entidad en el breadcrumb

- Nunca mostrar IDs numéricos en el breadcrumb. El label debe ser siempre el nombre
  descriptivo de la entidad (`club.nombre`, `temporada.descripcion`, `equipo.nombre`, etc.).
- Si la cadena de FK es profunda (ej. equipo → categoría → temporada → club), el servicio
  del nivel más cercano al listado ya devuelve las relaciones anidadas; se usa la estructura
  del modelo para extraer los nombres de cada nivel.
- Cuando la entidad padre no existe en la ruta (ruta raíz sin FK), el breadcrumb se queda
  con los labels genéricos de categoría (ej. `'Temporadas'`, `'Noticias'`).

#### Ejemplo completo — equipo filtrado por categoría

```typescript
// page/equipo/teamadmin/plist/plist.ts
id_categoria = signal<number>(0);

breadcrumbItems = signal<BreadcrumbItem[]>([
  { label: 'Mis Clubes', route: '/club/teamadmin' },
  { label: 'Temporadas', route: '/temporada/teamadmin' },
  { label: 'Categorías', route: '/categoria/teamadmin' },
  { label: 'Equipos' },
]);

ngOnInit(): void {
  const idParam = this.route.snapshot.paramMap.get('id_categoria');
  if (idParam) {
    this.id_categoria.set(Number(idParam));
    this.categoriaService.get(this.id_categoria()).subscribe({
      next: (cat) => {
        const temp = cat.temporada;
        const items: BreadcrumbItem[] = [
          { label: 'Mis Clubes', route: '/club/teamadmin' },
        ];
        if (temp?.club) {
          items.push({ label: temp.club.nombre, route: `/club/teamadmin/view/${temp.club.id}` });
        }
        items.push({ label: 'Temporadas', route: '/temporada/teamadmin' });
        if (temp) {
          items.push({ label: temp.descripcion, route: `/temporada/teamadmin/view/${temp.id}` });
        }
        items.push({
          label: 'Categorías',
          route: temp ? `/categoria/teamadmin/temporada/${temp.id}` : '/categoria/teamadmin',
        });
        items.push({ label: cat.nombre, route: `/categoria/teamadmin/view/${cat.id}` });
        items.push({ label: 'Equipos' });
        this.breadcrumbItems.set(items);
      },
      error: () => {},
    });
  }
}
```

#### Tabla de servicios y campos para cada entidad breadcrumb

| Entidad | FK del param | Servicio | Campo nombre | Profundidad |
|---------|-------------|---------|-------------|------------|
| temporada | `id_club` | `ClubService.get()` | `club.nombre` | 1 |
| categoria | `id_temporada` | `TemporadaService.get()` | `temp.descripcion`, `temp.club.nombre` | 2 |
| equipo | `id_categoria` | `CategoriaService.get()` | `cat.nombre`, `cat.temporada.*`, `cat.temporada.club.*` | 3 |
| jugador | `id_equipo` | `EquipoService.get()` | igual que equipo | 4 |
| jugador | `id_usuario` | `UsuarioService.get()` | `usuario.nombre + apellido1` | 1 (vía Usuarios) |
| cuota | `id_equipo` | `EquipoService.get()` | igual que equipo | 4 |
| liga | `id_equipo` | `EquipoService.get()` | igual que equipo | 4 |
| partido | `id_liga` | `LigaService.get()` | `liga.nombre`, `liga.equipo.*` | 5 |
| pago | `id_cuota` | `CuotaService.get()` | `cuota.descripcion`, `cuota.equipo.*` | 5 |
| pago | `id_jugador` | `JugadorService.getById()` | `jugador.usuario.*`, `jugador.equipo.*` | 5 |
| noticia | `id_club` | `ClubService.get()` | `club.nombre` | 1 |
| comentario | `id_noticia` | `NoticiaService.getById()` | `noticia.titulo` | 1 |
| tipoarticulo | `id_club` | `ClubService.get()` | `club.nombre` | 1 |
| articulo | `id_tipoarticulo` | `TipoarticuloService.get()` | `tipoarticulo.descripcion` | 1 |
| puntuacion | `id_noticia` | `NoticiaService.getById()` | `noticia.titulo` | 1 |
| puntuacion | `id_usuario` | `UsuarioService.get()` | `usuario.nombre + apellido1` | 1 |
| factura | `id_usuario` | `UsuarioService.get()` | `usuario.nombre + apellido1` | 1 |
| compra | `id_articulo` | `ArticuloService.get()` | `articulo.nombre` | 1 |
| carrito | `id_articulo` | `ArticuloService.get()` | `articulo.nombre` | 1 |
| carrito | `id_usuario` | `UsuarioService.get()` | `usuario.nombre + apellido1` | 1 |
| comentarioart | `id_articulo` | `ArticuloService.get()` | `articulo.nombre` | 1 |
| comentarioart | `id_usuario` | `UsuarioService.get()` | `usuario.nombre + apellido1` | 1 |

### 2.3 Jerarquía de navegación del perfil teamadmin

La cadena de entidades para el breadcrumb sigue la estructura jerárquica del modelo de datos:

```
Mis Clubes
├── Temporadas
│   └── Categorías
│       └── Equipos
│           ├── Jugadores   ← también accesible desde Usuarios (ruta dual, ver Sección 13)
│           ├── Cuotas → Pagos
│           └── Ligas → Partidos
├── Noticias
│   ├── Comentarios
│   └── Puntuaciones
├── Tipos de Artículo
│   └── Artículos
│       ├── Comentarios de artículo
│       ├── Compras
│       └── Carritos
├── Usuarios
│   ├── Jugadores   ← misma entidad que en Equipos, breadcrumb alternativo (ver Sección 13)
│   └── Facturas
└── (entidades de solo lectura para el club admin)
```

### 2.4 Regla de la raíz `Mis Clubes`

El primer ítem del breadcrumb siempre es `{ label: 'Mis Clubes', route: '/club/teamadmin' }`.
Este punto de entrada muestra los clubes que gestiona el usuario (filtrado por backend).
Desde ahí, los contadores enlazados en las tarjetas permiten navegar al listado filtrado de
cada entidad hija.

### 2.5 Breadcrumb en vistas `detail`, `form` y páginas `new`/`edit`/`delete`

- Las vistas `detail` no usan el componente `app-breadcrumb`. En su lugar muestran una
  **cabecera de sección** con botón "Volver" que regresa al listado teamadmin correspondiente.
- Las vistas `form` tampoco usan breadcrumb; la navegación de retorno se controla con el
  `returnUrl` pasado como `@Input`.
- Las páginas wrapper (`new`, `edit`, `delete`) montan directamente el componente sin añadir
  breadcrumb propio; la cabecera del componente ya provee la navegación de regreso.

---

## 3. Estructura de archivos del componente teamadmin

Cada entidad gestionada por el Administrador de club sigue esta estructura:

- `component/<entidad>/teamadmin/plist/` → plist.ts + plist.html + plist.css
- `component/<entidad>/teamadmin/detail/` → detail.ts + detail.html + detail.css
- `component/<entidad>/teamadmin/form/` → form.ts + form.html + form.css (si la entidad es editable)
- `page/<entidad>/teamadmin/plist/` → plist.ts + plist.html (wrapper mínimo)
- `page/<entidad>/teamadmin/view/` → view.ts (wrapper inline o con template)
- `page/<entidad>/teamadmin/new/` → new.ts (wrapper del form en modo crear)
- `page/<entidad>/teamadmin/edit/` → edit.ts (wrapper del form en modo editar)
- `page/<entidad>/teamadmin/delete/` → delete.ts + delete.html (confirmación de borrado)

**Todas las entidades tienen su propio componente `plist` teamadmin independiente** (implementación
completa con layout de tarjetas). No se reutilizan componentes admin para el listing teamadmin.

Las entidades que **sí** comparten el componente admin para otros usos (formularios modales,
selección de entidades) siguen el patrón `@Input() strRole: string = ''` en sus `.ts`:
- El plist admin incluye `@Input() strRole: string = ''` para activar rutas `/teamadmin/...`
  cuando se usa como selector de entidad en formularios teamadmin.
- Los formularios teamadmin abren el plist admin en modo diálogo vía `ModalService` para
  seleccionar registros de entidades relacionadas (ver Sección 8.4).

**Patrón `strRole` en plists admin compartidos**: los plists admin que también usa el club
admin como selector modal incluyen en su `.ts` la propiedad `@Input() strRole: string = ''`
y en su `.html` modifican el botón crear con la condición `@if (!session.isClubAdmin() || strRole)`
y la ruta dinámica `[routerLink]="strRole ? ['/<entidad>', strRole, 'new'] : ['/<entidad>/new']"`.  
El wrapper teamadmin pasa `strRole="teamadmin"` al componente compartido cuando lo abre como modal.

---

## 4. Diseño del componente `plist` (listado)

El perfil teamadmin dispone de **dos layouts estándar** para componentes plist. Cada nuevo
componente plist debe usar **exactamente uno** de los dos modelos; no se mezclan ni se
inventan variantes.

---

### 4.1 Plist tipo LISTA (tabla) — modelo: `usuario/teamadmin`

Usado para entidades con muchos campos tabulares o donde la comparación columnar es relevante.
**Referencia canónica**: `component/usuario/teamadmin/plist/`

#### 4.1.1 TypeScript

```typescript
@Component({
  standalone: true,
  selector: 'app-<entidad>-teamadmin-plist',
  imports: [RouterLink, Paginacion, BotoneraActionsPlist],
  // Añadir TrimPipe si se truncan textos; NO importar BotoneraRpp
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class <Entidad>TeamadminPlist implements OnInit, OnDestroy {
  @Input() id_<padre>?: number;   // FK opcional; omitir si no hay filtro

  oPage = signal<IPage<I<Entidad>> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10);    // siempre 10, NO exponer al usuario
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  // Búsqueda de texto (si aplica)
  nombre = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  private <entidad>Service = inject(<Entidad>Service);
  private modalRef = inject(MODAL_REF, { optional: true });

  ngOnInit() {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((term) => { this.nombre.set(term); this.numPage.set(0); this.getPage(); });
    this.getPage();
  }

  ngOnDestroy() { this.searchSubscription?.unsubscribe(); }

  getPage() {
    this.<entidad>Service.getPage(
      this.numPage(), this.numRpp(), this.orderField(), this.orderDirection(),
      this.nombre(), this.id_<padre> ?? 0
    ).subscribe({
      next: (data) => {
        this.oPage.set(data);
        if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
          this.numPage.set(data.totalPages - 1);
          this.getPage();
        }
      },
      error: (err) => console.error(err),
    });
  }

  onOrder(field: string) {
    if (this.orderField() === field) {
      this.orderDirection.set(this.orderDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.orderField.set(field);
      this.orderDirection.set('asc');
    }
    this.numPage.set(0);
    this.getPage();
  }

  goToPage(n: number) { this.numPage.set(n); this.getPage(); }
  onSearch(v: string) { this.searchSubject.next(v); }
  isDialogMode() { return !!this.modalRef; }
  onSelect(item: I<Entidad>) { this.modalRef?.close(item); }
}
```

**Reglas del `.ts` tipo lista**:
- `numRpp` fijo a **10**. No se importa ni usa `BotoneraRpp`.
- Búsqueda de texto con debounce vía `Subject<string>` + `debounceTimeSearch`.
- Si el filtro es por FK (ej. `id_club`), la barra de búsqueda se oculta cuando el `@Input` tiene valor.
- `MODAL_REF` se inyecta como opcional para soportar uso como selector modal.

#### 4.1.2 Template HTML

```html
<div>
  <!-- 1. Barra de búsqueda: solo si NO hay filtro FK activo -->
  @if (!id_<padre> || id_<padre> === 0) {
    <div class="d-flex justify-content-center my-2">
      <input
        class="form-control me-2"
        type="search"
        placeholder="Buscar por <campo>"
        aria-label="Search"
        (input)="onSearch($any($event.target).value)"
        [value]="nombre()"
        name="searchField"
      />
    </div>
  }

  <!-- 2. Contador total + filtro de texto activo -->
  <div class="d-flex justify-content-center my-1">
    <small class="text-muted">Total registros: {{ totalRecords() || 0 }}</small>
    @if (nombre() && nombre().length > 0) {
      <small class="text-muted ms-3">Filtro: búsqueda contiene "{{ nombre() }}"</small>
    }
  </div>

  <!-- 3. Botón crear (oculto en modo diálogo y si entidad no es editable) -->
  @if (!isDialogMode()) {
    <div class="d-flex my-1">
      <div class="w-100 d-flex justify-content-center">
        <a class="btn btn-primary new-btn"
           [routerLink]="['/<entidad>/teamadmin/new']"
           [queryParams]="id_<padre> ? { id_<padre>: id_<padre> } : {}"
           role="button">
          <i class="bi bi-plus-circle me-2" aria-hidden="true"></i>
          <span class="d-none d-sm-inline">Crear <entidad></span>
        </a>
      </div>
    </div>
  }

  <!-- 4. Paginación: solo si hay más de 1 página -->
  @if (totalRecords() > 0 && (oPage()?.totalPages ?? 1) > 1) {
    <div class="container-fluid p-0 my-1">
      <div class="controls-row mb-2">
        <div class="col-control left">
          <app-paginacion
            [numPage]="numPage()"
            [numPages]="oPage()?.totalPages || 1"
            (pageChange)="goToPage($event)"
          ></app-paginacion>
        </div>
      </div>
    </div>
  }

  <!-- 5. Tabla -->
  <div class="d-flex justify-content-center">
    <div class="table-responsive w-100">
      <table class="table table-striped table-bordered table-sm w-100">
        <thead>
          <tr>
            <th scope="col" (click)="onOrder('id')" style="cursor: pointer; width: 6%">
              <div class="header-stacked">
                <div class="header-top">
                  <i class="bi bi-hash" aria-hidden="true"></i>
                  @if (orderField() === 'id') {
                    @if (orderDirection() === 'asc') { <i class="bi bi-caret-up-fill"></i> }
                    @if (orderDirection() === 'desc') { <i class="bi bi-caret-down-fill"></i> }
                  }
                </div>
                <span>ID</span>
              </div>
            </th>
            <!-- Columnas de campos: (click)="onOrder('<campo>')" y header-stacked -->
            <!-- Columnas de contadores: class="d-none d-lg-table-cell text-center" -->
            <th scope="col" class="text-center" style="width: 14%">
              <div class="header-stacked">
                <div class="header-top"><i class="bi bi-gear" aria-hidden="true"></i></div>
                <span>Acciones</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          @for (oItem of oPage()?.content; track oItem.id) {
            <tr (click)="onSelect(oItem)" [style.cursor]="isDialogMode() ? 'pointer' : 'default'">
              <th scope="row" class="text-center">{{ oItem.id }}</th>
              <!-- Celdas de campos -->
              <!-- Contadores con routerLink teamadmin o bi-ban si 0 -->
              <td class="text-center">
                <app-botonera-actions-plist
                  [id]="oItem.id"
                  strEntity="<entidad>"
                  strRole="teamadmin"
                ></app-botonera-actions-plist>
              </td>
            </tr>
          }
          @empty {
            <tr>
              <td colspan="<N>" class="text-center text-muted py-3">No se encontraron registros</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>
</div>
```

**Reglas del template tipo lista**:
- `numRpp` **nunca** se muestra ni se pasa a `app-botonera-rpp`. No existe botonera RPP.
- La paginación (`app-paginacion`) se muestra **solo si `totalPages > 1`**.
- Cabeceras de columna con `<div class="header-stacked">`: icono arriba, label abajo, flechas de orden si corresponde.
- Columnas informativas opcionales con `class="d-none d-md-table-cell"` o `d-none d-lg-table-cell`.
- Contadores en celdas: `<a [routerLink]="['/hija/teamadmin/padre', oItem.id]">` si `> 0`; `<i class="bi bi-ban">` si `= 0`.
- Fila `@empty` con `colspan` igual al número de columnas.

#### 4.1.3 CSS

```css
.controls-row { display: flex; flex-wrap: nowrap; gap: 0.5rem; align-items: center; }
.controls-row .col-control { flex: 1 1 50%; display: flex; align-items: center; }
.controls-row .col-control.left { justify-content: flex-start; }
.controls-row .col-control.right { justify-content: flex-end; }
.new-btn { display: inline-block; margin: 10px auto; }
.controls-row app-paginacion { display: inline-flex; justify-content: center; }
@media (max-width: 850px) {
  .controls-row { flex-wrap: wrap; justify-content: center; }
  .controls-row .col-control { flex: 1 1 100%; justify-content: center; }
}
```

---

### 4.2 Plist tipo CARD (tarjetas) — modelo: `temporada/teamadmin`

Usado para entidades que se presentan mejor con tarjetas visuales (más campos descriptivos,
contadores relacionados, navegación jerarquizada).
**Referencia canónica**: `component/temporada/teamadmin/plist/`

#### 4.2.1 TypeScript

```typescript
@Component({
  standalone: true,
  selector: 'app-<entidad>-teamadmin-plist',
  imports: [Paginacion, RouterLink, TrimPipe, BotoneraActionsPlist],
  // Añadir TrimPipe si se truncan textos; NO importar BotoneraRpp
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class <Entidad>TeamadminPlist implements OnInit, OnDestroy {
  @Input() id_<padre>?: number;   // FK opcional

  oPage = signal<IPage<I<Entidad>> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10);    // siempre 10, NO exponer al usuario
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  // Campo de búsqueda de texto
  descripcion = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  private <entidad>Service = inject(<Entidad>Service);

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((term) => { this.descripcion.set(term); this.numPage.set(0); this.getPage(); });
    this.getPage();
  }

  ngOnDestroy(): void { this.searchSubscription?.unsubscribe(); }

  getPage(): void {
    this.<entidad>Service.getPage(
      this.numPage(), this.numRpp(), this.orderField(), this.orderDirection(),
      this.descripcion(), this.id_<padre> ?? 0
    ).subscribe({
      next: (data) => {
        this.oPage.set(data);
        if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
          this.numPage.set(data.totalPages - 1);
          this.getPage();
        }
      },
      error: (err) => console.error(err),
    });
  }

  goToPage(n: number): void { this.numPage.set(n); this.getPage(); }
  onSearchDescription(v: string) { this.searchSubject.next(v); }
}
```

**Reglas del `.ts` tipo card**:
- `numRpp` fijo a **10**. No se importa ni usa `BotoneraRpp`.
- No se inyecta `MODAL_REF` (las cards no se usan como selector modal).
- La búsqueda de texto siempre visible (no depende de FK).

#### 4.2.2 Template HTML

```html
<div>
  <!-- 1. Barra de búsqueda (siempre visible) -->
  <div class="d-flex justify-content-center my-2">
    <input
      class="form-control me-2"
      type="search"
      placeholder="Buscar por descripción"
      aria-label="Search"
      (input)="onSearchDescription($any($event.target).value)"
      [value]="descripcion()"
      name="searchDescription"
    />
  </div>

  <!-- 2. Contador total + filtro de texto activo -->
  <div class="d-flex justify-content-center my-1">
    <small class="text-muted">Total registros: {{ totalRecords() || 0 }}</small>
    @if (descripcion().length > 0) {
      <small class="text-muted ms-3">Filtro: descripción contiene "{{ descripcion() }}"</small>
    }
  </div>

  <!-- 3. Paginación: solo si hay más de 1 página -->
  @if (totalRecords() > 0 && (oPage()?.totalPages ?? 1) > 1) {
    <div class="container-fluid p-0 my-1">
      <div class="controls-row mb-2">
        <div class="col-control left">
          <app-paginacion
            [numPage]="numPage()"
            [numPages]="oPage()?.totalPages || 1"
            (pageChange)="goToPage($event)"
          ></app-paginacion>
        </div>
      </div>
    </div>
  }

  <!-- 4. Botón crear -->
  <div class="d-flex my-1">
    <div class="w-100 d-flex justify-content-center">
      <a class="btn btn-primary new-btn"
         [routerLink]="['/<entidad>/teamadmin/new']"
         [queryParams]="id_<padre> ? { id_<padre>: id_<padre> } : {}"
         role="button">
        <i class="bi bi-plus-circle" aria-hidden="true"></i>
        <span class="d-none d-sm-inline">Crear <entidad></span>
      </a>
    </div>
  </div>

  <!-- 5. Grid de cards -->
  <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
    @for (oItem of oPage()?.content; track oItem.id) {
      <div class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-header">
            <h5 class="card-title mb-0">ID {{ oItem.id }}</h5>
          </div>
          <div class="card-body">
            <!-- Campo descriptivo principal -->
            <p class="card-text"><strong>Descripción:</strong> {{ oItem.descripcion }}</p>
            <!-- Relaciones ManyToOne con enlace teamadmin -->
            <p class="card-text">
              <strong><Relación>:</strong>
              <a [routerLink]="['/<relacion>/teamadmin/view', oItem.<relacion>.id]">
                {{ oItem.<relacion>.campo | trim: 20 }} ({{ oItem.<relacion>.id }})
              </a>
            </p>
            <!-- Contadores badge (filosofía 0 = puerta de creación, ver 4.11) -->
            <div class="d-flex flex-wrap gap-2 align-items-center">
            </div>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <!-- Badge(s) de contador de entidades hijas -->
            @if (oItem.hijas === 0) {
              <a [routerLink]="['/<hija>/teamadmin/new']"
                 [queryParams]="{ id_<entidad>: oItem.id }"
                 class="badge big-badge bg-warning text-dark text-decoration-none"
                 title="Crear primera <hija>">
                <i class="bi bi-plus-circle me-1"></i>0 <hijas>
              </a>
            } @else {
              <a [routerLink]="['/<hija>/teamadmin/<entidad>', oItem.id]"
                 class="badge big-badge bg-primary text-decoration-none"
                 title="Ver <hijas>">
                <i class="bi bi-<icono> me-1"></i>{{ oItem.hijas }} <hijas>
              </a>
            }
            <app-botonera-actions-plist
              [id]="oItem.id"
              strEntity="<entidad>"
              strRole="teamadmin"
            ></app-botonera-actions-plist>
          </div>
        </div>
      </div>
    }
  </div>
</div>
```

**Reglas del template tipo card**:
- `numRpp` **nunca** se muestra ni se pasa a `app-botonera-rpp`. No existe botonera RPP.
- La paginación (`app-paginacion`) se muestra **solo si `totalPages > 1`**.
- El botón crear **siempre visible** (no condicionado a `isDialogMode`), excepto si la entidad
  es de solo lectura para el club admin.
- Cards con `class="card h-100 shadow-sm"`, header con `<h5 class="card-title mb-0">ID N</h5>`.
- Footer con `d-flex justify-content-between`: contadores de hijas a la izquierda,
  `app-botonera-actions-plist` a la derecha.
- Aplicar filosofía «0 = puerta de creación» del apartado 4.11.

#### 4.2.3 CSS

```css
.controls-row { display: flex; flex-wrap: nowrap; gap: 0.5rem; align-items: center; }
.controls-row .col-control { flex: 1 1 50%; display: flex; align-items: center; }
.controls-row .col-control.left { justify-content: flex-start; }
.controls-row .col-control.right { justify-content: flex-end; }
.new-btn { display: inline-block; margin: 10px auto; }
.controls-row app-paginacion { display: inline-flex; justify-content: center; }
@media (max-width: 850px) {
  .controls-row { flex-wrap: wrap; justify-content: center; }
  .controls-row .col-control { flex: 1 1 100%; justify-content: center; }
}
```

---

### 4.3 Tabla comparativa de los dos layouts

| Aspecto | Tipo LISTA (tabla) | Tipo CARD (tarjetas) |
|---------|-------------------|---------------------|
| Referencia | `usuario/teamadmin` | `temporada/teamadmin` |
| Layout HTML | `<table>` con `thead`/`tbody` | `row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4` |
| `numRpp` por defecto | 10 | 10 |
| Botonera RPP | **No existe** | **No existe** |
| Paginación | Solo si `totalPages > 1` | Solo si `totalPages > 1` |
| Búsqueda de texto | Cuando no hay FK activa | Siempre visible |
| Botón crear | Solo si `!isDialogMode()` | Siempre visible (si aplica) |
| Modo diálogo | Sí (soporta `MODAL_REF`) | No |
| Ordenación por columna | Sí (`onOrder()`, flechas) | No |
| Contadores | Celdas con link o `bi-ban` | Badges en `card-footer` |
| Fila vacía | `@empty` con `colspan` | No aplica |
| Admin (id=1) | Tabla igual, con `BotoneraRpp` | No aplica (admin siempre tabla) |

---

### 4.4 Filosofía «0 = puerta de entrada a creación»

El perfil teamadmin **no dispone de menú lateral** y solo puede navegar mediante breadcrumbs
y los enlaces de las tarjetas. Para garantizar que el club admin nunca quede bloqueado ante
entidades sin registros hijos, se aplica la siguiente regla:

> **Cuando un contador de entidad hija vale 0, el badge gris estático se convierte en un
> enlace de creación amarillo** que lleva directamente al formulario de alta fijando el FK
> del padre vía `queryParam`.

#### Regla de estilos

| Estado del contador | Clase CSS del badge | Icono | Comportamiento |
|---|---|---|---|
| `> 0` registros | `badge bg-primary text-decoration-none` | icono de la entidad | Navega al listado filtrado de hijos |
| `= 0` con creación permitida | `badge bg-warning text-dark text-decoration-none` | `bi-plus-circle` | Navega al formulario de alta con FK precargado |
| `= 0` solo lectura (contenido de usuario) | `badge bg-secondary opacity-75` | `bi-x-circle` | No interactivo — sin cambio |

#### Mapeado completo padre → hijo (teamadmin)

| Plist padre | Contador → entidad hija | Ruta de creación | queryParam |
|---|---|---|---|
| Club (`/club/teamadmin`) | `temporadas` | `/temporada/teamadmin/new` | — (club implícito en sesión) |
| Club (`/club/teamadmin`) | `noticias` | `/noticia/teamadmin/new` | — |
| Club (`/club/teamadmin`) | `tipoarticulos` | `/tipoarticulo/teamadmin/new` | — |
| Club (`/club/teamadmin`) | `usuarios` | `/usuario/teamadmin/new` | — |
| Temporada (`/temporada/teamadmin`) | `categorias` | `/categoria/teamadmin/new` | `id_temporada` |
| Categoría (`/categoria/teamadmin`) | `equipos` | `/equipo/teamadmin/new` | `id_categoria` |
| Equipo (`/equipo/teamadmin`) | `jugadores` | `/jugador/teamadmin/new` | `id_equipo` |
| Equipo (`/equipo/teamadmin`) | `cuotas` | `/cuota/teamadmin/new` | `id_equipo` |
| Equipo (`/equipo/teamadmin`) | `ligas` | `/liga/teamadmin/new` | `id_equipo` |
| Liga (unrouted teamadmin) | `partidos` | `/partido/teamadmin/new` | `id_liga` |
| Cuota (teamadmin plist propio) | `pagos` | `/pago/teamadmin/new` | `id_cuota` |
| Tipo artículo (admin plist, `strRole='teamadmin'`) | `articulos` | `/articulo/teamadmin/new` | `id_tipoarticulo` |

#### Entidades NO convertidas (contenido generado por usuarios finales)

Los siguientes contadores **permanecen como badge gris estático** porque los registros hijos
los crea el usuario final (tipousuario=3), no el club admin:

- Noticia → `comentarios`, `puntuaciones`
- Artículo → `comentarioarts`, `compras`, `carritos`

#### Implementación en plists standalone teamadmin (badge cards)

```html
@if (oEntidad.contador === 0) {
  <a
    [routerLink]="['/<entidadHija>/teamadmin/new']"
    [queryParams]="{ id_<entidadPadre>: oEntidad.id }"
    class="badge bg-warning text-dark text-decoration-none"
    title="Crear primera/primer <entidadHija>"
  >
    <i class="bi bi-plus-circle me-1"></i>0 <nombreHija>
  </a>
} @else {
  <a
    [routerLink]="['/<entidadHija>/teamadmin/<entidadPadre>', oEntidad.id]"
    class="badge bg-primary text-decoration-none"
    title="Ver <nombreHija>"
  >
    <i class="bi bi-<icono> me-1"></i>{{ oEntidad.contador }} <nombreHija>
  </a>
}
```

**Nota para el plist raíz Club**: Las rutas de creación desde el plist de club **no incluyen
queryParam de club** porque el backend asigna automáticamente el club desde la sesión del
usuario autenticado (idéntico al comportamiento del botón «Nueva Temporada» existente).

#### Implementación en plists admin compartidos (tabla, con `strRole`)

Los plists admin que también usa el club admin via `strRole="teamadmin"` usan una condición
doble: solo muestran el enlace de creación cuando `strRole === 'teamadmin'` y no están en
modo diálogo:

```html
@if (!oCuota.pagos || oCuota.pagos === 0) {
  @if (strRole === 'teamadmin') {
    <a [routerLink]="['/pago/teamadmin/new']"
       [queryParams]="{ id_cuota: oCuota.id }"
       class="text-warning"
       title="Crear primer pago">
      <i class="bi bi-plus-circle" aria-hidden="true"></i>
    </a>
  } @else {
    <i class="bi bi-ban" aria-hidden="true"></i>
  }
} @else {
  <a [routerLink]="[session.isClubAdmin() ? '/pago/teamadmin/cuota' : '/pago/cuota', oCuota.id]">
    {{ oCuota.pagos }}
  </a>
}
```

Esto garantiza que el administrador global (tipousuario=1) sigue viendo el icono `bi-ban`
sin cambios en su experiencia.

---

## 5. Diseño del componente `detail` (detalle de solo lectura)

### 5.1 Estructura raíz

- `<div class="container-fluid">` como contenedor raíz.

### 5.2 Cabecera de sección

- `<div class="d-flex flex-wrap align-items-center justify-content-between gap-2 border rounded bg-light p-2 mb-3">` con dos hijos:
  - `<div>` con:
    - `<div class="text-uppercase small text-muted fw-semibold"><Entidades en plural></div>`
    - `<div class="fw-bold">Detalle de <entidad></div>`
    - `<div class="text-muted small">Panel administrador de club</div>`
  - Botón volver: `<a class="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2" routerLink="/<entidad>/teamadmin"><i class="bi bi-arrow-left"></i> Volver</a>`.

**Nota**: la tercera línea dice **"Panel administrador de club"** (distinto del admin global
que dice "Panel administrativo").

### 5.3 Estado de carga y error

Idénticos al perfil Administrador (Secciones 4.3 y 4.4 del perfil id=1).

### 5.4 Tarjeta principal de datos

Condición: `@if (!loading() && !error() && oEntidad())`.

Estructura idéntica al perfil Administrador (Sección 4.5 del perfil id=1):
- Card header con `bg-primary text-white`, icono, nombre descriptivo y badge de ID.
- Card body con `row g-1` de pares `col-5/col-7`.

### 5.5 Campos propios de la entidad

Reglas idénticas al perfil Administrador (Sección 4.6 del perfil id=1).

### 5.6 Secciones de relaciones ManyToOne (anidadas)

Misma jerarquía de colores que el perfil Administrador:
- **Nivel 1**: `border-info` / `bg-info bg-opacity-10` / `text-info`.
- **Nivel 2**: `border-success` / `bg-success bg-opacity-10` / `text-success`.
- **Nivel 3** (cuando la jerarquía llega a un tercer nivel, por ejemplo
  Equipo → Categoría → Temporada → Club): `border-warning` / `bg-warning bg-opacity-10` /
  `text-warning`.

Los enlaces de relaciones anidadas apuntan a las rutas `/teamadmin/view/`:
```html
<a [routerLink]="['/<relacion>/teamadmin/view', oEntidad()?.relacion?.id]"
   class="ms-auto badge bg-info text-white text-decoration-none small">
  {{ oEntidad()?.relacion?.campoDescriptivo }}
  <span class="opacity-75 ms-1">#{{ oEntidad()?.relacion?.id }}</span>
  <i class="bi bi-box-arrow-up-right ms-1"></i>
</a>
```

### 5.7 Sección de contadores (OneToMany)

Patrón idéntico al perfil Administrador (Sección 4.9 del perfil id=1), pero todos los
`routerLink` usan rutas `/teamadmin/`:

```html
<a [routerLink]="['/<entidadHija>/teamadmin/<entidad>', oEntidad()?.id]"
   class="text-decoration-none">{{ oEntidad()?.contador }}</a>
```

**Patrón adicional — botón de creación rápida en contadores con valor 0**:

Cuando un contador es 0, el detail teamadmin puede incluir un botón `+` junto al cero para
crear un registro hijo directamente:
```html
@if ((oEntidad()?.contador ?? 0) > 0) {
  <a [routerLink]="['/<entidadHija>/teamadmin/<entidad>', oEntidad()?.id]"
     class="text-decoration-none">{{ oEntidad()?.contador }}</a>
} @else {
  0
  <a [routerLink]="['/<entidadHija>/teamadmin/new']"
     [queryParams]="{ id_<entidad>: oEntidad()?.id }"
     class="btn btn-outline-success btn-sm ms-1 py-0 px-1"
     title="Crear <entidadHija> para este <entidad>">
    <i class="bi bi-plus-lg"></i>
  </a>
}
```

### 5.8 CSS del componente detail

- Reglas mínimas: `:host { display: block; }`.
- No importar plist-styles.css.

---

## 6. Diseño del componente `form` (formulario crear/editar)

### 6.1 Estructura raíz

- Un único `<div>` raíz sin clases de contenedor.
- El formulario teamadmin incluye estados de carga y error propios.

### 6.2 Estado de carga y error

```html
@if (loading()) {
  <div class="d-flex justify-content-center my-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
}
@if (error()) {
  <div class="alert alert-danger" role="alert">
    <i class="bi bi-exclamation-triangle me-2"></i>{{ error() }}
  </div>
}
```

### 6.3 Formulario

- `<form [formGroup]="<entidad>Form" (ngSubmit)="onSubmit()" novalidate>`.
- Solo se renderiza cuando `!loading() && !error()`.

### 6.4 Campo ID (solo lectura)

- Se muestra solo si `id() > 0` (modo edición):
  ```html
  @if (id() > 0) {
    <div class="mb-4">
      <label for="id" class="form-label">ID del <entidad></label>
      <input type="text" class="form-control" id="id" formControlName="id" readonly />
    </div>
  }
  ```

### 6.5 Campos de texto / número

Idénticos al perfil Administrador (Sección 5.4 del perfil id=1), con `mb-4` en lugar de
`mb-3` para mayor espaciado. Incluyen:
- Clases `is-invalid` e `is-valid` condicionadas al estado del control.
- `placeholder` descriptivo.
- Mensajes de error inline con `invalid-feedback`.

### 6.6 Campos de relación ManyToOne (selector por modal)

A diferencia del perfil Administrador que usa `<select>`, el perfil teamadmin usa
**selección por diálogo modal** (`ModalService`):

```html
<div class="p-4 rounded mb-4" style="background-color: #e4e4e4; border-left: 4px solid #0d6efd;">
  <div class="mb-4">
    <label for="<relacion>" class="form-label"><Relación> <span class="text-danger">*</span></label>
    <input id="<relacion>" type="text" class="form-control"
           [value]="selected<Relacion>()?.campoDescriptivo || ''" readonly />
  </div>
  <div class="d-flex gap-3 align-items-end">
    @if (id<Relacion>() <= 0) {
      <button type="button" class="btn btn-info" (click)="open<Relacion>FinderModal()">
        <i class="bi bi-search me-2"></i>Buscar
      </button>
    }
    <div>
      <label for="display_id_<relacion>" class="form-label">ID <Relación></label>
      <input type="text" class="form-control" id="display_id_<relacion>"
             formControlName="id_<relacion>" readonly />
    </div>
  </div>
</div>
```

- El bloque FK se destaca visualmente con fondo gris (`background-color: #e4e4e4`) y borde
  izquierdo azul primario (`border-left: 4px solid #0d6efd`).
- El formulario declara el ID de la FK como signal input: `id<Relacion> = input<number>(0)`.
  Cuando `id<Relacion>() > 0` (viene de queryParams via la página `new`), en `ngOnInit()` se
  precarga el campo y se carga la entidad relacionada. El botón "Buscar" se oculta con
  `@if (id<Relacion>() <= 0)` para evitar sobrescribir el valor prefijado.
- Al abrir el modal, se lanza el plist admin de la entidad relacionada en modo diálogo.
  Al seleccionar un registro el modal se cierra y el signal `selected<Relacion>` se actualiza.
- Se puede mostrar información expandida de la relación (ej. temporada de la categoría)
  mediante `<p class="form-control-plaintext">` adicionales.

**Patrón completo de pre-relleno en `ngOnInit` del formulario**:
```typescript
ngOnInit(): void {
  this.initForm();
  if (this.id() > 0) {
    this.loadById(this.id());
  } else {
    if (this.id<Relacion>() > 0) {
      this.<entidad>Form.patchValue({ id_<relacion>: this.id<Relacion>() });
      this.load<Relacion>(this.id<Relacion>());
    }
    this.loading?.set(false);
  }
}
```

### 6.7 Campos booleanos, fecha, contraseña

Mismas reglas que el perfil Administrador (Secciones 5.5, 5.7 y 5.8 del perfil id=1).

### 6.8 Botonera de acciones del formulario

```html
<div class="d-flex justify-content-between mt-4">
  <button type="button" class="btn btn-secondary" (click)="goBack()">
    <i class="bi bi-arrow-left me-2"></i>Cancelar
  </button>
  <button type="submit" class="btn btn-primary"
          [disabled]="submitting() || <entidad>Form.invalid">
    @if (submitting()) {
      <span class="spinner-border spinner-border-sm me-2"></span>
    }
    {{ id() > 0 ? 'Guardar' : 'Crear' }}
  </button>
</div>
```

- El botón "Cancelar" navega a `returnUrl` (pasado como `@Input`).
- Tras submit exitoso se navega a `returnUrl` con `?msg=...` de confirmación y se muestra un
  `MatSnackBar` como feedback inmediato.

### 6.9 Manejo de errores

- Signal `error = signal<string | null>(null)`.
- Se muestra como `<div class="alert alert-danger">` antes del formulario.
- Los errores de validación del servidor se muestran via `MatSnackBar`.

### 6.10 CSS del componente form

- Normalmente vacío salvo `:host { display: block; }`.

---

## 7. Diseño de las páginas (`page/`)

### 7.1 Página `plist` (wrapper del componente plist)

- Contenedor: `<div class="container-fluid">`.
- **Incluye breadcrumb y título `<h1>` centrado con icono**:
  ```html
  <div class="container-fluid">
    <app-breadcrumb [items]="breadcrumbItems()"></app-breadcrumb>
    <div class="d-flex justify-content-center my-3">
      <h1 class="mb-0"><i class="bi bi-<icono>" aria-hidden="true"></i><Entidades en plural></h1>
    </div>
    <app-<entidad>-teamadmin-plist [id_<padre>]="id_<padre>()"></app-<entidad>-teamadmin-plist>
  </div>
  ```
  - El icono es específico de la entidad (ej. `bi-people` para usuarios, `bi-receipt` para facturas).
  - El texto es siempre el nombre plural de la entidad con mayúscula inicial.
  - El espaciado vertical es `my-3` y el título no tiene margen inferior (`mb-0`).
- Cuando el plist puede recibir **múltiples parámetros de ruta** distintos (rutas duales),
  la página declara un signal por cada parámetro posible y los lee todos en `ngOnInit()`.
  Ver **Sección 13** para el patrón completo de rutas duales y breadcrumbs contextuales.

### 7.2 Página `view` (wrapper del componente detail)

- Template minimal (frecuentemente inline en el `@Component`):
  ```typescript
  template: '<app-<entidad>-teamadmin-detail [id]="id_<entidad>"></app-<entidad>-teamadmin-detail>'
  ```
- El componente detail ya incluye su cabecera y botón de volver.

### 7.3 Página `new` (crear nuevo registro)

- Template inline que monta el form con `returnUrl` y los IDs de FK precargados desde queryParams:
  ```typescript
  template: '<app-<entidad>-teamadmin-form [returnUrl]="returnUrl" [id<Relacion>]="id<Relacion>()"></app-<entidad>-teamadmin-form>'
  ```
- `returnUrl` apunta al listado teamadmin: `'/<entidad>/teamadmin'`.
- El `id<Relacion>` se extrae de `queryParamMap` en `ngOnInit()` y se pasa al formulario.

**Patrón completo de la página `new`**:
```typescript
@Component({
  selector: 'app-<entidad>-teamadmin-new-page',
  imports: [EntidadTeamadminForm],
  template: '<app-<entidad>-teamadmin-form [returnUrl]="returnUrl" [id<Relacion>]="id<Relacion>()"></app-<entidad>-teamadmin-form>',
})
export class EntidadTeamadminNewPage implements OnInit {
  private route = inject(ActivatedRoute);
  returnUrl = '/<entidad>/teamadmin';
  id<Relacion> = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_<relacion>');
    if (val) this.id<Relacion>.set(Number(val));
  }
}
```

**Cadena completa del patrón de pre-relleno de FK** (los 4 eslabones):
1. **Plist padre** — `[queryParams]="idPadre ? { id_padre: idPadre } : {}"` en el botón crear.
2. **Página `new`** — lee `id_padre` de `queryParamMap` y lo pasa al form como `[id<Relacion>]`.
3. **Form `.ts`** — `id<Relacion> = input<number>(0)`. En `ngOnInit()`, si `> 0` y no es edición,
   parchea el `FormGroup` y carga la entidad relacionada.
4. **Form `.html`** — `@if (id<Relacion>() <= 0)` oculta el botón "Buscar" cuando hay prefijo.

### 7.4 Página `edit` (editar registro existente)

- Template inline que monta el form con el ID del registro:
  ```typescript
  template: '<app-<entidad>-teamadmin-form [id]="id_<entidad>()" [returnUrl]="returnUrl"></app-<entidad>-teamadmin-form>'
  ```
- El ID se extrae de `paramMap.get('id')`.

### 7.5 Página `delete` (confirmación de borrado)

- Contenedor: `<div class="container-fluid">`.
- Alerta de confirmación:
  ```html
  <div class="alert alert-danger d-flex align-items-center gap-2 mb-3" role="alert">
    <i class="bi bi-exclamation-triangle-fill"></i>
    <strong>¿Eliminar este registro?</strong> Esta acción no se puede deshacer.
  </div>
  ```
- Montaje del componente detail para mostrar qué se va a eliminar:
  `<app-<entidad>-teamadmin-detail [id]="id_<entidad>"></app-<entidad>-teamadmin-detail>`.
- Botonera de confirmación:
  ```html
  <div class="d-flex gap-2 mt-3">
    <button class="btn btn-danger" (click)="doDelete()">
      <i class="bi bi-trash me-2"></i>Eliminar
    </button>
    <button class="btn btn-secondary" (click)="doCancel()">
      <i class="bi bi-arrow-left me-2"></i>Cancelar
    </button>
  </div>
  ```
- Tras eliminación exitosa: `MatSnackBar` + navegación a listado con `?msg=...`.

---

## 8. Componentes compartidos utilizados

### 8.1 `app-breadcrumb`

- Obligatorio en todo `plist` teamadmin.
- `[items]="breadcrumbItems()"` — array de `BreadcrumbItem`.

### 8.2 `app-paginacion` y `app-botonera-rpp`

Mismo uso que en el perfil Administrador (Secciones 7.1 y 7.2 del perfil id=1).
- `numRpp` por defecto: **5** en todos los plists teamadmin standalone.
- La paginación se muestra siempre que `totalRecords() > 0` (no solo cuando hay >1 página).

### 8.3 `app-botonera-actions-plist`

- Se usa con `strRole="teamadmin"` para generar rutas con el segmento `/teamadmin/`.
- El componente aplica internamente restricciones basadas en las entidades prohibidas:
  - **Entidades sin editar ni borrar** (`clubForbidden`): `club`, `carrito`, `puntuacion`.
  - **Entidades sin borrar** (`clubNoDelete`): `factura`.
- El botón **Ver** siempre se muestra para todas las entidades.

### 8.4 `ModalService` (selección de entidad en formularios)

- Los formularios teamadmin abren un componente plist admin en modo diálogo para seleccionar
  registros de entidades relacionadas.
- `this.modalService.open<unknown, IEntidad | null>(EntidadAdminPlist)` → abre el plist como
  overlay. Al hacer clic en una fila, el plist cierra el modal devolviendo el registro.
- Tras la selección se actualiza el signal `selected<Relacion>` y se parchea el `FormGroup`.

---

## 9. Patrones de accesibilidad

Idénticos al perfil Administrador (Sección 8 del perfil id=1):
- `aria-hidden="true"` en iconos decorativos.
- `aria-label="Search"` en inputs de búsqueda.
- `role="status"` en spinners.
- `role="alert"` en alertas de error.
- `aria-label="breadcrumb"` en el `<nav>` del breadcrumb.

---

## 10. Restricciones de edición/borrado por entidad

El Administrador de club (tipousuario id=2) tiene restricciones sobre qué entidades puede
crear, editar y eliminar. El frontend las refleja ocultando botones y rutas.

| Entidad | Ver | Crear | Editar | Eliminar | Notas |
|---------|-----|-------|--------|----------|-------|
| **club** | ✅ | ❌ | ❌ | ❌ | Solo lectura de su propio club |
| **temporada** | ✅ | ✅ | ✅ | ✅ | Solo datos de su club |
| **categoria** | ✅ | ✅ | ✅ | ✅ | Solo datos de su club |
| **equipo** | ✅ | ✅ | ✅ | ✅ | Solo datos de su club |
| **jugador** | ✅ | ✅ | ✅ | ✅ | Solo datos de su club |
| **cuota** | ✅ | ✅ | ✅ | ✅ | Solo datos de su club |
| **pago** | ✅ | ✅ | ✅ | ✅ | Solo datos de su club |
| **liga** | ✅ | ✅ | ✅ | ✅ | Solo datos de su club |
| **partido** | ✅ | ✅ | ✅ | ✅ | Solo datos de su club |
| **noticia** | ✅ | ✅ | ✅ | ✅ | Solo datos de su club |
| **comentario** | ✅ | ✅ | ✅ | ✅ | Solo datos de su club |
| **puntuacion** | ✅ | ❌ | ❌ | ❌ | Solo lectura |
| **tipoarticulo** | ✅ | ✅ | ✅ | ✅ | Solo datos de su club |
| **articulo** | ✅ | ✅ | ✅ | ✅ | Solo datos de su club |
| **comentarioart** | ✅ | ❌ | ❌ | ❌ | Solo lectura |
| **carrito** | ✅ | ❌ | ❌ | ❌ | Solo lectura |
| **compra** | ✅ | ✅ | ✅ | ✅ | Solo datos de su club |
| **factura** | ✅ | ✅ | ✅ | ❌ | Editable pero no eliminable |
| **usuario** | ✅ | ✅* | ✅* | ✅* | *Solo tipousuario=3, de su club |

---

## 11. Responsive breakpoints referencia rápida

- Las tarjetas usan `row-cols-1 row-cols-md-2 row-cols-xl-3`:
  - **xs–sm** (<768px): 1 tarjeta por fila.
  - **md–lg** (≥768px): 2 tarjetas por fila.
  - **xl+** (≥1200px): 3 tarjetas por fila.
- Los contadores del detail usan `col-6 col-md-4 col-lg-3`.
- Los formularios se limitan al ancho de `col-lg-6` en las páginas wrapper.
- El breadcrumb se compacta automáticamente con `font-size: 0.85rem`.

---

## 12. Modo diálogo (selector de entidad)

El modo diálogo funciona igual que en el perfil Administrador (Sección 9 del perfil id=1):
- `isDialogMode()` devuelve `true` si `ModalRef` está inyectado (con `{ optional: true }`
  usando el token `MODAL_REF`).
- En modo diálogo: se oculta el botón de creación, se simplifican los enlaces, cada fila/tarjeta
  tiene `cursor: pointer` y al hacer clic llama a `onSelect(oEntidad)` que cierra el modal
  devolviendo el registro.

---

## 13. Rutas duales y breadcrumbs contextuales en plist teamadmin

Algunos plist del perfil teamadmin son accesibles desde **distintos caminos de navegación**.
Por ejemplo, los jugadores se pueden ver desde:
- La jerarquía de equipo: `Mis Clubes → Temporadas → Categorías → Equipos → {equipo} → Jugadores`
- La jerarquía de usuarios: `Mis Clubes → Usuarios → {nombre apellido1} → Jugadores`

En estos casos, el plist y la página deben soportar ambas rutas y mostrar el breadcrumb que
corresponda a la ruta de entrada.

### 13.1 Rutas en `app.routes.ts`

Se definen dos (o más) rutas separadas para el mismo page component, cada una con un parámetro
de filtro distinto:

```typescript
{ path: '<entidad>/teamadmin',                             component: EntidadTeamadminPlistPage, canActivate: [ClubAdminGuard] },
{ path: '<entidad>/teamadmin/<filtroA>/:id_<filtroA>',     component: EntidadTeamadminPlistPage, canActivate: [ClubAdminGuard] },
{ path: '<entidad>/teamadmin/<filtroB>/:id_<filtroB>',     component: EntidadTeamadminPlistPage, canActivate: [ClubAdminGuard] },
```

Las rutas extra **no requieren page components distintos**: el mismo page component lee qué
parámetro está presente y lo pasa al componente de presentación.

### 13.2 Page component (`.ts`)

Declara un signal por cada parámetro de filtro posible e inicializa solo el que tenga valor:

```typescript
export class EntidadTeamadminPlistPage implements OnInit {
  id_<filtroA> = signal<number | undefined>(undefined);
  id_<filtroB> = signal<number | undefined>(undefined);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const paramA = this.route.snapshot.paramMap.get('id_<filtroA>');
    if (paramA) this.id_<filtroA>.set(Number(paramA));

    const paramB = this.route.snapshot.paramMap.get('id_<filtroB>');
    if (paramB) this.id_<filtroB>.set(Number(paramB));
  }
}
```

### 13.3 Page template (`.html`)

Pasa todos los inputs de filtro al componente:

```html
<div class="container-fluid my-2">
  <app-<entidad>-teamadmin-plist
    [id_<filtroA>]="id_<filtroA>()"
    [id_<filtroB>]="id_<filtroB>()">
  </app-<entidad>-teamadmin-plist>
</div>
```

### 13.4 Componente teamadmin plist (`.ts`)

Declara un `@Input()` por cada ruta de entrada, inyecta los servicios necesarios para obtener
los datos del padre, y en `ngOnInit()` construye el breadcrumb condicionalmente:

```typescript
export class EntidadTeamadminPlist implements OnInit {
  @Input() id_<filtroA>?: number;
  @Input() id_<filtroB>?: number;

  breadcrumbItems = signal<BreadcrumbItem[]>([
    // Breadcrumb por defecto (sin filtro activo)
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: '<Entidades>' },
  ]);

  private o<FiltroA>Service = inject(<FiltroA>Service);
  private o<FiltroB>Service = inject(<FiltroB>Service);

  ngOnInit(): void {
    if (this.id_<filtroA> && this.id_<filtroA> > 0) {
      this.o<FiltroA>Service.get(this.id_<filtroA>).subscribe({
        next: (entA) => {
          this.breadcrumbItems.set([
            { label: 'Mis Clubes', route: '/club/teamadmin' },
            // ... ítems de la jerarquía de filtroA usando campos del objeto entA
            { label: entA.campoDescriptivo, route: `/<filtroA>/teamadmin/view/${entA.id}` },
            { label: '<Entidades>' },
          ]);
        },
        error: () => {},
      });
    } else if (this.id_<filtroB> && this.id_<filtroB> > 0) {
      this.o<FiltroB>Service.get(this.id_<filtroB>).subscribe({
        next: (entB) => {
          this.breadcrumbItems.set([
            { label: 'Mis Clubes', route: '/club/teamadmin' },
            // ... ítems de la jerarquía de filtroB
            { label: `${entB.nombre} ${entB.apellido1}`, route: `/<filtroB>/teamadmin/view/${entB.id}` },
            { label: '<Entidades>' },
          ]);
        },
        error: () => {},
      });
    }
    // Si ningún filtro está activo, queda el breadcrumb por defecto inicializado en el signal.
  }
}
```

**Reglas obligatorias:**
- El `if` / `else if` evalúa **en el mismo orden de prioridad** que el servicio de datos.
  El primer filtro activo gana; nunca se activan dos ramas simultáneamente.
- El servicio de datos ya implementa la misma prioridad para el filtrado (primer filtro > 0 gana).
- La llamada al servicio de la entidad padre se usa solo para obtener el nombre/descripción
  para el breadcrumb. Los errores HTTP se silencian con `error: () => {}`.
- El `@Input()` para el filtro debe declararse opcional (`?: number`) porque la ruta sin filtro
  no lo pasará.

### 13.5 Componente teamadmin plist (`.html`)

Pasa todos los inputs de filtro al componente admin reutilizado:

```html
<div>
  <app-breadcrumb [items]="breadcrumbItems()"></app-breadcrumb>
  <app-<entidad>-admin-plist
    [id_<filtroA>]="id_<filtroA>"
    [id_<filtroB>]="id_<filtroB>"
    [showFilterInfo]="false"
    strRole="teamadmin">
  </app-<entidad>-admin-plist>
</div>
```

### 13.6 Breadcrumbs estándar por contexto de entrada

Lista de los paths de navegación documentados y sus breadcrumbs:

**Path equipo** (jerarquía completa descendente):
- `Mis Clubes → Temporadas → {temporada.descripcion} → Categorías → {categoria.nombre} → Equipos → {equipo.nombre} → {Entidades}`
- Cada ítem de la cadena lleva `route` a su vista teamadmin correspondiente.
- Los segmentos genéricos intermedios (`Temporadas`, `Categorías`, `Equipos`) llevan rutas
  filtradas por el padre: `/categoria/teamadmin/temporada/{id}`, `/equipo/teamadmin/categoria/{id}`.

**Path usuario** (acceso desde la lista de usuarios del club):
- `Mis Clubes → Usuarios → {usuario.nombre} {usuario.apellido1} → {Entidades}`
- Ejemplo de implementación en `jugador/teamadmin/plist/plist.ts`.

**Sin filtro** (acceso directo desde sidebar o URL directa):
- `Mis Clubes → {Entidades}` (breadcrumb estático, no requiere llamada HTTP).

### 13.7 Enlace de origen en el plist padre

Cuando un plist lista registros que actúan como origen de la ruta dual, el contador en los
badges de tarjeta debe enlazar usando el segmento correcto:

- Desde un plist de **equipo**, el badge de jugadores enlaza a:
  `['/jugador/teamadmin/equipo', oEntidad.id]`
- Desde un plist de **usuario**, el badge de jugadores enlaza a:
  `['/jugador/teamadmin/usuario', oUsuario.id]`

Cada origen usa su segmento de ruta para que el componente receptor pueda determinar el
breadcrumb contextual correcto.

### 13.8 Entidades con rutas duales implementadas

- **jugador**: rutas `equipo/:id_equipo` y `usuario/:id_usuario`.
  Implementación de referencia en `component/jugador/teamadmin/plist/plist.ts`.

---

## 14. Ejemplo completo — Entidad Temporada (Teamadmin)

La entidad **Temporada** es el punto de partida en la jerarquía del perfil teamadmin
(después de Mis Clubes) y sirve como referencia de implementación para todas las demás
entidades de este perfil. Documenta todos los patrones descritos en las secciones anteriores
aplicados a un caso real.

### 14.1 Estructura de archivos

```
component/temporada/teamadmin/
├── plist/           # Componente de listado (cards)
│   ├── plist.ts
│   ├── plist.html
│   └── plist.css
├── detail/          # Componente de detalle (solo lectura)
│   ├── detail.ts
│   ├── detail.html
│   └── detail.css
└── form/            # Componente de formulario (crear/editar)
    ├── form.ts
    ├── form.html
    └── form.css

page/temporada/teamadmin/
├── plist/
│   ├── plist.ts     # Page wrapper (mínimo, sin lógica)
│   └── plist.html
├── new/
│   └── new.ts       # Page wrapper para crear
├── edit/
│   └── edit.ts      # Page wrapper para editar
├── delete/          # Page wrapper + template para confirmar borrado
│   ├── delete.ts
│   └── delete.html
└── view/
    └── view.ts      # Page wrapper para detalle
```

### 14.2 Componente Plist: `component/temporada/teamadmin/plist/plist.ts`

**Características principales:**
- Breadcrumb dinámica que se adapta si la temporada está filtrada por club.
- Búsqueda por descripción con debounce.
- Paginación con `rpp = 5`.
- Grid de tarjetas con información del club padre y contador de categorías.
- Enlace de creación rápida en categorías si el contador es 0.

```typescript
@Component({
  selector: 'app-temporada-teamadmin-plist',
  imports: [Paginacion, RouterLink, TrimPipe, BotoneraActionsPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class TemporadaTeamadminPlist {
  @Input() id_club?: number;  // Opcional: filtro desde ruta `/temporada/teamadmin/club/:id_club`

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas' },
  ]);

  oPage = signal<IPage<ITemporada> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);

  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  private searchSubject = new Subject<string>();
  descripcion = signal<string>('');
  private searchSubscription?: Subscription;

  oTemporadaService = inject(TemporadaService);
  private clubService = inject(ClubService);
  session = inject(SessionService);

  ngOnInit(): void {
    // Si llega id_club, carga el nombre del club para el breadcrumb dinámico
    if (this.id_club) {
      this.clubService.get(this.id_club).subscribe({
        next: (club) => this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          { label: club.nombre, route: `/club/teamadmin/view/${club.id}` },
          { label: 'Temporadas' },
        ]),
      });
    }

    // Debounce de búsqueda
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.descripcion.set(searchTerm);
        this.numPage.set(0);
        this.getPage();
      });

    this.getPage();
  }

  getPage(): void {
    this.oTemporadaService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.descripcion(),
        this.id_club ?? 0  // Backend filtra por club cuando se envía > 0
      )
      .subscribe({
        next: (data: IPage<ITemporada>) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
        },
        error: (error: HttpErrorResponse) => console.error(error),
      });
  }

  onSearchDescription(value: string): void {
    this.searchSubject.next(value);
  }

  goToPage(page: number): void {
    this.numPage.set(page);
    this.getPage();
  }
}
```

### 14.3 Componente Plist: `component/temporada/teamadmin/plist/plist.html`

**Patrones aplicados:**
- Breadcrumb al inicio.
- Búsqueda centrada.
- Contador total con indicador de filtro activo.
- Paginación condicional.
- Botón de creación.
- Grid responsivo con tarjetas.
- Badge de categorías con lógica 0 = amarillo (crear), > 0 = azul (listar).

```html
<div>
  <!-- Breadcrumb -->
  <app-breadcrumb [items]="breadcrumbItems()"></app-breadcrumb>

  <!-- Búsqueda por descripción -->
  <div class="d-flex justify-content-center my-2">
    <input class="form-control me-2" type="search" 
      placeholder="Buscar por descripción de la temporada"
      [value]="descripcion()"
      (input)="onSearchDescription($any($event.target).value)" />
  </div>

  <!-- Total registros -->
  <div class="d-flex justify-content-center my-1">
    <small class="text-muted">Total temporadas: {{ totalRecords() || 0 }}</small>
    @if (descripcion().length > 0) {
    <small class="text-muted ms-3">Filtro: descripción contiene "{{ descripcion() }}"</small>
    }
  </div>

  <!-- Paginación -->
  @if (totalRecords() > 0 && (oPage()?.totalPages ?? 1) > 1) {
  <div class="container-fluid p-0 my-1">
    <div class="controls-row mb-2">
      <div class="col-control left">
        <app-paginacion [numPage]="numPage()" [numPages]="oPage()?.totalPages || 1"
          (pageChange)="goToPage($event)"></app-paginacion>
      </div>
    </div>
  </div>
  }

  <!-- Botón de creación -->
  <div class="d-flex my-1">
    <div class="w-100 d-flex justify-content-center">
      <a class="btn btn-primary new-btn" [routerLink]="['/temporada/teamadmin/new']" role="button">
        <i class="bi bi-plus-circle" aria-hidden="true"></i>
        <span class="d-none d-sm-inline">Crear una nueva Temporada</span>
      </a>
    </div>
  </div>

  <!-- Grid de tarjetas -->
  <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
    @for (oTemporada of oPage()?.content; track oTemporada.id) {
    <div class="col">
      <div class="card h-100 shadow-sm">
        <!-- Card Header -->
        <div class="card-header">
          <h5 class="card-title mb-0">ID {{ oTemporada.id }}</h5>
        </div>

        <!-- Card Body -->
        <div class="card-body">
          <p class="card-text"><strong>Descripción: </strong> {{ oTemporada.descripcion }}</p>
          <p class="card-text">
            <strong>Club: </strong>
            <a [routerLink]="['/club/teamadmin/view', oTemporada.club.id]">
              {{ oTemporada.club.nombre | trim: 20 }} ({{ oTemporada.club.id }})
            </a>
          </p>
        </div>

        <!-- Card Footer: Contadores y Acciones -->
        <div class="card-footer d-flex justify-content-between">
          <!-- Badge de categorías: 0 → amarillo (crear), >0 → azul (listar) -->
          @if (oTemporada.categorias === 0) {
            <a [routerLink]="['/categoria/teamadmin/new']" 
              [queryParams]="{ id_temporada: oTemporada.id }"
              class="badge big-badge bg-warning text-dark text-decoration-none" 
              title="Crear primera categoría">
              <i class="bi bi-plus-circle me-1"></i>0 categorías
            </a>
          } @else {
            <a [routerLink]="['/categoria/teamadmin/temporada', oTemporada.id]"
              class="badge big-badge bg-primary text-decoration-none" 
              title="Ver categorías de esta temporada">
              <i class="bi bi-tags-fill me-1"></i>{{ oTemporada.categorias }} categorías
            </a>
          }

          <!-- Botonera de acciones (view, edit, delete) -->
          <app-botonera-actions-plist [id]="oTemporada.id" strEntity="temporada"
            strRole="teamadmin"></app-botonera-actions-plist>
        </div>
      </div>
    </div>
    }
  </div>
</div>
```

### 14.4 Componente Detail: `component/temporada/teamadmin/detail/detail.ts`

**Características principales:**
- Carga la temporada por ID.
- Breadcrumb dinámica que incluye jerárquica completa: Mis Clubes → {Club} → Temporadas → {Descripción}.
- Card principal con datos de la temporada.
- Sección anidada del club (border-info, bg-info bg-opacity-10).
- Contador de categorías con enlace a listar o botón de crear.

```typescript
@Component({
  selector: 'app-temporada-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class TemporadaTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private oTemporadaService = inject(TemporadaService);
  session = inject(SessionService);

  oTemporada = signal<ITemporada | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Temporada' },
  ]);

  ngOnInit(): void {
    this.load(this.id());
  }

  load(id: number): void {
    this.oTemporadaService.get(id).subscribe({
      next: (data: ITemporada) => {
        this.oTemporada.set(data);
        this.loading.set(false);

        // Breadcrumb dinámico con club
        const club = data.club;
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          ...(club ? [{ label: club.nombre, route: `/club/teamadmin/view/${club.id}` }] : []),
          { label: 'Temporadas', route: club ? `/temporada/teamadmin/club/${club.id}` : '/temporada/teamadmin' },
          { label: data.descripcion },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la temporada');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
```

### 14.5 Componente Detail: `component/temporada/teamadmin/detail/detail.html`

**Patrones aplicados:**
- Breadcrumb.
- Estados de carga y error.
- Card principal con header de color primario.
- Datos en filas de 2 columnas (col-5 / col-7).
- Sección anidada del club con border-info y color info.
- Contador de categorías con enlace o botón de crear si es 0.

```html
<div class="container-fluid">
  <app-breadcrumb [items]="breadcrumbItems()"></app-breadcrumb>

  @if (loading()) {
    <div class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="text-muted small mt-2 mb-0">Cargando detalle...</p>
    </div>
  }

  @if (error()) {
    <div class="alert alert-danger d-flex align-items-center gap-2" role="alert">
      <i class="bi bi-exclamation-triangle-fill"></i> {{ error() }}
    </div>
  }

  @if (!loading() && !error() && oTemporada()) {
    <div class="card border-0 shadow-sm">
      <!-- Card Header con icono, descripción e ID -->
      <div class="card-header bg-primary text-white d-flex align-items-center gap-2">
        <i class="bi bi-calendar3"></i>
        <span class="fw-semibold">{{ oTemporada()?.descripcion }}</span>
        <span class="badge bg-white text-primary ms-auto">ID {{ oTemporada()?.id }}</span>
      </div>

      <div class="card-body">
        <!-- Datos principales de la temporada -->
        <div class="row g-1 mb-3">
          <div class="col-5 text-muted small text-uppercase">ID</div>
          <div class="col-7 fw-semibold small">{{ oTemporada()?.id }}</div>

          <div class="col-5 text-muted small text-uppercase">Descripción</div>
          <div class="col-7 fw-semibold small">{{ oTemporada()?.descripcion }}</div>

          <!-- Contador de categorías: 0 → enlace de crear, >0 → enlace a listar -->
          <div class="col-5 text-muted small text-uppercase">Categorías</div>
          <div class="col-7 fw-semibold small">
            @if ((oTemporada()?.categorias ?? 0) > 0) {
              <a [routerLink]="['/categoria/teamadmin/temporada', oTemporada()?.id]"
                class="text-decoration-none">{{ oTemporada()?.categorias }}</a>
            } @else {
              0
              <a [routerLink]="['/categoria/teamadmin/new']"
                [queryParams]="{ id_temporada: oTemporada()?.id }"
                class="btn btn-outline-success btn-sm ms-1 py-0 px-1"
                title="Crear categoría">
                <i class="bi bi-plus-lg"></i>
              </a>
            }
          </div>
        </div>

        <!-- Sección anidada: Club (border-info, bg-info, text-info) -->
        <div class="card border-start border-3 border-info mt-3">
          <div class="card-header py-1 d-flex align-items-center gap-2 bg-info bg-opacity-10">
            <i class="bi bi-building-fill text-info small"></i>
            <span class="text-uppercase small fw-semibold text-info">Club</span>
            <a [routerLink]="['/club/teamadmin/view', oTemporada()?.club?.id]"
              class="ms-auto badge bg-info text-white text-decoration-none small">
              {{ oTemporada()?.club?.nombre }} 
              <span class="opacity-75 ms-1">#{{ oTemporada()?.club?.id }}</span>
              <i class="bi bi-box-arrow-up-right ms-1"></i>
            </a>
          </div>

          <div class="card-body p-2">
            <div class="row g-1">
              <div class="col-5 text-muted small text-uppercase">ID</div>
              <div class="col-7 fw-semibold small">{{ oTemporada()?.club?.id }}</div>

              <div class="col-5 text-muted small text-uppercase">Nombre</div>
              <div class="col-7 fw-semibold small">{{ oTemporada()?.club?.nombre }}</div>

              <div class="col-5 text-muted small text-uppercase">Dirección</div>
              <div class="col-7 fw-semibold small">{{ oTemporada()?.club?.direccion }}</div>

              <div class="col-5 text-muted small text-uppercase">Teléfono</div>
              <div class="col-7 fw-semibold small">{{ oTemporada()?.club?.telefono }}</div>

              <!-- Contadores del club: enlazar a listados teamadmin -->
              <div class="col-5 text-muted small text-uppercase">Temporadas</div>
              <div class="col-7 fw-semibold small">
                @if ((oTemporada()?.club?.temporadas ?? 0) > 0) {
                  <a [routerLink]="['/temporada/teamadmin/club', oTemporada()?.club?.id]"
                    class="text-decoration-none">{{ oTemporada()?.club?.temporadas }}</a>
                } @else {
                  0
                }
              </div>

              <div class="col-5 text-muted small text-uppercase">Noticias</div>
              <div class="col-7 fw-semibold small">
                @if ((oTemporada()?.club?.noticias ?? 0) > 0) {
                  <a [routerLink]="['/noticia/teamadmin/club', oTemporada()?.club?.id]"
                    class="text-decoration-none">{{ oTemporada()?.club?.noticias }}</a>
                } @else {
                  0
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
</div>
```

### 14.6 Componente Form: `component/temporada/teamadmin/form/form.ts`

**Características principales:**
- Modo crear (id=0) vs. editar (id>0).
- Breadcrumb dinámica que se adapta según modo.
- Pre-relleno de club desde la sesión (si es clubadmin).
- Selección de club vía modal para admin global.
- Validación: descripción (required, 3-255 caracteres).
- Estados: loading, submitting, error.

```typescript
@Component({
  selector: 'app-temporada-teamadmin-form',
  imports: [ReactiveFormsModule, RouterLink, BreadcrumbComponent],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class TemporadaTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/temporada/teamadmin');

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private oTemporadaService = inject(TemporadaService);
  private oClubService = inject(ClubService);
  private notificacion = inject(NotificacionService);
  private modalService = inject(ModalService);
  session = inject(SessionService);

  temporadaForm!: FormGroup;
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  submitting = signal<boolean>(false);
  temporada = signal<ITemporada | null>(null);
  selectedClub = signal<IClub | null>(null);

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Nueva Temporada' },
  ]);

  get descripcion() {
    return this.temporadaForm.get('descripcion');
  }

  get id_club() {
    return this.temporadaForm.get('id_club');
  }

  ngOnInit(): void {
    this.initForm();
    if (this.id() > 0) {
      this.getTemporada(this.id());
    } else {
      this.loading.set(false);
    }
  }

  initForm(): void {
    this.temporadaForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      id_club: [null, [Validators.required]],
    });

    // Si es clubadmin, pre-rellena el club desde la sesión
    if (this.session.isClubAdmin()) {
      const cid = this.session.getClubId();
      if (cid != null) {
        this.temporadaForm.patchValue({ id_club: cid });
        this.oClubService.get(cid).subscribe({
          next: (club) => this.selectedClub.set(club),
        });
      }
    }
  }

  getTemporada(id: number): void {
    this.oTemporadaService.get(id).subscribe({
      next: (data: ITemporada) => {
        this.temporada.set(data);
        this.syncClub(data.club.id);
        this.temporadaForm.patchValue({
          descripcion: data.descripcion,
          id_club: data.club.id,
        });
        this.loading.set(false);

        // Breadcrumb para edición
        const club = data.club;
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          ...(club ? [{ label: club.nombre, route: `/club/teamadmin/view/${club.id}` }] : []),
          { label: 'Temporadas', route: club ? `/temporada/teamadmin/club/${club.id}` : '/temporada/teamadmin' },
          { label: data.descripcion, route: `/temporada/teamadmin/view/${data.id}` },
          { label: 'Editar' },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error al cargar el registro');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  syncClub(clubId: number): void {
    this.oClubService.get(clubId).subscribe({
      next: (club) => {
        this.selectedClub.set(club);
        this.temporadaForm.patchValue({ id_club: clubId });
      },
    });
  }

  openClubFinderModal(): void {
    this.modalService.open(ClubAdminPlist, { data: { isDialogMode: true } }).subscribe({
      next: (selectedClub: IClub) => {
        if (selectedClub) {
          this.selectedClub.set(selectedClub);
          this.temporadaForm.patchValue({ id_club: selectedClub.id });
        }
      },
    });
  }

  onSubmit(): void {
    if (!this.temporadaForm.valid) {
      this.temporadaForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formValue = this.temporadaForm.value;

    if (this.id() > 0) {
      // Modo edición
      this.oTemporadaService.update(this.id(), formValue).subscribe({
        next: () => {
          this.submitting.set(false);
          this.notificacion.success('Temporada actualizada correctamente');
          this.router.navigate([this.returnUrl()], { queryParams: { msg: 'Temporada actualizada' } });
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.notificacion.error(err.error?.message || 'Error al actualizar');
          console.error(err);
        },
      });
    } else {
      // Modo creación
      this.oTemporadaService.add(formValue).subscribe({
        next: (createdTemporada: ITemporada) => {
          this.submitting.set(false);
          this.notificacion.success('Temporada creada correctamente');
          this.router.navigate([this.returnUrl()], { queryParams: { msg: 'Temporada creada' } });
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.notificacion.error(err.error?.message || 'Error al crear');
          console.error(err);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate([this.returnUrl()]);
  }
}
```

### 14.7 Componente Form: `component/temporada/teamadmin/form/form.html`

**Patrones aplicados:**
- Breadcrumb.
- Título dinámico (Nueva Temporada / Editar Temporada).
- Campo ID (solo edición, readonly).
- Campo Descripción con validación inline.
- Sección de Club (solo visible para admin global):
  - Input readonly con nombre del club.
  - Botón de búsqueda para abrir modal.
  - Input readonly con ID.
  - Mostrar dirección adicional.
- Botones: Cancelar y Guardar/Crear.
- Estados: loading, error, submitting.

```html
<app-breadcrumb [items]="breadcrumbItems()"></app-breadcrumb>

<div class="container-fluid my-4 edit-form">
  <div class="row justify-content-center">
    <div class="col-12 col-lg-8">
      <div class="form-card">
        <header class="mb-4">
          <h1 class="h3 mb-0">
            @if (id() && id() > 0) {Editar Temporada} @else {Nueva Temporada}
          </h1>
        </header>

        @if (loading()) {
        <div class="d-flex justify-content-center my-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        }

        @if (error()) {
        <div class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ error() }}
        </div>
        }

        @if (!loading() && !error()) {
        <form [formGroup]="temporadaForm" (ngSubmit)="onSubmit()" novalidate>
          <!-- ID (solo lectura cuando exista) -->
          @if (id() > 0) {
            <div class="mb-4">
              <label for="id" class="form-label">ID de la temporada</label>
              <input type="text" class="form-control" id="id" [value]="id()" disabled />
            </div>
          }

          <!-- Descripción -->
          <div class="mb-4">
            <label for="descripcion" class="form-label">Descripción <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control"
              [class.is-invalid]="descripcion?.invalid && descripcion?.touched"
              [class.is-valid]="descripcion?.valid && descripcion?.touched"
              id="descripcion"
              formControlName="descripcion"
              placeholder="Introduce una descripción para la temporada"
            />
            @if (descripcion?.invalid && descripcion?.touched) {
            <div class="invalid-feedback">
              @if (descripcion?.errors?.['required']) {
                <span>La descripción es obligatoria.</span>
              } @else if (descripcion?.errors?.['minlength']) {
                <span>La descripción debe tener al menos 3 caracteres.</span>
              } @else if (descripcion?.errors?.['maxlength']) {
                <span>La descripción no puede superar 255 caracteres.</span>
              }
            </div>
            }
          </div>

          <!-- Sección: Club (solo visible para admin global) -->
          @if (!session.isClubAdmin()) {
          <div class="p-4 rounded mb-4" style="background-color: #e4e4e4; border-left: 4px solid #0d6efd;">
            <div class="mb-4">
              <label for="club" class="form-label">Club <span class="text-danger">*</span></label>
              <input
                id="club"
                type="text"
                class="form-control"
                [class.is-invalid]="id_club?.invalid && id_club?.touched"
                [class.is-valid]="id_club?.valid && id_club?.touched"
                [value]="selectedClub()?.nombre"
                readonly
              />
              @if (id_club?.invalid && id_club?.touched) {
                <div class="invalid-feedback">
                  <span>Debe seleccionar un club.</span>
                </div>
              }
            </div>

            <!-- Buscador, ID y Dirección en una línea -->
            <div class="d-flex gap-3 align-items-end">
              <button type="button" class="btn btn-info" (click)="openClubFinderModal()">
                <i class="bi bi-search me-2"></i>Buscar
              </button>
              <div>
                <label for="display_id_club" class="form-label">ID Club</label>
                <input
                  type="text"
                  class="form-control"
                  id="display_id_club"
                  [value]="id_club?.value"
                  formControlName="id_club"
                  readonly
                />
              </div>
              @if (selectedClub()) {
                <div class="grow">
                  <label class="form-label">Dirección</label>
                  <p class="form-control-plaintext fw-semibold mb-0">
                    {{ selectedClub()?.direccion }}
                  </p>
                </div>
              }
            </div>
          </div>
          }

          <!-- Botones -->
          <div class="d-flex justify-content-between align-items-center mt-4">
            <a [routerLink]="[returnUrl()]" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>Cancelar
            </a>
            <button type="submit" class="btn btn-primary" [disabled]="submitting() || temporadaForm.invalid">
              @if (submitting()) {
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              } @else {
                <i class="bi bi-check-circle me-2"></i>
              }
              @if (id() && id() > 0) {Guardar Cambios} @else {Crear}
            </button>
          </div>
        </form>
        }
      </div>
    </div>
  </div>
</div>
```

### 14.8 Rutas en `app.routes.ts`

La entidad Temporada tiene una estructura simple sin rutas duales. Las rutas son:

```typescript
// Temporada - Teamadmin
{ path: 'temporada/teamadmin', 
  component: TemporadaTeamadminPlistPage, 
  canActivate: [ClubAdminGuard] },
{ path: 'temporada/teamadmin/club/:id_club', 
  component: TemporadaTeamadminPlistPage, 
  canActivate: [ClubAdminGuard] },
{ path: 'temporada/teamadmin/view/:id', 
  component: TemporadaTeamadminViewPage, 
  canActivate: [ClubAdminGuard] },
{ path: 'temporada/teamadmin/new', 
  component: TemporadaTeamadminNewPage, 
  canActivate: [ClubAdminGuard] },
{ path: 'temporada/teamadmin/edit/:id', 
  component: TemporadaTeamadminEditPage, 
  canActivate: [ClubAdminGuard] },
{ path: 'temporada/teamadmin/delete/:id', 
  component: TemporadaTeamadminDeletePage, 
  canActivate: [ClubAdminGuard] },
```

- Ruta base: `/temporada/teamadmin` (lista todas las temporadas del club actual).
- Ruta filtrada: `/temporada/teamadmin/club/:id_club` (lista temporadas de un club específico, 
  usado desde detail de Club o cuando se navega manualmente).

### 14.9 Conclusión

La entidad Temporada aplica todos los patrones de diseño del perfil teamadmin:

✅ **Breadcrumb dinámica** que se adapta al contexto de navegación.
✅ **Plist con tarjetas**, búsqueda y paginación.
✅ **Contadores inteligentes** (0 = crear, >0 = listar).
✅ **Detail con secciones anidadas** (relaciones ManyToOne con colores).
✅ **Form con validación reactiva** y pre-relleno de datos.
✅ **Inyección de dependencias** siguiendo patrones de Angular Signals.
✅ **NotificacionService** para feedback de usuario (success/error).
✅ **Guard de acceso** (`ClubAdminGuard`) en todas las rutas.

Para implementar nuevas entidades en el perfil teamadmin, tomar Temporada como referencia
de implementación y adaptar los nombres de entidades, campos y relaciones según corresponda.

---

## 15. Referencia de implementación — Categoría (listado filtrado por temporada)

La entidad **Categoría** demuestra el patrón de listado filtrado por una entidad padre jerárquica.
Es más compleja que Temporada: el breadcrumb debe mostrar toda la cadena (Club → Temporada → Categorías),
cargando dinámicamente el nombre de la Temporada padre.

### 15.1 Diseño de la página plist

La página `/categoria/teamadmin/temporada/:id_temporada` sigue el mismo diseño que Temporada:

```html
<!-- page/categoria/teamadmin/plist/plist.html -->
<div class="container-fluid">
  <app-breadcrumb [items]="breadcrumbItems()"></app-breadcrumb>
  <div class="d-flex justify-content-center my-3">
    <h1 class="mb-0"><i class="bi bi-tags me-2" aria-hidden="true"></i>Mis Categorías</h1>
  </div>
  <app-categoria-teamadmin-plist [id_temporada]="id_temporada()"></app-categoria-teamadmin-plist>
</div>
```

### 15.2 Page component (`.ts`) — Breadcrumb dinámico con profundidad 2

El TypeScript carga la Temporada padre para extraer su nombre y el del Club:

```typescript
// page/categoria/teamadmin/plist/plist.ts
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaTeamadminPlist } from '../../../../component/categoria/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { TemporadaService } from '../../../../service/temporada';

@Component({
  selector: 'app-categoria-teamadmin-plist-page',
  imports: [CategoriaTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CategoriaTeamadminPlistPage implements OnInit {
  id_temporada = signal<number>(0);

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías' },
  ]);

  constructor(
    private route: ActivatedRoute,
    private temporadaService: TemporadaService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_temporada');
    if (idParam) {
      this.id_temporada.set(Number(idParam));
      
      // Cargar la Temporada padre para obtener Club + nombre de Temporada
      this.temporadaService.get(this.id_temporada()).subscribe({
        next: (temp) => {
          const items: BreadcrumbItem[] = [
            { label: 'Mis Clubes', route: '/club/teamadmin' },
          ];
          
          // Agregar el Club si existe
          if (temp.club) {
            items.push({
              label: temp.club.nombre,
              route: `/club/teamadmin/view/${temp.club.id}`,
            });
          }
          
          // Agregar la Temporada
          items.push({ label: 'Temporadas', route: '/temporada/teamadmin' });
          items.push({
            label: temp.descripcion,
            route: `/temporada/teamadmin/view/${temp.id}`,
          });
          
          // Categorías es el actual (sin ruta)
          items.push({ label: 'Categorías' });
          
          this.breadcrumbItems.set(items);
        },
        error: () => {
          // Mantener el breadcrumb por defecto si hay error
        },
      });
    }
  }
}
```

**Puntos clave:**
- El breadcrumb comienza siempre con "Mis Clubes".
- Si la Temporada tiene Club anidado (`temp.club`), se agrega como ítems intermedios.
- El último ítem "Categorías" no tiene ruta (está activo).
- Los ítems se construyen en `ngOnInit()` tras cargar la Temporada con el servicio.

### 15.3 Rutas en `app.routes.ts`

```typescript
// Categoría - Teamadmin
{ path: 'categoria/teamadmin', 
  component: CategoriaTeamadminPlistPage, 
  canActivate: [ClubAdminGuard] },
{ path: 'categoria/teamadmin/temporada/:id_temporada', 
  component: CategoriaTeamadminPlistPage, 
  canActivate: [ClubAdminGuard] },
{ path: 'categoria/teamadmin/view/:id', 
  component: CategoriaTeamadminViewPage, 
  canActivate: [ClubAdminGuard] },
{ path: 'categoria/teamadmin/new', 
  component: CategoriaTeamadminNewPage, 
  canActivate: [ClubAdminGuard] },
{ path: 'categoria/teamadmin/edit/:id', 
  component: CategoriaTeamadminEditPage, 
  canActivate: [ClubAdminGuard] },
{ path: 'categoria/teamadmin/delete/:id', 
  component: CategoriaTeamadminDeletePage, 
  canActivate: [ClubAdminGuard] },
```

### 15.4 Patrón general — Listados filtrados por jerarquía

**Resumen del patrón aplicable a cualquier entidad filtrada:**

| Nivel | Ruta | Parámetro | Servicio | Campo nombre | Breadcrumb |
|-------|------|-----------|----------|--------------|-----------|
| **Temporada** | `/temporada/teamadmin/club/:id_club` | `id_club` | `ClubService.get()` | `club.nombre` | Mis Clubes → {Club} → **Temporadas** |
| **Categoría** | `/categoria/teamadmin/temporada/:id_temporada` | `id_temporada` | `TemporadaService.get()` | `temp.descripcion`, `temp.club.nombre` | Mis Clubes → {Club} → Temporadas → {Temporada} → **Categorías** |
| **Equipo** | `/equipo/teamadmin/categoria/:id_categoria` | `id_categoria` | `CategoriaService.get()` | `cat.nombre`, `cat.temporada.descripcion`, `cat.temporada.club.nombre` | Mis Clubes → {Club} → Temporadas → {Temporada} → Categorías → {Categoría} → **Equipos** |

**Algoritmo de construcción del breadcrumb:**

1. Inicializar con valor por defecto: `[{ label: 'Mis Clubes', route: '/club/teamadmin' }, ..., { label: '<Entidad pluralizada>' }]`.
2. Leer parámetro de ruta (ej. `id_temporada`).
3. Si parámetro > 0:
   - Llamar a su servicio padre (ej. `TemporadaService.get(id_temporada)`).
   - Extraer la cadena de relaciones anidadas (ej. `temp.club`, `temp.descripcion`).
   - Construir breadcrumb dinámico cargando cada nivel.
4. Si error o parámetro vacío, mantener valor por defecto.

### 15.5 Conclusión

El patrón de listados filtrados por jerarquía se replica uniformemente en el proyecto:
- **Temporada** por Club: breadcrumb de profundidad 2.
- **Categoría** por Temporada: breadcrumb de profundidad 3.
- **Equipo** por Categoría: breadcrumb de profundidad 4+.

Todos siguen el mismo layout: Breadcrumb → Título centrado → Plist de tarjetas o tabla.
La única variación es la **profundidad del breadcrumb** y el **servicio padre** necesario
para cargar los nombres de entidades de cada nivel jerárquico.

Para agregar una nueva relación jerárquica, replicar exactamente this patrón,
cambiando solo los nombres de entidades y servicios.
