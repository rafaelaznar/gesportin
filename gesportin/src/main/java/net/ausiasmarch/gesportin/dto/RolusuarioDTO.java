package net.ausiasmarch.gesportin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.ausiasmarch.gesportin.entity.RolusuarioEntity;

@Getter
@Setter
@NoArgsConstructor
public class RolusuarioDTO extends RolusuarioEntity {
    
    private int usuarios;
    
    public RolusuarioDTO(RolusuarioEntity entity, int usuarios) {
        setId(entity.getId());
        setDescripcion(entity.getDescripcion());
        this.usuarios = usuarios;
    }
}
