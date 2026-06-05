package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.ArticuloDTO;
import net.ausiasmarch.gesportin.entity.ArticuloEntity;
import net.ausiasmarch.gesportin.repository.ArticuloRepository;

/**
 * Conversor inyectable para ArticuloDTO (complejo con 5 computed fields).
 * Requiere ArticuloRepository para ejecutar queries de conteo.
 */
@Component
public class ArticuloConverter {

    @Autowired
    private ArticuloRepository repository;

    /**
     * Convierte un ArticuloEntity a ArticuloDTO con los computed fields.
     * @param entity Entidad Articulo
     * @return ArticuloDTO con computed fields poblados
     */
    public ArticuloDTO toDTO(ArticuloEntity entity) {
        if (entity == null) {
            return null;
        }
        int comentarioarts = (int) repository.countComentarioartsByArticuloId(entity.getId());
        int puntuacionarts = (int) repository.countPuntuacionartsByArticuloId(entity.getId());
        int compras = (int) repository.countComprasByArticuloId(entity.getId());
        int carritos = (int) repository.countCarritosByArticuloId(entity.getId());
        double mediaPuntuacion = repository.avgPuntuacionByArticuloId(entity.getId());
        return new ArticuloDTO(entity, comentarioarts, puntuacionarts, compras, carritos, mediaPuntuacion);
    }

    /**
     * Convierte una Page<ArticuloEntity> a Page<ArticuloDTO> con los computed fields.
     * @param page Página de entidades Articulo
     * @return Page<ArticuloDTO> con computed fields poblados para cada elemento
     */
    public Page<ArticuloDTO> toPageDTO(Page<ArticuloEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
