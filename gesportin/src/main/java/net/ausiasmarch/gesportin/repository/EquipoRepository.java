package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.EquipoEntity;

public interface EquipoRepository extends JpaRepository<EquipoEntity, Long> {
    
        Page<EquipoEntity> findByDescripcionContainingIgnoreCase(String descripcion, Pageable pageable);

        Page<EquipoEntity> findByCuotaId(Long idCuota, Pageable pageable);    

        Page<EquipoEntity> findByUsuarioId(Long idUsuario, Pageable pageable);    
    
}
