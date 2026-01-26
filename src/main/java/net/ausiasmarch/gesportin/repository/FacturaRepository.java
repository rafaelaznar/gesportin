package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.FacturaEntity;

public interface FacturaRepository extends JpaRepository<FacturaEntity, Long> {

    Page<FacturaEntity> findByUsuarioId(Long idUsuario, Pageable pageable);

}