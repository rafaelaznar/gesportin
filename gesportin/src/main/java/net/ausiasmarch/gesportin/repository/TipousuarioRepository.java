package net.ausiasmarch.gesportin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import net.ausiasmarch.gesportin.entity.TipousuarioEntity;

public interface TipousuarioRepository extends JpaRepository<TipousuarioEntity, Long> {
    
    @Query("SELECT COUNT(u) FROM UsuarioEntity u WHERE u.tipousuario.id = :tipousuarioId")
    long countUsuariosByTipousuarioId(@Param("tipousuarioId") Long tipousuarioId);
}
