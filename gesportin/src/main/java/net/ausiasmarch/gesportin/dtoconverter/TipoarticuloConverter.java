package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.TipoarticuloDTO;
import net.ausiasmarch.gesportin.entity.TipoarticuloEntity;
import net.ausiasmarch.gesportin.repository.CompraRepository;
import net.ausiasmarch.gesportin.repository.TipoarticuloRepository;

/**
 * Conversor inyectable para TipoarticuloDTO (complejo con 2 computed fields: articulos, totalVentas).
 * Requiere TipoarticuloRepository para conteo y CompraRepository para sumatoria de ventas.
 */
@Component
public class TipoarticuloConverter {

    @Autowired
    private TipoarticuloRepository tipoarticuloRepository;

    @Autowired
    private CompraRepository compraRepository;

    /**
     * Convierte un TipoarticuloEntity a TipoarticuloDTO con los computed fields.
     * @param entity Entidad Tipoarticulo
     * @return TipoarticuloDTO con articulos y totalVentas poblados
     */
    public TipoarticuloDTO toDTO(TipoarticuloEntity entity) {
        if (entity == null) {
            return null;
        }
        int articulos = (int) tipoarticuloRepository.countArticulosByTipoarticuloId(entity.getId());
        Double totalVentas = compraRepository.sumVentasByTipoarticuloId(entity.getId());
        return new TipoarticuloDTO(entity, articulos, totalVentas != null ? totalVentas : 0.0);
    }

    /**
     * Convierte una Page<TipoarticuloEntity> a Page<TipoarticuloDTO> con los computed fields.
     * @param page Página de entidades Tipoarticulo
     * @return Page<TipoarticuloDTO> con computed fields poblados para cada elemento
     */
    public Page<TipoarticuloDTO> toPageDTO(Page<TipoarticuloEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
