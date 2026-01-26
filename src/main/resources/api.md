# API REST - Gesportin

## Descripción General

Gesportin es una API REST desarrollada con Spring Boot para la gestión integral de clubes deportivos. La aplicación permite administrar usuarios, equipos, jugadores, partidos, noticias, tienda online y gestión económica de los clubes.

**URL Base**: `http://localhost:8089`

**CORS**: Habilitado para todos los orígenes (`*`)

---

## Nota Importante sobre Relaciones OneToMany

En esta API, las relaciones **OneToMany** en las entidades se serializan como **valores numéricos** (Integer) que representan el **tamaño/cantidad** de elementos en la colección, en lugar de devolver la lista completa de objetos relacionados.

**Ejemplo:** 
- En `UsuarioEntity`, el campo `comentarios` (que es una relación OneToMany con `ComentarioEntity`) aparece en el JSON como un número entero: `"comentarios": 5`
- Esto indica que el usuario tiene 5 comentarios asociados, pero no devuelve el array de comentarios.

**Motivo:** Esta implementación evita problemas de recursión infinita en la serialización JSON y mejora el rendimiento al no cargar colecciones completas innecesariamente.

**Entidades afectadas:**
- Usuario: comentarios, puntuaciones, comentarioarts, carritos, facturas
- Club: temporadas, noticias, tipoarticulos, usuarios
- Noticia: comentarios, puntuaciones
- Articulo: comentarioarts, compras, carritos
- Equipo: jugadores, cuotas, ligas
- Categoria: equipos
- Temporada: categorias
- Liga: partidos
- Tipoarticulo: articulos
- Factura: compras
- Cuota: pagos
- Jugador: pagos

---

## Índice de Recursos

1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Tipos de Usuario](#tipos-de-usuario)
4. [Roles de Usuario](#roles-de-usuario)
5. [Clubes](#clubes)
6. [Equipos](#equipos)
7. [Jugadores](#jugadores)
8. [Categorías](#categorías)
9. [Temporadas](#temporadas)
10. [Ligas](#ligas)
11. [Partidos](#partidos)
12. [Noticias](#noticias)
13. [Comentarios](#comentarios)
14. [Puntuaciones](#puntuaciones)
15. [Artículos](#artículos)
16. [Tipos de Artículo](#tipos-de-artículo)
17. [Carrito](#carrito)
18. [Facturas](#facturas)
19. [Compras](#compras)
20. [Cuotas](#cuotas)
21. [Pagos](#pagos)

---

## 1. Autenticación

### Modelo de Datos: SessionBean
```json
{
  "username": "string",
  "password": "string"
}
```

### Modelo de Respuesta: TokenBean
```json
{
  "token": "string"
}
```

### Endpoints

#### POST /session/login
Autentica un usuario en el sistema.

**Request Body:**
```json
{
  "username": "usuario123",
  "password": "contraseña"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Posibles Errores:**
- 401 Unauthorized: Credenciales inválidas

---

#### GET /session/check
Verifica si existe una sesión activa.

**Response 200:**
```json
true
```

**Response 200 (sin sesión):**
```json
false
```

---

## 2. Usuarios

### Modelo de Datos: UsuarioEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| nombre | String | Not blank, Not null | Nombre del usuario |
| apellido1 | String | Not blank, Not null | Primer apellido |
| apellido2 | String | Not blank, Not null | Segundo apellido |
| username | String | Not blank, Not null, Unique | Nombre de usuario único |
| password | String | Not blank, Not null | Contraseña (hash) |
| fechaAlta | LocalDateTime | Not null | Fecha de alta en el sistema |
| genero | Integer | Not null | Género (0: Femenino, 1: Masculino, etc.) |
| tipousuario | TipousuarioEntity | Not null | Objeto del tipo de usuario |
| rolusuario | RolusuarioEntity | Not null | Objeto del rol de usuario |
| club | ClubEntity | Not null | Objeto del club al que pertenece |
| comentarios | Integer | - | Cantidad de comentarios del usuario |
| puntuaciones | Integer | - | Cantidad de puntuaciones del usuario |
| comentarioarts | Integer | - | Cantidad de comentarios en artículos del usuario |
| carritos | Integer | - | Cantidad de items en el carrito del usuario |
| facturas | Integer | - | Cantidad de facturas del usuario |

### Endpoints

#### GET /usuario/{id}
Obtiene un usuario por su ID.

**Parámetros:**
- `id` (path): Long - ID del usuario

**Response 200:**
```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido1": "García",
  "apellido2": "López",
  "username": "jgarcia",
  "password": "$2a$10$...",
  "fechaAlta": "2024-01-15 10:30:00",
  "genero": 1,
  "tipousuario": {
    "id": 2,
    "descripcion": "Jugador"
  },
  "rolusuario": {
    "id": 1,
    "descripcion": "Administrador"
  },
  "club": {
    "id": 1,
    "nombre": "CD Deportivo",
    "direccion": "Calle Mayor 123",
    "telefono": "963123456",
    "fechaAlta": "2020-01-01 10:00:00"
  },
  "comentarios": 5,
  "puntuaciones": 12,
  "comentarioarts": 3,
  "carritos": 2,
  "facturas": 8
}
```

**Posibles Errores:**
- 404 Not Found: Usuario no encontrado

---

#### GET /usuario
Obtiene una página de usuarios con filtros opcionales.

**Parámetros de Query (opcionales):**
- `nombre` (String): Filtrar por nombre
- `username` (String): Filtrar por username
- `idTipousuario` (Long): Filtrar por tipo de usuario
- `idClub` (Long): Filtrar por club
- `page` (Integer): Número de página (default: 0)
- `size` (Integer): Tamaño de página (default: 1000)
- `sort` (String): Campo de ordenación

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "nombre": "Juan",
      "apellido1": "García",
      "apellido2": "López",
      "username": "jgarcia",
      "password": "$2a$10$...",
      "fechaAlta": "2024-01-15 10:30:00",
      "genero": 1,
      "tipousuario": {
        "id": 2,
        "descripcion": "Jugador"
      },
      "rolusuario": {
        "id": 1,
        "descripcion": "Administrador"
      },
      "club": {
        "id": 1,
        "nombre": "CD Deportivo"
      },
      "comentarios": 5,
      "puntuaciones": 12,
      "comentarioarts": 3,
      "carritos": 2,
      "facturas": 8
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 1000
  },
  "totalElements": 1,
  "totalPages": 1
}
```

---

#### POST /usuario
Crea un nuevo usuario.

**Request Body:**
```json
{
  "nombre": "María",
  "apellido1": "Fernández",
  "apellido2": "Ruiz",
  "username": "mfernandez",
  "password": "password123",
  "fechaAlta": "2024-01-20 14:00:00",
  "genero": 0,
  "tipousuario": {
    "id": 3
  },
  "rolusuario": {
    "id": 2
  },
  "club": {
    "id": 1
  }
}
```

**Response 200:**
```json
{
  "id": 2,
  "nombre": "María",
  "apellido1": "Fernández",
  "apellido2": "Ruiz",
  "username": "mfernandez",
  "password": "$2a$10$...",
  "fechaAlta": "2024-01-20 14:00:00",
  "genero": 0,
  "tipousuario": {
    "id": 3,
    "descripcion": "Entrenador"
  },
  "rolusuario": {
    "id": 2,
    "descripcion": "Usuario"
  },
  "club": {
    "id": 1,
    "nombre": "CD Deportivo"
  },
  "comentarios": 0,
  "puntuaciones": 0,
  "comentarioarts": 0,
  "carritos": 0,
  "facturas": 0
}
```

**Posibles Errores:**
- 400 Bad Request: Datos inválidos
- 409 Conflict: Username ya existe

---

#### PUT /usuario
Actualiza un usuario existente.

**Request Body:**
```json
{
  "id": 2,
  "nombre": "María",
  "apellido1": "Fernández",
  "apellido2": "Ruiz",
  "username": "mfernandez",
  "password": "newpassword",
  "fechaAlta": "2024-01-20 14:00:00",
  "genero": 0,
  "tipousuario": {
    "id": 3
  },
  "rolusuario": {
    "id": 2
  },
  "club": {
    "id": 1
  }
}
```

**Response 200:**
```json
{
  "id": 2,
  "nombre": "María",
  "apellido1": "Fernández",
  "apellido2": "Ruiz",
  "username": "mfernandez",
  "password": "$2a$10$...",
  "fechaAlta": "2024-01-20 14:00:00",
  "genero": 0,
  "tipousuario": {
    "id": 3,
    "descripcion": "Entrenador"
  },
  "rolusuario": {
    "id": 2,
    "descripcion": "Usuario"
  },
  "club": {
    "id": 1,
    "nombre": "CD Deportivo"
  },
  "comentarios": 0,
  "puntuaciones": 0,
  "comentarioarts": 0,
  "carritos": 0,
  "facturas": 0
}
```

**Posibles Errores:**
- 404 Not Found: Usuario no encontrado
- 400 Bad Request: Datos inválidos

---

#### DELETE /usuario/{id}
Elimina un usuario por su ID.

**Parámetros:**
- `id` (path): Long - ID del usuario

**Response 200:**
```json
1
```

**Posibles Errores:**
- 404 Not Found: Usuario no encontrado

---

#### GET /usuario/fill/{cantidad}
Rellena la base de datos con usuarios aleatorios (para testing).

**Parámetros:**
- `cantidad` (path): Long - Cantidad de usuarios a crear

**Response 200:**
```json
50
```

---

#### DELETE /usuario/empty
Vacía todos los usuarios de la base de datos.

**Response 200:**
```json
25
```

---

#### GET /usuario/count
Cuenta el total de usuarios.

**Response 200:**
```json
100
```

---

## 3. Tipos de Usuario

### Modelo de Datos: TipousuarioEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| descripcion | String | Not blank | Descripción del tipo (ej: Admin, Jugador, Entrenador) |

### Endpoints

#### GET /tipousuario/{id}
Obtiene un tipo de usuario por su ID.

**Response 200:**
```json
{
  "id": 1,
  "descripcion": "Administrador"
}
```

---

#### GET /tipousuario
Obtiene todos los tipos de usuario disponibles.

**Response 200:**
```json
[
  {
    "id": 1,
    "descripcion": "Administrador"
  },
  {
    "id": 2,
    "descripcion": "Entrenador"
  },
  {
    "id": 3,
    "descripcion": "Jugador"
  }
]
```

---

#### GET /tipousuario/fill
Rellena la tabla con tipos de usuario predeterminados.

**Response 200:**
```json
3
```

---

#### DELETE /tipousuario/empty
Vacía todos los tipos de usuario.

**Response 200:**
```json
3
```

---

#### GET /tipousuario/count
Cuenta el total de tipos de usuario.

**Response 200:**
```json
3
```

---

## 4. Roles de Usuario

### Modelo de Datos: RolusuarioEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| descripcion | String | Not blank | Descripción del rol (ej: Admin, Usuario, etc.) |

### Endpoints

#### GET /rolusuario/{id}
Obtiene un rol de usuario por su ID.

**Response 200:**
```json
{
  "id": 1,
  "descripcion": "Administrador"
}
```

---

#### GET /rolusuario/all
Obtiene todos los roles de usuario disponibles sin paginación.

**Response 200:**
```json
[
  {
    "id": 1,
    "descripcion": "Administrador"
  },
  {
    "id": 2,
    "descripcion": "Usuario"
  }
]
```

---

#### GET /rolusuario
Obtiene una página de roles de usuario con filtros opcionales.

**Parámetros de Query (opcionales):**
- `descripcion` (String): Filtrar por descripción
- `page` (Integer): Número de página (default: 0)
- `size` (Integer): Tamaño de página (default: 1000)
- `sort` (String): Campo de ordenación

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "descripcion": "Administrador"
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

#### POST /rolusuario
Crea un nuevo rol de usuario.

**Request Body:**
```json
{
  "descripcion": "Moderador"
}
```

**Response 200:**
```json
{
  "id": 3,
  "descripcion": "Moderador"
}
```

---

#### PUT /rolusuario
Actualiza un rol de usuario existente.

**Request Body:**
```json
{
  "id": 3,
  "descripcion": "Moderador Principal"
}
```

**Response 200:** Retorna el rol actualizado

---

#### DELETE /rolusuario/{id}
Elimina un rol de usuario por su ID.

**Parámetros:**
- `id` (path): Long - ID del rol

**Response 200:**
```json
1
```

---

#### POST /rolusuario/fill
Rellena la tabla con roles de usuario predeterminados.

**Response 200:**
```json
2
```

---

#### DELETE /rolusuario/empty
Vacía todos los roles de usuario.

**Response 200:**
```json
2
```

---

#### GET /rolusuario/count
Cuenta el total de roles de usuario.

**Response 200:**
```json
2
```

---

## 5. Clubes

### Modelo de Datos: ClubEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| nombre | String | Not null | Nombre del club |
| direccion | String | Not null | Dirección del club |
| telefono | String | Not null | Teléfono de contacto |
| fechaAlta | LocalDateTime | Not null | Fecha de alta del club |
| imagen | byte[] | Not null | Logo del club (BLOB) |
| temporadas | Integer | - | Cantidad de temporadas del club |
| noticias | Integer | - | Cantidad de noticias del club |
| tipoarticulos | Integer | - | Cantidad de tipos de artículos del club |
| usuarios | Integer | - | Cantidad de usuarios del club |

### Endpoints

#### GET /club/{id}
Obtiene un club por su ID.

**Response 200:**
```json
{
  "id": 1,
  "nombre": "CD Deportivo",
  "direccion": "Calle Mayor 123",
  "telefono": "963123456",
  "fechaAlta": "2020-01-01 10:00:00",
  "imagen": [...],
  "temporadas": 5,
  "noticias": 23,
  "tipoarticulos": 8,
  "usuarios": 45
}
```

---

#### GET /club
Obtiene una página de clubes.

**Parámetros de Query:**
- `page` (Integer): Número de página
- `size` (Integer): Tamaño de página
- `sort` (String): Campo de ordenación

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "nombre": "CD Deportivo",
      "direccion": "Calle Mayor 123",
      "telefono": "963123456",
      "fechaAlta": "2020-01-01 10:00:00",
      "imagen": [...],
      "temporadas": 5,
      "noticias": 23,
      "tipoarticulos": 8,
      "usuarios": 45
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

#### POST /club
Crea un nuevo club.

**Request Body:**
```json
{
  "nombre": "CF Nuevo Club",
  "direccion": "Avenida del Deporte 45",
  "telefono": "961987654",
  "fechaAlta": "2024-01-20 12:00:00",
  "imagen": [...]
}
```

**Response 200:**
```json
{
  "id": 2,
  "nombre": "CF Nuevo Club",
  "direccion": "Avenida del Deporte 45",
  "telefono": "961987654",
  "fechaAlta": "2024-01-20 12:00:00",
  "imagen": [...],
  "temporadas": 0,
  "noticias": 0,
  "tipoarticulos": 0,
  "usuarios": 0
}
```

---

#### PUT /club
Actualiza un club existente.

**Request Body:** Similar a POST con `id` incluido

**Response 200:** Retorna el club actualizado

---

#### DELETE /club/{id}
Elimina un club.

**Response 200:**
```json
1
```

---

#### GET /club/fill/{cantidad}
Genera clubes aleatorios.

**Response 200:**
```json
10
```

---

#### DELETE /club/empty
Vacía todos los clubes.

**Response 200:**
```json
5
```

---

#### GET /club/count
Cuenta el total de clubes.

**Response 200:**
```json
15
```

---

## 6. Equipos

### Modelo de Datos: EquipoEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| nombre | String | Not null, Size(3-1024) | Nombre del equipo |
| entrenador | UsuarioEntity | Not null | Objeto del usuario entrenador |
| categoria | CategoriaEntity | Not null | Objeto de la categoría del equipo |
| jugadores | Integer | - | Cantidad de jugadores del equipo |
| cuotas | Integer | - | Cantidad de cuotas del equipo |
| ligas | Integer | - | Cantidad de ligas en las que participa el equipo |

### Endpoints

#### GET /equipo/{id}
Obtiene un equipo por su ID.

**Response 200:**
```json
{
  "id": 1,
  "nombre": "Equipo Juvenil A",
  "entrenador": {
    "id": 15,
    "nombre": "Carlos"
  },
  "categoria": {
    "id": 3,
    "nombre": "Juvenil"
  },
  "jugadores": 18,
  "cuotas": 12,
  "ligas": 2
}
```

---

#### GET /equipo
Obtiene una página de equipos.

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "nombre": "Equipo Juvenil A",
      "entrenador": {
        "id": 15,
        "nombre": "Carlos"
      },
      "categoria": {
        "id": 3,
        "nombre": "Juvenil"
      },
      "jugadores": 18,
      "cuotas": 12,
      "ligas": 2
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

#### POST /equipo
Crea un nuevo equipo.

**Request Body:**
```json
{
  "nombre": "Equipo Infantil B",
  "entrenador": {
    "id": 20
  },
  "categoria": {
    "id": 2
  }
}
```

**Response 200:** Retorna el equipo creado con su ID

---

#### PUT /equipo
Actualiza un equipo existente.

**Response 200:** Retorna el equipo actualizado

---

#### DELETE /equipo/{id}
Elimina un equipo.

**Response 200:**
```json
1
```

---

#### GET /equipo/fill/{cantidad}
Genera equipos aleatorios.

---

#### DELETE /equipo/empty
Vacía todos los equipos.

---

#### GET /equipo/count
Cuenta el total de equipos.

---

## 7. Jugadores

### Modelo de Datos: JugadorEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| dorsal | int | Not null | Número de dorsal |
| posicion | String | Not null, Size(3-255) | Posición en el campo |
| capitan | Boolean | Not null | Si es capitán del equipo |
| imagen | String | Nullable, Size(3-255) | URL de la imagen del jugador |
| usuario | UsuarioEntity | Not null | Objeto del usuario asociado |
| equipo | EquipoEntity | Not null | Objeto del equipo al que pertenece |
| pagos | Integer | - | Cantidad de pagos del jugador |

### Endpoints

#### GET /jugador/{id}
Obtiene un jugador por su ID.

**Response 200:**
```json
{
  "id": 1,
  "dorsal": 10,
  "posicion": "Delantero",
  "capitan": true,
  "imagen": "jugador1.jpg",
  "usuario": {
    "id": 25,
    "nombre": "Carlos"
  },
  "equipo": {
    "id": 5,
    "nombre": "Equipo Juvenil A"
  },
  "pagos": 10
}
```

---

#### GET /jugador
Obtiene una página de jugadores.

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "dorsal": 10,
      "posicion": "Delantero",
      "capitan": true,
      "imagen": "jugador1.jpg",
      "usuario": {
        "id": 25,
        "nombre": "Carlos"
      },
      "equipo": {
        "id": 5,
        "nombre": "Equipo Juvenil A"
      },
      "pagos": 10
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

#### POST /jugador
Crea un nuevo jugador.

**Request Body:**
```json
{
  "dorsal": 7,
  "posicion": "Centrocampista",
  "capitan": false,
  "imagen": "jugador2.jpg",
  "usuario": {
    "id": 30
  },
  "equipo": {
    "id": 5
  }
}
```

**Response 200:** Retorna el jugador creado

---

#### PUT /jugador
Actualiza un jugador existente.

---

#### DELETE /jugador/{id}
Elimina un jugador.

---

#### GET /jugador/fill/{cantidad}
Genera jugadores aleatorios.

---

#### DELETE /jugador/empty
Vacía todos los jugadores.

---

#### GET /jugador/count
Cuenta el total de jugadores.

---

## 8. Categorías

### Modelo de Datos: CategoriaEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| nombre | String | Not null, Size(4-255) | Nombre de la categoría |
| temporada | TemporadaEntity | Not null | Objeto de la temporada asociada |
| equipos | Integer | - | Cantidad de equipos en la categoría |

### Endpoints

#### GET /categoria/{id}
Obtiene una categoría por su ID.

**Response 200:**
```json
{
  "id": 1,
  "nombre": "Juvenil",
  "temporada": {
    "id": 2,
    "descripcion": "Temporada 2024/2025"
  },
  "equipos": 6
}
```

---

#### GET /categoria
Obtiene una página de categorías.

---

#### POST /categoria
Crea una nueva categoría.

**Request Body:**
```json
{
  "nombre": "Infantil",
  "temporada": {
    "id": 2
  }
}
```

---

#### PUT /categoria
Actualiza una categoría existente.

---

#### DELETE /categoria/{id}
Elimina una categoría.

---

#### GET /categoria/fill/{cantidad}
Genera categorías aleatorias.

---

#### DELETE /categoria/empty
Vacía todas las categorías.

---

#### GET /categoria/count
Cuenta el total de categorías.

---

## 9. Temporadas

### Modelo de Datos: TemporadaEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| descripcion | String | Not null, Size(1-256) | Descripción de la temporada |
| club | ClubEntity | Not null | Objeto del club asociado |
| categorias | Integer | - | Cantidad de categorías en la temporada |

### Endpoints

#### GET /temporada/{id}
Obtiene una temporada por su ID.

**Response 200:**
```json
{
  "id": 1,
  "descripcion": "Temporada 2023/2024",
  "club": {
    "id": 1,
    "nombre": "Club Deportivo"
  },
  "categorias": 8
}
```

---

#### GET /temporada
Obtiene una página de temporadas.

---

#### POST /temporada
Crea una nueva temporada.

**Request Body:**
```json
{
  "descripcion": "Temporada 2024/2025",
  "club": {
    "id": 1
  }
}
```

---

#### PUT /temporada
Actualiza una temporada existente.

---

#### DELETE /temporada/{id}
Elimina una temporada.

---

#### GET /temporada/fill/{cantidad}
Genera temporadas aleatorias.

---

#### DELETE /temporada/empty
Vacía todas las temporadas.

---

#### GET /temporada/count
Cuenta el total de temporadas.

---

## 10. Ligas

### Modelo de Datos: LigaEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| nombre | String | Not blank, Not null | Nombre de la liga |
| equipo | EquipoEntity | Not null | Objeto del equipo participante |
| partidos | Integer | - | Cantidad de partidos de la liga |

### Endpoints

#### GET /liga/{id}
Obtiene una liga por su ID.

**Response 200:**
```json
{
  "id": 1,
  "nombre": "Liga Provincial Juvenil",
  "equipo": {
    "id": 5,
    "nombre": "Equipo Juvenil A"
  },
  "partidos": 22
}
```

---

#### GET /liga
Obtiene una página de ligas con filtros opcionales.

**Parámetros de Query (opcionales):**
- `nombre` (String): Filtrar por nombre
- `idEquipo` (Long): Filtrar por equipo
- `page`, `size`, `sort`: Paginación

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "nombre": "Liga Provincial Juvenil",
      "equipo": {
        "id": 5,
        "nombre": "Equipo Juvenil A"
      },
      "partidos": 22
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

#### POST /liga
Crea una nueva liga.

**Request Body:**
```json
{
  "nombre": "Copa Federación",
  "equipo": {
    "id": 7
  }
}
```

---

#### PUT /liga
Actualiza una liga existente.

---

#### DELETE /liga/{id}
Elimina una liga.

---

#### GET /liga/fill/{cantidad}
Genera ligas aleatorias.

---

#### DELETE /liga/empty
Vacía todas las ligas.

---

#### GET /liga/count
Cuenta el total de ligas.

---

## 11. Partidos

### Modelo de Datos: PartidoEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| rival | String | Not null, Size(3-1024) | Nombre del equipo rival |
| liga | LigaEntity | Not null | Objeto de la liga donde se juega |
| local | Boolean | Not null | true si es local, false si es visitante |
| resultado | String | Not null, Size(3-1024) | Resultado del partido (ej: "2-1") |

### Endpoints

#### GET /partido/{id}
Obtiene un partido por su ID.

**Response 200:**
```json
{
  "id": 1,
  "rival": "CD Rival FC",
  "liga": {
    "id": 3,
    "nombre": "Liga Regional"
  },
  "local": true,
  "resultado": "3-1"
}
```

---

#### GET /partido
Obtiene una página de partidos.

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "rival": "CD Rival FC",
      "liga": {
        "id": 3,
        "nombre": "Liga Regional"
      },
      "local": true,
      "resultado": "3-1"
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

#### POST /partido
Crea un nuevo partido.

**Request Body:**
```json
{
  "rival": "UD Competidor",
  "liga": {
    "id": 3
  },
  "local": false,
  "resultado": "1-1"
}
```

---

#### PUT /partido
Actualiza un partido existente.

---

#### DELETE /partido/{id}
Elimina un partido.

---

#### GET /partido/fill/{cantidad}
Genera partidos aleatorios.

---

#### DELETE /partido/empty
Vacía todos los partidos.

---

#### GET /partido/count
Cuenta el total de partidos.

---

## 12. Noticias

### Modelo de Datos: NoticiaEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| titulo | String | Not null, Size(3-1024) | Título de la noticia |
| contenido | String | Not null, Size(min=3) | Contenido de la noticia |
| fecha | LocalDateTime | Not null, Format: yyyy-MM-dd HH:mm:ss | Fecha de publicación |
| imagen | byte[] | Nullable | Imagen de la noticia (BLOB) |
| club | ClubEntity | Not null | Objeto del club que publica |
| comentarios | Integer | - | Cantidad de comentarios de la noticia |
| puntuaciones | Integer | - | Cantidad de puntuaciones de la noticia |

### Endpoints

#### GET /noticia/{id}
Obtiene una noticia por su ID.

**Response 200:**
```json
{
  "id": 1,
  "titulo": "Victoria del equipo juvenil",
  "contenido": "El equipo juvenil consigue una gran victoria...",
  "fecha": "2024-01-15 18:30:00",
  "imagen": [...],
  "club": {
    "id": 1,
    "nombre": "CD Deportivo"
  },
  "comentarios": 15,
  "puntuaciones": 42
}
```

---

#### GET /noticia
Obtiene una página de noticias.

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "titulo": "Victoria del equipo juvenil",
      "contenido": "El equipo juvenil consigue una gran victoria...",
      "fecha": "2024-01-15 18:30:00",
      "imagen": [...],
      "club": {
        "id": 1,
        "nombre": "CD Deportivo"
      },
      "comentarios": 15,
      "puntuaciones": 42
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

#### POST /noticia
Crea una nueva noticia.

**Request Body:**
```json
{
  "titulo": "Fichaje estrella",
  "contenido": "El club ficha a un nuevo jugador...",
  "fecha": "2024-01-20 10:00:00",
  "imagen": [...],
  "club": {
    "id": 1
  }
}
```

---

#### PUT /noticia
Actualiza una noticia existente.

---

#### DELETE /noticia/{id}
Elimina una noticia.

---

#### GET /noticia/fill/{cantidad}
Genera noticias aleatorias.

---

#### DELETE /noticia/empty
Vacía todas las noticias.

---

#### GET /noticia/count
Cuenta el total de noticias.

---

## 13. Comentarios

### Modelo de Datos: ComentarioEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| contenido | String | Not null, Size(3-1024) | Contenido del comentario |
| noticia | NoticiaEntity | Not null | Objeto de la noticia comentada |
| usuario | UsuarioEntity | Not null | Objeto del usuario que comenta |

### Endpoints

#### GET /comentario/{id}
Obtiene un comentario por su ID.

**Response 200:**
```json
{
  "id": 1,
  "contenido": "Excelente partido, enhorabuena!",
  "noticia": {
    "id": 5,
    "titulo": "Victoria importante"
  },
  "usuario": {
    "id": 12,
    "nombre": "Juan"
  }
}
```

---

#### GET /comentario
Obtiene una página de comentarios.

**Parámetros de Query:**
- `page`, `size`, `sort`: Paginación (size por defecto: 1000)

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "contenido": "Excelente partido, enhorabuena!",
      "noticia": {
        "id": 5,
        "titulo": "Victoria importante"
      },
      "usuario": {
        "id": 12,
        "nombre": "Juan"
      }
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

#### POST /comentario
Crea un nuevo comentario.

**Request Body:**
```json
{
  "contenido": "Gran resultado del equipo!",
  "noticia": {
    "id": 5
  },
  "usuario": {
    "id": 15
  }
}
```

**Response 200:**
```json
1
```
(Retorna el ID del comentario creado)

---

#### PUT /comentario
Actualiza un comentario existente.

**Response 200:**
```json
1
```
(Retorna el ID del comentario actualizado)

---

#### DELETE /comentario/{id}
Elimina un comentario.

**Response 200:**
```json
1
```

---

#### GET /comentario/fill/{cantidad}
Genera comentarios aleatorios.

---

#### DELETE /comentario/empty
Vacía todos los comentarios.

---

#### GET /comentario/count
Cuenta el total de comentarios.

---

## 13.1 Comentarios de Artículos

### Modelo de Datos: ComentarioartEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| contenido | String | Not null, Size(3-1024) | Contenido del comentario |
| articulo | ArticuloEntity | Not null | Objeto del artículo comentado |
| usuario | UsuarioEntity | Not null | Objeto del usuario que comenta |

### Endpoints

#### GET /comentarioart/{id}
Obtiene un comentario de artículo por su ID.

**Response 200:**
```json
{
  "id": 1,
  "contenido": "Gran análisis del artículo, gracias!",
  "articulo": {
    "id": 3,
    "descripcion": "Camiseta oficial"
  },
  "usuario": {
    "id": 15,
    "nombre": "Pedro"
  }
}
```

---

#### GET /comentarioart
Obtiene una página de comentarios de artículos.

**Parámetros de Query:**
- `page`, `size`, `sort`: Paginación (size por defecto: 1000)

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "contenido": "Gran análisis del artículo, gracias!",
      "articulo": {
        "id": 3,
        "descripcion": "Camiseta oficial"
      },
      "usuario": {
        "id": 15,
        "nombre": "Pedro"
      }
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

#### POST /comentarioart
Crea un nuevo comentario de artículo.

**Request Body:**
```json
{
  "contenido": "Me ha gustado mucho este artículo",
  "articulo": {
    "id": 3
  },
  "usuario": {
    "id": 15
  }
}
```

**Response 200:**
```json
1
```
(Retorna el ID del comentario creado)

---

#### PUT /comentarioart
Actualiza un comentario de artículo existente.

**Request Body (ejemplo):**
```json
{
  "id": 1,
  "contenido": "Actualizado: una corrección en el comentario",
  "articulo": {
    "id": 3
  },
  "usuario": {
    "id": 15
  }
}
```

**Response 200:**
```json
1
```
(Retorna el ID del comentario actualizado)

---

#### DELETE /comentarioart/{id}
Elimina un comentario de artículo.

**Response 200:**
```json
1
```

---

#### GET /comentarioart/fill/{cantidad}
Genera comentarios de artículos aleatorios.

---

#### DELETE /comentarioart/empty
Vacía todos los comentarios de artículos.

---

#### GET /comentarioart/count
Cuenta el total de comentarios de artículos.

---

## 14. Puntuaciones

### Modelo de Datos: PuntuacionEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| puntuacion | Integer | Not null, Min(1), Max(5) | Puntuación de 1 a 5 estrellas |
| noticia | NoticiaEntity | Not null | Objeto de la noticia puntuada |
| usuario | UsuarioEntity | Not null | Objeto del usuario que puntúa |

### Endpoints

#### GET /puntuacion/{id}
Obtiene una puntuación por su ID.

**Response 200:**
```json
{
  "id": 1,
  "puntuacion": 5,
  "noticia": {
    "id": 8,
    "titulo": "Victoria importante"
  },
  "usuario": {
    "id": 20,
    "nombre": "Ana"
  }
}
```

---

#### GET /puntuacion
Obtiene una página de puntuaciones.

---

#### POST /puntuacion
Crea una nueva puntuación.

**Request Body:**
```json
{
  "puntuacion": 4,
  "noticia": {
    "id": 8
  },
  "usuario": {
    "id": 22
  }
}
```

**Validación:**
- `puntuacion` debe estar entre 1 y 5

---

#### PUT /puntuacion
Actualiza una puntuación existente.

---

#### DELETE /puntuacion/{id}
Elimina una puntuación.

---

#### GET /puntuacion/fill/{cantidad}
Genera puntuaciones aleatorias.

---

#### DELETE /puntuacion/empty
Vacía todas las puntuaciones.

---

#### GET /puntuacion/count
Cuenta el total de puntuaciones.

---

## 15. Artículos

### Modelo de Datos: ArticuloEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| descripcion | String | Not blank | Descripción del artículo |
| precio | BigDecimal | Not null | Precio del artículo |
| descuento | BigDecimal | Nullable | Descuento aplicable |
| imagen | byte[] | Nullable | Imagen del artículo (BLOB) |
| tipoarticulo | TipoarticuloEntity | Not null | Objeto del tipo de artículo |
| comentarioarts | Integer | - | Cantidad de comentarios del artículo |
| compras | Integer | - | Cantidad de compras del artículo |
| carritos | Integer | - | Cantidad de items en carritos del artículo |

### Endpoints

#### GET /articulo/{id}
Obtiene un artículo por su ID.

**Response 200:**
```json
{
  "id": 1,
  "descripcion": "Camiseta oficial temporada 2024",
  "precio": 49.99,
  "descuento": 5.00,
  "imagen": [...],
  "tipoarticulo": {
    "id": 2,
    "descripcion": "Equipación"
  },
  "comentarioarts": 8,
  "compras": 35,
  "carritos": 4
}
```

---

#### GET /articulo
Obtiene una página de artículos con filtros opcionales.

**Parámetros de Query (opcionales):**
- `descripcion` (String): Filtrar por descripción
- `idTipoarticulo` (Long): Filtrar por tipo de artículo
- `page`, `size`, `sort`: Paginación (size por defecto: 1000)

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "descripcion": "Camiseta oficial temporada 2024",
      "precio": 49.99,
      "descuento": 5.00,
      "imagen": [...],
      "tipoarticulo": {
        "id": 2,
        "descripcion": "Equipación"
      },
      "comentarioarts": 8,
      "compras": 35,
      "carritos": 4
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

#### POST /articulo
Crea un nuevo artículo.

**Request Body:**
```json
{
  "descripcion": "Pantalón corto oficial",
  "precio": 29.99,
  "descuento": 0,
  "imagen": [...],
  "tipoarticulo": {
    "id": 2
  }
}
```

---

#### PUT /articulo
Actualiza un artículo existente.

---

#### DELETE /articulo/{id}
Elimina un artículo.

---

#### GET /articulo/fill/{cantidad}
Genera artículos aleatorios.

---

#### GET /articulo/fill
Genera 50 artículos aleatorios por defecto.

**Response 200:**
```json
50
```

---

#### DELETE /articulo/empty
Vacía todos los artículos.

---

#### GET /articulo/count
Cuenta el total de artículos.

---

## 16. Tipos de Artículo

### Modelo de Datos: TipoarticuloEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| descripcion | String | Not blank, Not null | Descripción del tipo |
| club | ClubEntity | Not null | Objeto del club asociado |
| articulos | Integer | - | Cantidad de artículos de este tipo |

### Endpoints

#### GET /tipoarticulo/{id}
Obtiene un tipo de artículo por su ID.

**Response 200:**
```json
{
  "id": 1,
  "descripcion": "Equipamiento",
  "club": {
    "id": 1,
    "nombre": "Club Deportivo"
  },
  "articulos": 15
}
```

---

#### GET /tipoarticulo
Obtiene una página de tipos de artículo con filtros opcionales.

**Parámetros de Query (opcionales):**
- `descripcion` (String): Filtrar por descripción
 
- `page`, `size`, `sort`: Paginación (size por defecto: 1000)

---

#### POST /tipoarticulo
Crea un nuevo tipo de artículo.

**Request Body:**
```json
{
  "descripcion": "Merchandising",
  "club": {
    "id": 1
  }
}
```

---

#### PUT /tipoarticulo
Actualiza un tipo de artículo existente.

---

#### DELETE /tipoarticulo/{id}
Elimina un tipo de artículo.

---

#### GET /tipoarticulo/fill/{cantidad}
Genera tipos de artículo aleatorios.

---

#### DELETE /tipoarticulo/empty
Vacía todos los tipos de artículo.

---

#### GET /tipoarticulo/count
Cuenta el total de tipos de artículo.

---

## 17. Carrito

### Modelo de Datos: CarritoEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| cantidad | Integer | Not null | Cantidad de artículos |
| articulo | ArticuloEntity | Not null | Objeto del artículo en el carrito |
| usuario | UsuarioEntity | Not null | Objeto del usuario propietario |

### Endpoints

#### GET /carrito/{id}
Obtiene un item del carrito por su ID.

**Response 200:**
```json
{
  "id": 1,
  "cantidad": 2,
  "articulo": {
    "id": 5,
    "descripcion": "Camiseta oficial"
  },
  "usuario": {
    "id": 10,
    "nombre": "Pedro",
    "username": "psanchez"
  }
}
```

---

#### GET /carrito
Obtiene una página de items del carrito.

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "cantidad": 2,
      "articulo": {
        "id": 5,
        "descripcion": "Camiseta"
      },
      "usuario": {
        "id": 10,
        "nombre": "Juan"
      }
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

#### POST /carrito
Añade un artículo al carrito.

**Request Body:**
```json
{
  "cantidad": 1,
  "articulo": {
    "id": 7
  },
  "usuario": {
    "id": 10
  }
}
```

---

#### PUT /carrito
Actualiza la cantidad de un item en el carrito.

---

#### DELETE /carrito/{id}
Elimina un item del carrito.

---

#### GET /carrito/fill/{cantidad}
Genera items aleatorios en carritos.

---

#### DELETE /carrito/empty
Vacía todos los carritos.

---

#### GET /carrito/count
Cuenta el total de items en carritos.

---

## 18. Facturas

### Modelo de Datos: FacturaEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| fecha | LocalDateTime | Not null, Format: yyyy-MM-dd HH:mm:ss | Fecha de emisión |
| usuario | UsuarioEntity | Not null | Objeto del usuario que realiza la compra |
| compras | Integer | - | Cantidad de compras en la factura |

### Endpoints

#### GET /factura/{id}
Obtiene una factura por su ID.

**Response 200:**
```json
{
  "id": 1,
  "fecha": "2024-01-15 16:30:00",
  "usuario": {
    "id": 10,
    "nombre": "Juan"
  },
  "compras": 3
}
```

---

#### GET /factura
Obtiene una página de facturas.

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "fecha": "2024-01-15 16:30:00",
      "usuario": {
        "id": 10,
        "nombre": "Juan"
      },
      "compras": 3
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

#### POST /factura
Crea una nueva factura.

**Request Body:**
```json
{
  "fecha": "2024-01-20 12:00:00",
  "usuario": {
    "id": 15
  }
}
```

---

#### PUT /factura
Actualiza una factura existente.

---

#### DELETE /factura/{id}
Elimina una factura.

---

#### GET /factura/fill/{cantidad}
Genera facturas aleatorias.

---

#### DELETE /factura/empty
Vacía todas las facturas.

---

#### GET /factura/count
Cuenta el total de facturas.

---

## 19. Compras

### Modelo de Datos: CompraEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| cantidad | Integer | Not null | Cantidad comprada |
| precio | BigDecimal | Not null | Precio unitario en el momento de compra |
| articulo | ArticuloEntity | Not null | Objeto del artículo comprado |
| factura | FacturaEntity | Not null | Objeto de la factura asociada |

### Endpoints

#### GET /compra/{id}
Obtiene una compra por su ID.

**Response 200:**
```json
{
  "id": 1,
  "cantidad": 2,
  "precio": 49.99,
  "articulo": {
    "id": 3,
    "descripcion": "Camiseta oficial"
  },
  "factura": {
    "id": 5
  }
}
```

---

#### GET /compra
Obtiene una página de compras.

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "cantidad": 2,
      "precio": 49.99,
      "articulo": {
        "id": 3,
        "descripcion": "Camiseta oficial"
      },
      "factura": {
        "id": 5
      }
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

#### POST /compra
Crea una nueva compra (línea de factura).

**Request Body:**
```json
{
  "cantidad": 1,
  "precio": 29.99,
  "articulo": {
    "id": 7
  },
  "factura": {
    "id": 5
  }
}
```

---

#### PUT /compra
Actualiza una compra existente.

---

#### DELETE /compra/{id}
Elimina una compra.

---

#### GET /compra/fill/{cantidad}
Genera compras aleatorias.

---

#### DELETE /compra/empty
Vacía todas las compras.

---

#### GET /compra/count
Cuenta el total de compras.

---

## 20. Cuotas

### Modelo de Datos: CuotaEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| descripcion | String | Not null, Size(max=255) | Descripción de la cuota |
| cantidad | BigDecimal | Not null | Importe de la cuota |
| fecha | LocalDateTime | Not null, Format: yyyy-MM-dd HH:mm:ss | Fecha de vencimiento |
| equipo | EquipoEntity | Not null | Objeto del equipo al que pertenece |
| pagos | Integer | - | Cantidad de pagos realizados para esta cuota |

### Endpoints

#### GET /cuota/{id}
Obtiene una cuota por su ID.

**Response 200:**
```json
{
  "id": 1,
  "descripcion": "Cuota mensual Enero 2024",
  "cantidad": 30.00,
  "fecha": "2024-01-31 23:59:59",
  "equipo": {
    "id": 5,
    "nombre": "Equipo Juvenil A"
  },
  "pagos": 15
}
```

---

#### GET /cuota
Obtiene una página de cuotas.

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "descripcion": "Cuota mensual Enero 2024",
      "cantidad": 30.00,
      "fecha": "2024-01-31 23:59:59",
      "equipo": {
        "id": 5,
        "nombre": "Equipo Juvenil A"
      },
      "pagos": 15
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

#### POST /cuota
Crea una nueva cuota.

**Request Body:**
```json
{
  "descripcion": "Cuota mensual Febrero 2024",
  "cantidad": 30.00,
  "fecha": "2024-02-29 23:59:59",
  "equipo": {
    "id": 5
  }
}
```

---

#### PUT /cuota
Actualiza una cuota existente.

---

#### DELETE /cuota/{id}
Elimina una cuota.

---

#### GET /cuota/fill/{cantidad}
Genera cuotas aleatorias.

---

#### DELETE /cuota/empty
Vacía todas las cuotas.

---

#### GET /cuota/count
Cuenta el total de cuotas.

---

## 21. Pagos

### Modelo de Datos: PagoEntity

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Long | Auto-generado | Identificador único |
| cuota | CuotaEntity | Not null | Objeto de la cuota pagada |
| jugador | JugadorEntity | Not null | Objeto del jugador que paga |
| abonado | Integer | Not null | Estado del pago (0: pendiente, 1: pagado) |
| fecha | LocalDateTime | Not null, Format: yyyy-MM-dd HH:mm:ss | Fecha del pago |

### Endpoints

#### GET /pago/{id}
Obtiene un pago por su ID.

**Response 200:**
```json
{
  "id": 1,
  "cuota": {
    "id": 8
  },
  "jugador": {
    "id": 12
  },
  "abonado": 1,
  "fecha": "2024-01-10 10:30:00"
}
```

---

#### GET /pago
Obtiene una página de pagos.

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "cuota": {
        "id": 8
      },
      "jugador": {
        "id": 12
      },
      "abonado": 1,
      "fecha": "2024-01-10 10:30:00"
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

#### POST /pago
Registra un nuevo pago.

**Request Body:**
```json
{
  "cuota": {
    "id": 9
  },
  "jugador": {
    "id": 15
  },
  "abonado": 1,
  "fecha": "2024-01-15 14:00:00"
}
```

---

#### PUT /pago
Actualiza un pago existente.

---

#### DELETE /pago/{id}
Elimina un pago.

---

#### GET /pago/fill/{cantidad}
Genera pagos aleatorios.

---

#### DELETE /pago/empty
Vacía todos los pagos.

---

#### GET /pago/count
Cuenta el total de pagos.

---

## Diagrama de Relaciones entre Entidades

```
Club
  ├── Temporada
  ├── Tipoarticulo
  ├── Usuario
  └── Noticia

Usuario
  ├── Tipousuario
  ├── Rolusuario
  ├── Club
  ├── Jugador
  ├── Carrito
  ├── Factura
  ├── Comentario
  ├── Comentarioart
  └── Puntuacion

Equipo
  ├── Usuario (entrenador)
  ├── Categoria
  ├── Liga
  ├── Jugador
  └── Cuota

Jugador
  ├── Usuario
  ├── Equipo
  └── Pago

Temporada
  ├── Club
  └── Categoria

Categoria
  ├── Temporada
  └── Equipo

Liga
  ├── Equipo
  └── Partido

Partido
  └── Liga

Noticia
  ├── Club
  ├── Comentario
  └── Puntuacion

Articulo
  ├── Tipoarticulo
  ├── Comentarioart
  ├── Carrito
  └── Compra

Tipoarticulo
  ├── Club
  └── Articulo

Factura
  ├── Usuario
  └── Compra

Compra
  ├── Articulo
  └── Factura

Carrito
  ├── Usuario
  └── Articulo

Cuota
  ├── Equipo
  └── Pago

Pago
  ├── Cuota
  └── Jugador

Tipousuario
  └── Usuario

Rolusuario
  └── Usuario

Comentario
  ├── Noticia
  └── Usuario

Comentarioart
  ├── Articulo
  └── Usuario

Puntuacion
  ├── Noticia
  └── Usuario
```

---

## Códigos de Estado HTTP Comunes

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos de entrada inválidos |
| 401 | Unauthorized | Autenticación fallida o token inválido |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto (ej: username duplicado) |
| 500 | Internal Server Error | Error interno del servidor |

---

## Paginación

Todos los endpoints que retornan listas soportan paginación con los siguientes parámetros de query:

- `page`: Número de página (comienza en 0)
- `size`: Cantidad de elementos por página (por defecto: variable según endpoint)
- `sort`: Campo por el cual ordenar, formato: `campo,asc` o `campo,desc`

**Ejemplo:**
```
GET /usuario?page=0&size=20&sort=nombre,asc
```

**Respuesta:**
```json
{
  "content": [...],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": {
      "sorted": true,
      "unsorted": false
    }
  },
  "totalElements": 100,
  "totalPages": 5,
  "last": false,
  "first": true,
  "numberOfElements": 20
}
```

---

## Formato de Fechas

Todas las fechas utilizan el formato: `yyyy-MM-dd HH:mm:ss`

**Ejemplo:**
```
2024-01-20 14:30:00
```

---

## Notas de Implementación

1. **Autenticación**: Se utiliza JWT (JSON Web Tokens) para la autenticación.
2. **Imágenes**: Se almacenan como BLOB (byte arrays) en la base de datos.
3. **Contraseñas**: Se almacenan hasheadas, típicamente con BCrypt.
4. **CORS**: Configurado para aceptar peticiones desde cualquier origen durante desarrollo.
5. **Endpoints de Testing**: Los endpoints `/fill` y `/empty` están diseñados para facilitar el testing y no deberían estar disponibles en producción.

---

## Ejemplos de Uso

### Autenticación y Uso del Token

```bash
# 1. Login
curl -X POST http://localhost:8089/session/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Respuesta: {"token":"eyJhbGc..."}

# 2. Usar el token en peticiones subsiguientes
curl -X GET http://localhost:8089/usuario/1 \
  -H "Authorization: Bearer eyJhbGc..."
```

### Crear un Usuario Completo

```bash
curl -X POST http://localhost:8089/usuario \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Pedro",
    "apellido1": "Sánchez",
    "apellido2": "Martín",
    "username": "psanchez",
    "password": "password123",
    "fechaAlta": "2024-01-20 10:00:00",
    "genero": 1,
    "tipousuario": {"id": 3},
    "rolusuario": {"id": 2},
    "club": {"id": 1}
  }'
```

### Filtrar Artículos por Tipo

```bash
curl -X GET "http://localhost:8089/articulo?tipoarticulo=1&page=0&size=10"
```

### Añadir Artículo al Carrito

```bash
curl -X POST http://localhost:8089/carrito \
  -H "Content-Type: application/json" \
  -d '{
    "cantidad": 2,
    "articulo": {"id": 5},
    "usuario": {"id": 10}
  }'
```

---

## Versión

**Versión de la API**: 1.0  
**Última actualización**: Enero 2026  
**Framework**: Spring Boot  
**Base de datos**: MySQL
