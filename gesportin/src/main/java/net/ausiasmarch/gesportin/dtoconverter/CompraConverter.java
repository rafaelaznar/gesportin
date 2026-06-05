package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.CompraDTO;
import net.ausiasmarch.gesportin.entity.CompraEntity;

/**
 * Conversor inyectable para CompraDTO.
 */
@Component
public class CompraConverter {

    public CompraDTO toDTO(CompraEntity entity) {
        if (entity == null) {
            return null;
        }
        return new CompraDTO(entity);
    }

    public Page<CompraDTO> toPageDTO(Page<CompraEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
