# Restricciones para generación de datos de prueba — Gesportin

Este documento define las reglas de consistencia que deben respetarse al generar datos aleatorios para tests o seeds. El incumplimiento de estas reglas produce inconsistencias de multitenancy (datos de un club "visibles" dentro de otro).

---

## Principio general

**Todas las entidades pertenecen indirectamente a un club.** Al crear cualquier registro que relacione dos entidades, ambas deben pertenecer al mismo club. La cadena de pertenencia es siempre rastreable hasta `club.id`.

## Restricciones de integridad referencial

Muy importante cumplirlas para evitar inconsistencias:

* Las noticias de un club C deben de estar comentadassólo por usuarios del club C.
* Las puntuaciones de un club C deben ser realizadas sólo por usuarios del club C.
* El usuario de un equipo debe pertenecer al club en el que está el equipo.
* Los artículos de tipos de artículos de un club C sólo pueden ser comentados por usuarios del club C.
* Los artículos de tipos de artículos de un club C sólo pueden ser valorados por usuarios del club C.
* Los artículos de tipos de artículos de un club C sólo pueden ser introducidos en el carrito por usuarios del club C.  
* Los jugadores de un equipo de un club C sólo pueden estar asociados a usuarios del club C.
* Los pagos de las cuotas de un equipo E sólo pueden ser realizadas por jugadores de ese equipo E. Los jugadores no pueden pagar una cuota dos veces.
* Las facturas de un usuario de un club C sólo pueden contener compras de artículos del mismo club C.
* Las facturas tienen que contener al menos un artículo.

---

## Orden obligatorio de creación

Las entidades deben crearse en este orden para respetar las FK:

```
1.  tipousuario     (datos fijos del sistema, no generar)
2.  rolusuario
3.  club
4.  usuario         → necesita: club, tipousuario, rolusuario
5.  temporada       → necesita: club
6.  noticia         → necesita: club
7.  tipoarticulo    → necesita: club
8.  categoria       → necesita: temporada (→ club)
9.  articulo        → necesita: tipoarticulo (→ club)
10. equipo          → necesita: categoria (→ club), entrenador/usuario (mismo club)
11. liga            → necesita: equipo
12. jugador         → necesita: equipo (→ club), usuario (mismo club)
13. cuota           → necesita: equipo
14. partido         → necesita: liga
15. pago            → necesita: cuota, jugador (mismo equipo)
16. comentario      → necesita: noticia, usuario (mismo club)
17. puntuacion      → necesita: noticia, usuario (mismo club)
18. comentarioart   → necesita: articulo, usuario (mismo club)
19. carrito         → necesita: articulo, usuario (mismo club)
20. factura         → necesita: usuario
21. compra          → necesita: factura (→ usuario → club), articulo (mismo club)
```

---

## Restricciones por entidad

---

### `usuario`

| Restricción | Descripción |
|---|---|
| `id_tipousuario = 1` | Solo para el administrador global del club. Máximo 1 por club. |
| `id_tipousuario = 2` | Para entrenadores de equipos. Solo usuarios que vayan a ser asignados como `id_entrenador` en `equipo`. |
| `id_tipousuario = 3` | Para jugadores / socios / usuarios generales. |
| `id_club` | Todos los usuarios pertenecen a un único club. No cambiar después de la creación salvo corrección explícita. |

---

### `temporada`

| Restricción | Descripción |
|---|---|
| `id_club` | Debe referenciar un `club` existente. |

---

### `categoria`

| Restricción | Descripción |
|---|---|
| `id_temporada` | Debe referenciar una `temporada` del mismo club para el que se crean las categorías. |

---

### `equipo`

| Restricción | Descripción |
|---|---|
| `id_categoria` | La categoría debe pertenecer al mismo club del equipo (`categoria.temporada.id_club`). |
| `id_entrenador` | Debe ser un `usuario` con `id_club` igual al club del equipo (`equipo.categoria.temporada.id_club`). |
| `id_entrenador` | El usuario asignado como entrenador debe tener `id_tipousuario = 2` (Administrador de club). |

---

### `jugador`

| Restricción | Descripción |
|---|---|
| `id_equipo` | El equipo define el club al que pertenece el jugador. |
| `id_usuario` | Debe ser un `usuario` con `id_club` igual al club del equipo (`jugador.equipo.categoria.temporada.id_club`). |
| `id_usuario` | El usuario asignado debe tener `id_tipousuario = 3` (Usuario). |
| `id_usuario` único por equipo | **Un usuario no puede estar asignado a dos jugadores (~dorsal) distintos del MISMO equipo.** La combinación `(id_usuario, id_equipo)` es implícitamente única. Un usuario puede ser jugador en múltiples equipos diferentes, pero solo una vez por equipo. |

---

### `liga`

| Restricción | Descripción |
|---|---|
| `id_equipo` | Debe referenciar un equipo existente del club correspondiente. Un equipo puede participar en varias ligas. |

---

### `partido`

| Restricción | Descripción |
|---|---|
| `id_liga` | Debe referenciar una liga existente. |
| `resultado` | Formato recomendado: `"X-Y"` (ej: `"3-1"`). Puede ser vacío si el partido aún no se ha jugado. |

---

### `cuota`

| Restricción | Descripción |
|---|---|
| `id_equipo` | Debe referenciar un equipo del club correspondiente. |

---

### `pago`

| Restricción | Descripción |
|---|---|
| `id_cuota` | La cuota debe pertenecer a un equipo. |
| `id_jugador` | El jugador debe pertenecer al **mismo equipo** que la cuota: `pago.cuota.id_equipo == pago.jugador.id_equipo`. |
| Unicidad | No crear dos registros de `pago` para el mismo par `(id_cuota, id_jugador)`. |

> **Comportamiento de UI (teamadmin/form):** cuando el formulario de creación de pago recibe un `id_cuota` por parámetro de URL (o se selecciona una cuota en el formulario), el selector de jugador abre el modal filtrando automáticamente por `id_equipo = cuota.equipo.id`, de modo que solo se muestran los jugadores del equipo al que pertenece la cuota.

---

### `noticia`

| Restricción | Descripción |
|---|---|
| `id_club` | Debe referenciar un `club` existente. |

---

### `comentario`

| Restricción | Descripción |
|---|---|
| `id_noticia` | Debe ser una noticia existente. |
| `id_usuario` | Debe ser un `usuario` con `id_club` igual al club de la noticia: `usuario.id_club == noticia.id_club`. |

---

### `puntuacion`

| Restricción | Descripción |
|---|---|
| `id_noticia` | Debe ser una noticia existente. |
| `id_usuario` | Debe ser un `usuario` con `id_club` igual al club de la noticia: `usuario.id_club == noticia.id_club`. |
| Unicidad | Un usuario solo puede puntuar **una vez** cada noticia: par `(id_noticia, id_usuario)` único. |
| `puntuacion` | Valor entre 1 y 5 (inclusive). |

---

### `tipoarticulo`

| Restricción | Descripción |
|---|---|
| `id_club` | Debe referenciar el club propietario del catálogo de artículos. |

---

### `articulo`

| Restricción | Descripción |
|---|---|
| `id_tipoarticulo` | Debe pertenecer al club para el que se generan los artículos (`tipoarticulo.id_club`). |
| `descuento` | Si se genera, valor entre 0.00 y 100.00. Puede ser NULL. |

---

### `comentarioart`

| Restricción | Descripción |
|---|---|
| `id_articulo` | Debe ser un artículo existente. |
| `id_usuario` | Debe ser un `usuario` con `id_club` igual al club del artículo: `usuario.id_club == articulo.tipoarticulo.id_club`. |

---

### `carrito`

| Restricción | Descripción |
|---|---|
| `id_articulo` | Debe ser un artículo del mismo club que el usuario. |
| `id_usuario` | Debe ser un `usuario` con `id_club` igual al club del artículo: `usuario.id_club == articulo.tipoarticulo.id_club`. |
| `cantidad` | Entero positivo ≥ 1. |

---

### `factura`

| Restricción | Descripción |
|---|---|
| `id_usuario` | Debe ser un `usuario` existente. La factura hereda el club del usuario. |

---

### `compra`

| Restricción | Descripción |
|---|---|
| `id_factura` | Debe ser una factura existente. |
| `id_articulo` | El artículo debe pertenecer al **mismo club** que el usuario de la factura: `articulo.tipoarticulo.id_club == factura.usuario.id_club`. |
| `cantidad` | Entero positivo ≥ 1. |
| `precio` | Copiar el `precio` del artículo en el momento de la compra (no referenciar directamente; es un snapshot). |

---

## Resumen rápido de restricciones de club cruzado

| Entidad | Campo | Club requerido |
|---|---|---|
| `equipo.id_entrenador` | usuario | `equipo.categoria.temporada.id_club` |
| `jugador.id_usuario` | usuario | `jugador.equipo.categoria.temporada.id_club` |
| `comentario.id_usuario` | usuario | `comentario.noticia.id_club` |
| `puntuacion.id_usuario` | usuario | `puntuacion.noticia.id_club` |
| `comentarioart.id_usuario` | usuario | `comentarioart.articulo.tipoarticulo.id_club` |
| `carrito.id_usuario` | usuario | `carrito.articulo.tipoarticulo.id_club` |
| `compra.id_articulo` | articulo | `compra.factura.usuario.id_club` |
| `pago.id_jugador` | jugador | mismo `id_equipo` que `pago.cuota.id_equipo` |

---

## Restricciones de unicidad relevantes

| Tabla | Unicidad lógica |
|---|---|
| `usuario` | `username` único global |
| `puntuacion` | Par `(id_noticia, id_usuario)` único |
| `pago` | Par `(id_cuota, id_jugador)` único |
| `jugador` | `dorsal` único dentro del mismo `id_equipo` |
| `jugador` | Par `(id_usuario, id_equipo)` único — Un usuario no puede ser jugador en dos registros distintos del mismo equipo |
