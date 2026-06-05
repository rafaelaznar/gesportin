package net.ausiasmarch.gesportin.dtoconverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.dto.CategoriaDTO;
import net.ausiasmarch.gesportin.entity.CategoriaEntity;
import net.ausiasmarch.gesportin.repository.CategoriaRepository;

/**
 * Conversor inyectable para CategoriaDTO (complejo con 1 computed field: equipos).
 * Requiere CategoriaRepository para ejecutar la query de conteo de equipos.
 */
@Component
public class CategoriaConverter {

    @Autowired
    private CategoriaRepository repository;

    /**
     * Convierte un CategoriaEntity a CategoriaDTO con el computed field equipos.
     * @param entity Entidad Categoria
     * @return CategoriaDTO con equipos poblado
     */
    public CategoriaDTO toDTO(CategoriaEntity entity) {
        if (entity == null) {
            return null;
        }
        int equipos = (int) repository.countEquiposByCategoriaId(entity.getId());
        return new CategoriaDTO(entity, equipos);
    }

    /**
     * Convierte una Page<CategoriaEntity> a Page<CategoriaDTO> con el computed field equipos.
     * @param page Página de entidades Categoria
     * @return Page<CategoriaDTO> con equipos poblado para cada elemento
     */
    public Page<CategoriaDTO> toPageDTO(Page<CategoriaEntity> page) {
        if (page == null) {
            return null;
        }
        return page.map(this::toDTO);
    }
}
