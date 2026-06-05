package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.ComentarioartDTO;
import net.ausiasmarch.gesportin.entity.ComentarioartEntity;

/**
 * Conversor inyectable para ComentarioartDTO.
 */
@Component
public class ComentarioartConverter {

    public ComentarioartDTO toDTO(ComentarioartEntity entity) {
        if (entity == null) {
            return null;
        }
        return new ComentarioartDTO(entity);
    }

    public Page<ComentarioartDTO> toPageDTO(Page<ComentarioartEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
