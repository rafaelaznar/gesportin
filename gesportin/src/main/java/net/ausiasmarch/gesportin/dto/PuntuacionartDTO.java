package net.ausiasmarch.gesportin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.ausiasmarch.gesportin.entity.PuntuacionartEntity;

@Getter
@Setter
@NoArgsConstructor
public class PuntuacionartDTO extends PuntuacionartEntity {

    public PuntuacionartDTO(PuntuacionartEntity entity) {
        setId(entity.getId());
        setPuntuacion(entity.getPuntuacion());
        setArticulo(entity.getArticulo());
        setUsuario(entity.getUsuario());
    }
}
