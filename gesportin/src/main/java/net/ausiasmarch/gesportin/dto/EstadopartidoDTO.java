package net.ausiasmarch.gesportin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.ausiasmarch.gesportin.entity.EstadopartidoEntity;

@Getter
@Setter
@NoArgsConstructor
public class EstadopartidoDTO extends EstadopartidoEntity {

    private int partidos;

    public EstadopartidoDTO(EstadopartidoEntity entity, int partidos) {
        setId(entity.getId());
        setDescripcion(entity.getDescripcion());
        this.partidos = partidos;
    }
}
