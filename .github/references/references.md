# Creación de Ficheros de referencia

Usa estas instrucciones simpre que tengas que crear ficheros de referencia en .github/references para modelos de inteligencia artificial.

Los ficheros de referencia deben cumplir las siguientes normas:

* siempre deben estar en formato markdown y extensión "md"
* no introduzcas tablas, es más legible usar listas y sublistas (cada fila un item de lista) ordenadas o no ordenadas.
* se minucioso e intenta cubrir todos los posibles aspectos y preveer posibles complicaciones del tema a normativizar
* asegurate de que el fichero queda enlazado desde .github/copilot-instructions.md para que pueda ser encontrado por los modelos
* siempre que se modifica el código debes actualizar los fichero de referencias afectados por los cambios de código

## Ficheros de referencia existentes

- `api.md` — endpoints de la API REST del backend.
- `backend.md` — estructura del proyecto backend Spring Boot.
- `database.md` — entidades, atributos y relaciones de la base de datos.
- `diseño-1.md` — diseño UI para el perfil Administrador (tipousuario id=1).
- `diseño-2.md` — diseño UI para el perfil Administrador de club (tipousuario id=2).
- `diseño-3.md` — diseño UI para el perfil Usuario (tipousuario id=3).
- `entidades.md` — entidades y sus expansiones en el backend.
- `error.md` — gestión de errores: excepciones del backend, códigos HTTP, ExceptionBean, y manejo en el frontend (JWTInterceptor, LoginComponent, NotificacionService).
- `frontend.md` — estructura del proyecto frontend Angular.
- `integridad.md` — restricciones de integridad referencial.
- `permisos.md` — gestión de permisos para tipos de usuario.
- `references.md` — este fichero, guía para crear y mantener ficheros de referencia.
- `roles.md` — roles y permisos para tipos de usuario.