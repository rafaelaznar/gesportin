package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.EquipoDTO;
import net.ausiasmarch.gesportin.entity.EquipoEntity;
import net.ausiasmarch.gesportin.repository.EquipoRepository;

/**
 * Conversor inyectable para EquipoDTO (complejo con 3 computed fields: jugadores, cuotas, ligas).
 * Requiere EquipoRepository para ejecutar queries de conteo.
 */
@Component
public class EquipoConverter {

    @Autowired
    private EquipoRepository repository;

    /**
     * Convierte un EquipoEntity a EquipoDTO con los computed fields.
     * @param entity Entidad Equipo
     * @return EquipoDTO con jugadores, cuotas y ligas poblados
     */
    public EquipoDTO toDTO(EquipoEntity entity) {
        if (entity == null) {
            return null;
        }
        int jugadores = (int) repository.countJugadoresByEquipoId(entity.getId());
        int cuotas = (int) repository.countCuotasByEquipoId(entity.getId());
        int ligas = (int) repository.countLigasByEquipoId(entity.getId());
        return new EquipoDTO(entity, jugadores, cuotas, ligas);
    }

    /**
     * Convierte una Page<EquipoEntity> a Page<EquipoDTO> con los computed fields.
     * @param page Página de entidades Equipo
     * @return Page<EquipoDTO> con jugadores, cuotas y ligas poblados para cada elemento
     */
    public Page<EquipoDTO> toPageDTO(Page<EquipoEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
