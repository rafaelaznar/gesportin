package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.LigaDTO;
import net.ausiasmarch.gesportin.entity.LigaEntity;
import net.ausiasmarch.gesportin.repository.LigaRepository;

/**
 * Conversor inyectable para LigaDTO (complejo con 1 computed field: partidos).
 * Requiere LigaRepository para ejecutar la query de conteo de partidos.
 */
@Component
public class LigaConverter {

    @Autowired
    private LigaRepository repository;

    /**
     * Convierte un LigaEntity a LigaDTO con el computed field partidos.
     * @param entity Entidad Liga
     * @return LigaDTO con partidos poblado
     */
    public LigaDTO toDTO(LigaEntity entity) {
        if (entity == null) {
            return null;
        }
        int partidos = (int) repository.countPartidosByLigaId(entity.getId());
        return new LigaDTO(entity, partidos);
    }

    /**
     * Convierte una Page<LigaEntity> a Page<LigaDTO> con el computed field partidos.
     * @param page Página de entidades Liga
     * @return Page<LigaDTO> con partidos poblado para cada elemento
     */
    public Page<LigaDTO> toPageDTO(Page<LigaEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
