package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.CarritoDTO;
import net.ausiasmarch.gesportin.entity.CarritoEntity;

/**
 * Conversor inyectable para CarritoDTO.
 */
@Component
public class CarritoConverter {

    public CarritoDTO toDTO(CarritoEntity entity) {
        if (entity == null) {
            return null;
        }
        return new CarritoDTO(entity);
    }

    public Page<CarritoDTO> toPageDTO(Page<CarritoEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
