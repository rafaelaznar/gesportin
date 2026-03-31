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

Cada componente `plist` teamadmin mantiene un signal `breadcrumbItems` que se inicializa con la
cadena de navegación estática y se **reconstruye dinámicamente** en `ngOnInit()` cuando existen
filtros FK activos.

**Ejemplo de equipo (filtrado por categoría)**:
```typescript
breadcrumbItems = signal<BreadcrumbItem[]>([
  { label: 'Mis Clubes', route: '/club/teamadmin' },
  { label: 'Temporadas', route: '/temporada/teamadmin' },
  { label: 'Categorías', route: '/categoria/teamadmin' },
  { label: 'Equipos' },
]);

ngOnInit(): void {
  if (this.categoria > 0) {
    this.oCategoriaService.get(this.categoria).subscribe({
      next: (cat) => {
        const temp = cat.temporada;
        const items: BreadcrumbItem[] = [
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          { label: 'Temporadas', route: '/temporada/teamadmin' },
        ];
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
    });
  }
}
```

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

**Nota**: algunas entidades heredan/reusan el componente admin del plist pasando `strRole`
y breadcrumb. Otras entidades tienen su propio plist teamadmin independiente:
- Wrapper fino: `<app-breadcrumb [items]="breadcrumbItems()"></app-breadcrumb>` +
  `<app-<entidad>-admin-plist [filtros] [showFilterInfo]="false" strRole="teamadmin"></app-<entidad>-admin-plist>`.
  El `@Input() strRole: string = ''` en el plist admin activa la visibilidad del botón crear
  para el club admin y cambia las rutas a `/<entidad>/teamadmin/...`.
- Plist propio: implementación completa del plist con layout de tarjetas (ej. equipo, club).

**Patrón `strRole` en plists admin compartidos**: los plists admin que también usa el club
admin incluyen en su `.ts` la propiedad `@Input() strRole: string = ''` y en su `.html` modifican
el botón crear con la condición `@if (!session.isClubAdmin() || strRole)` y la ruta dinámica
`[routerLink]="strRole ? ['/<entidad>', strRole, 'new'] : ['/<entidad>/new']"`.
El wrapper teamadmin pasa `strRole="teamadmin"` al componente compartido.

---

## 4. Diseño del componente `plist` (listado) — Layout de tarjetas

El perfil teamadmin usa **tarjetas (cards)** en lugar de tablas para los listados principales.
Esto proporciona una navegación más visual y táctil adecuada para el gestor de club.

### 4.1 Raíz del template

- Un único `<div>` raíz sin clases de contenedor (el contenedor lo pone la página).

### 4.2 Breadcrumb

- Primera línea del template: `<app-breadcrumb [items]="breadcrumbItems()"></app-breadcrumb>`.

### 4.3 Mensaje de éxito (queryParams)

- Si la ruta trae `?msg=...`, mostrar un alert temporal:
  ```html
  @if (message()) {
    <div class="d-flex justify-content-center my-2">
      <div class="alert alert-success w-100 text-center" role="alert">
        {{ message() }}
      </div>
    </div>
  }
  ```
- El mensaje se auto-oculta tras 4 segundos mediante `setTimeout`.

### 4.4 Barra de búsqueda global

- `<div class="d-flex justify-content-center my-2">` con `<input>` de búsqueda idéntico al
  del perfil Administrador (ver Sección 3.2 del perfil id=1).
- Binding con `debounceTime` vía `Subject<string>`.
- Si el componente ya filtra por FK (ej. `categoria > 0`), la barra puede mostrarse igualmente
  porque el filtro FK se combina con la búsqueda de texto.

### 4.5 Línea de contadores

- `<div class="d-flex justify-content-center my-1">`:
  - `<small class="text-muted">Total registros: {{ totalRecords() || 0 }}</small>`
  - Si hay filtro de texto activo:
    `<small class="text-muted ms-3">Filtro: nombre contiene "{{ nombre() }}"</small>`

### 4.6 Controles de paginación y rpp

- Solo se muestran si `totalRecords() > 0`.
- Estructura idéntica al perfil Administrador:
  ```html
  <div class="container-fluid p-0 my-1">
    <div class="controls-row mb-2">
      <div class="col-control left">
        <app-paginacion ...></app-paginacion>
      </div>
      <div class="col-control right">
        <app-botonera-rpp ...></app-botonera-rpp>
      </div>
    </div>
  </div>
  ```

### 4.7 Botón de creación

- `<div class="d-flex my-1">` → `<div class="w-100 d-flex justify-content-center">`:
  ```html
  <a class="btn btn-primary new-btn" [routerLink]="['/<entidad>/teamadmin/new']" role="button">
    <i class="bi bi-plus-circle" aria-hidden="true"></i>
    <span class="d-none d-sm-inline">Crear <entidad></span>
  </a>
  ```
- En modo diálogo (`isDialogMode()`), el botón se oculta.
- Para entidades que el club admin no puede crear (ver Sección 10, restricciones por entidad),
  el botón se omite completamente del template.
- Cuando el plist está filtrado por una entidad padre (FK activa), el botón pasa el ID del
  padre como `queryParam` para que el formulario de creación lo precargue automáticamente:
  ```html
  <a class="btn btn-primary new-btn"
     [routerLink]="['/<entidad>/teamadmin/new']"
     [queryParams]="idPadre ? { id_padre: idPadre } : {}"
     role="button">
    <i class="bi bi-plus-circle" aria-hidden="true"></i>
    <span class="d-none d-sm-inline">Crear <entidad></span>
  </a>
  ```
  Si `idPadre` es `0` o `undefined`, `[queryParams]` devuelve `{}` (sin parámetros).
  En plists que reutilizan el plist admin con `strRole`, el routerLink es dinámico:
  ```html
  [routerLink]="strRole ? ['/<entidad>', strRole, 'new'] : ['/<entidad>/new']"
  [queryParams]="idPadre ? { id_padre: idPadre } : {}"
  ```

### 4.8 Rejilla de tarjetas

- Contenedor: `<div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">`.
- Iteración: `@for (oEntidad of oPage()?.content; track oEntidad.id)`.

Cada tarjeta sigue este patrón:

```html
<div class="col">
  <div class="card h-100 shadow-sm">
    <div class="card-header d-flex align-items-center gap-2">
      <i class="bi bi-<icono> fs-5" aria-hidden="true"></i>
      <strong class="text-truncate">{{ oEntidad.campoDescriptivo }}</strong>
    </div>
    <div class="card-body pb-2">
      <ul class="list-unstyled mb-3">
        <li class="mb-1">
          <i class="bi bi-hash text-muted me-1"></i>
          <span class="text-muted">ID:</span> {{ oEntidad.id }}
        </li>
        <!-- Campos propios relevantes con icono + texto -->
        <li class="mb-1">
          <i class="bi bi-<icono-campo> text-muted me-1"></i>
          <span class="text-muted"><Label>:</span> {{ oEntidad.campo }}
        </li>
      </ul>
      <!-- Relaciones ManyToOne como texto con enlace -->
      <p><strong><Relación>:</strong>
        @if (oEntidad.relacion) {
          <a [routerLink]="['/<relacion>/teamadmin/view', oEntidad.relacion.id]">
            {{ oEntidad.relacion.campoDescriptivo }}
          </a>
        } @else { Sin <relación> }
      </p>
      <!-- Contadores (OneToMany) como badges -->
      <div class="d-flex flex-wrap gap-2">
        @if (oEntidad.contador === 0) {
          <span class="badge bg-secondary opacity-75">
            <i class="bi bi-<icono> me-1"></i>0 <nombre>
          </span>
        } @else {
          <a [routerLink]="['/<entidadHija>/teamadmin/<entidad>', oEntidad.id]"
             class="badge bg-primary text-decoration-none">
            <i class="bi bi-<icono> me-1"></i>{{ oEntidad.contador }} <nombre>
          </a>
        }
      </div>
    </div>
    <div class="card-footer d-flex justify-content-end gap-2">
      <!-- Botón Ver explícito -->
      <a [routerLink]="['/<entidad>/teamadmin/view', oEntidad.id]"
         class="btn btn-outline-primary btn-sm">
        <i class="bi bi-eye" aria-hidden="true"></i>
        <span class="d-none d-sm-inline ms-1">Ver</span>
      </a>
      <!-- Botones Editar/Eliminar (si la entidad lo permite) -->
      <a [routerLink]="['/<entidad>/teamadmin/edit', oEntidad.id]"
         class="btn btn-outline-warning btn-sm">
        <i class="bi bi-pencil" aria-hidden="true"></i>
        <span class="d-none d-sm-inline ms-1">Editar</span>
      </a>
      <a [routerLink]="['/<entidad>/teamadmin/delete', oEntidad.id]"
         class="btn btn-outline-danger btn-sm">
        <i class="bi bi-trash" aria-hidden="true"></i>
        <span class="d-none d-sm-inline ms-1">Eliminar</span>
      </a>
    </div>
  </div>
</div>
```

**Alternativa con `app-botonera-actions-plist`**:
En lugar de botones manuales en el `card-footer`, se puede usar el componente compartido
pasando `strRole="teamadmin"`:
```html
<div class="card-footer d-flex justify-content-between">
  <a [routerLink]="['/<entidad>/teamadmin/view', oEntidad.id]"
     class="btn btn-outline-secondary btn-sm">Ver</a>
  <app-botonera-actions-plist [id]="oEntidad.id ?? 0"
    strEntity="<entidad>" strRole="teamadmin">
  </app-botonera-actions-plist>
</div>
```

El componente `BotoneraActionsPlist` genera automáticamente las rutas con el segmento
`/teamadmin/` cuando recibe `strRole="teamadmin"`, y aplica internamente las restricciones de
edición/borrado por entidad (ver Sección 10).

### 4.9 Diferencia con el plist del perfil Administrador (id=1)

| Aspecto | Admin (id=1) | Teamadmin (id=2) |
|---------|-------------|-----------------|
| Layout | Tabla `<table>` con columnas ordenables | Tarjetas `card` en grid responsivo |
| Navegación primaria | Menú lateral / sidebar | Breadcrumbs + enlaces en tarjetas |
| Breadcrumb | No se usa | Obligatorio en todo plist |
| Rutas | `/<entidad>/...` | `/<entidad>/teamadmin/...` |
| Botón crear | Siempre visible | Visible solo si entidad es editable |
| Filtro FK | Indicado en línea de contadores | Indicado en breadcrumb dinámico |
| Contadores | Columnas de tabla | Badges dentro de la tarjeta |

### 4.10 CSS del componente plist teamadmin

- Importar el CSS compartido al inicio: `@import '../../../shared/plist-styles.css';`
  (ajustar ruta relativa según profundidad).
- Solo `controls-row` y clases de paginación se usan del CSS compartido (las reglas de tabla
  se ignoran al no haber tabla).
- Regla mínima obligatoria: `:host { display: block; }`.

---

## 5. Diseño del componente `detail` (detalle de solo lectura)

### 5.1 Estructura raíz

- `<div class="container py-3">` como contenedor raíz.

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

- Contenedor: `<div class="container my-2">`.
- **No lleva título `<h1>`** propio; el breadcrumb del componente ya indica la ubicación.
- Montaje del componente con filtros si aplica:
  ```html
  <app-<entidad>-teamadmin-plist [categoria]="categoria()" [usuario]="usuario()">
  </app-<entidad>-teamadmin-plist>
  ```
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

- Contenedor: `<div class="container py-3">`.
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
<div class="container my-2">
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
