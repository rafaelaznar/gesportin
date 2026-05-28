package net.ausiasmarch.gesportin.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeudaPorEquipoDTO {

    private String equipo;
    private BigDecimal deuda;
}
