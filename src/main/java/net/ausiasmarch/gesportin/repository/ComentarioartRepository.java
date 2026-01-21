package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.ComentarioartEntity;
public interface ComentarioartRepository extends JpaRepository<ComentarioartEntity, Long> {
    Page<ComentarioartEntity> findByArticuloId(Long id_articulo, org.springframework.data.domain.Pageable oPageable);
    Page<ComentarioartEntity> findByUsuarioId(Long id_usuario, org.springframework.data.domain.Pageable oPageable);
}
