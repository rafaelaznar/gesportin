package net.ausiasmarch.gesportin.entity;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "compra")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompraEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Integer cantidad;

    @NotNull
    private BigDecimal precio;

    @NotNull
    private Long id_articulo;

    @NotNull
    private Long id_factura;

}