package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.CategoriaEntity;

public interface CategoriaRepository extends JpaRepository<CategoriaEntity, Long>{
    
    Page<CategoriaEntity> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);

    Page<CategoriaEntity> findByTemporadaId(Long id_temporada, Pageable pageable);
}
