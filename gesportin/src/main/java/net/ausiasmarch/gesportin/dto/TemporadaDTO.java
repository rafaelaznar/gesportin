package net.ausiasmarch.gesportin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.ausiasmarch.gesportin.entity.TemporadaEntity;

@Getter
@Setter
@NoArgsConstructor
public class TemporadaDTO extends TemporadaEntity {

    private int categorias;

    public TemporadaDTO(TemporadaEntity entity, int categorias) {
        setId(entity.getId());
        setDescripcion(entity.getDescripcion());
        setClub(entity.getClub());
        this.categorias = categorias;
    }
}
