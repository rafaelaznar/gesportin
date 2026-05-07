# Reference Guide

## Description of the Gesportín project

Gesportín es una aplicación de gestión deportiva diseñada para optimizar la administración de clubes y organizaciones deportivas.

Gesportín tiene como objetivo mejorar la eficiencia de la gestión deportiva, facilitando la colaboración y manteniendo informados a los miembros de los clubes sobre sus clubes.

Gesportín proporciona una plataforma integral para gestionar diversos aspectos de las actividades deportivas:

- gestión de clubes,
- la gestión de miembros de los clubes: presidente, secretario, entrenador, jugador, etc.
- gestión de pagos y cuotas de los miembros de los clubes
- gestión de eventos deportivos: programación y seguimiento de partidos
- comunicación de noticias e interacción informativa con los miembros del club
- venta a nivel de club de productos relacionados con el deporte, como equipamiento deportivo, ropa deportiva, etc.

La aplicación Gesportín está construida utilizando una tecnología moderna, que incluye:

- una base de datos relacional (MySQL) para almacenar y gestionar los datos de la aplicación, cuyo archivo de creación está situado en /.github/database.sql,
- una API de backend desarrollada en java con Spring Boot, que accede a la base de datos relacional para almacenar y gestionar los datos de la aplicación, situada en el directorio /gesportin,
- una interfaz de usuario frontend desarrollada en Angular y typescript, situada en el directorio /frontsportin.

### Compilación y ejecución del backend

Para compilar el backend, es necesario tener instalado Java y Maven. Luego, se puede ejecutar el siguiente comando en la terminal desde el directorio raíz del proyecto:

```bash
mvn clean install
```

Para ejecutar el backend, se puede ejecutar el siguiente comando en la terminal desde el directorio raíz del proyecto:

```bash
mvn spring-boot:run
```

El punto de entrada (main) para ejecutar el backend es la clase `GesportinApplication` situada en /gesportin/src/main/java/net/ausiasmarch/gesportin/GesportinApplication.java

NOTA: Recuerda que tras clonar el proyecto, es necesario ejecutar `mvn clean install` en el directorio del backend para instalar las dependencias necesarias antes de compilarlo.

Por defecto el backend se ejecuta en el puerto 8080, Según se especifica en el fichero application.properties, situado en /gesportin/src/main/resources/application.properties, modificando la propiedad `server.port`.

### Compilación y ejecución del frontend

Para compilar el frontend, es necesario tener instalado Node.js y Angular CLI. Luego, se puede ejecutar el siguiente comando en la terminal desde el directorio raíz del proyecto:

```bash
ng build
```

Para ejecutar el frontend, se puede ejecutar el siguiente comando en la terminal desde el directorio raíz del proyecto:

```bash
ng serve
```

NOTA: Recuerda que tras clonar el proyecto, es necesario ejecutar `npm install` en el directorio del frontend para instalar las dependencias necesarias antes de compilarlo.

Por defecto el frontend se ejecuta en el puerto 4200, Según se especifica en el fichero angular.json, situado en /frontsportin/angular.json, en la propiedad `serve.options.port`.

### Entorno de ejecución de la base de datos

Para ejecutar la base de datos, se usa MySQL. Normalmente la base de datos se ejecuta en un contenedor Docker, que se puede encontrar en los siguientes directorios, dependiendo de las preferencias de cada desarrollador:
- ~/docker-compose-lamp-master
- ~/Docker/docker-compose-lamp-master
Dentro de estos directorios hay un fichero .env y un fichero docker-compose.yml que se puede ejecutar con el siguiente comando en la terminal:

```bash
docker-compose up -d
```

Normalmente la base de datos se ejecuta en el puerto 3306, con el nombre de usuario "root" y la contraseña "tiger", según se especifica en el fichero .env, modificando las variables `MYSQL_ROOT_PASSWORD` y `HOST_MACHINE_MYSQL_PORT`.

El nombre de la base de datos es "gesportin".

### Security

En todas las modificaciones y adiciones de código, debes garantizar que el proyecto Gesportín implemente medidas de seguridad efectivas para proteger los datos y garantizar la integridad de los datos de la aplicación.

El proyecto usa tokens JWT para la autenticación y autorización de usuarios. Es importante asegurarse de que los tokens JWT se generen y validen correctamente, y que se implementen medidas de seguridad adecuadas para proteger los tokens JWT contra ataques como el robo de tokens o la manipulación de tokens.

Asmismo, es importante implementar medidas de seguridad adecuadas para garantizar la integridad de los datos de la aplicación. Esto incluye:
* la implementación de validaciones de entrada para evitar ataques de inyección de SQL o ataques de inyección de código, sobretodo en el servidor, pero tambien en el frontend, para evitar que los usuarios puedan introducir datos maliciosos que puedan comprometer la seguridad de la aplicación,
* el cumplimineto de restricciones de integridad referencial para asegurar que los datos estén relacionados correctamente
* la implementación de permisos adecuados para garantizar que los usuarios solo puedan acceder a los datos y funcionalidades que les correspondan según su tipo de usuario (tipousuario id=1,2,3).

### Shared files 

En las adiciones y modificaciones del código NO debes tocar los ficheros compartidos de entorno servidor y entorno cliente ya que estos ficheros son utilizados por el equipo de desarrollo para configurar el entorno de ejecución del backend y del frontend, y cualquier cambio en estos ficheros podría afectar a todos los desarrolladores. Cuando desees modificar la configuración del entorno de ejecución, debes comunicarlo al equipo de desarrollo para tomar una decisión conjunta sobre cómo proceder. Los archivos que no debes modificar son los siguientes:
- entorno servidor:
  - /docker-compose-lamp-master/.env
  - /docker-compose-lamp-master/docker-compose.yml
  - /Docker/docker-compose-lamp-master/.env
  - /Docker/docker-compose-lamp-master/docker-compose.yml
  - /gesportin/src/main/java/net/ausiasmarch/gesportin/GesportinApplication.java
  - /gesportin/src/main/resources/application.properties
  - /gesportin/pom.xml
- entorno cliente:
  - /frontsportin/angular.json
  - /frontsportin/package.json
  - /frontsportin/package-lock.json
  - /frontsportin/tsconfig.json
  - /frontsportin/tsconfig.app.json
  - /frontsportin/tsconfig.spec.json
- Ficheros compartidos:
  - /README.md
  - /.github/copilot-instructions.md
  - /.github/references/*.md

### Git & Github workflow

El flujo de trabajo de Git y Github debes dejarlo en manos de los desarrolladores.

## Detailed Guidance

Load the detailed guidance based on on context:

### Estructura de la API

- Reference: [references/api.md](references/api.md)
- Load When: Cuando necesites saber sobre los endpoints de la API de backend.

### Estructura backend

- Reference: [references/backend.md](references/backend.md)
- Load When: Siempre que tengas que desarrollar o modificar código en el backend.

### Estructura de la base de datos

- Reference: [references/database.md](references/database.md)
- Load When: Cuando necesites saber sobre entidades, atributos y relaciones en la base de datos.

### Diseño de UI para el perfil Administrador

- Reference: [references/diseño-1.md](references/diseño-1.md)
- Load When: Siempre que tengas que desarrollar o modificar páginas o vistas (plist, detail, form) del perfil Administrador (tipousuario id=1) en el frontend, para mantener el diseño unificado de la aplicación.

### Diseño de UI para el perfil Administrador de club

- Reference: [references/diseño-2.md](references/diseño-2.md)
- Load When: Siempre que tengas que desarrollar o modificar páginas o vistas (plist, detail, form) del perfil Administrador de club (tipousuario id=2) en el frontend, para mantener el diseño unificado de la aplicación.

### Diseño de UI para el perfil Usuario

- Reference: [references/diseño-3.md](references/diseño-3.md)
- Load When: Siempre que tengas que desarrollar o modificar páginas o vistas (plist, detail, form) del perfil Usuario (tipousuario id=3) en el frontend, para mantener el diseño unificado de la aplicación.

### Estructura entidades

- Reference: [references/entidades.md](references/entidades.md)
- Load When: Cuando necesites saber sobre las entidades y sus expansiones en el backend.

### Estructura frontend

- Reference: [references/frontend.md](references/frontend.md)
- Load When: Siempre que tengas que desarrollar o modificar código en el frontend.

### Restricciones de integridad referencial para datos

- Reference: [references/integridad.md](references/integridad.md)
- Load When: Siempre que tengas que llenar o corregir datos en la base de datos o crear o modificar código que involucre estas restricciones, especialmente para asegurar la integridad referencial.

### Gestión de permisos

- Reference: [references/permisos.md](references/permisos.md)
- Load When: Cuando tengas que tomar decisones sobre permisos para tipos de usuarios (tipousuario id=1,2,3).

### Fichero de referencia

- Reference: [references/references.md](references/references.md)
- Load When: Siempre que tengas que desarrollar o modificar ficheros de referencia para modelos de inteligencia artificial en .github/references.

### Gestión de permisos

- Reference: [references/roles.md](references/roles.md)
- Load When: Cuando tengas que tomar decisones sobre permisos para tipos de usuarios (tipousuario id=1,2,3).


