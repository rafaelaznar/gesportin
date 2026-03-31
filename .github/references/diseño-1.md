# Diseño de UI para el perfil Administrador (tipousuario id=1)

Guía de referencia exhaustiva del diseño visual y de marcado HTML para todas las vistas
(`plist`, `detail` y `form`) del perfil **Administrador** en la aplicación frontsportin.
Debe aplicarse de forma uniforme a todas las entidades gestionadas por este perfil.

---

## 1. Principios generales

- El stack de UI es **Bootstrap 5.3** + **Bootstrap Icons 1.13** + **Angular Material 20**.
  No mezclar componentes de Angular Material para la maquetación de páginas de entidad;
  Angular Material se usa exclusivamente para diálogos (`MatDialog`) y notificaciones (`MatSnackBar`).
- Escala de tamaños de fuente reducida (`small`, `fs-5`, `fw-semibold`) para maximizar
  la densidad de información.
- Responsive first: columnas de tabla que no son esenciales se ocultan en pantallas pequeñas
  con `d-none d-md-table-cell` o `d-none d-lg-table-cell`.
- Paleta de colores institucional:
  - **Primario** → `bg-primary` / `text-primary` (azul Bootstrap por defecto)
  - **Secciones de relaciones nivel 1** → `border-info` / `bg-info bg-opacity-10` / `text-info`
  - **Secciones de relaciones nivel 2 (anidadas)** → `border-success` / `bg-success bg-opacity-10` / `text-success`
  - **Fondo de cabecera de página** → `bg-light border rounded`
  - **Alerta de error** → `alert-danger`
  - **Spinner** → `spinner-border text-primary` (carga) / `spinner-border text-secondary` (edición)
- Los componentes son **standalone**; importar solo lo que se usa.
- Estado del componente manejado con **Angular Signals** (`signal`, `computed`).
  Nunca usar `BehaviorSubject` ni propiedades mutables directas para estado de UI.

---

## 2. Estructura de archivos del componente admin

Cada entidad gestionada por el Administrador sigue esta estructura canónica:

- `component/<entidad>/admin/plist/` → plist.ts + plist.html + plist.css
- `component/<entidad>/admin/form/`  → form.ts + form.html + form.css
- `component/<entidad>/admin/detail/` → detail.ts + detail.html + detail.css
- `page/<entidad>/admin/plist/`  → plist.ts + plist.html (wrapper mínimo)
- `page/<entidad>/admin/view/`   → view.html (monta el componente detail)
- `page/<entidad>/admin/new/`    → new.ts + new.html (wrapper del form en modo crear)
- `page/<entidad>/admin/edit/`   → edit.ts + edit.html (wrapper del form en modo editar)
- `page/<entidad>/admin/delete/` → delete.ts + delete.html (confirmación de borrado)

---

## 3. Diseño del componente `plist` (listado paginado)

### 3.1 Raíz del template

- Un único `<div>` raíz sin clases de contenedor (el contenedor lo pone la página).

### 3.2 Barra de búsqueda global

- Un `<div class="d-flex justify-content-center my-2">` contiene el `<input>` de búsqueda.
- El `<input>` lleva:
  - `class="form-control me-2"`
  - `type="search"`
  - `placeholder="Buscar por <campo>"`
  - `aria-label="Search"`
  - Binding `(input)` al método `onSearch<Campo>($any($event.target).value)`
  - Binding `[value]` al signal del término de búsqueda
  - `name="searchField"`
- Si el plist tiene filtro por FK activo (recibe `@Input` con `id_<entidad>`), la barra de búsqueda
  de texto libre se oculta totalmente mientras el filtro FK esté activo.
- Solo hay una barra de búsqueda por plist; nunca múltiples `<input>` de búsqueda visibles
  al mismo tiempo.

### 3.3 Línea de contadores y filtros activos

- Un `<div class="d-flex justify-content-center my-1">` muestra:
  - `<small class="text-muted">Total registros: {{ totalRecords() || 0 }}</small>`
  - Por cada filtro FK activo (ej. `id_club > 0`):
    - `<small class="text-muted ms-3">Filtro: id de <entidad> = {{ id_<entidad> }}</small>`
    - Un enlace `<a class="ms-2" [routerLink]="['/entidad']">` con icono `bi-x-lg` para quitar el filtro.
      Este enlace solo se muestra si `!isDialogMode()`.
  - Por cada filtro de texto activo:
    - `<small class="text-muted ms-3">Filtro: búsqueda contiene "{{ termino() }}"</small>`

### 3.4 Botón de creación

- Un `<div class="d-flex my-1">` → `<div class="w-100 d-flex justify-content-center">` contiene el botón.
- Botón: `<a class="btn btn-primary new-btn" [routerLink]="['/entidad/new']" role="button">`.
  - Icono: `<i class="bi bi-plus-circle me-2" aria-hidden="true"></i>`.
  - Texto: `<span class="d-none d-sm-inline">Crear <entidad></span>` (oculto en xs).
- Para el perfil Administrador puro (`id=1`), el botón de creación **siempre** se muestra.
  No se condiciona a ningún guard de sesión en el template del componente admin.

### 3.5 Controles de paginación y rpp

- Solo se muestran si `totalRecords() > 0`.
- Envueltos en `<div class="container-fluid p-0 my-1">` →
  `<div class="controls-row mb-2">` (clase definida en `plist-styles.css`):
  - `<div class="col-control left">` → `<app-paginacion [numPage]="numPage()" [numPages]="oPage()?.totalPages || 1" (pageChange)="goToPage($event)"></app-paginacion>`
  - `<div class="col-control right">` → `<app-botonera-rpp [numRpp]="numRpp()" (rppChange)="onRppChange($event)"></app-botonera-rpp>`

### 3.6 Tabla de datos

- Envuelta en `<div class="d-flex justify-content-center">` →
  `<div class="table-responsive w-100">`.
- Etiqueta de tabla: `<table class="table table-striped table-bordered table-sm w-100">`.

#### Cabecera (`<thead>`)

Cada `<th>` sigue este patrón:
- `scope="col"` obligatorio.
- Ancho fijo mediante `style="width: N%"` para que la tabla no rebote al cambiar de página.
- Si la columna es ordenable, llevar `(click)="onOrder('<campo>')"` y `style="cursor: pointer"`.
- Las columnas de datos secundarios (contadores de relaciones) llevan
  `class="d-none d-md-table-cell"` o `class="d-none d-lg-table-cell"` para ocultarse en móvil.
- Contenido interno del `<th>`:
  ```
  <div class="header-stacked">
    <div class="header-top">
      <i class="bi bi-<icono>" aria-hidden="true"></i>
      <!-- Si es ordenable, mostrar caret según dirección activa -->
      @if (orderField() === '<campo>') {
        @if (orderDirection() === 'asc')  { <i class="bi bi-caret-up-fill"   aria-hidden="true"></i> }
        @if (orderDirection() === 'desc') { <i class="bi bi-caret-down-fill" aria-hidden="true"></i> }
      }
    </div>
    <span>Nombre columna</span>
  </div>
  ```
- La columna de **ID** encabeza siempre la tabla con `style="width: 6-7%"`.
- La columna de **Acciones** cierra siempre la tabla con `class="text-center"` y
  `style="width: 12-15%"`.

#### Columnas recomendadas de cabecera por tipo

- Columna ID: icono `bi-hash`, no ordenable cuando solo hay un campo clave; sí ordenable si el
  campo `id` tiene sentido semántico de forma ordenada.
- Columnas de campos propios de la entidad: ordenables, icono descriptivo del campo.
- Columnas de relaciones ManyToOne: no ordenables (no son campos directos de la entidad),
  sin icono de caret. Sólo icono temático.
- Columnas de contadores OneToMany: no ordenables, ocultas en pantallas pequeñas.
- Columna Acciones: no ordenable, `text-center`.

#### Filas de datos (`<tbody>`)

- Iteración con `@for (oEntidad of oPage()?.content; track oEntidad.id)`.
- `<tr>` lleva:
  - `(click)="onSelect(oEntidad)"` — en modo diálogo selecciona el registro; en modo normal no hace nada.
  - `[style.cursor]="isDialogMode() ? 'pointer' : 'default'"`
- Primera celda: `<th scope="row" class="text-center">{{ oEntidad.id }}</th>`.
- Celdas de texto simple: `<td>{{ oEntidad.campo }}</td>`.
- Celdas numéricas: `<td class="text-end">{{ oEntidad.campo }}</td>`.
- Celdas de relación ManyToOne:
  - En modo diálogo: mostrar solo el texto del campo de la relación.
  - En modo normal: enlace `<a [routerLink]="['/entidadRelacionada/view', oEntidad.relacion.id]">texto</a>`,
    más botón de filtro `<a class="btn btn-warning btn-sm ms-2 float-end" [routerLink]="['/entidad/entidadRelacionada', oEntidad.relacion.id]" title="Filtrar"><i class="bi bi-funnel-fill"></i></a>`.
- Celdas de contadores (OneToMany):
  - Llevan `class="text-center d-none d-md-table-cell"` (o d-lg según importancia).
  - En modo diálogo: mostrar el número directamente.
  - En modo normal: si el contador es 0, mostrar `<i class="bi bi-ban" aria-hidden="true"></i>`.
    Si es mayor que 0, mostrar como enlace al listado filtrado:
    `<a [routerLink]="['/entidadRelacionada/entidad', oEntidad.id]">{{ contador }}</a>`.
- Celda de acciones: `<td class="text-center">`.
  - `<app-botonera-actions-plist [id]="oEntidad.id" strEntity="<entidad>"></app-botonera-actions-plist>`.
  - `strEntity` debe ser el nombre de la entidad en minúsculas, igual que el segmento de ruta.

### 3.7 CSS del componente plist

- Importar siempre el CSS compartido al inicio del fichero CSS:
  `@import '../../../shared/plist-styles.css';`
  (ajustar la ruta relativa según la profundidad de la entidad)
- Solo añadir reglas propias del componente si son estrictamente necesarias.
- Regla mínima obligatoria:
  - `:host { display: block; }`
  - `th { user-select: none; }` — evita selección de texto al ordenar
  - `th:hover { background-color: #f5f5f5; }` — feedback visual al pasar el ratón

---

## 4. Diseño del componente `detail` (detalle de solo lectura)

### 4.1 Estructura raíz

- `<div class="container py-3">` como contenedor raíz.

### 4.2 Cabecera de sección

- `<div class="d-flex flex-wrap align-items-center justify-content-between gap-2 border rounded bg-light p-2 mb-3">` con dos hijos:
  - `<div>` con:
    - `<div class="text-uppercase small text-muted fw-semibold"><Entidades en plural></div>`
    - `<div class="fw-bold">Detalle de <entidad></div>`
    - `<div class="text-muted small">Panel administrativo</div>`
  - `<a class="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2" routerLink="/<entidad>">` con `<i class="bi bi-arrow-left"></i> Volver`.

### 4.3 Estado de carga

- Mientras `loading()` sea `true`:
  ```html
  <div class="text-center py-4">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
    <p class="text-muted small mt-2 mb-0">Cargando detalle...</p>
  </div>
  ```

### 4.4 Estado de error

- Si `error()` no es nulo:
  ```html
  <div class="alert alert-danger d-flex align-items-center gap-2" role="alert">
    <i class="bi bi-exclamation-triangle-fill"></i> {{ error() }}
  </div>
  ```

### 4.5 Tarjeta principal de datos

Condición: `@if (!loading() && !error() && oEntidad())`.

- `<div class="card border-0 shadow-sm">`:
  - **Card header**: `<div class="card-header bg-primary text-white d-flex align-items-center gap-2">`:
    - Icono representativo de la entidad: `<i class="bi bi-<icono>-fill"></i>`.
    - `<span class="fw-semibold">{{ oEntidad()?.campoIdentificador }}</span>` (campo más descriptivo).
    - `<span class="badge bg-white text-primary ms-auto">ID {{ oEntidad()?.id }}</span>`.
  - **Card body**: `<div class="card-body">`.

### 4.6 Campos propios de la entidad

- Dentro del card body, antes de las relaciones:
  ```html
  <div class="row g-1 mb-3">
    <div class="col-5 text-muted small text-uppercase">ID</div>
    <div class="col-7 fw-semibold small">{{ oEntidad()?.id }}</div>
    <div class="col-5 text-muted small text-uppercase">Campo</div>
    <div class="col-7 fw-semibold small">{{ oEntidad()?.campo }}</div>
    <!-- ... un par col-5 / col-7 por cada campo propio -->
  </div>
  ```
- Normas por tipo de campo:
  - Texto simple: `{{ oEntidad()?.campo }}`.
  - Fecha/hora: `{{ oEntidad()?.fechaAlta | datetime }}` (usar el pipe `DatetimePipe`).
  - Booleano/género codificado como 0/1: expresión ternaria `{{ oEntidad()?.genero === 0 ? 'Hombre' : 'Mujer' }}`.
  - Numérico monetario: `{{ oEntidad()?.precio | number:'1.2-2' }} €`.
  - Porcentaje: `{{ oEntidad()?.descuento | number:'1.2-2' }}%`.
  - Imagen (base64): `<img [src]="'data:image/jpeg;base64,' + oEntidad()?.imagen" class="img-thumbnail" style="max-height:80px" alt="<entidad>"/>`, con fallback `@else { Sin imagen }`.
  - Campo nullable: añadir `|| '-'` para mostrar guión cuando es nullo.

### 4.7 Secciones de relaciones ManyToOne (nivel 1)

Por cada relación ManyToOne de la entidad:

- `<div class="card border-start border-3 border-info mt-3">`:
  - **Card header**: `<div class="card-header py-1 d-flex align-items-center gap-2 bg-info bg-opacity-10">`:
    - `<i class="bi bi-<icono> text-info small"></i>`
    - `<span class="text-uppercase small fw-semibold text-info"><Nombre de la relación></span>`
    - Enlace rápido: `<a [routerLink]="['/entidadRelacion/view', oEntidad()?.relacion?.id]" class="ms-auto badge bg-info text-white text-decoration-none small">`:
      - `{{ oEntidad()?.relacion?.campoDescriptivo }}`
      - `<span class="opacity-75 ms-1">#{{ oEntidad()?.relacion?.id }}</span>`
      - `<i class="bi bi-box-arrow-up-right ms-1"></i>`
  - **Card body**: `<div class="card-body p-2">` → `<div class="row g-1">` con pares `col-5/col-7`
    para cada campo relevante de la entidad relacionada.

### 4.8 Secciones de relaciones ManyToOne anidadas (nivel 2)

Si la relación de nivel 1 incluye a su vez otra ManyToOne:

- Se anida dentro del card body de nivel 1.
- `<div class="card border-start border-3 border-success mt-3">`:
  - **Card header**: mismo patrón que nivel 1 pero usando `border-success`, `bg-success bg-opacity-10`,
    `text-success` y `bg-success` en el badge.
  - **Card body**: igual que nivel 1.

### 4.9 Sección de contadores (OneToMany)

Al final del card body de la tarjeta principal, tras las relaciones ManyToOne:

- `<div class="border-top mt-3 pt-3">`:
  - `<div class="text-uppercase small text-muted fw-semibold mb-2"><i class="bi bi-bar-chart-fill me-1"></i>Contadores</div>`
  - `<div class="row g-2">` con un `<div class="col-6 col-md-4 col-lg-3">` por cada contador:
    ```html
    <div class="border rounded p-2 text-center bg-light">
      <div class="text-muted small text-uppercase"><Nombre del contador></div>
      <div class="fw-bold fs-5">
        @if ((oEntidad()?.contador ?? 0) > 0) {
          <a [routerLink]="['/entidadRelacionada/entidad', oEntidad()?.id]" class="text-decoration-none">
            {{ oEntidad()?.contador }}
          </a>
        } @else { 0 }
      </div>
    </div>
    ```

### 4.10 CSS del componente detail

- Reglas mínimas: `:host { display: block; }`.
- No importar plist-styles.css (es exclusivo de los plist).
- No añadir márgenes al `.card` salvo `margin-top: 1rem` si se necesita separación entre tarjetas.
- El tamaño de fuente de `.text-uppercase` debe reducirse ligeramente: `font-size: 0.75rem`.

---

## 5. Diseño del componente `form` (formulario crear/editar)

### 5.1 Estructura raíz

- Un único `<div>` raíz sin clases de contenedor (el contenedor lo provee la página).

### 5.2 Formulario

- `<form [formGroup]="<entidad>Form" (ngSubmit)="onSubmit()" novalidate>`.

### 5.3 Campo ID (solo lectura)

- Siempre el primer campo del formulario.
- `<div class="mb-3">`:
  - `<label for="id" class="form-label">ID</label>`
  - `<input id="id" type="text" class="form-control" formControlName="id" readonly />`

### 5.4 Campos de texto / número

- Cada campo en un `<div class="mb-3">`:
  - Etiqueta: `<label for="<campo>" class="form-label"><Nombre> <span class="text-danger">*</span></label>`
    (el `<span>` de asterisco solo si el campo es obligatorio).
  - Input: `<input id="<campo>" type="text|number|email|password|date" class="form-control" formControlName="<campo>" [class.is-invalid]="<campo>?.invalid && <campo>?.touched" />`.
  - Para `type="number"` con decimales: añadir `step="0.01"`.
  - Mensajes de error: bloque `@if (<campo>?.invalid && <campo>?.touched)`:
    ```html
    <div class="invalid-feedback">
      @if (<campo>?.errors?.['required'])  { <span><Nombre> es obligatorio.</span> }
      @if (<campo>?.errors?.['minlength']) { <span>Debe tener al menos N caracteres.</span> }
      @if (<campo>?.errors?.['maxlength']) { <span>Máx N caracteres.</span> }
      @if (<campo>?.errors?.['min'])       { <span><Nombre> debe ser mayor a N.</span> }
      @if (<campo>?.errors?.['max'])       { <span><Nombre> no puede ser mayor a N.</span> }
      @if (<campo>?.errors?.['email'])     { <span>Email no válido.</span> }
    </div>
    ```

### 5.5 Campos de contraseña con visibilidad condicional

- El campo de contraseña solo se muestra en modo creación (`!isEditMode`).
- En modo edición se omite completamente.
- Pattern estructural:
  ```html
  <div class="mb-3" *ngIf="!isEditMode">
    <label for="password" class="form-label">Contraseña <span class="text-danger">*</span></label>
    <input id="password" type="password" class="form-control" formControlName="password"
           [class.is-invalid]="password?.invalid && password?.touched" />
    @if (password?.invalid && password?.touched) {
      <div class="invalid-feedback">...</div>
    }
  </div>
  ```

### 5.6 Campos de relación ManyToOne (`<select>`)

- Cada relación FK en un `<div class="mb-3">`:
  ```html
  <label for="id_<relacion>" class="form-label"><Nombre de la relación> <span class="text-danger">*</span></label>
  <select id="id_<relacion>" class="form-select" formControlName="id_<relacion>"
          [class.is-invalid]="id_<relacion>?.invalid && id_<relacion>?.touched">
    <option [ngValue]="null">Selecciona <relación></option>
    @for (item of <relaciones>(); track item.id) {
      <option [value]="item.id">{{ item.campoDescriptivo }}</option>
    }
  </select>
  @if (id_<relacion>?.invalid && id_<relacion>?.touched) {
    <div class="invalid-feedback"><Nombre de relación> es obligatorio.</div>
  }
  ```
- El signal `<relaciones>` se carga en `ngOnInit()` llamando el servicio correspondiente.
- En el `FormGroup` el campo siempre se nombra con prefijo `id_`: `id_club`, `id_tipousuario`, etc.

### 5.7 Campos booleanos u opciones binarias

- Usar `<select class="form-select">` con dos `<option>`:
  ```html
  <select id="<campo>" class="form-select" formControlName="<campo>">
    <option [value]="0">Opción A</option>
    <option [value]="1">Opción B</option>
  </select>
  ```

### 5.8 Campos de fecha

- Usar `<input type="date" class="form-control" ...>`.
- En `loadData()` convertir el string ISO al formato `yyyy-MM-dd` para rellenar el input.

### 5.9 Botonera de acciones del formulario

- Al final del formulario, un `<div class="d-flex justify-content-between">`:
  - Botón cancelar: `<button type="button" class="btn btn-outline-secondary" (click)="onCancel()">Cancelar</button>`.
  - Botón submit: `<button type="submit" class="btn btn-primary" [disabled]="submitting() || <entidad>Form.invalid">`.
    - Si `submitting()` incluir spinner: `<span class="spinner-border spinner-border-sm me-2"></span>`.
    - Texto dinámico: `{{ isEditMode ? 'Guardar' : 'Crear' }}`.

### 5.10 Manejo de errores en el formulario

- Un signal `error = signal<string | null>(null)` en el componente.
- Mostrar en template justo antes de la botonera, solo cuando `error()` no es nulo:
  ```html
  @if (error()) {
    <div class="alert alert-danger mt-3" role="alert">{{ error() }}</div>
  }
  ```

### 5.11 CSS del componente form

- Normalmente el fichero CSS puede quedar vacío salvo `:host { display: block; }`.
- No añadir estilos propios salvo ajustes estrictamente necesarios.

---

## 6. Diseño de las páginas (`page/`)

### 6.1 Página `plist` (wrapper del componente plist)

- Contenedor: `<div class="container my-2">`.
- Título de sección visible al usuario:
  - `<div class="d-flex justify-content-center my-3">` →
    `<h1 class="mb-0"><i class="bi bi-<icono> me-2" aria-hidden="true"></i><Entidades en plural></h1>`.
- Montaje del componente: `<app-<entidad>-admin-plist [id_<relacion>]="id_<relacion>()"></app-<entidad>-admin-plist>`.
  - Si la página no recibe filtros por FK, el montaje es simplemente `<app-<entidad>-admin-plist />`.

### 6.2 Página `view` (wrapper del componente detail)

- En la mayoría de los casos la plantilla HTML solo monta el componente detail:
  ```html
  <app-<entidad>-admin-detail [id]="id_<entidad>"></app-<entidad>-admin-detail>
  ```
- El componente detail ya incluye su propia cabecera de sección con botón de volver.

### 6.3 Página `new` (crear nuevo registro)

- Contenedor: `<div class="container py-3">` → `<div class="row justify-content-center">` →
  `<div class="col-lg-6">`.
- Cabecera de sección:
  - `<div class="d-flex flex-wrap align-items-center justify-content-between gap-2 border rounded bg-light p-2 mb-3">` con:
    - `<div class="text-uppercase small text-muted fw-semibold"><Entidades en plural></div>`
    - `<div class="fw-bold">Crear nuevo/nueva <entidad></div>`
- Montaje del form: `<app-<entidad>-admin-form [<entidad>]="null" [isEditMode]="false" (formSuccess)="onFormSuccess()" (formCancel)="onFormCancel()"></app-<entidad>-admin-form>`.
- Ancho máximo limitado a `col-lg-6` para que el formulario no ocupe todo el ancho en pantallas grandes.

### 6.4 Página `edit` (editar registro existente)

- Contenedor igual que `new`: `container py-3` → `row justify-content-center` → `col-lg-6`.
- Gestor de estado de carga:
  - `@if (loading())` → spinner `<div class="text-center py-3"><div class="spinner-border text-secondary" ...>`.
  - `@if (error())` → `<div class="alert alert-danger">{{ error() }}</div>`.
  - `@if (!loading() && !error() && <entidad>())` → cabecera + form.
- Cabecera:
  - `<div class="d-flex flex-wrap align-items-center justify-content-between gap-2 border rounded bg-light p-2 mb-3">`:
    - `<div class="text-uppercase small text-muted fw-semibold"><Entidades en plural></div>`
    - `<div class="fw-bold">Editar <entidad></div>`
- Montaje del form: `<app-<entidad>-admin-form [<entidad>]="<entidad>()" [isEditMode]="true" (formSuccess)="onFormSuccess()" (formCancel)="onFormCancel()"></app-<entidad>-admin-form>`.

### 6.5 Página `delete` (confirmación de borrado)

- Contenedor: `<div class="container my-4">` → `<div class="row justify-content-center">` →
  `<div class="col-12 col-lg-8">` → `<div class="form-card">`.
- Cabecera: `<header class="mb-4"><h1 class="h3 mb-0">Eliminar <entidad></h1></header>`.
- Mensaje de error si lo hay: `<div class="alert alert-danger" role="alert">{{ error() }}</div>`.
- Mostrar el detalle del registro a eliminar:
  `<app-<entidad>-admin-detail [id]="id_<entidad>"></app-<entidad>-admin-detail>`.
- Botonera de confirmación:
  - `<div class="mt-3 d-flex gap-2">`:
    - `<button class="btn btn-danger" (click)="doDelete()">Confirmar eliminación</button>`
    - `<button class="btn btn-secondary" (click)="doCancel()">Cancelar</button>`

---

## 7. Componentes compartidos obligatorios

### 7.1 `app-paginacion`

- Empleado en todo plist cuando `totalRecords() > 0`.
- `[numPage]="numPage()"` — página actual (0-based).
- `[numPages]="oPage()?.totalPages || 1"` — total de páginas.
- `(pageChange)="goToPage($event)"` — output que recibe el número de página.

### 7.2 `app-botonera-rpp`

- Empleado en todo plist cuando `totalRecords() > 0`, siempre junto a `app-paginacion`.
- `[numRpp]="numRpp()"` — registros por página activos.
- `(rppChange)="onRppChange($event)"` — output que recibe el nuevo valor.

### 7.3 `app-botonera-actions-plist`

- Empleado en la última celda `<td>` de cada fila del plist.
- `[id]="oEntidad.id"` — id del registro.
- `strEntity="<entidad>"` — nombre de la entidad en minúsculas (igual al segmento de ruta).
- Genera automáticamente los botones ver / editar / borrar con los iconos y colores correctos:
  - Ver: `btn btn-primary btn-sm` + icono `bi-eye`.
  - Editar: `btn btn-warning btn-sm` + icono `bi-pencil`.
  - Borrar: `btn btn-danger btn-sm` + icono `bi-trash`.
- La visibilidad de los botones editar y borrar se gestiona internamente según el rol.
- Nunca reimplementar esta lógica de forma manual.

---

## 8. Patrones de accesibilidad

- Todos los `<i class="bi bi-...">` llevan `aria-hidden="true"` siempre que sean decorativos.
- Los `<input>` de búsqueda llevan `aria-label="Search"`.
- Los spinners llevan `role="status"` y `<span class="visually-hidden">Cargando...</span>`.
- Las alertas de error llevan `role="alert"`.
- Los grupos de botones de acciones llevan `role="group"` y `aria-label="Small button group"`.

---

## 9. Modo diálogo (selector de entidad)

Cuando un plist se abre como `MatDialog` para seleccionar un registro:

- `isDialogMode()` devuelve `true` si `MatDialogRef` está inyectado (con `{ optional: true }`).
- En modo diálogo:
  - Se oculta el botón de creación.
  - Se ocultan los enlaces de navegación (quitar filtro, filtrar por FK, ver detalle).
  - Las celdas de relaciones y contadores muestran texto plano en lugar de enlaces.
  - Cada `<tr>` tiene `cursor: pointer` y al hacer clic llama a `onSelect(oEntidad)`,
    que cierra el diálogo devolviendo el registro: `this.dialogRef?.close(oEntidad)`.

---

## 10. Responsive breakpoints referencia rápida

- Columnas siempre visibles: ID, campo principal, acciones.
- Columnas visibles desde md (≥768px): `d-none d-md-table-cell` — datos secundarios relevantes
  (contadores de relaciones de primer nivel).
- Columnas visibles desde lg (≥992px): `d-none d-lg-table-cell` — contadores de relaciones
  de segundo nivel o menos relevantes.
- El `plist-styles.css` compartido aplica automáticamente a ≤767px una regla CSS que fuerza
  la ocultación de todas las columnas excepto la primera, la segunda y la última (acciones).
  Por tanto, asegurarse de que las dos primeras columnas siempre sean ID y el campo más
  descriptivo de la entidad.
