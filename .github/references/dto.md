# DTO y DTOConverter — Gesportin

## Propósito

Los DTO (*Data Transfer Objects*) resuelven el problema de serializar colecciones `@OneToMany` con fetch `LAZY`. Como las colecciones no se inicializan al cargar la entidad padre, la serialización directa produciría `null` o error. En lugar de eso, los DTO exponen **contadores enteros** calculados mediante consultas explícitas en el repositorio, manteniendo la paginación eficiente.

## Patrón general

```
Entity (JPA)  →  Converter (@Component)  →  DTO (extends Entity)
                 inyecta Repository         añade campos contador
                 llama queries de conteo
```

## DTO

- Extienden la entidad correspondiente (`extends XxxEntity`).
- Añaden campos `int` para cada contador de colección (`private int xxx;`).
- Tienen constructor que recibe la entidad y los contadores, copia los campos de la entidad con los setters heredados y asigna los contadores.
- Usan Lombok `@Getter @Setter @NoArgsConstructor`.
- Para entidades sin colecciones (`OneToMany`) se usa un DTO simple que solo copia campos.

```java
// Ejemplo con contadores
public class TemporadaDTO extends TemporadaEntity {
    private int categorias;
    private int equipos;

    public TemporadaDTO(TemporadaEntity entity, int categorias, int equipos) {
        setId(entity.getId());
        setDescripcion(entity.getDescripcion());
        setClub(entity.getClub());
        this.categorias = categorias;
        this.equipos = equipos;
    }
}

// Ejemplo simple (sin contadores)
public class PartidoDTO extends PartidoEntity {
    public PartidoDTO(PartidoEntity entity) {
        setId(entity.getId());
        setRival(entity.getRival());
        setLiga(entity.getLiga());
        // ... resto de campos
    }
}
```

## DTOConverter

- `@Component` con inyección del repositorio correspondiente.
- Método `toDTO(XxxEntity entity)`: recibe entidad, ejecuta queries de conteo en el repositorio, construye y retorna el DTO.
- Método `toPageDTO(Page<XxxEntity> page)`: recibe una página Spring Data, mapea cada elemento con `toDTO`.
- Ambos métodos retornan `null` si la entrada es `null`.

```java
@Component
public class TemporadaConverter {

    @Autowired
    private TemporadaRepository repository;

    public TemporadaDTO toDTO(TemporadaEntity entity) {
        if (entity == null) return null;
        int categorias = (int) repository.countCategoriasByTemporadaId(entity.getId());
        int equipos = (int) repository.countEquiposByTemporadaId(entity.getId());
        return new TemporadaDTO(entity, categorias, equipos);
    }

    public Page<TemporadaDTO> toPageDTO(Page<TemporadaEntity> page) {
        if (page == null) return null;
        return page.map(this::toDTO);
    }
}
```

## Queries de conteo en el repositorio

Se definen como métodos derivados de Spring Data JPA o con `@Query` explícita:

```java
// Derivado
long countByCategoriaTemporadaId(Long id_temporada);

// Explícito
@Query("SELECT COUNT(e) FROM EquipoEntity e WHERE e.categoria.temporada.id = :temporadaId")
int countEquiposByTemporadaId(@Param("temporadaId") Long temporadaId);
```

## Integración en el Service

El service usa el converter en lugar de la entidad directamente:

```java
public TemporadaDTO get(Long id) {
    TemporadaEntity e = repository.findById(id).orElseThrow(...);
    return oTemporadaConverter.toDTO(e);
}

public Page<TemporadaDTO> getPage(...) {
    Page<TemporadaEntity> page = repository.findAll(...);
    return oTemporadaConverter.toPageDTO(page);
}
```

## Resumen de DTOs

| DTO | Contadores | Tipo |
|---|---|---|
| `TipousuarioDTO` | usuarios | contador |
| `RolusuarioDTO` | usuarios | contador |
| `ClubDTO` | temporadas, noticias, tipoarticulos, usuarios | contador |
| `TemporadaDTO` | categorias, equipos | contador |
| `CategoriaDTO` | equipos | contador |
| `EquipoDTO` | jugadores, cuotas, ligas | contador |
| `JugadorDTO` | pagos | contador |
| `CuotaDTO` | pagos | contador |
| `LigaDTO` | partidos | contador |
| `EstadopartidoDTO` | partidos | contador |
| `NoticiaDTO` | comentarios, puntuaciones, mediaPuntuacion | contador + promedio |
| `ArticuloDTO` | comentarioarts, puntuacionarts, compras, carritos, mediaPuntuacion | contador + promedio |
| `FacturaDTO` | compras | contador |
| `TipoarticuloDTO` | articulos, totalVentas | contador + suma |
| `CarritoDTO` | precioTotal | campo calculado |
| `UsuarioDTO` | comentarios, puntuaciones, comentarioarts, carritos, facturas, equiposentrenados, jugadores | contador |
| `CompraDTO` | — | simple |
| `PartidoDTO` | — | simple |
| `ComentarioDTO` | — | simple |
| `PuntuacionDTO` | — | simple |
| `ComentarioartDTO` | — | simple |
| `PuntuacionartDTO` | — | simple |
