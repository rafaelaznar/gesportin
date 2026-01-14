package net.ausiasmarch.gesportin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "puntuacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PuntuacionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "puntuacion")
    @NotNull
    @Min(1)
    @Max(5)
    private Integer puntuacion;

    @Column(name = "id_noticia")
    @NotNull
    private Long idNoticia;

    @Column(name = "id_usuario")
    @NotNull
    private Long idUsuario;
}
