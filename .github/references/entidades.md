# Entidades y Expansiones — Gesportin

## Principios de serialización JSON

| Anotación JPA | Comportamiento en JSON |
|---|---|
| `@ManyToOne(fetch = EAGER)` | Se serializa como **objeto anidado completo** |
| `@OneToMany(fetch = LAZY)` con getter `getXxx()` | Se serializa como **entero contador** |
| `@Lob byte[]` | Se serializa como Base64 o null |

> Los contadores dentro de objetos anidados pueden valer **0** porque las colecciones lazy no se inicializan al cargar el objeto como parte de una relación EAGER.

---

## Jerarquía de expansiones

```
tipousuario          (raíz — sin ManyToOne)
rolusuario           (raíz — sin ManyToOne)
club                 (raíz — sin ManyToOne)
 └─ temporada
     └─ categoria
         └─ equipo  ──→ entrenador (usuario ──→ tipousuario, rolusuario, club)
             ├─ jugador  ──→ usuario
             ├─ cuota
             │   └─ pago  ──→ jugador
             └─ liga
                 └─ partido
tipoarticulo  ──→ club
 └─ articulo
     ├─ carrito      ──→ usuario
     ├─ comentarioart ──→ usuario
     └─ compra       ──→ factura ──→ usuario
noticia       ──→ club
 ├─ comentario  ──→ usuario
 └─ puntuacion  ──→ usuario
```

---

## Entidades raíz (sin @ManyToOne)

---

### `tipousuario`

Sin FK. Datos fijos del sistema.

| Campo | Tipo Java | Tipo JSON | Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `descripcion` | String | string | |
| `usuarios` | int (contador) | number | |

**Valores fijos:**
| id | descripcion |
|---|---|
| 1 | Administrador |
| 2 | Administrador de club |
| 3 | Usuario |

```json
{ "id": 1, "descripcion": "Administrador", "usuarios": 5 }
```

---

### `rolusuario`

Sin FK.

| Campo | Tipo Java | Tipo JSON | Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `descripcion` | String | string | |
| `usuarios` | int (contador) | number | |

```json
{ "id": 1, "descripcion": "Socio", "usuarios": 3 }
```

---

### `club`

Sin FK. Entidad raíz del sistema multitenancy.

| Campo | Tipo Java | Tipo JSON | Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `nombre` | String | string | |
| `direccion` | String | string | Columna BD: `dirección` |
| `telefono` | String | string | Columna BD: `teléfono` |
| `fechaAlta` | LocalDateTime | string | `yyyy-MM-dd'T'HH:mm:ss` |
| `imagen` | byte[] | string/null | Base64 blob |
| `temporadas` | int (contador) | number | |
| `noticias` | int (contador) | number | |
| `tipoarticulos` | int (contador) | number | |
| `usuarios` | int (contador) | number | |

```json
{
  "id": 1,
  "nombre": "Club Deportivo ...",
  "direccion": "Calle ..., 1",
  "telefono": "600000000",
  "fechaAlta": "2024-09-01T00:00:00",
  "imagen": null,
  "temporadas": 2,
  "noticias": 10,
  "tipoarticulos": 3,
  "usuarios": 25
}
```

---

## Entidades con expansión de nivel 1

---

### `usuario`

Expande: `tipousuario`, `rolusuario`, `club`

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `nombre` | String | string | |
| `apellido1` | String | string | |
| `apellido2` | String | string | |
| `username` | String | string | Único |
| `password` | String | string | Hash bcrypt |
| `fechaAlta` | LocalDateTime | string | `yyyy-MM-dd'T'HH:mm:ss` |
| `genero` | Integer | number | 0=Hombre, 1=Mujer |
| `tipousuario` | TipousuarioEntity | object | **EXPANDIDO** |
| `rolusuario` | RolusuarioEntity | object | **EXPANDIDO** |
| `club` | ClubEntity | object | **EXPANDIDO** |
| `comentarios` | int (contador) | number | |
| `puntuaciones` | int (contador) | number | |
| `comentarioarts` | int (contador) | number | |
| `carritos` | int (contador) | number | |
| `facturas` | int (contador) | number | |
| `equiposentrenados` | int (contador) | number | |
| `jugadores` | int (contador) | number | |

```json
{
  "id": 5,
  "nombre": "Juan",
  "apellido1": "García",
  "apellido2": "López",
  "username": "jgarcia",
  "password": "$2a$10$...",
  "fechaAlta": "2024-09-01T00:00:00",
  "genero": 0,
  "tipousuario": { "id": 3, "descripcion": "Usuario", "usuarios": 0 },
  "rolusuario": { "id": 1, "descripcion": "Socio", "usuarios": 0 },
  "club": {
    "id": 1, "nombre": "...", "direccion": "...", "telefono": "...",
    "fechaAlta": "...", "imagen": null,
    "temporadas": 0, "noticias": 0, "tipoarticulos": 0, "usuarios": 0
  },
  "comentarios": 2,
  "puntuaciones": 1,
  "comentarioarts": 0,
  "carritos": 3,
  "facturas": 1,
  "equiposentrenados": 0,
  "jugadores": 0
}
```

---

### `temporada`

Expande: `club`

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `descripcion` | String | string | Ej: "2025-2026" |
| `club` | ClubEntity | object | **EXPANDIDO** |
| `categorias` | int (contador) | number | |

```json
{
  "id": 1,
  "descripcion": "2025-2026",
  "club": { "id": 1, "nombre": "...", ... },
  "categorias": 3
}
```

---

### `noticia`

Expande: `club`

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `titulo` | String | string | 3–1024 chars |
| `contenido` | String | string | |
| `fecha` | LocalDateTime | string | `yyyy-MM-dd'T'HH:mm:ss` |
| `imagen` | byte[] | string/null | Base64 blob |
| `club` | ClubEntity | object | **EXPANDIDO** |
| `comentarios` | int (contador) | number | |
| `puntuaciones` | int (contador) | number | |

```json
{
  "id": 1,
  "titulo": "...",
  "contenido": "...",
  "fecha": "2025-10-01T12:00:00",
  "imagen": null,
  "club": { "id": 1, "nombre": "...", ... },
  "comentarios": 4,
  "puntuaciones": 7
}
```

---

### `tipoarticulo`

Expande: `club`

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `descripcion` | String | string | |
| `club` | ClubEntity | object | **EXPANDIDO** |
| `articulos` | int (contador) | number | |

```json
{
  "id": 1,
  "descripcion": "Camisetas",
  "club": { "id": 1, "nombre": "...", ... },
  "articulos": 12
}
```

---

### `factura`

Expande: `usuario` (→ `tipousuario`, `rolusuario`, `club`)

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `fecha` | LocalDateTime | string | `yyyy-MM-dd'T'HH:mm:ss` |
| `usuario` | UsuarioEntity | object | **EXPANDIDO** (profundidad 2) |
| `compras` | int (contador) | number | |

```json
{
  "id": 1,
  "fecha": "2025-11-15T14:20:00",
  "usuario": { "id": 5, "nombre": "...", "tipousuario": {...}, "rolusuario": {...}, "club": {...}, ... },
  "compras": 3
}
```

---

## Entidades con expansión de nivel 2

---

### `categoria`

Expande: `temporada` (→ `club`)

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `nombre` | String | string | 4–255 chars |
| `temporada` | TemporadaEntity | object | **EXPANDIDO** (profundidad 2) |
| `equipos` | int (contador) | number | |

```json
{
  "id": 1,
  "nombre": "Benjamín",
  "temporada": {
    "id": 1,
    "descripcion": "2025-2026",
    "club": { "id": 1, "nombre": "...", ... },
    "categorias": 0
  },
  "equipos": 2
}
```

---

### `articulo`

Expande: `tipoarticulo` (→ `club`)

> El club del artículo se accede como `articulo.tipoarticulo.club`. No hay campo `club` directamente en `articulo`.

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `descripcion` | String | string | |
| `precio` | BigDecimal | number | |
| `descuento` | BigDecimal | number/null | Porcentaje |
| `imagen` | byte[] | string/null | Base64 blob |
| `tipoarticulo` | TipoarticuloEntity | object | **EXPANDIDO** (profundidad 2) |
| `comentarioarts` | int (contador) | number | |
| `puntuacionarts` | int (contador) | number | Número de puntuaciones |
| `mediaPuntuacion` | double | number | Promedio de puntuaciones (1-5), 0 si no hay |
| `compras` | int (contador) | number | |
| `carritos` | int (contador) | number | |

```json
{
  "id": 1,
  "descripcion": "Camiseta oficial",
  "precio": 29.99,
  "descuento": 10.00,
  "imagen": null,
  "tipoarticulo": {
    "id": 1,
    "descripcion": "Camisetas",
    "club": { "id": 1, "nombre": "...", ... },
    "articulos": 0
  },
  "comentarioarts": 3,
  "puntuacionarts": 12,
  "mediaPuntuacion": 4.5,
  "compras": 5,
  "carritos": 2
}
```

---

### `comentario`

Expande: `noticia` (→ `club`), `usuario` (→ `tipousuario`, `rolusuario`, `club`)

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `contenido` | String | string | 3–1024 chars |
| `noticia` | NoticiaEntity | object | **EXPANDIDO** (profundidad 2) |
| `usuario` | UsuarioEntity | object | **EXPANDIDO** (profundidad 2) |

```json
{
  "id": 1,
  "contenido": "...",
  "noticia": {
    "id": 1, "titulo": "...", "contenido": "...", "fecha": "...",
    "club": { "id": 1, ... }, "comentarios": 0, "puntuaciones": 0
  },
  "usuario": {
    "id": 5, "nombre": "...",
    "tipousuario": { "id": 3, ... }, "rolusuario": { ... }, "club": { ... },
    ...
  }
}
```

---

### `puntuacion`

Expande: `noticia` (→ `club`), `usuario` (→ `tipousuario`, `rolusuario`, `club`)

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `puntuacion` | Integer | number | Mín 1, Máx 5 |
| `noticia` | NoticiaEntity | object | **EXPANDIDO** (profundidad 2) |
| `usuario` | UsuarioEntity | object | **EXPANDIDO** (profundidad 2) |

```json
{
  "id": 1,
  "puntuacion": 4,
  "noticia": { "id": 1, "club": { ... }, ... },
  "usuario": { "id": 5, "tipousuario": {...}, "club": { ... }, ... }
}
```

---

### `comentarioart`

Expande: `articulo` (→ `tipoarticulo` → `club`), `usuario` (→ `tipousuario`, `rolusuario`, `club`)

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `contenido` | String | string | 3–1024 chars |
| `articulo` | ArticuloEntity | object | **EXPANDIDO** (profundidad 3) |
| `usuario` | UsuarioEntity | object | **EXPANDIDO** (profundidad 2) |

```json
{
  "id": 1,
  "contenido": "...",
  "articulo": {
    "id": 1,
    "tipoarticulo": {
      "id": 1, "descripcion": "...",
      "club": { "id": 1, ... }
    }
  },
  "usuario": { "id": 5, "tipousuario": {...}, "club": {...}, ... }
}
```

---

### `puntuacionart`

Expande: `articulo` (→ `tipoarticulo` → `club`), `usuario` (→ `tipousuario`, `rolusuario`, `club`)

Calificaciones/puntuaciones de artículos por parte de usuarios. Los usuarios pueden valorar artículos con puntuaciones de 1 a 5.

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `puntuacion` | Integer | number | 1–5 estrellas |
| `articulo` | ArticuloEntity | object | **EXPANDIDO** (profundidad 3) |
| `usuario` | UsuarioEntity | object | **EXPANDIDO** (profundidad 2) |

```json
{
  "id": 1,
  "puntuacion": 5,
  "articulo": {
    "id": 1, "descripcion": "...",
    "tipoarticulo": {
      "id": 1, "descripcion": "...",
      "club": { "id": 1, ... }
    }
  },
  "usuario": { "id": 5, "nombre": "...", "tipousuario": {...}, "club": {...}, ... }
}
```

---

### `carrito`

Expande: `articulo` (→ `tipoarticulo` → `club`), `usuario` (→ `tipousuario`, `rolusuario`, `club`)

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `cantidad` | Integer | number | Unidades |
| `articulo` | ArticuloEntity | object | **EXPANDIDO** (profundidad 3) |
| `usuario` | UsuarioEntity | object | **EXPANDIDO** (profundidad 2) |

```json
{
  "id": 1,
  "cantidad": 2,
  "articulo": {
    "id": 1, "descripcion": "...", "precio": 29.99,
    "tipoarticulo": { "id": 1, "club": { "id": 1, ... } }
  },
  "usuario": { "id": 5, "tipousuario": {...}, "club": {...}, ... }
}
```

---

### `compra`

Expande: `articulo` (→ `tipoarticulo` → `club`), `factura` (→ `usuario` → `tipousuario`, `rolusuario`, `club`)

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `cantidad` | Integer | number | Unidades compradas |
| `precio` | Double | number | Precio unitario en momento de compra |
| `articulo` | ArticuloEntity | object | **EXPANDIDO** (profundidad 3) |
| `factura` | FacturaEntity | object | **EXPANDIDO** (profundidad 3) |

```json
{
  "id": 1,
  "cantidad": 2,
  "precio": 29.99,
  "articulo": {
    "id": 1, "descripcion": "...",
    "tipoarticulo": { "id": 1, "club": { "id": 1, ... } }
  },
  "factura": {
    "id": 1, "fecha": "...",
    "usuario": { "id": 5, "tipousuario": {...}, "club": {...}, ... }
  }
}
```

---

## Entidades con expansión de nivel 3+

---

### `equipo`

Expande: `categoria` (→ `temporada` → `club`), `entrenador` (→ `tipousuario`, `rolusuario`, `club`)

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `nombre` | String | string | 3–1024 chars |
| `categoria` | CategoriaEntity | object | **EXPANDIDO** (profundidad 3) |
| `entrenador` | UsuarioEntity | object | **EXPANDIDO** (profundidad 2) |
| `jugadores` | int (contador) | number | |
| `cuotas` | int (contador) | number | |
| `ligas` | int (contador) | number | |

```json
{
  "id": 1,
  "nombre": "Equipo A",
  "categoria": {
    "id": 1,
    "nombre": "Benjamín",
    "temporada": {
      "id": 1,
      "descripcion": "2025-2026",
      "club": { "id": 1, "nombre": "...", ... },
      "categorias": 0
    },
    "equipos": 0
  },
  "entrenador": {
    "id": 2, "nombre": "...",
    "tipousuario": { "id": 2, "descripcion": "Administrador de club", "usuarios": 0 },
    "rolusuario": { ... },
    "club": { "id": 1, ... },
    ...
  },
  "jugadores": 11,
  "cuotas": 3,
  "ligas": 1
}
```

---

### `jugador`

Expande: `usuario` (→ `tipousuario`, `rolusuario`, `club`), `equipo` (→ `categoria` → `temporada` → `club`, y → `entrenador`)

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `dorsal` | Integer | number | |
| `posicion` | String | string | 3–255 chars |
| `capitan` | Boolean | boolean | |
| `imagen` | String | string/null | URL o ruta |
| `usuario` | UsuarioEntity | object | **EXPANDIDO** (profundidad 2) |
| `equipo` | EquipoEntity | object | **EXPANDIDO** (profundidad 4) |
| `pagos` | int (contador) | number | |

```json
{
  "id": 1,
  "dorsal": 9,
  "posicion": "Delantero",
  "capitan": false,
  "imagen": null,
  "usuario": { "id": 5, "tipousuario": {...}, "club": {...}, ... },
  "equipo": {
    "id": 1,
    "nombre": "Equipo A",
    "categoria": {
      "id": 1,
      "nombre": "Benjamín",
      "temporada": { "id": 1, "club": { "id": 1, ... }, ... }
    },
    "entrenador": { "id": 2, "tipousuario": {...}, "club": {...}, ... }
  },
  "pagos": 2
}
```

---

### `liga`

Expande: `equipo` (→ `categoria` → `temporada` → `club`, y → `entrenador`)

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `nombre` | String | string | |
| `equipo` | EquipoEntity | object | **EXPANDIDO** (profundidad 4) |
| `partidos` | int (contador) | number | |

```json
{
  "id": 1,
  "nombre": "Liga Municipal",
  "equipo": {
    "id": 1, "nombre": "Equipo A",
    "categoria": {
      "id": 1,
      "temporada": { "id": 1, "club": { "id": 1, ... } }
    },
    "entrenador": { "id": 2, ... }
  },
  "partidos": 5
}
```

---

### `cuota`

Expande: `equipo` (→ `categoria` → `temporada` → `club`, y → `entrenador`)

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `descripcion` | String | string | máx 255 chars |
| `cantidad` | BigDecimal | number | Importe en euros |
| `fecha` | LocalDateTime | string | `yyyy-MM-dd'T'HH:mm:ss` |
| `equipo` | EquipoEntity | object | **EXPANDIDO** (profundidad 4) |
| `pagos` | int (contador) | number | |

```json
{
  "id": 1,
  "descripcion": "Cuota mensual octubre",
  "cantidad": 50.00,
  "fecha": "2025-10-01T00:00:00",
  "equipo": {
    "id": 1, "nombre": "Equipo A",
    "categoria": { "temporada": { "club": { "id": 1, ... } } },
    "entrenador": { ... }
  },
  "pagos": 8
}
```

---

### `partido`

Expande: `liga` (→ `equipo` → `categoria` → `temporada` → `club`, y → `entrenador`)

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `rival` | String | string | 3–1024 chars |
| `liga` | LigaEntity | object | **EXPANDIDO** (profundidad 5) |
| `local` | Boolean | boolean | `true`=local, `false`=visitante |
| `resultado` | String | string | Ej: "3-1" |
| `fecha` | LocalDateTime | string | ISO datetime; nullable |
| `lugar` | String | string | Lugar del partido |
| `comentario` | String | string | Comentario opcional; nullable |
| `estadopartido` | EstadopartidoEntity | object | FK expandida; nullable |

```json
{
  "id": 1,
  "rival": "Club Rival FC",
  "liga": {
    "id": 1,
    "nombre": "Liga Municipal",
    "equipo": {
      "id": 1,
      "nombre": "Equipo A",
      "categoria": {
        "id": 1,
        "nombre": "Benjamín",
        "temporada": {
          "id": 1,
          "descripcion": "2025-2026",
          "club": { "id": 1, "nombre": "...", ... },
          "categorias": 0
        },
        "equipos": 0
      },
      "entrenador": { "id": 2, ... },
      "jugadores": 0, "cuotas": 0, "ligas": 0
    },
    "partidos": 0
  },
  "local": true,
  "resultado": "3-1"
}
```

---

### `pago`

Expande: `cuota` (→ `equipo` → `categoria` → `temporada` → `club`), `jugador` (→ `usuario`, → `equipo`)

La entidad más profunda del sistema — puede llegar a **6 niveles** de anidamiento.

| Campo | Tipo Java | Tipo JSON | Expansión / Notas |
|---|---|---|---|
| `id` | Long | number | PK |
| `cuota` | CuotaEntity | object | **EXPANDIDO** (profundidad 5) |
| `jugador` | JugadorEntity | object | **EXPANDIDO** (profundidad 5) |
| `abonado` | Boolean | boolean | `true`=pagado, `false`=pendiente |
| `fecha` | LocalDateTime | string | `yyyy-MM-dd'T'HH:mm:ss` |

```json
{
  "id": 1,
  "cuota": {
    "id": 1, "descripcion": "...", "cantidad": 50.00, "fecha": "...",
    "equipo": {
      "id": 1, "nombre": "...",
      "categoria": {
        "temporada": {
          "club": { "id": 1, ... }
        }
      },
      "entrenador": { ... }
    },
    "pagos": 0
  },
  "jugador": {
    "id": 1, "dorsal": 9, "posicion": "...", "capitan": false,
    "usuario": { "id": 5, "tipousuario": {...}, "club": {...}, ... },
    "equipo": {
      "id": 1,
      "categoria": { "temporada": { "club": { "id": 1, ... } } },
      "entrenador": { ... }
    },
    "pagos": 0
  },
  "abonado": true,
  "fecha": "2025-10-05T10:30:00"
}
```

---

## Resumen de profundidades de expansión

| Entidad | Profundidad máx. | Ruta más larga |
|---|---|---|
| `tipousuario` | 0 | — |
| `rolusuario` | 0 | — |
| `club` | 0 | — |
| `usuario` | 1 | `usuario.tipousuario` / `.rolusuario` / `.club` |
| `temporada` | 1 | `temporada.club` |
| `noticia` | 1 | `noticia.club` |
| `tipoarticulo` | 1 | `tipoarticulo.club` |
| `factura` | 2 | `factura.usuario.club` |
| `categoria` | 2 | `categoria.temporada.club` |
| `articulo` | 2 | `articulo.tipoarticulo.club` |
| `comentario` | 2 | `comentario.noticia.club` / `comentario.usuario.club` |
| `puntuacion` | 2 | `puntuacion.noticia.club` / `puntuacion.usuario.club` |
| `comentarioart` | 3 | `comentarioart.articulo.tipoarticulo.club` |
| `carrito` | 3 | `carrito.articulo.tipoarticulo.club` |
| `compra` | 3 | `compra.articulo.tipoarticulo.club` / `compra.factura.usuario.club` |
| `equipo` | 3 | `equipo.categoria.temporada.club` |
| `jugador` | 4 | `jugador.equipo.categoria.temporada.club` |
| `liga` | 4 | `liga.equipo.categoria.temporada.club` |
| `cuota` | 4 | `cuota.equipo.categoria.temporada.club` |
| `partido` | 5 | `partido.liga.equipo.categoria.temporada.club` |
| `pago` | 5 | `pago.cuota.equipo.categoria.temporada.club` |

---

## Cómo acceder al club desde cualquier entidad

Todas las entidades pertenecen a un club. La ruta para obtener el `id` del club varía según la entidad:

| Entidad | Ruta al club |
|---|---|
| `club` | `club.id` |
| `usuario` | `usuario.club.id` |
| `temporada` | `temporada.club.id` |
| `noticia` | `noticia.club.id` |
| `tipoarticulo` | `tipoarticulo.club.id` |
| `factura` | `factura.usuario.club.id` |
| `categoria` | `categoria.temporada.club.id` |
| `articulo` | `articulo.tipoarticulo.club.id` |
| `comentario` | `comentario.noticia.club.id` |
| `puntuacion` | `puntuacion.noticia.club.id` |
| `comentarioart` | `comentarioart.articulo.tipoarticulo.club.id` |
| `carrito` | `carrito.articulo.tipoarticulo.club.id` |
| `compra` | `compra.articulo.tipoarticulo.club.id` |
| `equipo` | `equipo.categoria.temporada.club.id` |
| `jugador` | `jugador.equipo.categoria.temporada.club.id` |
| `liga` | `liga.equipo.categoria.temporada.club.id` |
| `cuota` | `cuota.equipo.categoria.temporada.club.id` |
| `partido` | `partido.liga.equipo.categoria.temporada.club.id` |
| `pago` | `pago.cuota.equipo.categoria.temporada.club.id` |
