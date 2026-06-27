package net.ausiasmarch.gesportin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.ausiasmarch.gesportin.entity.JugadorEntity;

@Getter
@Setter
@NoArgsConstructor
public class JugadorDTO extends JugadorEntity {

    private int pagos;

    public JugadorDTO(JugadorEntity entity, int pagos) {
        setId(entity.getId());
        setDorsal(entity.getDorsal());
        setPosicion(entity.getPosicion());
        setCapitan(entity.getCapitan());
        setUsuario(entity.getUsuario());
        setEquipo(entity.getEquipo());
        this.pagos = pagos;
    }
}
