package net.ausiasmarch.gesportin.entity;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "articulo")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArticuloEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String descripcion;

    @NotNull
    private BigDecimal precio;

    private BigDecimal descuento;

    @Lob
    private byte[] imagen;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_tipoarticulo")
    private TipoarticuloEntity tipoarticulo;

    // https://www.baeldung.com/lombok-omit-getter-setter    
    
    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "articulo", fetch = FetchType.LAZY)
    private java.util.List<ComentarioartEntity> comentarioarts;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "articulo", fetch = FetchType.LAZY)
    private java.util.List<CompraEntity> compras;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "articulo", fetch = FetchType.LAZY)
    private java.util.List<CarritoEntity> carritos;

    
    public int getComentarioarts() {
        return comentarioarts.size();
    }

    public int getCompras() {
        return compras.size();
    }

    public int getCarritos() {
        return carritos.size();
    }
    

    /*

En Spring Boot (Jackson), la **recursión infinita** entre relaciones **`@OneToMany` ↔ `@ManyToOne`** ocurre cuando Jackson intenta serializar ambos lados de la relación y entra en un bucle.

Hay **varias formas correctas de resolverlo**, y **`@JsonIdentityInfo`** y **`@JsonIgnore`** son dos de ellas, con **usos distintos**.

---

## 1️⃣ Opción A – `@JsonIgnore` (la más simple)

👉 **Rompes la serialización en uno de los lados**

### Ejemplo típico

```java
@Entity
public class Author {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @OneToMany(mappedBy = "author")
    @JsonIgnore
    private List<Book> books;
}
```

```java
@Entity
public class Book {

    @Id
    @GeneratedValue
    private Long id;

    private String title;

    @ManyToOne
    private Author author;
}
```

### Resultado JSON

```json
{
  "id": 1,
  "title": "Spring in Action",
  "author": {
    "id": 1,
    "name": "Craig Walls"
  }
}
```

### ✅ Ventajas

* Muy simple
* Ideal para APIs REST clásicas
* Control total del JSON

### ❌ Inconvenientes

* **Pierdes el lado ignorado** en el JSON
* No sirve si necesitas ambas direcciones

---

## 2️⃣ Opción B – `@JsonIdentityInfo` (relaciones bidireccionales reales)

👉 Jackson usa **IDs** para evitar ciclos

### Ejemplo

```java
@Entity
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id"
)
public class Author {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @OneToMany(mappedBy = "author")
    private List<Book> books;
}
```

```java
@Entity
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id"
)
public class Book {

    @Id
    @GeneratedValue
    private Long id;

    private String title;

    @ManyToOne
    private Author author;
}
```

### Resultado JSON

```json
{
  "id": 1,
  "name": "Craig Walls",
  "books": [
    {
      "id": 10,
      "title": "Spring in Action",
      "author": 1
    }
  ]
}
```

🔁 La segunda vez que aparece `author`, Jackson usa **solo el ID**

### ✅ Ventajas

* Mantiene relaciones completas
* Ideal para APIs ricas / gráficas
* Evita bucles automáticamente

### ❌ Inconvenientes

* JSON menos legible
* Requiere IDs **no nulos** (ojo con entidades nuevas)

---

## 3️⃣ Opción C – `@JsonManagedReference` / `@JsonBackReference` (clásica)

👉 Una relación **padre → hijo**

```java
@Entity
public class Author {

    @OneToMany(mappedBy = "author")
    @JsonManagedReference
    private List<Book> books;
}
```

```java
@Entity
public class Book {

    @ManyToOne
    @JsonBackReference
    private Author author;
}
```

### Resultado

* Se serializa `Author → books`
* Se ignora `Book → author`

### ⚠️ Limitación

* Solo funciona bien con **una única relación**
* No vale para grafos complejos

---

## 4️⃣ ¿Cuál usar? (recomendación práctica)

| Caso                      | Solución recomendada    |
| ------------------------- | ----------------------- |
| API REST simple           | `@JsonIgnore`           |
| Grafo bidireccional       | `@JsonIdentityInfo`     |
| Relación padre-hijo clara | `@JsonManagedReference` |
| APIs profesionales        | **DTOs (mejor opción)** |

---

## 5️⃣ ⭐ Mejor práctica REAL (producción)

👉 **NO serializar entidades JPA directamente**

```java
public record BookDTO(
    Long id,
    String title,
    Long authorId
) {}
```

Esto:

* Evita ciclos
* Evita lazy loading inesperado
* Da control total del contrato REST

---

## Conclusión clara

* `@JsonIgnore` 👉 rápido y efectivo
* `@JsonIdentityInfo` 👉 correcto para grafos
* `@JsonManagedReference` 👉 limitado
* **DTOs** 👉 solución profesional

Si quieres, dime:

* ✔️ ¿API REST o frontend Angular?
* ✔️ ¿Relaciones simples o grafo complejo?

Y te digo **qué opción usar exactamente en tu caso** 💡

    
    
    */



}
