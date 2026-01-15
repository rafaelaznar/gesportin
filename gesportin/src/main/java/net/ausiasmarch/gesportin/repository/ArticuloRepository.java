package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.ArticuloEntity;

public interface ArticuloRepository extends JpaRepository<ArticuloEntity, Long> {

    Page<ArticuloEntity> findByDescripcionContainingIgnoreCase(String descripcion, Pageable pageable);

    //Page<ArticuloEntity> findByIdTipoarticulo(Long idTipoarticulo, Pageable pageable);    

}
