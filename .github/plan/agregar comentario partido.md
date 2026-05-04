# Plan: Agregar Comentario de Partido

## Objetivo
Añadir un campo `comentario` al partido, editable únicamente por:
- Tipousuario=1 (Administrador general) — acceso total
- Tipousuario=2 (Administrador de club / Entrenador) — del mismo club del partido

## Configuración
- **Campo**: `comentario` (TEXT NULL, sin límite estricto)
- **Editable en**: Formularios admin y teamadmin
- **Visible en**: Detail view (admin y teamadmin), formularios
- **NO visible en**: Plist (demasiado largo para columna de tabla)
- **Permisos**: Tipousuario=1 acceso total; Tipousuario=2 mismo club; Tipousuario=3 denegado

## Fase 1: Base de Datos

### SQL (requisito previo — ejecutar manualmente)
```sql
ALTER TABLE partido ADD COLUMN comentario TEXT NULL;
```

Se debe actualizar el script de creación de la tabla `partido` en `database.sql` para incluir esta columna, asegurando que futuras instalaciones también la tengan.

---

## Fase 2: Backend

### 1. PartidoEntity.java
**Localización**: `gesportin/src/main/java/net/ausiasmarch/gesportin/entity/PartidoEntity.java`

**Cambio**: Añadir campo después de `lugar`:
```java
private String comentario;
```

**Anotaciones**: Ninguna (`@NotNull`, `@Size`, etc.). Campo nullable.

---

### 2. PartidoService.java
**Localización**: `gesportin/src/main/java/net/ausiasmarch/gesportin/service/PartidoService.java`

**Cambio**: En método `update()`, después de la línea que copia `lugar`, añadir:
```java
oPartidoExistente.setComentario(oPartidoEntity.getComentario());
```

**Contexto**: La línea se añade en el bloque de copia de campos (después de `setLugar()`, antes del `save()`).

**Permisos**: Ya cubiertos por el flujo existente de `update()` (verifica tipousuario y club automáticamente).

---

## Fase 3: Frontend

### 3. Model: model/partido.ts
**Localización**: `frontsportin/src/app/model/partido.ts`

**Cambio**: Añadir campo opcional a la interfaz `IPartido`:
```typescript
comentario?: string;
```

---

### 4. Admin Form: component/partido/admin/form/form.ts
**Localización**: `frontsportin/src/app/component/partido/admin/form/form.ts`

**Cambio en FormGroup**:
```typescript
comentario: [''],
```

**Contexto**: Se añade al objeto de inicialización del FormGroup, después de `id_estadopartido`.

---

### 5. Admin Form HTML: component/partido/admin/form/form.html
**Localización**: `frontsportin/src/app/component/partido/admin/form/form.html`

**Cambio**: Añadir sección textarea antes del botón de submit. Patrón (seguir estructura de noticia):
```html
<div class="mb-3">
  <label for="comentario" class="form-label">Comentario</label>
  <textarea
    class="form-control"
    id="comentario"
    rows="4"
    [class.is-invalid]="comentario?.invalid && comentario?.touched"
    [class.is-valid]="comentario?.valid && comentario?.touched"
    formControlName="comentario"
    placeholder="Añade un comentario sobre el partido (opcional)"
  ></textarea>
  <div class="invalid-feedback" *ngIf="comentario?.invalid && comentario?.touched">
    El comentario no es válido.
  </div>
</div>
```

**Variable helper** (ya debe existir en TS):
```typescript
get comentario() {
  return this.formulario.get('comentario');
}
```

---

### 6. Admin Detail: component/partido/admin/detail/detail.html
**Localización**: `frontsportin/src/app/component/partido/admin/detail/detail.html`

**Cambio**: Añadir bloque para mostrar comentario (después del campo `lugar`, antes de las tarjetas anidadas):
```html
<div class="card-text" *ngIf="oPartido()?.comentario">
  <strong>Comentario:</strong>
  <p class="mt-2">{{ oPartido()?.comentario }}</p>
</div>
```

**Contexto**: Se añade dentro del `<div class="card-body">` principal, entre los campos de Lugar y Liga.

---

### 7. Teamadmin Form: component/partido/teamadmin/form/form.ts
**Localización**: `frontsportin/src/app/component/partido/teamadmin/form/form.ts`

**Cambio**: Idéntico al admin form. Añadir:
```typescript
comentario: [''],
```
al FormGroup (mismo patrón, mismo getter helper si no existe).

---

### 8. Teamadmin Form HTML: component/partido/teamadmin/form/form.html
**Localización**: `frontsportin/src/app/component/partido/teamadmin/form/form.html`

**Cambio**: Idéntico al admin form HTML. Añadir el mismo bloque `<div class="mb-3">` con textarea.

---

### 9. Teamadmin Detail: component/partido/teamadmin/detail/detail.html
**Localización**: `frontsportin/src/app/component/partido/teamadmin/detail/detail.html`

**Cambio**: Idéntico al admin detail. Añadir el mismo bloque con `*ngIf` para mostrar `comentario`.

---

## Fase 4: Referencia (Documentación)

### 10. database.md
**Localización**: `.github/references/database.md`

**Cambio**: En la sección de tabla `partido`, añadir fila a la tabla de campos:
```
| comentario | TEXT NULL | Optional comment on the match |
```

**Contexto**: Se añade después de la fila `lugar`.

---

### 11. api.md
**Localización**: `.github/references/api.md`

**Cambio**: En la sección del recurso `Partido`, añadir campo a la lista:
```
| comentario | TEXT | Optional; readable/editable by admin or club admin of the same club |
```

---

### 12. entidades.md
**Localización**: `.github/references/entidades.md`

**Cambio**: Anotar que `partido` tiene un campo escalar adicional `comentario` (TEXT, optional).

**Contexto**: En la sección de `partido`, añadir nota sobre el nuevo campo.

---

### 13. permisos.md
**Localización**: `.github/references/permisos.md`

**Cambio**: En la sección de permisos de `Administrador de club`, o en la sección general de partido, añadir:
```
- **Comentario de partido** (editable por Administrador y Administrador de club del mismo club)
```

---

## Validación

1. **Backend**: `mvn clean package` — sin errores de compilación
2. **Frontend**: `ng build` — sin errores
3. **Manual — Tipousuario=1**:
   - Ir a `/partido/edit/{id}`
   - Rellenar comentario
   - Guardar
   - Ir a `/partido/view/{id}` → comentario visible
4. **Manual — Tipousuario=2 (Club A)**:
   - Editar partido de Club A → comentario se guarda ✓
   - Intenta editar partido de Club B → 401 Unauthorized ✓
5. **Manual — Tipousuario=3**:
   - GET `/partido/{id}` → puede ver comentario ✓
   - PUT `/partido/{id}` → 401 Unauthorized ✓

---

## Notas

- El campo `comentario` NO requiere nuevo endpoint; se integra en el flujo `PUT /partido` existente
- El entrenador (`equipo.id_entrenador`) ya es tipousuario=2 por restricción de integridad referencial → cubierto automáticamente
- El plist de partido NO se modifica; el comentario es demasiado largo para mostrar en una columna de tabla
- Colspan/styling en detail NO requiere cambio especial — es un párrafo normal
- Si en el futuro se desea: agregar un endpoint GET separado para comentarios, historial de ediciones, o notificaciones — serían features adicionales posteriores
