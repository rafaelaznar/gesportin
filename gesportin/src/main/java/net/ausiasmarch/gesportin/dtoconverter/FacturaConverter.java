package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.FacturaDTO;
import net.ausiasmarch.gesportin.entity.FacturaEntity;
import net.ausiasmarch.gesportin.repository.FacturaRepository;

/**
 * Conversor inyectable para FacturaDTO (con 1 computed field: compras).
 * Requiere FacturaRepository para ejecutar queries de conteo.
 */
@Component
public class FacturaConverter {

    @Autowired
    private FacturaRepository repository;

    /**
     * Convierte un FacturaEntity a FacturaDTO con los computed fields.
     * @param entity Entidad Factura
     * @return FacturaDTO con compras poblado
     */
    public FacturaDTO toDTO(FacturaEntity entity) {
        if (entity == null) {
            return null;
        }
        int compras = repository.countComprasByFacturaId(entity.getId());
        return new FacturaDTO(entity, compras);
    }

    /**
     * Convierte una Page<FacturaEntity> a Page<FacturaDTO> con los computed fields.
     * @param page Página de entidades Factura
     * @return Page<FacturaDTO> con compras poblado para cada elemento
     */
    public Page<FacturaDTO> toPageDTO(Page<FacturaEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
