package net.ausiasmarch.gesportin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.ausiasmarch.gesportin.entity.FacturaEntity;

@Getter
@Setter
@NoArgsConstructor
public class FacturaDTO extends FacturaEntity {

    private int compras;

    public FacturaDTO(FacturaEntity entity, int compras) {
        setId(entity.getId());
        setFecha(entity.getFecha());
        setUsuario(entity.getUsuario());
        this.compras = compras;
    }
}
