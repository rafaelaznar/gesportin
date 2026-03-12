
# Perfiles y permisos en gesportin

En gesportin, los perfiles y permisos se gestionan a través de roles. Cada rol tiene un conjunto de permisos asociados que determinan qué acciones pueden realizar los usuarios asignados a ese rol. A continuación, se describen los roles y permisos disponibles en gesportin:

## Roles

### 1. **Administrador** 

* (tabla: tipousuario, id:1) 
* Tiene acceso completo a todas las funcionalidades del sistema, incluyendo la gestión de usuarios, configuración del sistema y acceso a todos los datos. 
* No puede crear ni borrar tipos de usuario en la tabla tipousuario.

### 2. **Administrador de equipo**
* (tabla: tipousuario, id:2) 
* Puede gestionar:
  * Las temporadas de su club (crud completo pero sólo de temporadas de su club),
  * Las categorías de cada temporada de su club (crud completo pero sólo de categorias de su club),
  * Los equipos de cada categoría de su club (crud completo pero sólo de equipos de su club),
  * Las ligas en las que participan los equipos de su club (crud completo pero sólo de ligas de su club),
  * Los partidos que se juegan dentro de las ligas de su club (crud completo pero sólo de partidos de su club)
  * Los jugadores de su club (crud completo pero sólo de jugadores de su club)
  * Las cuotas que pagan los jugadores de su club (crud completo pero sólo de cuotas de su club)
  * Los pagos de los jugadores de su club (crud completo pero sólo de pagos de su club)
  * Las noticias de su club (crud completo pero sólo de noticias de su club)
  * Los tipos de articulo de su club (crud completo pero sólo de tipos de articulo de su club)
  * Los artículos de su club (crud completo pero sólo de artículos de tipos de artículo de su club)
  * Las facturas de su club (crud completo excepto borrar pero sólo de facturas de su club)
  * Los jugadores de su club (crud completo pero sólo de jugadores de su club)
  * Las cuotas que pagan los jugadores de su club (crud completo pero sólo de cuotas de su club)
  * Los pagos de los jugadores de su club (crud completo pero sólo de pagos de su club)
* Puede ver:
  * Puede ver los datos de los usuarios de su club pero no puede modificarlos ni borrarlos. No puede ver los datos de los usuarios de otros clubes.
  * Puede ver los datos de su club pero no puede modificarlos ni borrarlos.
  * Sólo puede ver las facturas y las compras de su club, no puede crearlas ni modificarlas ni borrarlas.  
  * No puede gestionar el carrito de la compra de los usuarios de su club.
  * Puede ver comentarios y puntuaciones de noticias ni de artículos de su club.
  * No puede gestionar comentarios ni puntuaciones de noticias ni de artículos de su club.
  * No tiene permisos de ningún tipo para gestionar nada de otros clubes.

### 3. **Usuario**
* (tabla: tipousuario, id:3) 
* Puede ver:
  * Los datos de su club.
  * Las temporadas de su club,
  * Las categorías de cada temporada de su club,
  * Los equipos de cada categoría de su club,
  * Las ligas en las que participan los equipos de su club,
  * Los partidos que se juegan dentro de las ligas de su club,
  * Las cuotas que pagan los jugadores de su club,
  * Las noticias de su club,
  * Los tipos de articulo de su club,
  * Los artículos de su club,  
* Puede crear y modificar sus comentarios de noticias de su club.
* Puede crear y modificar sus puntuaciones de noticias de su club.
* Puede crear y modificar sus comentarios de artículos de tipos de articulos de su club.
* Puede introducir productos de su club en su carrito de la compra.
* Puede comprar productos de su carrito de la compra. Si lo hace, se pasan los productos de su carrito a compra y se crea una factura asociada al usuario con esos productos.
* No tiene permisos para ver nada de otros clubes.