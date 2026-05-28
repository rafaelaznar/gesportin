package net.ausiasmarch.gesportin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquiposPorCategoriaDTO {

    private String categoria;
    private Long totalEquipos;
}
