package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import net.ausiasmarch.gesportin.entity.RolusuarioEntity;

public interface RolusuarioRepository extends JpaRepository<RolusuarioEntity, Long> {
    
    @Query("SELECT COUNT(u) FROM UsuarioEntity u WHERE u.rolusuario.id = :rolusuarioId")
    long countUsuariosByRolusuarioId(@Param("rolusuarioId") Long rolusuarioId);

    Page<RolusuarioEntity> findByDescripcionContainingIgnoreCase(String descripcion, Pageable pageable);    


}
