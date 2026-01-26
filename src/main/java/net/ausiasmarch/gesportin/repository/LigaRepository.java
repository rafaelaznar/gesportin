package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.LigaEntity;

public interface LigaRepository extends JpaRepository<LigaEntity, Long> {
    Page<LigaEntity> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
    Page<LigaEntity> findByIdEquipo(Long idEquipo, Pageable pageable);
}
