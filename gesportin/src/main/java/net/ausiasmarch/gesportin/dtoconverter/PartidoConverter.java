package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.PartidoDTO;
import net.ausiasmarch.gesportin.entity.PartidoEntity;

/**
 * Conversor inyectable para PartidoDTO.
 */
@Component
public class PartidoConverter {

    public PartidoDTO toDTO(PartidoEntity entity) {
        if (entity == null) {
            return null;
        }
        return new PartidoDTO(entity);
    }

    public Page<PartidoDTO> toPageDTO(Page<PartidoEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
