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
import lombok.AllArgsConstructor;
import lombok.Data;
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
    private TipoarticuloEntity tipoArticulo;

    @OneToMany(mappedBy = "articulo", fetch = FetchType.LAZY)
    private java.util.List<ComentarioartEntity> comentarioarts;

    @OneToMany(mappedBy = "articulo", fetch = FetchType.LAZY)
    private java.util.List<CompraEntity> compras;

    @OneToMany(mappedBy = "articulo", fetch = FetchType.LAZY)
    private java.util.List<CompraEntity> carritos;
   

}
