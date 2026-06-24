# Diseño de UI para el perfil Usuario (tipousuario id=3)

Guía de referencia exhaustiva del diseño visual y de marcado HTML para todas las vistas
(`plist`, `detail` y `form`) del perfil **Usuario** en la aplicación
frontsportin. Debe aplicarse de forma uniforme a todas las entidades gestionadas por este perfil.

---

## 1. Arquitectura general de navegación

El perfil **Usuario** (tipousuario id=3) accede a la aplicación a través de rutas con prefijo `/mi/`. La navegación se realiza desde el **menú superior** (componente `app-menu`) y desde el **dashboard** o página de inicio (`/mi`).

### Rutas del perfil Usuario

| Ruta | Componente Page | Propósito |
|------|----------------|-----------|
| `/mi` | `MiHomePage` | Dashboard principal con tarjetas de acceso rápido |
| `/mi/perfil` | `UsuarioPerfilPage` | Datos personales del usuario en sesión |
| `/mi/noticias` | `NoticiaUsuarioPlistPage` | Listado de noticias del club |
| `/mi/noticias/:id` | `NoticiaUsuarioViewPage` | Detalle de noticia con comentarios y valoración |
| `/mi/equipos` | `EquipoUsuarioPlistPage` | Mis equipos agrupados por temporada y categoría |
| `/mi/equipos/:id` | `EquipoUsuarioViewPage` | Detalle del equipo con ligas y partidos |
| `/mi/equipos/:id/jugadores` | `JugadorUsuarioEquipoPlistPage` | Plantilla de jugadores del equipo |
| `/mi/cuotas` | `CuotaUsuarioPlistPage` | Cuotas y pagos por equipo |
| `/mi/tienda` | `CarritoUsuarioTiendaPage` | Tienda virtual + carrito de compras |
| `/mi/facturas` | `FacturaUsuarioPlistPage` | Historial de facturas de compras |
| `/usuario/teamadmin` | `UsuarioTeamadminPlistPage` | CRUD de usuarios (role teamadmin) |
| `/usuario/teamadmin/new` | `UsuarioTeamadminNewPage` | Crear usuario (teamadmin) |
| `/usuario/teamadmin/edit/:id` | `UsuarioTeamadminEditPage` | Editar usuario (teamadmin) |
| `/usuario/teamadmin/view/:id` | `UsuarioTeamadminViewPage` | Ver detalle de usuario (teamadmin) |
| `/usuario/teamadmin/delete/:id` | `UsuarioTeamadminDeletePage` | Eliminar usuario (teamadmin) |

### Estructura del layout general

El layout se define en `app.html`:
- **Header** (`app-header`): barra superior oscura (background `#1a1a1a`) con logo, nombre de la app y menú (`app-menu`).
- **Main**: ocupa el 100% del ancho (`col-12`) a diferencia del perfil Admin que tiene sidebar. Clase CSS `.main-content`.
- **Footer**: texto centrado "Gesportin, 2026 - MIT licensed" con borde superior.

---

## 2. Dashboard principal (`/mi`)

**Componente**: `app-user-dashboard` (`/component/shared/user-dashboard/`)

### Estructura HTML

```html
<div class="ud-wrapper">
  <header class="ud-hero">
    <div class="ud-hero-content">
      <div class="ud-avatar">
        <!-- Logo del club o icono por defecto -->
        <img *ngIf="clubLogo" /> o <i class="bi bi-person-circle"></i>
      </div>
      <div class="ud-welcome">
        <h1>Bienvenido, <span class="ud-username">{{ userName() }}</span></h1>
        <p>Área personal de tu club</p>
      </div>
    </div>
  </header>
  <div class="ud-grid">
    <!-- Tarjetas de acceso rápido -->
  </div>
</div>
```

### CSS principal (`ud-*`)

- `.ud-wrapper`: fondo `#f0f4f8`, `min-height: 100vh`, padding inferior 3rem.
- `.ud-hero`: gradiente `linear-gradient(135deg, #1a3a5c 0%, #2e6da4 60%, #4a9fd4 100%)`, padding `3rem 2rem 2.5rem`.
- `.ud-hero-content`: `max-width: 900px`, flex con gap `1.5rem`, centrado.
- `.ud-avatar`: `font-size: 4rem`, color blanco semitransparente.
- `.ud-logo-img`: `width: 5rem`, `height: 5rem`, `border-radius: 50%`, borde blanco semitransparente.
- `.ud-username`: color `#a8d8f0`.
- `.ud-grid`: `max-width: 900px`, grid con `repeat(auto-fill, minmax(300px, 1fr))`, gap `1.25rem`.

### Tarjetas de acceso (`ud-card`)

Cada tarjeta es un `<a>` con:
- `display: flex`, `align-items: center`, gap `1.25rem`
- `background: #fff`, `border-radius: 14px`, `padding: 1.5rem`
- `border: 2px solid transparent`, `box-shadow: 0 2px 12px rgba(0,0,0,0.07)`
- Hover: `translateY(-3px)`, sombra y color de borde según tipo

**Tipos de tarjeta y colores:**

| Tarjeta | Clase CSS | Color borde hover | Icono |
|---------|-----------|-------------------|-------|
| Noticias | `ud-card--news` | `#2e86c1` | `bi-newspaper` |
| Mis Equipos | `ud-card--teams` | `#1e8449` | `bi-trophy` |
| Cuotas y Pagos | `ud-card--fees` | `#d4ac0d` | `bi-cash-coin` |
| Tienda Virtual | `ud-card--shop` | `#cb4335` | `bi-bag-heart` |
| Mis Facturas | `ud-card--invoices` | `#7d3c98` | `bi-receipt` |

Características comunes a todas las tarjetas:
- Icono con fondo coloreado y `border-radius: 12px`, `width/height: 3.5rem`
- Flecha `bi-arrow-right-circle` que se desplaza +4px en hover
- Badge rojo (`#e74c3c`) opcional para notificaciones (carrito, facturas)

### Página home (`/page/usuario/mi-home/mi-home.html`)

```html
<app-user-dashboard />
```

Es simplemente el contenedor que renderiza el dashboard.

---

## 3. Perfil de usuario (`/mi/perfil`)

**Componente**: `UsuarioPerfilPage` (`/page/usuario/perfil/`)

### Estructura

```html
<div class="container-fluid">
  <!-- Cabecera breadcrumb -->
  <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 border rounded bg-light p-2 mb-3">
    <div>
      <div class="text-uppercase small text-muted fw-semibold">Cuenta</div>
      <div class="fw-bold">Mi perfil</div>
      <div class="text-muted small">Datos de tu usuario en sesión</div>
    </div>
  </div>

  <!-- Loading spinner -->
  <div class="text-center py-4">
    <div class="spinner-border text-primary" role="status">...</div>
  </div>

  <!-- Error alert -->
  <div class="alert alert-danger d-flex align-items-center gap-2">
    <i class="bi bi-exclamation-triangle-fill"></i> {{ error() }}
  </div>

  <!-- Card de datos personales -->
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-primary text-white d-flex align-items-center gap-2">
      <i class="bi bi-person-circle"></i>
      <span class="fw-semibold">{{ nombre }} {{ apellido1 }} {{ apellido2 }}</span>
      <span class="badge bg-white text-primary ms-auto">ID {{ id }}</span>
    </div>
    <div class="card-body">
      <!-- Datos en formato row: col-5 label + col-7 valor -->
      <div class="row g-1 mb-3">
        <div class="col-5 text-muted small text-uppercase">ID</div>
        <div class="col-7 fw-semibold small">{{ value }}</div>
        <!-- ... más campos ... -->
      </div>

      <!-- Cards expandibles con border-start border-3 border-info -->
      <div class="card border-start border-3 border-info mt-3">
        <div class="card-header py-1 d-flex align-items-center gap-2 bg-info bg-opacity-10">
          <i class="bi bi-person-badge-fill text-info small"></i>
          <span class="text-uppercase small fw-semibold text-info">Tipo de usuario</span>
        </div>
        <div class="card-body p-2">
          <div class="row g-1">
            <div class="col-5 text-muted small text-uppercase">ID</div>
            <div class="col-7 fw-semibold small">{{ id }}</div>
            <div class="col-5 text-muted small text-uppercase">Descripción</div>
            <div class="col-7 fw-semibold small">{{ descripcion }}</div>
          </div>
        </div>
      </div>

      <!-- Rol de usuario (mismo patrón) -->
      <!-- Club (condicional, solo si tiene club) -->
    </div>
  </div>
</div>
```

### Patrón Detail

El perfil y las vistas detail usan un **patrón de card** consistente:
- Card principal sin borde (`border-0`) con sombra (`shadow-sm`)
- Header azul (`bg-primary text-white`) con icono, título y badge ID
- Cuerpo con filas de datos en grid `row g-1`: label `col-5 text-muted small text-uppercase`, valor `col-7 fw-semibold small`
- Secciones anidadas con `card border-start border-3 border-info` y header semitransparente (`bg-info bg-opacity-10`)

---

## 4. Noticias del club

### 4.1 Listado (`/mi/noticias`)

**Página**: `/page/noticia/usuario/plist/`
**Componente**: `app-noticia-usuario-plist` (`/component/noticia/usuario/plist/`)

#### HTML del page wrapper

```html
<div class="page-container">
  <div class="page-header">
    <h2><i class="bi bi-newspaper me-2"></i>Noticias de tu club</h2>
  </div>
  <app-noticia-usuario-plist></app-noticia-usuario-plist>
</div>
```

#### CSS del page wrapper

- `.page-container`: `max-width: 860px`, `margin: 0 auto`, `padding: 1.5rem`
- `.page-header`: `margin-bottom: 1.5rem`, `padding-bottom: 0.75rem`, `border-bottom: 2px solid #e5e7eb`
- `.page-header h2`: `font-size: 1.5rem`, `font-weight: 700`, `color: #1a1a2e`

#### Componente plist

**Estados**: loading, error, empty, listado.

**Listado**:
- Contenedor `.news-list` con `display: flex`, `flex-direction: column`, `gap: 1rem`
- Cada noticia es un `<a>` con clase `.news-card`:
  - `display: flex`, `align-items: flex-start`, `gap: 1rem`
  - `background: #fff`, `border-radius: 12px`, `padding: 1.25rem 1.5rem`
  - `border: 1px solid #e5e7eb`, `box-shadow: 0 1px 4px rgba(0,0,0,0.05)`
  - `text-decoration: none`, `color: inherit`
  - Hover: `box-shadow: 0 4px 18px rgba(0,0,0,0.1)`, `translateY(-2px)`
- Metadatos: `.news-meta` con fecha, puntuación (color `#f59e0b`) y comentarios (color `#6b7280`)
- Título: `.news-title` `font-size: 1.1rem`, `font-weight: 700`, `color: #1a1a2e`
- Extracto: `.news-excerpt` `font-size: 0.875rem`, `color: #6b7280`
- Imagen opcional: `.news-card-img` `width: 90px`, `height: 70px`, `border-radius: 8px`
- Chevron: `.news-card-chevron` `color: #d1d5db`, en hover cambia a `#3b82f6` y se desplaza +3px
- Loading/empty: `text-align: center`, `padding: 3rem`, icono grande (`font-size: 3rem`)

### 4.2 Detalle de noticia (`/mi/noticias/:id`)

**Página**: `/page/noticia/usuario/view/`
**Componente**: `app-noticia-usuario-detail` (`/component/noticia/usuario/detail/`)

#### HTML del page wrapper

```html
<div class="page-container">
  <app-noticia-usuario-detail [id_noticia]="id_noticia()"></app-noticia-usuario-detail>
</div>
```

#### CSS del page wrapper

Mismo `.page-container` que plist.

#### Componente detail (`.nd-*`)

**Estructura**: `<article class="nd-article">` con `max-width: 780px`, `margin: 0 auto`, `padding: 1.5rem`.

Secciones:
1. **Imagen hero** (`.nd-hero-img`): `border-radius: 14px`, `max-height: 340px`
2. **Header** (`.nd-header`): título `font-size: 1.75rem`, `font-weight: 800`, metadatos flex con gap
3. **Cuerpo** (`.nd-body`): `white-space: pre-wrap`, `line-height: 1.75`
4. **Sección de puntuación** (`.nd-rating-section`):
   - Fondo `#f9fafb`, borde `#e5e7eb`, `border-radius: 12px`, padding `1.25rem 1.5rem`
   - Estrellas en fila: botones `font-size: 2rem`, color `#d1d5db`, active/hover `#f59e0b`
5. **Sección de comentarios** (`.nd-comments`):
   - Formulario con textarea (`resize: vertical`) y botón Publicar
   - Lista de comentarios: cada uno con avatar (`bi-person-circle`, `font-size: 1.75rem`)
   - Comentario propio (`.nd-comment--mine`): `border-color: #bfdbfe`, `background: #eff6ff`
   - Badge "Tú" (`.nd-mine-badge`): `background: #3b82f6`, `border-radius: 20px`
   - Botón eliminar comentario: `btn-outline-danger btn-xs`
6. **Volver**: botón `btn-outline-secondary` con `bi-arrow-left`

---

## 5. Equipos del usuario

### 5.1 Listado (`/mi/equipos`)

**Página**: `/page/equipo/usuario/plist/`
**Componente**: `app-equipo-usuario-plist` (`/component/equipo/usuario/plist/`)

#### Page wrapper

```html
<div class="page-container">
  <div class="page-header">
    <h2><i class="bi bi-trophy me-2"></i>Mis Equipos</h2>
    <p class="text-muted small">Tus inscripciones organizadas por temporada y categoría</p>
  </div>
  <app-equipo-usuario-plist></app-equipo-usuario-plist>
</div>
```

#### Componente plist (`.eq-*`)

Agrupación jerárquica: **Temporada → Categoría → Equipos**

- `.eq-season`: `background: #fff`, `border-radius: 14px`, `border: 1px solid #e5e7eb`, overflow hidden
- `.eq-season-header`: gradiente `linear-gradient(90deg, #1a3a5c, #2e6da4)`, texto blanco, padding `0.85rem 1.25rem`
- `.eq-category`: padding `0.75rem 1.25rem`, label en mayúsculas pequeñas (`font-size: 0.8rem`, `color: #9ca3af`)
- `.eq-team-card`: flex row, `background: #f9fafb`, `border-radius: 10px`, `border: 1px solid #e5e7eb`
  - Icono: `font-size: 2rem`, `color: #2e6da4`
  - Nombre: `font-weight: 700`, `color: #1a1a2e`
  - Acciones: dos botones `btn-outline-primary` (Equipo) y `btn-outline-success` (Jugadores)

### 5.2 Detalle de equipo (`/mi/equipos/:id`)

**Página**: `/page/equipo/usuario/view/`
**Componente**: `app-equipo-usuario-detail` (`/component/equipo/usuario/detail/`)

#### Page wrapper

```html
<div class="page-container">
  <app-equipo-usuario-detail [id_equipo]="id_equipo()"></app-equipo-usuario-detail>
</div>
```

#### Componente detail (`.ed-*`)

- `.ed-wrapper`: `max-width: 780px`, `margin: 0 auto`
- Header del equipo (`.ed-equipo-header`):
  - Gradiente `linear-gradient(135deg, #1a3a5c, #2e6da4)`
  - `border-radius: 14px`, padding `1.5rem 1.75rem`, texto blanco
  - Icono `font-size: 3rem`, nombre `font-size: 1.5rem` `font-weight: 800`
  - Breadcrumb de temporada/categoría
  - Entrenador con icono `bi-person-badge`
- Ligas y partidos:
  - `.ed-liga`: card blanca con borde `#e5e7eb`, `border-radius: 12px`
  - Header de liga: `background: #f8f9fa`, `font-weight: 700`, `color: #1a3a5c`
  - Tabla de partidos (`.ed-table`): `font-size: 0.875rem`
  - Resultados con badges de color:
    - `.res-win`: `background: #d1fae5`, `color: #065f46`
    - `.res-loss`: `background: #fee2e2`, `color: #991b1b`
    - `.res-draw`: `background: #fef3c7`, `color: #92400e`
- Botón Volver con borde superior (`border-top: 1px solid #e5e7eb`)

### 5.3 Jugadores del equipo (`/mi/equipos/:id/jugadores`)

**Página**: `/page/jugador/usuario/equipo-plist/`
**Componente**: `app-jugador-usuario-equipo-plist` (`/component/jugador/usuario/equipo-plist/`)

#### Componente (`.jp-*`)

- `.jp-wrapper`: `max-width: 720px`, `margin: 0 auto`
- Header: mismo gradiente y estilo que equipo detail
- Tabla de jugadores:
  - `.jp-table-card`: `background: #fff`, `border-radius: 12px`, overflow hidden
  - Thead: `background: #f8f9fa`, texto uppercase `font-size: 0.8rem`
  - Dorsal: `font-weight: 800`, `font-size: 1.05rem`, `color: #2e6da4`, centrado
  - Posición: badge con `background: #eff6ff`, `color: #1d4ed8`, `border: 1px solid #bfdbfe`
  - Capitán: estrella `color: #f59e0b`

---

## 6. Cuotas y Pagos (`/mi/cuotas`)

**Página**: `/page/cuota/usuario/plist/`
**Componente**: `app-cuota-usuario-plist` (`/component/cuota/usuario/plist/`)

### Page wrapper

```html
<div class="page-container">
  <div class="page-header">
    <h2><i class="bi bi-cash-coin me-2"></i>Mis Cuotas y Pagos</h2>
    <p class="text-muted small">Estado de cuotas por equipo y temporada</p>
  </div>
  <app-cuota-usuario-plist></app-cuota-usuario-plist>
</div>
```

### Componente (`.cu-*`)

Agrupación por equipos:
- `.cu-equipo`: card blanca `border-radius: 12px`, `border: 1px solid #e5e7eb`
- `.cu-equipo-header`: `background: #f8f9fa`, flex space-between
  - Badge de pendiente: `background: #fee2e2`, `color: #991b1b`, `border-radius: 20px`
  - Badge "Al día": `color: #065f46`, check verde
- `.cu-cuota-row`:
  - `--paid`: `border-left-color: #22c55e`, `background: #f0fdf4`
  - `--pending`: `border-left-color: #f59e0b`, `background: #fffbeb`
  - Descripción, fecha, cantidad (bold), estado
  - Botón "Pagar" (`.cu-pay-btn`): `background: #1a3a5c`, `color: #fff`, `border-radius: 6px`

---

## 7. Facturas (`/mi/facturas`)

**Página**: `/page/factura/usuario/plist/`
**Componente**: `app-factura-usuario-plist` (`/component/factura/usuario/plist/`)

### Page wrapper

```html
<div class="container-xl py-4">
  <h2 class="mb-4"><i class="bi bi-receipt me-2 text-primary"></i>Mis Facturas</h2>
  <app-factura-usuario-plist />
</div>
```

### Componente (`.fv-*`)

- `.fv-list`: `display: flex`, `flex-direction: column`, `gap: 0.75rem`, `padding: 1rem`
- `.fv-card`: `border: 1px solid #e2e8f0`, `border-radius: 12px`, `background: #fff`
  - Expandida (`.fv-card--expanded`): `border-color: #3b82f6`
  - Header clickeable (`.fv-card-header`): `background: #f8fafc`, flex space-between
  - Expandido: `background: #eff6ff`
- `.fv-number`: `font-weight: 700`, `color: #3b82f6`
- `.fv-total`: `font-weight: 700`, `color: #059669`
- Tabla de artículos (`.fv-table`): al expandir, con cabecera, cuerpo y pie
- Total en tfoot: `color: #059669`
- Estado vacío: icono grande `bi-receipt-cutoff`, texto centrado

---

## 8. Tienda Virtual (`/mi/tienda`)

**Página**: `/page/carrito/usuario/tienda/` (renderiza `<app-carrito-usuario-tienda />`)
**Componente**: `app-carrito-usuario-tienda` (`/component/carrito/usuario/tienda/`)

### Layout general (`.td-layout`)

Grid de 2 columnas: `1fr 340px` (tienda | carrito). En móvil (<900px) pasa a 1 columna.

### Sección Tienda (`.td-shop`)

- Artículos agrupados por categoría (`.td-category`)
- `.td-category-header`: `background: #f1f5f9`, `border-radius: 8px`, flex space-between
  - Badge con cuenta: `background: #3b82f6`, `color: #fff`, `border-radius: 999px`
- Grid de artículos: `repeat(auto-fill, minmax(200px, 1fr))`, gap `1rem`
- `.td-article-card`:
  - `background: #fff`, `border: 1px solid #e2e8f0`, `border-radius: 12px`
  - Hover: `box-shadow: 0 6px 24px rgba(0,0,0,0.1)`, `translateY(-2px)`
  - Expandido (`.td-article-card--expanded`): `border-color: #93c5fd`
  - Imagen: `height: 130px`, placeholder con `bi-box` y color `#cbd5e1`
  - Precio original tachado, final verde (`#059669`), badge descuento amarillo
  - Controles de cantidad: botón `−` / `+` e input numérico
  - Botón "Añadir" al carrito: `btn-primary btn-sm`
  - Footer: toggle para expandir comentarios/valoración

### Panel expandible de comentarios y valoración

- Estrellas: iconos `bi-star-fill` (activo color `#f59e0b`) / `bi-star` (inactivo color `#cbd5e1`)
- Sección de comentarios: lista scrolleable (`max-height: 220px`)
  - Comentario propio (`.td-comment--mine`): fondo azul claro (`#eff6ff`), borde `#bfdbfe`
  - Badge "Tú" (`.td-comment-mine-badge`)
  - Acciones: editar (bi-pencil) y eliminar (bi-trash3)
  - Formulario nuevo comentario con textarea y botón Publicar

### Sección Carrito (`.td-cart`)

- Sticky (`position: sticky`, `top: 1.5rem`)
- `background: #fff`, `border: 1px solid #e2e8f0`, `border-radius: 16px`
- Badge azul con count de items
- Items scrolleables (`max-height: 340px`)
- Controles: `−` / `+` / eliminar (icono rojo `bi-trash3`)
- Total con borde superior, color `#059669`
- Botón "Comprar ahora" verde success con spinner

---

## 9. CRUD Teamadmin

### 9.1 Listado (plist)

**Página**: `/page/usuario/teamadmin/plist/`
**Componente**: `app-usuario-teamadmin-plist` (`/component/usuario/teamadmin/plist/`)

#### Page wrapper

```html
<div class="container-fluid">
  <app-breadcrumb [items]="breadcrumbItems()"></app-breadcrumb>
  <div class="d-flex justify-content-center my-3">
    <h1 class="mb-0"><i class="bi bi-people me-2"></i>Mis usuarios</h1>
  </div>
  <app-usuario-teamadmin-plist [id_club]="id_club()"></app-usuario-teamadmin-plist>
</div>
```

#### Componente plist

**Características**:
- Barra de búsqueda por nombre (`form-control me-2` con `type="search"`)
- Total de registros mostrado
- Botón "Crear usuario" (`btn-primary`) con icono `bi-plus-circle`
- Paginación: componente `app-paginacion`
- Tabla `table table-striped table-bordered table-sm` con:
  - Columnas: ID, Nombre, Apellido 1, Username, Tipo, Rol, Facturas, Jugadores, Comentarios, Puntuaciones, Com. artículos, Carrito, Equipos, Acciones
  - Columnas responsive: `d-none d-md-table-cell`, `d-none d-lg-table-cell`
  - Headers con icono + indicador de ordenación (`bi-caret-up-fill` / `bi-caret-down-fill`)
  - Celdas con enlaces a listados relacionados (si count > 0) o icono `bi-ban` (si count = 0)
  - Acciones: componente `app-botonera-actions-plist`
- Modo diálogo: las celdas numéricas muestran el valor sin enlace
- Mensaje "No se encontraron registros" en tabla vacía

### 9.2 Vista detalle (view)

**Página**: `UsuarioTeamadminViewPage` (inline template)
**Componente**: `app-usuario-teamadmin-detail` (`/component/usuario/teamadmin/detail/`)

#### Patrón detail (`.card`)

Mismo patrón que el perfil de usuario con:
- Card principal `border-0 shadow-sm` con header `bg-primary text-white`
- Datos personales en filas `row g-1` (12 campos: ID, nombre, apellidos, username, fecha alta, género)
- Cards anidadas expandibles (`.card border-start border-3 border-info`) para:
  - Tipo de usuario (collapsible con `showTipousuario`)
  - Rol de usuario (collapsible con `showRolusuario`)
  - Club (collapsible con `showClub`)
- Cada card anidada tiene header clickeable con badge enlazable y chevron expandible
- Sección de métricas al final: grid `row g-2` con tarjetas numéricas (`border rounded p-2 text-center bg-light`) para:
  - Comentarios, Puntuaciones, Com. artículos, Carritos, Facturas, Equipos entren., Jugadores
  - Cada una con enlace al listado correspondiente si count > 0

### 9.3 Formulario (new/edit)

**Páginas**: `UsuarioTeamadminNewPage` / `UsuarioTeamadminEditPage`
**Componente**: `app-usuario-admin-form` (`/component/usuario/teamadmin/form/`)

#### Page wrapper (new)

```html
<div class="container-fluid my-4 edit-form">
  <app-breadcrumb [items]="breadcrumbItems()"></app-breadcrumb>
  <div class="row justify-content-center">
    <div class="col-12 col-lg-8">
      <div class="form-card">
        <header class="mb-4"><h1 class="h3 mb-0">Nuevo usuario</h1></header>
        <app-usuario-admin-form ...></app-usuario-admin-form>
      </div>
    </div>
  </div>
</div>
```

#### Page wrapper (edit)

Idéntico pero título "Editar usuario" y pasa `[usuario]="usuario()" [isEditMode]="true"`.

#### Componente form

**Estructura del formulario** (`.form-card`):
- Formulario reactivo con `formGroup` y `novalidate`
- Campos:
  - ID (readonly)
  - Nombre (requerido, minlength 3) con validación `is-invalid`
  - Apellido 1
  - Apellido 2
  - Username (requerido, minlength 3)
  - Contraseña (solo en nuevo, requerido, minlength 6)
  - Tipo de Usuario: buscador modal + campo readonly (solo visible si NO es club admin)
  - Rol de Usuario: buscador modal + campo readonly (visible siempre)
  - Club: buscador modal + campo readonly (solo visible si NO es club admin)
- Los selectores de entidad foránea usan:
  - `background-color: #f8f9fa`, `border-left: 4px solid #0d6efd`, `border-radius` y padding
  - Botón "Buscar" (`btn-info`) con `bi-search`
  - Campos readonly con ID y descripción
  - Errores de validación con `text-danger small`
- Botones: Cancelar (`btn-outline-secondary`) y Guardar/Crear (`btn-primary`)
- Spinner en botón submit durante envío

### 9.4 Eliminación (delete)

**Página**: `UsuarioTeamadminDeletePage`
**Componente**: `app-usuario-teamadmin-detail` reutilizado

```html
<div class="container-fluid">
  <app-breadcrumb [items]="breadcrumbItems()"></app-breadcrumb>
  <div class="alert alert-danger d-flex align-items-center gap-2 mb-3">
    <i class="bi bi-exclamation-triangle-fill"></i>
    <strong>¿Eliminar este usuario?</strong> Esta acción no se puede deshacer.
  </div>
  <app-usuario-teamadmin-detail [id]="id_usuario"></app-usuario-teamadmin-detail>
  <div class="d-flex gap-2 mt-3">
    <button class="btn btn-danger" (click)="doDelete()">
      <i class="bi bi-trash me-2"></i>Eliminar
    </button>
    <button class="btn btn-secondary" (click)="doCancel()">
      <i class="bi bi-x-lg me-2"></i>Cancelar
    </button>
  </div>
</div>
```

---

## 10. Patrones comunes de diseño

### 10.1 Estados de carga y error

Todas las vistas siguen el mismo patrón de estados:

```html
@if (loading()) {
  <div class="text-center py-4">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
    <p class="text-muted small mt-2 mb-0">Cargando...</p>
  </div>
}
@if (error()) {
  <div class="alert alert-danger d-flex align-items-center gap-2">
    <i class="bi bi-exclamation-triangle-fill"></i> {{ error() }}
  </div>
}
@if (!loading() && !error() && data()) {
  <!-- Contenido -->
}
```

### 10.2 Estado vacío

Para listados sin datos:

```html
<div class="empty-state-class">
  <i class="bi bi-icon-large"></i>
  <p>Mensaje descriptivo</p>
</div>
```

Con CSS: `text-align: center`, `padding: 3rem`, `color: #6b7280`, icono `font-size: 3rem` con `opacity: 0.35`.

### 10.3 Breadcrumbs

Se usa el componente `app-breadcrumb` compartido que recibe `[items]` como array de objetos `{ label: string, route?: string }`.

### 10.4 Sistema de iconos

Se usa **Bootstrap Icons** (`bi-*`). Iconos más utilizados:
- `bi-person-circle`, `bi-person-fill`, `bi-person-badge-fill` → usuarios
- `bi-newspaper` → noticias
- `bi-trophy`, `bi-shield-fill` → equipos
- `bi-cash-coin` → cuotas
- `bi-receipt` → facturas
- `bi-bag-heart`, `bi-cart3`, `bi-cart-plus` → tienda
- `bi-star-fill`, `bi-star` → valoraciones
- `bi-chat-dots`, `bi-chat-left-text`, `bi-chat-square-dots` → comentarios
- `bi-chevron-right`, `bi-chevron-down`, `bi-chevron-up` → navegación y expandibles
- `bi-arrow-left`, `bi-arrow-right-circle` → navegación
- `bi-trash`, `bi-trash3` → eliminación
- `bi-pencil` → edición
- `bi-search` → búsqueda
- `bi-plus-circle` → creación
- `bi-exclamation-triangle-fill` → errores
- `bi-check2`, `bi-check-circle` → confirmación/éxito
- `bi-ban` → sin datos
- `bi-box` → artículo sin imagen

### 10.5 Formato de moneda y fechas

- Moneda: pipe `currency:'EUR':'symbol':'1.2-2'`
- Fechas: pipe `date:'dd/MM/yyyy HH:mm'` en facturas; pipe `datetime` personalizado en el resto
- Género: `genero === 0 ? 'Hombre' : 'Mujer'`

### 10.6 Paleta de colores

| Uso | Color | Hex |
|-----|-------|-----|
| Header/app brand | Fondo oscuro | `#1a1a1a` |
| Hero dashboard | Gradiente azul | `#1a3a5c → #2e6da4 → #4a9fd4` |
| Headers de sección | Gradiente azul oscuro | `#1a3a5c → #2e6da4` |
| Títulos principales | Azul muy oscuro | `#1a1a2e` |
| Texto secundario | Gris medio | `#6b7280`, `#64748b` |
| Bordes de cards | Gris claro | `#e5e7eb`, `#e2e8f0` |
| Fondos de card | Blanco | `#fff` |
| Fondo de página | Gris muy claro | `#f0f4f8` (dashboard), `#f9fafb` |
| Acento primario | Azul | `#3b82f6`, `#0d6efd` |
| Éxito/Verde | Verde | `#22c55e`, `#059669` |
| Error/Rojo | Rojo | `#ef4444`, `#dc3545` |
| Advertencia | Amarillo | `#f59e0b`, `#d97706` |
| Información | Azul info | `#2e6da4` |

### 10.7 Responsive

- Las páginas de listado tipo tabla usan clases `d-none d-md-table-cell` y `d-none d-lg-table-cell` para ocultar columnas en pantallas pequeñas
- Las páginas de contenido (noticias, equipos, cuotas) usan `max-width: 780px-860px` y `margin: 0 auto` para centrar el contenido
- El layout tienda/carrito pasa a 1 columna en viewports < 900px
- Los formularios usan `col-12 col-lg-8` para centrar en desktop
- Las métricas del detail usan `col-6 col-md-4 col-lg-3` para grid responsive

---

## 11. Convenciones de nomenclatura

- **Selectores de página**: `app-{entidad}-{rol}-{tipo}-page` (ej: `app-noticia-usuario-plist-page`)
- **Selectores de componente**: `app-{entidad}-{rol}-{tipo}` (ej: `app-noticia-usuario-plist`)
- **Archivos de página**: en `/page/{entidad}/{rol}/{tipo}/{tipo}.html|ts|css`
- **Archivos de componente**: en `/component/{entidad}/{rol}/{tipo}/{tipo}.html|ts|css`
- **Prefijo CSS**: 2-3 letras que identifican el componente (ej: `ud-` user-dashboard, `nd-` noticia-detail, `eq-` equipo, `jp-` jugador-plist, `cu-` cuota, `fv-` factura, `td-` tienda)

---

---
