# Database Reference — Gesportin

Charset: `utf32_unicode_ci`. Engine: InnoDB. Los campos con prefijo `id_` son claves ajenas a la tabla indicada.

---

## Diagrama de relaciones (resumen)

```
tipousuario ←── usuario ──→ club ──→ tipoarticulo ──→ articulo
                  │                       │
              rolusuario              comentarioart
                                          │
club ──→ temporada ──→ categoria ──→ equipo ──→ liga ──→ partido
                                       │    \
                                    cuota  jugador
                                       │       │
                                     pago ─────┘

usuario ──→ factura ──→ compra ──→ articulo
usuario ──→ carrito ──→ articulo
usuario ──→ comentario ──→ noticia ──→ club
usuario ──→ puntuacion ──→ noticia
equipo ──→ entrenador (usuario)
```

---

## Entidades

---

### `tipousuario`

Define el tipo / rol del usuario en el sistema.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `descripcion` | varchar(255) | NO | — | |

**Datos iniciales:**

| id | descripcion |
|---|---|
| 1 | Administrador |
| 2 | Administrador de club |
| 3 | Usuario |

---

### `rolusuario`

Roles funcionales asignables a usuarios.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `descripcion` | varchar(255) | NO | — | |

---

### `club`

Club deportivo. Entidad raíz: la mayoría de entidades pertenecen a un club.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `nombre` | varchar(255) | NO | — | |
| `dirección` | varchar(255) | NO | — | |
| `teléfono` | varchar(255) | NO | — | |
| `fecha_alta` | datetime | NO | — | |
| `imagen` | longblob | SÍ | NULL | Imagen del club |

---

### `usuario`

Usuarios del sistema. Pertenecen a un club y tienen un tipo y un rol.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `nombre` | varchar(256) | NO | — | |
| `apellido1` | varchar(256) | NO | — | |
| `apellido2` | varchar(256) | NO | — | |
| `username` | varchar(256) | NO | — | Único |
| `password` | varchar(256) | NO | — | Hash bcrypt |
| `fecha_alta` | datetime | NO | — | |
| `genero` | tinyint | NO | — | 0=Hombre, 1=Mujer |
| `id_tipousuario` | bigint | NO | — | FK → tipousuario |
| `id_club` | bigint | NO | — | FK → club |
| `id_rolusuario` | bigint | NO | — | FK → rolusuario |

---

### `temporada`

Temporada deportiva perteneciente a un club.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `descripcion` | varchar(256) | NO | — | Ej: "2025-2026" |
| `id_club` | bigint | NO | — | FK → club |

---

### `categoria`

Categoría deportiva dentro de una temporada (ej: Benjamín, Alevín).

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `nombre` | varchar(255) | NO | — | |
| `id_temporada` | bigint | NO | — | FK → temporada |

---

### `equipo`

Equipo perteneciente a una categoría, con un entrenador asignado.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `nombre` | varchar(255) | NO | — | |
| `id_entrenador` | bigint | NO | — | FK → usuario (entrenador) |
| `id_categoria` | bigint | NO | — | FK → categoria |

---

### `jugador`

Jugador perteneciente a un equipo, asociado a un usuario del sistema.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `dorsal` | int | NO | — | Número de camiseta |
| `posicion` | varchar(50) | NO | — | Posición en el campo |
| `capitan` | tinyint(1) | NO | 0 | 0=No, 1=Sí |
| `imagen` | varchar(255) | SÍ | NULL | Ruta/URL de imagen |
| `id_usuario` | bigint | NO | — | FK → usuario |
| `id_equipo` | bigint | NO | — | FK → equipo |

**Restricciones de integridad:**
- `(id_usuario, id_equipo)` debe ser único: un usuario no puede ser jugador en dos registros distintos del mismo equipo.
- `id_usuario` debe pertenecer al mismo club que el equipo: `usuario.id_club == equipo.categoria.temporada.id_club`.

---

### `liga`

Liga en la que participa un equipo.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `nombre` | varchar(255) | NO | — | |
| `id_equipo` | bigint | NO | — | FK → equipo |

---

### `estadopartido`

Estado de un partido (No jugado, Ganado, Perdido, Empatado, Aplazado).

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `descripcion` | varchar(255) | NO | — | Ej: "Ganado", "Perdido" |

**Datos iniciales (seed):**
| id | descripcion |
|---|---|
| 1 | No jugado |
| 2 | Aplazado |
| 3 | Ganado |
| 4 | Perdido |
| 5 | Empatado |

---

### `partido`

Partido disputado en una liga.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `rival` | varchar(255) | NO | — | Nombre del equipo rival |
| `id_liga` | bigint | NO | — | FK → liga |
| `local` | tinyint(1) | NO | — | 0=Visitante, 1=Local |
| `resultado` | varchar(255) | NO | — | Ej: "3-1"; vacío si aún no jugado |
| `fecha` | datetime | SÍ | NULL | Fecha/hora del partido |
| `lugar` | varchar(255) | NO | — | Lugar donde se juega |
| `comentario` | text | SÍ | NULL | Comentario opcional sobre el partido |
| `id_estadopartido` | bigint | SÍ | NULL | FK → estadopartido |

---

### `cuota`

Cuota económica asociada a un equipo.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `descripcion` | varchar(255) | NO | — | |
| `cantidad` | decimal(5,2) | NO | — | Importe en euros |
| `fecha` | datetime | NO | — | Fecha de vencimiento |
| `id_equipo` | bigint | NO | — | FK → equipo |

---

### `pago`

Registro de pago de una cuota por parte de un jugador.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `id_cuota` | bigint | NO | — | FK → cuota |
| `id_jugador` | bigint | NO | — | FK → jugador |
| `abonado` | tinyint | NO | — | 0=Pendiente, 1=Pagado |
| `fecha` | datetime | NO | — | Fecha del pago |

---

### `noticia`

Noticia publicada por un club.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `titulo` | varchar(255) | NO | — | |
| `contenido` | text | NO | — | |
| `fecha` | datetime | NO | CURRENT_TIMESTAMP | Fecha de publicación |
| `imagen` | longblob | SÍ | NULL | |
| `id_club` | bigint | NO | — | FK → club |

---

### `comentario`

Comentario de un usuario sobre una noticia.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `contenido` | text | NO | — | |
| `id_noticia` | bigint | NO | — | FK → noticia |
| `id_usuario` | bigint | NO | — | FK → usuario |

---

### `puntuacion`

Puntuación (valoración) de un usuario sobre una noticia.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `puntuacion` | tinyint | NO | — | Valor numérico (ej: 1–5) |
| `id_noticia` | bigint | NO | — | FK → noticia |
| `id_usuario` | bigint | NO | — | FK → usuario |

---

### `tipoarticulo`

Tipo o categoría de artículo de la tienda, perteneciente a un club.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `descripcion` | varchar(255) | NO | — | |
| `id_club` | bigint | NO | — | FK → club |

---

### `articulo`

Artículo disponible en la tienda del club.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `descripcion` | varchar(255) | NO | — | |
| `precio` | decimal(10,2) | NO | — | Precio base en euros |
| `descuento` | decimal(10,2) | SÍ | NULL | Porcentaje de descuento |
| `imagen` | longblob | SÍ | NULL | |
| `id_tipoarticulo` | bigint | NO | — | FK → tipoarticulo |

---

### `comentarioart`

Comentario de un usuario sobre un artículo de la tienda.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `contenido` | text | NO | — | |
| `id_articulo` | bigint | NO | — | FK → articulo |
| `id_usuario` | bigint | NO | — | FK → usuario |

---

### `puntuacionart`

Puntuación/valoración de un artículo por parte de un usuario. Los usuarios pueden valorar artículos con puntuaciones de 1 a 5.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `puntuacion` | int | NO | — | Valor 1–5 |
| `id_articulo` | bigint | NO | — | FK → articulo |
| `id_usuario` | bigint | NO | — | FK → usuario |

---

### `carrito`

Línea del carrito de la compra de un usuario.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `cantidad` | int | NO | — | Unidades deseadas |
| `id_articulo` | bigint | NO | — | FK → articulo |
| `id_usuario` | bigint | NO | — | FK → usuario |

---

### `factura`

Cabecera de factura generada al completar una compra.

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `fecha` | datetime | NO | — | Fecha de compra |
| `id_usuario` | bigint | NO | — | FK → usuario |

---

### `compra`

Línea de detalle de una factura (artículo comprado).

| Campo | Tipo | Nulo | Default | Notas |
|---|---|---|---|---|
| `id` | bigint | NO | AUTO_INCREMENT | PK |
| `cantidad` | int | NO | — | Unidades compradas |
| `precio` | decimal(10,2) | NO | — | Precio unitario en el momento de la compra |
| `id_articulo` | bigint | NO | — | FK → articulo |
| `id_factura` | bigint | NO | — | FK → factura |

---

## Resumen de claves ajenas

| Tabla | Campo FK | Tabla referenciada |
|---|---|---|
| usuario | id_tipousuario | tipousuario |
| usuario | id_club | club |
| usuario | id_rolusuario | rolusuario |
| temporada | id_club | club |
| categoria | id_temporada | temporada |
| equipo | id_entrenador | usuario |
| equipo | id_categoria | categoria |
| jugador | id_usuario | usuario |
| jugador | id_equipo | equipo |
| liga | id_equipo | equipo |
| partido | id_liga | liga |
| cuota | id_equipo | equipo |
| pago | id_cuota | cuota |
| pago | id_jugador | jugador |
| noticia | id_club | club |
| comentario | id_noticia | noticia |
| comentario | id_usuario | usuario |
| puntuacion | id_noticia | noticia |
| puntuacion | id_usuario | usuario |
| tipoarticulo | id_club | club |
| articulo | id_tipoarticulo | tipoarticulo |
| comentarioart | id_articulo | articulo |
| comentarioart | id_usuario | usuario |
| carrito | id_articulo | articulo |
| carrito | id_usuario | usuario |
| factura | id_usuario | usuario |
| compra | id_articulo | articulo |
| compra | id_factura | factura |
