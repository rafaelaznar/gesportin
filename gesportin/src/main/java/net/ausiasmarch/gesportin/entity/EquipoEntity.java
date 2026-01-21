package net.ausiasmarch.gesportin.entity;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "equipo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Size(min = 3, max = 1024)
    @Column(nullable = false)
    private String nombre;
    
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_categoria")
    private CategoriaEntity categoria;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_entrenador")
    private UsuarioEntity entrenador;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "equipo", fetch = FetchType.LAZY)
    private List<JugadorEntity> jugadores;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "equipo", fetch = FetchType.LAZY)
    private List<CuotaEntity> cuotas;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "equipo", fetch = FetchType.LAZY)
    private List<LigaEntity> ligas;

    public int getJugadores() {
        return jugadores.size();
    }

    public int getCuotas() {
        return cuotas.size();
    }

    public int getLigas() {
        return ligas.size();
    }

}