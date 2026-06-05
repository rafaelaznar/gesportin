package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.ComentarioDTO;
import net.ausiasmarch.gesportin.entity.ComentarioEntity;

/**
 * Conversor inyectable para ComentarioDTO.
 */
@Component
public class ComentarioConverter {

    public ComentarioDTO toDTO(ComentarioEntity entity) {
        if (entity == null) {
            return null;
        }
        return new ComentarioDTO(entity);
    }

    public Page<ComentarioDTO> toPageDTO(Page<ComentarioEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
