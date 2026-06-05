package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.PuntuacionartDTO;
import net.ausiasmarch.gesportin.entity.PuntuacionartEntity;

/**
 * Conversor inyectable para PuntuacionartDTO.
 */
@Component
public class PuntuacionartConverter {

    public PuntuacionartDTO toDTO(PuntuacionartEntity entity) {
        if (entity == null) {
            return null;
        }
        return new PuntuacionartDTO(entity);
    }

    public Page<PuntuacionartDTO> toPageDTO(Page<PuntuacionartEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
