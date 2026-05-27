# Gesportín

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

Actualmente la aplicación se está utilizando en la formación de desarrolladores.

## Puesta en marcha local

### Base de datos

La base de datos local no se sube a GitHub. Cada persona que clone el proyecto debe tener MySQL arrancado y crear/importar la base de datos usando:

```powershell
.github/database.sql
```

La configuracion del backend debe apuntar a esa base de datos local. Por defecto el proyecto espera MySQL en `localhost:3306` y la base de datos `gesportin`.

### Backend

Desde la carpeta del backend:

```powershell
cd gesportin
mvn spring-boot:run
```

El backend arranca en `http://localhost:8089`.

### Emails reales

La configuracion SMTP esta definida directamente en `gesportin/src/main/resources/application.properties` para facilitar las pruebas en distintos ordenadores.

En Gmail, la contrasena configurada debe ser una contrasena de aplicacion, no la contrasena normal de la cuenta.

### Frontend

Desde la carpeta del frontend:

```powershell
cd frontsportin
npm install
npm start
```

El frontend arranca normalmente en `http://localhost:4200`.

## Licencia

License MIT
