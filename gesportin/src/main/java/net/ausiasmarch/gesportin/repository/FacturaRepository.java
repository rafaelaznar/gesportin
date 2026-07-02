package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import net.ausiasmarch.gesportin.entity.FacturaEntity;

public interface FacturaRepository extends JpaRepository<FacturaEntity, Long> {

    Page<FacturaEntity> findByUsuarioId(Long idUsuario, Pageable pageable);
    // equipo-admin: invoices of users belonging to a club
    Page<FacturaEntity> findByUsuarioClubId(Long clubId, Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM CompraEntity c WHERE c.factura.id = :facturaId")
    int countComprasByFacturaId(@Param("facturaId") Long facturaId);

    @Query("SELECT COALESCE(SUM(c.cantidad * c.precio), 0.0) FROM CompraEntity c WHERE c.factura.id = :facturaId")
    Double sumComprasByFacturaId(@Param("facturaId") Long facturaId);
}