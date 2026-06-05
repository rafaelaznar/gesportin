package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.TemporadaDTO;
import net.ausiasmarch.gesportin.entity.TemporadaEntity;
import net.ausiasmarch.gesportin.repository.TemporadaRepository;

/**
 * Conversor inyectable para TemporadaDTO (complejo con 1 computed field: categorias).
 * Requiere TemporadaRepository para ejecutar la query de conteo de categorías.
 */
@Component
public class TemporadaConverter {

    @Autowired
    private TemporadaRepository repository;

    /**
     * Convierte un TemporadaEntity a TemporadaDTO con el computed field categorias.
     * @param entity Entidad Temporada
     * @return TemporadaDTO con categorias poblado
     */
    public TemporadaDTO toDTO(TemporadaEntity entity) {
        if (entity == null) {
            return null;
        }
        int categorias = (int) repository.countCategoriasByTemporadaId(entity.getId());
        return new TemporadaDTO(entity, categorias);
    }

    /**
     * Convierte una Page<TemporadaEntity> a Page<TemporadaDTO> con el computed field categorias.
     * @param page Página de entidades Temporada
     * @return Page<TemporadaDTO> con categorias poblado para cada elemento
     */
    public Page<TemporadaDTO> toPageDTO(Page<TemporadaEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
