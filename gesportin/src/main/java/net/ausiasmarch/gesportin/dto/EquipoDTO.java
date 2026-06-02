package net.ausiasmarch.gesportin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.ausiasmarch.gesportin.entity.EquipoEntity;

@Getter
@Setter
@NoArgsConstructor
public class EquipoDTO extends EquipoEntity {

    private int jugadores;
    private int cuotas;
    private int ligas;

    public EquipoDTO(EquipoEntity entity, int jugadores, int cuotas, int ligas) {
        setId(entity.getId());
        setNombre(entity.getNombre());
        setCategoria(entity.getCategoria());
        setEntrenador(entity.getEntrenador());
        this.jugadores = jugadores;
        this.cuotas = cuotas;
        this.ligas = ligas;
    }
}
