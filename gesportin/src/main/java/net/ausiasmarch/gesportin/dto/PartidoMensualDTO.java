package net.ausiasmarch.gesportin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartidoMensualDTO {

    private String fecha;
    private Long jugados;
    private Long victorias;
}
