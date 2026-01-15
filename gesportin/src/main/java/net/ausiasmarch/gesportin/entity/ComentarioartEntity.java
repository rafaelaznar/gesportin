package net.ausiasmarch.gesportin.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "comentarioart")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioartEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 3, max = 1024)
    private String contenido;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name= "id_articulo")
    private ArticuloEntity articulo;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name= "id_usuario")
    private UsuarioEntity usuario;

}
