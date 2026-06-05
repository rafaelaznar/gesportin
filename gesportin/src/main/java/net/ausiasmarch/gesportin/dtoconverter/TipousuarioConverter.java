package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.TipousuarioDTO;
import net.ausiasmarch.gesportin.entity.TipousuarioEntity;
import net.ausiasmarch.gesportin.repository.TipousuarioRepository;

/**
 * Conversor inyectable para TipousuarioDTO (complejo con 1 computed field: usuarios).
 * Requiere TipousuarioRepository para ejecutar la query de conteo de usuarios.
 */
@Component
public class TipousuarioConverter {

    @Autowired
    private TipousuarioRepository repository;

    /**
     * Convierte un TipousuarioEntity a TipousuarioDTO con el computed field usuarios.
     * @param entity Entidad Tipousuario
     * @return TipousuarioDTO con usuarios poblado
     */
    public TipousuarioDTO toDTO(TipousuarioEntity entity) {
        if (entity == null) {
            return null;
        }
        int usuarios = (int) repository.countUsuariosByTipousuarioId(entity.getId());
        return new TipousuarioDTO(entity, usuarios);
    }

    /**
     * Convierte una Page<TipousuarioEntity> a Page<TipousuarioDTO> con el computed field usuarios.
     * @param page Página de entidades Tipousuario
     * @return Page<TipousuarioDTO> con usuarios poblado para cada elemento
     */
    public Page<TipousuarioDTO> toPageDTO(Page<TipousuarioEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
