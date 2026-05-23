# Reference Guide

Gesportín es una aplicación de gestión deportiva con backend Spring Boot, frontend Angular y base de datos MySQL. Antes de cambiar código, usa la documentación del repo como fuente principal y evita duplicar aquí contenido que ya vive en otro sitio.

Lee primero:

- [README.md](../README.md)
- [backend.md](references/backend.md)
- [frontend.md](references/frontend.md)
- [api.md](references/api.md)
- [database.md](references/database.md)
- [entidades.md](references/entidades.md)
- [integridad.md](references/integridad.md)
- [permisos.md](references/permisos.md)
- [roles.md](references/roles.md)
- [diseño-1.md](references/diseño-1.md), [diseño-2.md](references/diseño-2.md) y [diseño-3.md](references/diseño-3.md) cuando toques UI por perfil

Límites que debes respetar:

- No modifiques archivos compartidos de entorno, arranque o configuración salvo petición explícita y acuerdo del equipo. Eso incluye los ficheros listados en este repositorio como sensibles para servidor, cliente y documentación compartida.
- Mantén JWT, guards, validación de entrada e integridad referencial intactos.
- Haz cambios pequeños y locales. Si existe una implementación cercana en el mismo módulo, sigue ese patrón antes de inventar uno nuevo.
- No copies aquí reglas largas que ya están documentadas; enlaza la referencia correspondiente.

Backend:

- Sigue la estructura y convenciones de [backend.md](references/backend.md).
- Revisa [api.md](references/api.md) y [database.md](references/database.md) antes de tocar contratos entre API y datos.
- Prioriza seguridad, permisos por rol y validaciones de entrada.

Frontend:

- Sigue la estructura y convenciones de [frontend.md](references/frontend.md).
- Para pantallas por perfil, respeta el documento de diseño correspondiente antes de cambiar layouts o componentes.
- Mantén guards, interceptor JWT y formularios reactivos alineados con el patrón existente.

Comandos habituales:

- Backend: `mvn clean install` y `mvn spring-boot:run` desde la raíz del módulo backend.
- Frontend: `npm install` dentro de `frontsportin`, y después `npm start`, `npm run build` o `npm test` según corresponda.

Si una tarea cruza frontend y backend, valida primero el contrato de datos y el impacto en seguridad antes de editar la UI.
