package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.TipoarticuloEntity;

public interface TipoarticuloRepository extends JpaRepository<TipoarticuloEntity, Long> {
    Page<TipoarticuloEntity> findByDescripcionContainingIgnoreCase(String descripcion, Pageable pageable);
    Page<TipoarticuloEntity> findByClubId(Long idClub, Pageable pageable);
}
