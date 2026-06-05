package net.ausiasmarch.gesportin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.ausiasmarch.gesportin.entity.PuntuacionEntity;

@Getter
@Setter
@NoArgsConstructor
public class PuntuacionDTO extends PuntuacionEntity {

    public PuntuacionDTO(PuntuacionEntity entity) {
        setId(entity.getId());
        setPuntuacion(entity.getPuntuacion());
        setNoticia(entity.getNoticia());
        setUsuario(entity.getUsuario());
    }
}
