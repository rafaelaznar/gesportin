package net.ausiasmarch.gesportin.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClubResumenDTO {

    private Long totalJugadores;
    private Long totalEquipos;
    private Long totalPartidos;
    private Long totalNoticias;
    private Long totalPagos;
    private BigDecimal totalPagosRecibidos;
    private BigDecimal totalDeudas;
    private Long partidosJugados;
    private Long partidosPendientes;
}
