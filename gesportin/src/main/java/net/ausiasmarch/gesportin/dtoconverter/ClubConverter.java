package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.ClubDTO;
import net.ausiasmarch.gesportin.entity.ClubEntity;
import net.ausiasmarch.gesportin.repository.ClubRepository;

/**
 * Conversor inyectable para ClubDTO (complejo con 4 computed fields).
 * Requiere ClubRepository para ejecutar queries de conteo.
 */
@Component
public class ClubConverter {

    @Autowired
    private ClubRepository repository;

    /**
     * Convierte un ClubEntity a ClubDTO con los computed fields.
     * @param entity Entidad Club
     * @return ClubDTO con temporadas, noticias, tipoarticulos y usuarios poblados
     */
    public ClubDTO toDTO(ClubEntity entity) {
        if (entity == null) {
            return null;
        }
        int temporadas = (int) repository.countTemporadasByClubId(entity.getId());
        int noticias = (int) repository.countNoticiasByClubId(entity.getId());
        int tipoarticulos = (int) repository.countTipoarticulosByClubId(entity.getId());
        int usuarios = (int) repository.countUsuariosByClubId(entity.getId());
        return new ClubDTO(entity, temporadas, noticias, tipoarticulos, usuarios);
    }

    /**
     * Convierte una Page<ClubEntity> a Page<ClubDTO> con los computed fields.
     * @param page Página de entidades Club
     * @return Page<ClubDTO> con computed fields poblados para cada elemento
     */
    public Page<ClubDTO> toPageDTO(Page<ClubEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
