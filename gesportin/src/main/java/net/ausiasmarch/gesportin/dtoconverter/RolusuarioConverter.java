package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.RolusuarioDTO;
import net.ausiasmarch.gesportin.entity.RolusuarioEntity;
import net.ausiasmarch.gesportin.repository.RolusuarioRepository;

/**
 * Conversor inyectable para RolusuarioDTO (complejo con 1 computed field: usuarios).
 * Requiere RolusuarioRepository para ejecutar la query de conteo de usuarios.
 */
@Component
public class RolusuarioConverter {

    @Autowired
    private RolusuarioRepository repository;

    /**
     * Convierte un RolusuarioEntity a RolusuarioDTO con el computed field usuarios.
     * @param entity Entidad Rolusuario
     * @return RolusuarioDTO con usuarios poblado
     */
    public RolusuarioDTO toDTO(RolusuarioEntity entity) {
        if (entity == null) {
            return null;
        }
        int usuarios = (int) repository.countUsuariosByRolusuarioId(entity.getId());
        return new RolusuarioDTO(entity, usuarios);
    }

    /**
     * Convierte una Page<RolusuarioEntity> a Page<RolusuarioDTO> con el computed field usuarios.
     * @param page Página de entidades Rolusuario
     * @return Page<RolusuarioDTO> con usuarios poblado para cada elemento
     */
    public Page<RolusuarioDTO> toPageDTO(Page<RolusuarioEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
