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
  - [11. Estadopartido](#11-estadopartido)
  - [12. Partido](#12-partido)
  - [13. Cuota](#13-cuota)
  - [14. Pago](#14-pago)
  - [15. Noticia](#15-noticia)
  - [16. Comentario](#16-comentario)
  - [17. Puntuacion](#17-puntuacion)
  - [18. Tipoarticulo](#18-tipoarticulo)
  - [19. Articulo](#19-articulo)
  - [20. Comentarioart](#20-comentarioart)
  - [21. Puntuacionart](#21-puntuacionart)
  - [22. Carrito](#22-carrito)
  - [23. Factura](#23-factura)
  - [24. Compra](#24-compra)
  - [Admin / Seed](#admin--seed)
  - [Resumen de endpoints de utilidad](#resumen-de-endpoints-de-utilidad)

---

## 1. Sesión

**Base:** `/session`

| Método | Path | Body | Respuesta | Auth |
|---|---|---|---|---|---|
| POST | `/session/login` | `{ "username": "", "password": "" }` | `TokenBean { "token": "" }` | No |
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
|---|---|---|---|---|
| GET | `/{id}` | — | TipousuarioDTO |
| GET | `/` | — | `List<TipousuarioDTO>` (lista completa, sin paginación) |
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
|---|---|---|---|---|
| GET | `/{id}` | — | RolusuarioDTO |
| GET | `/all` | — | `List<RolusuarioDTO>` (sin paginar) |
| GET | `/` | `descripcion` | `Page<RolusuarioDTO>` |
| POST | `/` | — (body) | RolusuarioDTO |
| PUT | `/` | — (body) | RolusuarioDTO |
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
| GET | `/{id}` | — | ClubDTO |
| GET | `/` | — | `Page<ClubDTO>` |
| POST | `/` | — (body) | ClubDTO |
| PUT | `/` | — (body) | ClubDTO |
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
| GET | `/{id}` | — | UsuarioDTO |
| GET | `/` | `nombre`, `username`, `id_tipousuario`, `id_club`, `id_rol` | `Page<UsuarioDTO>` (size=1000) |
| POST | `/` | — (body) | UsuarioDTO |
| PUT | `/` | — (body) | UsuarioDTO |
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
| GET | `/{id}` | — | TemporadaDTO |
| GET | `/` | `descripcion`, `id_club` | `Page<TemporadaDTO>` (size=1000) |
| POST | `/` | — (body) | TemporadaDTO |
| PUT | `/` | — (body) | TemporadaDTO |
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
| GET | `/{id}` | — | CategoriaDTO |
| GET | `/` | `nombre`, `id_temporada` | `Page<CategoriaDTO>` |
| POST | `/` | — (body) | CategoriaDTO |
| PUT | `/` | — (body) | CategoriaDTO |
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
| GET | `/{id}` | — | EquipoDTO |
| GET | `/` | `descripcion`, `id_categoria`, `id_usuario` | `Page<EquipoDTO>` (size=1000) |
| POST | `/` | — (body) | EquipoDTO |
| PUT | `/` | — (body) | EquipoDTO |
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
| GET | `/{id}` | — | JugadorDTO |
| GET | `/` | `posicion`, `id_usuario`, `id_equipo` | `Page<JugadorDTO>` (size=1000) |
| POST | `/` | — (body) | JugadorDTO |
| PUT | `/` | — (body) | JugadorDTO |
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
| GET | `/{id}` | — | LigaDTO |
| GET | `/` | `nombre`, `id_equipo` | `Page<LigaDTO>` (size=1000) |
| POST | `/` | — (body) | LigaDTO |
| PUT | `/` | — (body) | LigaDTO |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 11. Estadopartido

**Base:** `/estadopartido`

Datos fijos del sistema. Se recomienda no crear/editar/borrar manualmente, pero la API expone los endpoints completos.

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
| GET | `/{id}` | — | EstadopartidoDTO |
| GET | `/` | — | `List<EstadopartidoDTO>` (lista completa, sin paginación) |
| POST | `/` | — (body) | EstadopartidoDTO |
| PUT | `/` | — (body) | EstadopartidoDTO |
| DELETE | `/{id}` | — | Long |
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
| GET | `/{id}` | — | PartidoDTO |
| GET | `/` | `id_liga` | `Page<PartidoDTO>` |
| POST | `/` | — (body) | PartidoDTO |
| PUT | `/` | — (body) | PartidoDTO |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 13. Cuota

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
| GET | `/{id}` | — | CuotaDTO |
| GET | `/` | `descripcion`, `id_equipo` | `Page<CuotaDTO>` (size=1000) |
| POST | `/` | — (body) | CuotaDTO |
| PUT | `/` | — (body) | CuotaDTO |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 14. Pago

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
| GET | `/{id}` | — | PagoDTO |
| GET | `/` | `id_cuota`, `id_jugador` | `Page<PagoDTO>` (size=1000) |
| POST | `/` | — (body) | PagoDTO |
| PUT | `/` | — (body) | PagoDTO |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 15. Noticia

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
| `mediaPuntuacion` | double | Promedio de puntuaciones (1-5), 0 si no hay |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | NoticiaDTO |
| GET | `/` | `contenido`, `id_club` | `Page<NoticiaDTO>` (size=1000) |
| POST | `/` | — (body) | NoticiaDTO |
| PUT | `/` | — (body) | NoticiaDTO |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 16. Comentario

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
| GET | `/{id}` | — | ComentarioDTO |
| GET | `/` | `contenido`, `id_usuario`, `id_noticia` | `Page<ComentarioDTO>` (size=1000) |
| POST | `/` | — (body) | ComentarioDTO |
| PUT | `/` | — (body) | ComentarioDTO |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 17. Puntuacion

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
| GET | `/{id}` | — | PuntuacionDTO |
| GET | `/` | `id_noticia`, `id_usuario` | `Page<PuntuacionDTO>` (size=1000) |
| POST | `/` | — (body) | PuntuacionDTO |
| PUT | `/` | — (body) | PuntuacionDTO |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 18. Tipoarticulo

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
| `totalVentas` | Double | Suma de ingresos por compras de artículos de este tipo; puede ser null |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | TipoarticuloDTO |
| GET | `/` | `descripcion`, `id_club` | `Page<TipoarticuloDTO>` (size=1000) |
| POST | `/` | — (body) | TipoarticuloDTO |
| PUT | `/` | — (body) | TipoarticuloDTO |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 19. Articulo

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
  "puntuacionarts": 12,
  "mediaPuntuacion": 4.5,
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
| `puntuacionarts` | int | Número de puntuaciones |
| `mediaPuntuacion` | double | Promedio de puntuaciones (1-5), 0 si no hay |
| `compras` | int | Contador |
| `carritos` | int | Contador |

> El club del artículo se obtiene vía `articulo.tipoarticulo.club`.

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | ArticuloDTO |
| GET | `/` | `descripcion`, `id_tipoarticulo` | `Page<ArticuloDTO>` (size=1000) |
| POST | `/` | — (body) | ArticuloDTO |
| PUT | `/` | — (body) | ArticuloDTO |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| GET | `/fill` | — | Long (crea 50 por defecto) |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 20. Comentarioart

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
| GET | `/{id}` | — | ComentarioartDTO |
| GET | `/` | `contenido`, `id_articulo`, `id_usuario` | `Page<ComentarioartDTO>` (size=1000) |
| POST | `/` | — (body) | ComentarioartDTO |
| PUT | `/` | — (body) | ComentarioartDTO |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 21. Puntuacionart

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
| GET | `/{id}` | — | PuntuacionartDTO |
| GET | `/` | `id_articulo`, `id_usuario` | `Page<PuntuacionartDTO>` (size=1000) |
| POST | `/` | — (body) | PuntuacionartDTO |
| PUT | `/` | — (body) | PuntuacionartDTO |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 22. Carrito

**Base:** `/carrito`

**Modelo JSON:**
```json
{
  "id": 1,
  "cantidad": 2,
  "articulo": { "id": 3, ... },
  "usuario": { "id": 5, ... },
  "precioTotal": 53.98
}
```

| Campo | Tipo | Notas |
|---|---|---|---|
| `id` | Long | PK |
| `cantidad` | Integer | Unidades |
| `articulo` | Object | FK expandida |
| `usuario` | Object | FK expandida |
| `precioTotal` | double | Precio total calculado (precio * cantidad con descuento) |

**Endpoints:**

| Método | Path | Parámetros opcionales | Respuesta |
|---|---|---|---|
| GET | `/{id}` | — | CarritoDTO |
| GET | `/` | `id_usuario`, `id_articulo` | `Page<CarritoDTO>` (size=1000) |
| POST | `/` | — (body) | CarritoDTO |
| PUT | `/` | — (body) | CarritoDTO |
| DELETE | `/{id}` | — | Long |
| POST | `/comprar` | — | FacturaDTO (crea factura + compras + vacía carrito) |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

> `/comprar` solo puede ejecutarlo un usuario con `tipousuario.id = 3`. Crea una `Factura` + `Compra` por cada línea del carrito del usuario autenticado, luego vacía su carrito.

---

## 23. Factura

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
| GET | `/{id}` | — | FacturaDTO |
| GET | `/` | `id_usuario` | `Page<FacturaDTO>` (size=1000) |
| POST | `/` | — (body) | FacturaDTO |
| PUT | `/` | — (body) | FacturaDTO |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

> En producción las facturas se generan únicamente vía `POST /carrito/comprar`.

---

## 24. Compra

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
| GET | `/{id}` | — | CompraDTO |
| GET | `/` | `id_articulo`, `id_factura` | `Page<CompraDTO>` |
| POST | `/` | — (body) | CompraDTO |
| PUT | `/` | — (body) | CompraDTO |
| DELETE | `/{id}` | — | Long |
| POST | `/fill/{cantidad}` | — | Long |
| DELETE | `/empty` | — | Long |
| GET | `/count` | — | Long |

---

## 25. Admin / Seed

**Base:** `/admin`

Endpoints de utilidad para administración del sistema (todos requieren `tipousuario.id = 1`).

| Método | Path | Respuesta | Descripción |
|---|---|---|---|
| POST | `/admin/seed` | Long | Inserta datos de sistema faltantes (idempotente) |
| POST | `/admin/reset` | Long | Reset transaccional: borra todos los datos y re-siembra datos mínimos |
| POST | `/admin/resetcomplete` | Long | Como `/reset` pero también reinicia los contadores AUTO_INCREMENT |

---

## Resumen de endpoints de utilidad

| Endpoint | Descripción |
|---|---|
| `POST /{recurso}/fill/{cantidad}` | Inserta `cantidad` registros con datos aleatorios |
| `GET /articulo/fill` | Inserta 50 artículos (atajo sin parámetro) |
| `GET /estadopartido/fill` | Inserta datos fijos del sistema (5 estados) |
| `POST /rolusuario/fill` | Sin parámetro de cantidad (cantidad fija interna) |
| `GET /tipousuario/fill` | Sin parámetro de cantidad (datos fijos del sistema) |
| `POST /admin/seed` | Siembra datos de sistema faltantes |
| `POST /admin/reset` | Reset completo transaccional |
| `POST /admin/resetcomplete` | Reset completo + reinicio de AUTO_INCREMENT |
| `DELETE /{recurso}/empty` | Elimina todos los registros del recurso |
| `GET /{recurso}/count` | Devuelve el total de registros |
