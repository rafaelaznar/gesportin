package net.ausiasmarch.gesportin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipoDetalleDTO {

    private String equipo;
    private String categoria;
    private Long numJugadores;
    private Long partidosJugados;
    private Long victorias;
}
