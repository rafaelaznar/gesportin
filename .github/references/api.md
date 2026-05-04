# API REST — Gesportin

## Convenciones globales

| Propiedad | Valor |
|---|---|
| Base URL | `http://localhost:8089` |
| CORS | Habilitado para todos los orígenes (`*`) |
| Autenticación | JWT — cabecera `Authorization: Bearer <token>` |
| Formato de fechas | `yyyy-MM-dd'T'HH:mm:ss` (ISO local date-time) |
| Parámetros de filtro | snake_case (`id_club`, `id_tipousuario`, …) |
| Relaciones `@ManyToOne` | Se devuelven como **objetos expandidos** en el JSON |
| Colecciones `@OneToMany` | Se exponen como **contadores enteros** (no arrays) |
| Paginación por defecto | `size=1000` (salvo que se indique otro valor) |

### Estructura de respuesta paginada

```json
{
  "content": [ /* elementos */ ],
  "totalElements": 0,
  "totalPages": 0,
  "size": 1000,
  "number": 0,
  "sort": { "sorted": false, "empty": true, "unsorted": true }
}
```

### Body de POST y PUT

Los cuerpos de creación y actualización envían el **objeto completo** con las relaciones como objetos anidados:

```json
{
  "id": null,
  "nombre": "...",
  "tipousuario": { "id": 3 },
  "club": { "id": 1 },
  "rolusuario": { "id": 1 }
}
```

---

## Índice

- [API REST — Gesportin](#api-rest--gesportin)
  - [Convenciones globales](#convenciones-globales)
    - [Estructura de respuesta paginada](#estructura-de-respuesta-paginada)
    - [Body de POST y PUT](#body-de-post-y-put)
  - [Índice](#índice)
  - [1. Sesión](#1-sesión)
  - [2. Tipousuario](#2-tipousuario)
  - [3. Rolusuario](#3-rolusuario)
  - [4. Club](#4-club)
  - [5. Usuario](#5-usuario)
  - [6. Temporada](#6-temporada)
  - [7. Categoria](#7-categoria)
  - [8. Equipo](#8-equipo)
  - [9. Jugador](#9-jugador)
  - [10. Liga](#10-liga)
  - [11. Partido](#11-partido)
  - [12. Cuota](#12-cuota)
  - [13. Pago](#13-pago)
  - [14. Noticia](#14-noticia)
  - [15. Comentario](#15-comentario)
  - [16. Puntuacion](#16-puntuacion)
  - [17. Tipoarticulo](#17-tipoarticulo)
  - [18. Articulo](#18-articulo)
  - [19. Comentarioart](#19-comentarioart)
  - [20. Puntuacionart](#20-puntuacionart)
  - [21. Carrito](#21-carrito)
  - [22. Factura](#22-factura)
  - [23. Compra](#23-compra)
  - [Resumen de endpoints de utilidad](#resumen-de-endpoints-de-utilidad)

---

## 1. Sesión

**Base:** `/session`

| Método | Path | Body | Respuesta | Auth |
|---|---|---|---|---|
| POST | `/session/login` | `{ "username": "", "password": "" }` | `{ "token": "" }` | No |
| GET | `/session/check` | — | `true` / `false` | Opcional |

---

## 2. Tipousuario

**Base:** `/tipousuario`  
No expone `POST`/`PUT`/`DELETE /{id}`. Solo lectura.

**Modelo JSON:**
```json
{
  "id": 1,
  "descripcion": "Administrador",
  "usuarios": 5
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `descripcion` | String | |
| `usuarios` | int | Contador |

**Endpoints:**

| Método | Path | Parámetros | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | TipousuarioEntity |
| GET | `/` | — | `List<TipousuarioEntity>` (lista completa, sin paginación) |
| GET | `/fill` | — | Long (cantidad creada) |
| DELETE | `/empty` | — | Long (cantidad eliminada) |
| GET | `/count` | — | Long |

**Datos fijos:**

| id | descripcion |
|---|---|
| 1 | Administrador |
| 2 | Administrador de club |
| 3 | Usuario |

---

## 3. Rolusuario

**Base:** `/rolusuario`

**Modelo JSON:**
```json
{
  "id": 1,
  "descripcion": "...",
  "usuarios": 3
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `descripcion` | String | |
| `usuarios` | int | Contador |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | RolusuarioEntity |
| GET | `/all` | — | `List<RolusuarioEntity>` (sin paginar) |
| GET | `/` | `descripcion` | `Page<RolusuarioEntity>` |
| POST | `/` | — (body) | RolusuarioEntity |
| PUT | `/` | — (body) | RolusuarioEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 4. Club

**Base:** `/club`

**Modelo JSON:**
```json
{
  "id": 1,
  "nombre": "...",
  "direccion": "...",
  "telefono": "...",
  "fechaAlta": "2025-09-01T00:00:00",
  "imagen": null,
  "temporadas": 2,
  "noticias": 5,
  "tipoarticulos": 3,
  "usuarios": 10
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `nombre` | String | |
| `direccion` | String | Columna BD: `dirección` |
| `telefono` | String | Columna BD: `teléfono` |
| `fechaAlta` | String | ISO datetime |
| `imagen` | byte[] | Blob; puede ser null |
| `temporadas` | int | Contador |
| `noticias` | int | Contador |
| `tipoarticulos` | int | Contador |
| `usuarios` | int | Contador |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | ClubEntity |
| GET | `/` | — | `Page<ClubEntity>` |
| POST | `/` | — (body) | ClubEntity |
| PUT | `/` | — (body) | ClubEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 5. Usuario

**Base:** `/usuario`

**Modelo JSON:**
```json
{
  "id": 1,
  "nombre": "...",
  "apellido1": "...",
  "apellido2": "...",
  "username": "...",
  "password": "...",
  "fechaAlta": "2025-09-01T00:00:00",
  "genero": 0,
  "tipousuario": { "id": 3, "descripcion": "Usuario", "usuarios": 0 },
  "rolusuario": { "id": 1, "descripcion": "...", "usuarios": 0 },
  "club": { "id": 1, "nombre": "...", ... },
  "comentarios": 2,
  "puntuaciones": 1,
  "comentarioarts": 0,
  "carritos": 3,
  "facturas": 1,
  "equiposentrenados": 0,
  "jugadores": 0
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `nombre` | String | |
| `apellido1` | String | |
| `apellido2` | String | |
| `username` | String | Único |
| `password` | String | Hash bcrypt |
| `fechaAlta` | String | ISO datetime |
| `genero` | Integer | 0=Hombre, 1=Mujer |
| `tipousuario` | Object | FK expandida |
| `rolusuario` | Object | FK expandida |
| `club` | Object | FK expandida |
| `comentarios` | int | Contador |
| `puntuaciones` | int | Contador |
| `comentarioarts` | int | Contador |
| `carritos` | int | Contador |
| `facturas` | int | Contador |
| `equiposentrenados` | int | Contador |
| `jugadores` | int | Contador |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | UsuarioEntity |
| GET | `/` | `nombre`, `username`, `id_tipousuario`, `id_club`, `id_rol` | `Page<UsuarioEntity>` (size=1000) |
| POST | `/` | — (body) | UsuarioEntity |
| PUT | `/` | — (body) | UsuarioEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 6. Temporada

**Base:** `/temporada`

**Modelo JSON:**
```json
{
  "id": 1,
  "descripcion": "2025-2026",
  "club": { "id": 1, ... },
  "categorias": 3
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `descripcion` | String | |
| `club` | Object | FK expandida |
| `categorias` | int | Contador |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | TemporadaEntity |
| GET | `/` | `descripcion`, `id_club` | `Page<TemporadaEntity>` (size=1000) |
| POST | `/` | — (body) | TemporadaEntity |
| PUT | `/` | — (body) | TemporadaEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 7. Categoria

**Base:** `/categoria`

**Modelo JSON:**
```json
{
  "id": 1,
  "nombre": "Benjamín",
  "temporada": { "id": 1, "descripcion": "...", "club": { ... }, "categorias": 0 },
  "equipos": 2
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `nombre` | String | |
| `temporada` | Object | FK expandida (incluye `club` anidado) |
| `equipos` | int | Contador |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | CategoriaEntity |
| GET | `/` | `nombre`, `id_temporada` | `Page<CategoriaEntity>` |
| POST | `/` | — (body) | CategoriaEntity |
| PUT | `/` | — (body) | CategoriaEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 8. Equipo

**Base:** `/equipo`

**Modelo JSON:**
```json
{
  "id": 1,
  "nombre": "...",
  "categoria": { "id": 1, "nombre": "...", "temporada": { ... }, "equipos": 0 },
  "entrenador": { "id": 2, "nombre": "...", ... },
  "jugadores": 11,
  "cuotas": 3,
  "ligas": 1
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `nombre` | String | |
| `categoria` | Object | FK expandida |
| `entrenador` | Object | FK → usuario (el entrenador) |
| `jugadores` | int | Contador |
| `cuotas` | int | Contador |
| `ligas` | int | Contador |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | EquipoEntity |
| GET | `/` | `descripcion`, `id_categoria`, `id_usuario` | `Page<EquipoEntity>` (size=1000) |
| POST | `/` | — (body) | EquipoEntity |
| PUT | `/` | — (body) | EquipoEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

> `id_usuario` filtra por entrenador.

---

## 9. Jugador

**Base:** `/jugador`

**Modelo JSON:**
```json
{
  "id": 1,
  "dorsal": 9,
  "posicion": "Delantero",
  "capitan": false,
  "imagen": null,
  "usuario": { "id": 5, ... },
  "equipo": { "id": 1, ... },
  "pagos": 2
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `dorsal` | Integer | |
| `posicion` | String | |
| `capitan` | Boolean | |
| `imagen` | String | Ruta/URL; puede ser null |
| `usuario` | Object | FK expandida |
| `equipo` | Object | FK expandida |
| `pagos` | int | Contador |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | JugadorEntity |
| GET | `/` | `posicion`, `id_usuario`, `id_equipo` | `Page<JugadorEntity>` (size=1000) |
| POST | `/` | — (body) | JugadorEntity |
| PUT | `/` | — (body) | JugadorEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |
| GET | `/usuariosDisponibles` | `id_equipo` (obligatorio), `nombre` (opcional) | `Page<UsuarioEntity>` |

> **`GET /jugador/usuariosDisponibles`**: devuelve los usuarios del club propietario del equipo que aún **no están asignados** como jugadores en ese equipo, paginados. Se usa en el formulario de nuevo jugador (perfil teamadmin) para filtrar la ventana modal de selección de usuario. Requiere al menos `id_equipo`. El parámetro `nombre` aplica un `LIKE` sobre el nombre del usuario.

---

## 10. Liga

**Base:** `/liga`

**Modelo JSON:**
```json
{
  "id": 1,
  "nombre": "...",
  "equipo": { "id": 1, ... },
  "partidos": 5
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `nombre` | String | |
| `equipo` | Object | FK expandida |
| `partidos` | int | Contador |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | LigaEntity |
| GET | `/` | `nombre`, `id_equipo` | `Page<LigaEntity>` (size=1000) |
| POST | `/` | — (body) | LigaEntity |
| PUT | `/` | — (body) | LigaEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 11. Estadopartido

**Base:** `/estadopartido`

No expone `POST`/`PUT`/`DELETE /{id}`. Solo lectura + fill/empty para datos del sistema.

**Modelo JSON:**
```json
{
  "id": 1,
  "descripcion": "Ganado",
  "partidos": 5
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `descripcion` | String | Estados fijos del sistema (no generar) |
| `partidos` | int | Contador |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | EstadopartidoEntity |
| GET | `/` | — | `List<EstadopartidoEntity>` (lista completa, sin paginación) |
| GET | `/fill` | — | Long (cantidad creada; fijos del sistema) |
| DELETE | `/empty` | — | Long (cantidad eliminada) |
| GET | `/count` | — | Long |

**Datos fijos:**

| id | descripcion |
|---|---|
| 1 | No jugado |
| 2 | Aplazado |
| 3 | Ganado |
| 4 | Perdido |
| 5 | Empatado |

---

## 12. Partido

**Base:** `/partido`

**Modelo JSON:**
```json
{
  "id": 1,
  "rival": "Club Rival FC",
  "liga": { "id": 1, ... },
  "local": true,
  "resultado": "3-1",
  "fecha": "2025-10-15T18:00:00",
  "lugar": "Estadio Municipal",
  "comentario": "Excelente desempeño del equipo",
  "estadopartido": { "id": 3, "descripcion": "Ganado" }
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `rival` | String | Nombre del equipo rival |
| `liga` | Object | FK expandida |
| `local` | Boolean | `true`=local, `false`=visitante |
| `resultado` | String | Ej: "3-1"; vacío si aún no jugado |
| `fecha` | String | ISO datetime; puede ser null |
| `lugar` | String | Lugar/estadio |
| `comentario` | String | Comentario opcional; editable por admin o club admin del mismo club; puede ser null |
| `estadopartido` | Object | FK expandida; puede ser null |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | PartidoEntity |
| GET | `/` | `id_liga` | `Page<PartidoEntity>` |
| POST | `/` | — (body) | PartidoEntity |
| PUT | `/` | — (body) | PartidoEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 12. Cuota

**Base:** `/cuota`

**Modelo JSON:**
```json
{
  "id": 1,
  "descripcion": "Cuota mensual",
  "cantidad": 50.00,
  "fecha": "2025-10-01T00:00:00",
  "equipo": { "id": 1, ... },
  "pagos": 8
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `descripcion` | String | |
| `cantidad` | BigDecimal | Importe en euros |
| `fecha` | String | ISO datetime — fecha de vencimiento |
| `equipo` | Object | FK expandida |
| `pagos` | int | Contador |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | CuotaEntity |
| GET | `/` | `descripcion`, `id_equipo` | `Page<CuotaEntity>` (size=1000) |
| POST | `/` | — (body) | CuotaEntity |
| PUT | `/` | — (body) | CuotaEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 13. Pago

**Base:** `/pago`

**Modelo JSON:**
```json
{
  "id": 1,
  "cuota": { "id": 1, ... },
  "jugador": { "id": 3, ... },
  "abonado": true,
  "fecha": "2025-10-05T10:30:00"
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `cuota` | Object | FK expandida |
| `jugador` | Object | FK expandida |
| `abonado` | Boolean | `true`=pagado, `false`=pendiente |
| `fecha` | String | ISO datetime |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | PagoEntity |
| GET | `/` | `id_cuota`, `id_jugador` | `Page<PagoEntity>` (size=1000) |
| POST | `/` | — (body) | PagoEntity |
| PUT | `/` | — (body) | PagoEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 14. Noticia

**Base:** `/noticia`

**Modelo JSON:**
```json
{
  "id": 1,
  "titulo": "...",
  "contenido": "...",
  "fecha": "2025-10-01T12:00:00",
  "imagen": null,
  "club": { "id": 1, ... },
  "comentarios": 4,
  "puntuaciones": 7
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `titulo` | String | |
| `contenido` | String | |
| `fecha` | String | ISO datetime; default `CURRENT_TIMESTAMP` |
| `imagen` | byte[] | Blob; puede ser null |
| `club` | Object | FK expandida |
| `comentarios` | int | Contador |
| `puntuaciones` | int | Contador |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | NoticiaEntity |
| GET | `/` | `contenido`, `id_club` | `Page<NoticiaEntity>` (size=1000) |
| POST | `/` | — (body) | NoticiaEntity |
| PUT | `/` | — (body) | NoticiaEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 15. Comentario

**Base:** `/comentario`

**Modelo JSON:**
```json
{
  "id": 1,
  "contenido": "...",
  "noticia": { "id": 1, ... },
  "usuario": { "id": 5, ... }
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `contenido` | String | |
| `noticia` | Object | FK expandida |
| `usuario` | Object | FK expandida |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | ComentarioEntity |
| GET | `/` | `contenido`, `id_usuario`, `id_noticia` | `Page<ComentarioEntity>` (size=1000) |
| POST | `/` | — (body) | ComentarioEntity |
| PUT | `/` | — (body) | ComentarioEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 16. Puntuacion

**Base:** `/puntuacion`

**Modelo JSON:**
```json
{
  "id": 1,
  "puntuacion": 4,
  "noticia": { "id": 1, ... },
  "usuario": { "id": 5, ... }
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `puntuacion` | Integer | Valor numérico (ej: 1–5) |
| `noticia` | Object | FK expandida |
| `usuario` | Object | FK expandida |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | PuntuacionEntity |
| GET | `/` | `id_noticia`, `id_usuario` | `Page<PuntuacionEntity>` (size=1000) |
| POST | `/` | — (body) | PuntuacionEntity |
| PUT | `/` | — (body) | PuntuacionEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 17. Tipoarticulo

**Base:** `/tipoarticulo`

**Modelo JSON:**
```json
{
  "id": 1,
  "descripcion": "Camisetas",
  "club": { "id": 1, ... },
  "articulos": 12
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `descripcion` | String | |
| `club` | Object | FK expandida |
| `articulos` | int | Contador |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | TipoarticuloEntity |
| GET | `/` | `descripcion`, `id_club` | `Page<TipoarticuloEntity>` (size=1000) |
| POST | `/` | — (body) | TipoarticuloEntity |
| PUT | `/` | — (body) | TipoarticuloEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 18. Articulo

**Base:** `/articulo`

**Modelo JSON:**
```json
{
  "id": 1,
  "descripcion": "...",
  "precio": 29.99,
  "descuento": 10.00,
  "imagen": null,
  "tipoarticulo": { "id": 1, "descripcion": "...", "club": { ... }, "articulos": 0 },
  "comentarioarts": 3,
  "compras": 5,
  "carritos": 2
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `descripcion` | String | |
| `precio` | BigDecimal | |
| `descuento` | BigDecimal | Porcentaje; puede ser null |
| `imagen` | byte[] | Blob; puede ser null |
| `tipoarticulo` | Object | FK expandida (incluye `club` anidado) |
| `comentarioarts` | int | Contador |
| `compras` | int | Contador |
| `carritos` | int | Contador |

> El club del artículo se obtiene vía `articulo.tipoarticulo.club`.

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | ArticuloEntity |
| GET | `/` | `descripcion`, `id_tipoarticulo` | `Page<ArticuloEntity>` (size=1000) |
| POST | `/` | — (body) | ArticuloEntity |
| PUT | `/` | — (body) | ArticuloEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| GET | `/fill` | — | Long (crea 50 por defecto) |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 19. Comentarioart

**Base:** `/comentarioart`

**Modelo JSON:**
```json
{
  "id": 1,
  "contenido": "...",
  "articulo": { "id": 1, ... },
  "usuario": { "id": 5, ... }
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `contenido` | String | |
| `articulo` | Object | FK expandida |
| `usuario` | Object | FK expandida |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | ComentarioartEntity |
| GET | `/` | `contenido`, `id_articulo`, `id_usuario` | `Page<ComentarioartEntity>` (size=1000) |
| POST | `/` | — (body) | ComentarioartEntity |
| PUT | `/` | — (body) | ComentarioartEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 20. Puntuacionart

**Base:** `/puntuacionart`

**Modelo JSON:**
```json
{
  "id": 1,
  "puntuacion": 5,
  "articulo": { "id": 3, "descripcion": "...", ... },
  "usuario": { "id": 5, "nombre": "...", ... }
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `puntuacion` | Integer | Valor numérico (1–5) |
| `articulo` | Object | FK expandida |
| `usuario` | Object | FK expandida |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | PuntuacionartEntity |
| GET | `/` | `id_articulo`, `id_usuario` | `Page<PuntuacionartEntity>` (size=1000) |
| POST | `/` | — (body) | PuntuacionartEntity |
| PUT | `/` | — (body) | PuntuacionartEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 21. Carrito

**Base:** `/carrito`

**Modelo JSON:**
```json
{
  "id": 1,
  "cantidad": 2,
  "articulo": { "id": 3, ... },
  "usuario": { "id": 5, ... }
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `cantidad` | Integer | Unidades |
| `articulo` | Object | FK expandida |
| `usuario` | Object | FK expandida |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | CarritoEntity |
| GET | `/` | `id_usuario`, `id_articulo` | `Page<CarritoEntity>` (size=1000) |
| POST | `/` | — (body) | CarritoEntity |
| PUT | `/` | — (body) | CarritoEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/comprar` | — | FacturaEntity (crea factura + compras + vacía carrito) |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

> `/comprar` solo puede ejecutarlo un usuario con `tipousuario.id = 3`. Crea una `Factura` + `Compra` por cada línea del carrito del usuario autenticado, luego vacía su carrito.

---

## 22. Factura

**Base:** `/factura`

**Modelo JSON:**
```json
{
  "id": 1,
  "fecha": "2025-11-15T14:20:00",
  "usuario": { "id": 5, ... },
  "compras": 3
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `fecha` | String | ISO datetime |
| `usuario` | Object | FK expandida |
| `compras` | int | Contador |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | FacturaEntity |
| GET | `/` | `id_usuario` | `Page<FacturaEntity>` (size=1000) |
| POST | `/` | — (body) | FacturaEntity |
| PUT | `/` | — (body) | FacturaEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

> En producción las facturas se generan únicamente vía `POST /carrito/comprar`.

---

## 23. Compra

**Base:** `/compra`

**Modelo JSON:**
```json
{
  "id": 1,
  "cantidad": 2,
  "precio": 29.99,
  "articulo": { "id": 3, ... },
  "factura": { "id": 1, ... }
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `cantidad` | Integer | Unidades compradas |
| `precio` | Double | Precio unitario en el momento de la compra |
| `articulo` | Object | FK expandida |
| `factura` | Object | FK expandida |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | CompraEntity |
| GET | `/` | `id_articulo`, `id_factura` | `Page<CompraEntity>` |
| POST | `/` | — (body) | CompraEntity |
| PUT | `/` | — (body) | CompraEntity |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## Resumen de endpoints de utilidad

| Endpoint | Descripción |
|---|---|
| `POST /{recurso}/fill/{cantidad}` | Inserta `cantidad` registros con datos aleatorios |
| `GET /articulo/fill` | Inserta 50 artículos (atajo sin parámetro) |
| `POST /rolusuario/fill` | Sin parámetro de cantidad (cantidad fija interna) |
| `GET /tipousuario/fill` | Sin parámetro de cantidad (datos fijos del sistema) |
| `DELETE /{recurso}/empty` | Elimina todos los registros del recurso |
| `GET /{recurso}/count` | Devuelve el total de registros |
