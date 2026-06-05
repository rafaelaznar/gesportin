package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.EstadopartidoDTO;
import net.ausiasmarch.gesportin.entity.EstadopartidoEntity;
import net.ausiasmarch.gesportin.repository.EstadopartidoRepository;

/**
 * Conversor inyectable para EstadopartidoDTO (complejo con 1 computed field: partidos).
 * Requiere EstadopartidoRepository para ejecutar la query de conteo de partidos.
 */
@Component
public class EstadopartidoConverter {

    @Autowired
    private EstadopartidoRepository repository;

    /**
     * Convierte un EstadopartidoEntity a EstadopartidoDTO con el computed field partidos.
     * @param entity Entidad Estadopartido
     * @return EstadopartidoDTO con partidos poblado
     */
    public EstadopartidoDTO toDTO(EstadopartidoEntity entity) {
        if (entity == null) {
            return null;
        }
        int partidos = (int) repository.countPartidosByEstadopartidoId(entity.getId());
        return new EstadopartidoDTO(entity, partidos);
    }

    /**
     * Convierte una Page<EstadopartidoEntity> a Page<EstadopartidoDTO> con el computed field partidos.
     * @param page Página de entidades Estadopartido
     * @return Page<EstadopartidoDTO> con partidos poblado para cada elemento
     */
    public Page<EstadopartidoDTO> toPageDTO(Page<EstadopartidoEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
