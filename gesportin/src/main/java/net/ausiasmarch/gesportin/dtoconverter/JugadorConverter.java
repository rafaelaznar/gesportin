package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.JugadorDTO;
import net.ausiasmarch.gesportin.entity.JugadorEntity;
import net.ausiasmarch.gesportin.repository.JugadorRepository;

/**
 * Conversor inyectable para JugadorDTO (con 1 computed field: pagos).
 * Requiere JugadorRepository para ejecutar queries de conteo.
 */
@Component
public class JugadorConverter {

    @Autowired
    private JugadorRepository repository;

    /**
     * Convierte un JugadorEntity a JugadorDTO con los computed fields.
     * @param entity Entidad Jugador
     * @return JugadorDTO con pagos poblado
     */
    public JugadorDTO toDTO(JugadorEntity entity) {
        if (entity == null) {
            return null;
        }
        int pagos = repository.countPagosByJugadorId(entity.getId());
        return new JugadorDTO(entity, pagos);
    }

    /**
     * Convierte una Page<JugadorEntity> a Page<JugadorDTO> con los computed fields.
     * @param page Página de entidades Jugador
     * @return Page<JugadorDTO> con pagos poblado para cada elemento
     */
    public Page<JugadorDTO> toPageDTO(Page<JugadorEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
