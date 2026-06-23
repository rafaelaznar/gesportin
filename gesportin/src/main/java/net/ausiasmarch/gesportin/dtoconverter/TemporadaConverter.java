package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.TemporadaDTO;
import net.ausiasmarch.gesportin.entity.TemporadaEntity;
import net.ausiasmarch.gesportin.repository.TemporadaRepository;

/**
 * Conversor inyectable para TemporadaDTO (complejo con 2 computed fields: categorias, equipos).
 * Requiere TemporadaRepository para ejecutar las queries de conteo de categorías y equipos.
 */
@Component
public class TemporadaConverter {

    @Autowired
    private TemporadaRepository repository;

    /**
     * Convierte un TemporadaEntity a TemporadaDTO con los computed fields categorias y equipos.
     * @param entity Entidad Temporada
     * @return TemporadaDTO con categorias y equipos poblados
     */
    public TemporadaDTO toDTO(TemporadaEntity entity) {
        if (entity == null) {
            return null;
        }
        int categorias = (int) repository.countCategoriasByTemporadaId(entity.getId());
        int equipos = (int) repository.countEquiposByTemporadaId(entity.getId());
        int ligas = (int) repository.countLigasByTemporadaId(entity.getId());
        return new TemporadaDTO(entity, categorias, equipos, ligas);
    }

    /**
     * Convierte una Page<TemporadaEntity> a Page<TemporadaDTO> con los computed fields categorias y equipos.
     * @param page Página de entidades Temporada
     * @return Page<TemporadaDTO> con categorias y equipos poblados para cada elemento
     */
    public Page<TemporadaDTO> toPageDTO(Page<TemporadaEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
