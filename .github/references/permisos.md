
# Perfiles y permisos en gesportin

En gesportin, los perfiles y permisos se gestionan a través de roles. Cada rol tiene un conjunto de permisos asociados que determinan qué acciones pueden realizar los usuarios asignados a ese rol. A continuación, se describen los roles y permisos disponibles en gesportin:

## Roles

### 1. **Administrador** 

* (tabla: tipousuario, id:1) 
* Tiene acceso completo a todas las funcionalidades del sistema, incluyendo la gestión de usuarios, configuración del sistema y acceso a todos los datos. 
* No puede crear ni borrar tipos de usuario en la tabla tipousuario.

### 2. **Administrador de club**
* (tabla: tipousuario, id:2) 
* Puede gestionar:
  * Las temporadas de su club (crud completo pero sólo de temporadas de su club),
  * Las categorías de cada temporada de su club (crud completo pero sólo de categorias de su club),
  * Los equipos de cada categoría de su club (crud completo pero sólo de equipos de su club),
  * Las ligas en las que participan los equipos de su club (crud completo pero sólo de ligas de su club),
  * Los partidos que se juegan dentro de las ligas de su club (crud completo pero sólo de partidos de su club)
    * Puede editar el comentario de cualquier partido de su club
  * Los jugadores de su club (crud completo pero sólo de jugadores de su club)
  * Las cuotas que pagan los jugadores de su club (crud completo pero sólo de cuotas de su club)
  * Los pagos de los jugadores de su club (crud completo pero sólo de pagos de su club)
  * Las noticias de su club (crud completo pero sólo de noticias de su club)
  * Los tipos de articulo de su club (crud completo pero sólo de tipos de articulo de su club)
  * Los artículos de su club (crud completo pero sólo de artículos de tipos de artículo de su club)
  * Las facturas de su club (crud completo excepto borrar pero sólo de facturas de su club)
  * Los jugadores de su club (crud completo pero sólo de jugadores de su club)
  * Las cuotas que pagan los jugadores de su club (crud completo pero sólo de cuotas de su club)
  * Los usuarios pero sólo de su club:
    * puede ver sólo usuarios de su club
    * puede crear usuarios del tipo usuario sólo en su club
    * puede modificar usuarios del tipo usuario sólo de su club sin cambiar su club
    * puede eliminar usuarios del tipo usuario sólo de su club
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
* (tabla: tipousuario, id:3 Perfil "Usuario") 
* Puede ver:
  * Roles de usuario
  * Tipos de usuario
  * Los datos de su club.
  * Las temporadas de su club,
  * Las categorías de cada temporada de su club,
  * Los equipos de cada categoría de su club,
  * Las ligas en las que participan los equipos de su club,
  * Los partidos que se juegan dentro de las ligas de su club,
  * Las cuotas que pagan los jugadores de equipo en su club,
  * Las noticias de su club,
  * La media de las puntuaciones de las noticias de su club,
  * Los tipos de articulo de su club,
  * Los artículos de su club,  
  * Sus facturas con las compras.
  * Los datos de usuario de usuarios de su club excepto el password.
* Puede crear y modificar: 
  * sólo sus comentarios de las noticias de su club.
  * sólo sus puntuaciones de sus noticias de su club.
  * sólo sus comentarios de artículos sólo de los tipos de articulos de su club.
* Puede introducir, borrar o modificar productos de su club en su carrito de la compra, lo que equivale a que tiene que poder escribir, borrar o modificar productos de su club en la tabla de carrito de la compra.
* Puede comprar productos de su carrito de la compra. Para comprar se debe ejecutar el siguiente proceso:
  1 El sistema comprueba que el usuario tiene productos en su carrito de la compra.
  2 Si el usuario no tiene productos en su carrito de la compra, se emite una excepción  indicando que no se pueden realizar compras sin productos en el carrito.
  3 Si el usuario tiene productos en su carrito de la compra, se procede a realizar la compra.
    4 Se crea una nueva factura con id=x asociada al usuario en la fecha y hora actuales.
    5 Se copian las referencias de los artículos y cantidades a la tabla compra, incluyendo el precio actual de cada artículo en el momento de la compra y se vinculan todas las líneas creadas con el id=x de la factura creada en el paso anterior.
    6 Se borran los registros del carrito de la compra del usuario.
* No tiene permisos para ver nada de otros clubes.
* No tiene permisos para crear modificar o borrar fuera de lo mencionado anteriormente.
* Puede registrar el pago de sus propias cuotas (crear un pago con `abonado=1` para su propio jugador, solo en cuotas de su club). No puede modificar ni borrar pagos.
