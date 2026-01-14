package net.ausiasmarch.gesportin.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jdk.jfr.BooleanFlag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "jugador")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JugadorEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private int dorsal;
    
    @NotNull
    @Size(min = 3, max = 255)
    private String posicion;
    
    @NotNull
    @BooleanFlag
    private Boolean capitan;
    
    @Nullable
    @Size(min=3, max = 255)
    private String imagen;
    
    @NotNull
    @Column(name = "id_usuario")
    private Long idUsuario;
    
    @NotNull
    @Column(name = "id_equipo")
    private Long idEquipo;
}
