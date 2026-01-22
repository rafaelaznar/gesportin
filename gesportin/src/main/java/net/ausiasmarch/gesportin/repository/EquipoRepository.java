package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.EquipoEntity;

public interface EquipoRepository extends JpaRepository<EquipoEntity, Long> {
    
        Page<EquipoEntity> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);

        Page<EquipoEntity> findByCategoriaId(Long idCategoria, Pageable pageable);    

        Page<EquipoEntity> findByEntrenadorId(Long idEntrenador, Pageable pageable);    
}
