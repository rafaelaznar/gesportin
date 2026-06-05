package net.ausiasmarch.gesportin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.ausiasmarch.gesportin.entity.TipousuarioEntity;

@Getter
@Setter
@NoArgsConstructor
public class TipousuarioDTO extends TipousuarioEntity {
    
    private int usuarios;
    
    public TipousuarioDTO(TipousuarioEntity entity, int usuarios) {
        setId(entity.getId());
        setDescripcion(entity.getDescripcion());
        this.usuarios = usuarios;
    }
}
