package net.ausiasmarch.gesportin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import net.ausiasmarch.gesportin.entity.EstadopartidoEntity;

public interface EstadopartidoRepository extends JpaRepository<EstadopartidoEntity, Long> {

    @Query("SELECT COUNT(p) FROM PartidoEntity p WHERE p.estadopartido.id = :estadopartidoId")
    int countPartidosByEstadopartidoId(@Param("estadopartidoId") Long estadopartidoId);
}
