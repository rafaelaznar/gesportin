package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.CuotaDTO;
import net.ausiasmarch.gesportin.entity.CuotaEntity;
import net.ausiasmarch.gesportin.repository.CuotaRepository;

/**
 * Conversor inyectable para CuotaDTO (complejo con 1 computed field: pagos).
 * Requiere CuotaRepository para ejecutar la query de conteo de pagos.
 */
@Component
public class CuotaConverter {

    @Autowired
    private CuotaRepository repository;

    /**
     * Convierte un CuotaEntity a CuotaDTO con el computed field pagos.
     * @param entity Entidad Cuota
     * @return CuotaDTO con pagos poblado
     */
    public CuotaDTO toDTO(CuotaEntity entity) {
        if (entity == null) {
            return null;
        }
        int pagos = (int) repository.countPagosByCuotaId(entity.getId());
        return new CuotaDTO(entity, pagos);
    }

    /**
     * Convierte una Page<CuotaEntity> a Page<CuotaDTO> con el computed field pagos.
     * @param page Página de entidades Cuota
     * @return Page<CuotaDTO> con pagos poblado para cada elemento
     */
    public Page<CuotaDTO> toPageDTO(Page<CuotaEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
