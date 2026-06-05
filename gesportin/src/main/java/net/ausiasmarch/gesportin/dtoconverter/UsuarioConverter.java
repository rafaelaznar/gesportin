package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.UsuarioDTO;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.repository.UsuarioRepository;

/**
 * Conversor inyectable para UsuarioDTO (complejo con 7 computed fields).
 * Requiere UsuarioRepository para ejecutar las queries de conteo.
 */
@Component
public class UsuarioConverter {

    @Autowired
    private UsuarioRepository repository;

    /**
     * Convierte un UsuarioEntity a UsuarioDTO con todos los computed fields.
     * @param entity Entidad Usuario
     * @return UsuarioDTO con computed fields poblados
     */
    public UsuarioDTO toDTO(UsuarioEntity entity) {
        if (entity == null) {
            return null;
        }
        int comentarios = (int) repository.countComentariosByUsuarioId(entity.getId());
        int puntuaciones = (int) repository.countPuntuacionesByUsuarioId(entity.getId());
        int comentarioarts = (int) repository.countComentarioartsByUsuarioId(entity.getId());
        int carritos = (int) repository.countCarritosByUsuarioId(entity.getId());
        int facturas = (int) repository.countFacturasByUsuarioId(entity.getId());
        int equiposentrenados = (int) repository.countEquiposEntrenadosByUsuarioId(entity.getId());
        int jugadores = (int) repository.countJugadoresByUsuarioId(entity.getId());
        return new UsuarioDTO(entity, comentarios, puntuaciones, comentarioarts, carritos, facturas, equiposentrenados, jugadores);
    }

    /**
     * Convierte una Page<UsuarioEntity> a Page<UsuarioDTO> con todos los computed fields.
     * @param page Página de entidades Usuario
     * @return Page<UsuarioDTO> con computed fields poblados para cada elemento
     */
    public Page<UsuarioDTO> toPageDTO(Page<UsuarioEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
