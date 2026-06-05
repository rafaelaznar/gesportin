package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.PuntuacionDTO;
import net.ausiasmarch.gesportin.entity.PuntuacionEntity;

/**
 * Conversor inyectable para PuntuacionDTO.
 */
@Component
public class PuntuacionConverter {

    public PuntuacionDTO toDTO(PuntuacionEntity entity) {
        if (entity == null) {
            return null;
        }
        return new PuntuacionDTO(entity);
    }

    public Page<PuntuacionDTO> toPageDTO(Page<PuntuacionEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
