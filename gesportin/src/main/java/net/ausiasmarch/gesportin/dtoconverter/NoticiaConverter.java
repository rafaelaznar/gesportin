package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.NoticiaDTO;
import net.ausiasmarch.gesportin.entity.NoticiaEntity;
import net.ausiasmarch.gesportin.repository.NoticiaRepository;

/**
 * Conversor inyectable para NoticiaDTO (complejo con 3 computed fields: comentarios, puntuaciones, mediaPuntuacion).
 * Requiere NoticiaRepository para ejecutar queries de conteo y promedio.
 */
@Component
public class NoticiaConverter {

    @Autowired
    private NoticiaRepository repository;

    /**
     * Convierte un NoticiaEntity a NoticiaDTO con los computed fields.
     * @param entity Entidad Noticia
     * @return NoticiaDTO con comentarios, puntuaciones y mediaPuntuacion poblados
     */
    public NoticiaDTO toDTO(NoticiaEntity entity) {
        if (entity == null) {
            return null;
        }
        int comentarios = repository.countComentariosByNoticiaId(entity.getId());
        int puntuaciones = repository.countPuntuacionesByNoticiaId(entity.getId());
        double mediaPuntuacion = repository.getAveragePuntuacionByNoticiaId(entity.getId());
        return new NoticiaDTO(entity, comentarios, puntuaciones, mediaPuntuacion);
    }

    /**
     * Convierte una Page<NoticiaEntity> a Page<NoticiaDTO> con los computed fields.
     * @param page Página de entidades Noticia
     * @return Page<NoticiaDTO> con comentarios, puntuaciones y mediaPuntuacion poblados para cada elemento
     */
    public Page<NoticiaDTO> toPageDTO(Page<NoticiaEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
