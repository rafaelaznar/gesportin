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
    private int equipos;
    private int ligas;

    public TemporadaDTO(TemporadaEntity entity, int categorias, int equipos, int ligas) {
        setId(entity.getId());
        setDescripcion(entity.getDescripcion());
        setClub(entity.getClub());
        this.categorias = categorias;
        this.equipos = equipos;
        this.ligas = ligas;
    }
}
