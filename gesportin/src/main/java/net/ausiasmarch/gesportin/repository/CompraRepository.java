package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import net.ausiasmarch.gesportin.entity.CompraEntity;

public interface CompraRepository extends JpaRepository<CompraEntity, Long> {

    @Query("SELECT COALESCE(SUM(c.cantidad * c.precio), 0.0) FROM CompraEntity c WHERE c.articulo.tipoarticulo.id = :id_tipoarticulo")
    Double sumVentasByTipoarticuloId(@Param("id_tipoarticulo") Long idTipoarticulo);

    @Query("SELECT COALESCE(SUM(c.cantidad * c.precio), 0.0) FROM CompraEntity c WHERE c.factura.id = :idFactura")
    Double sumByFacturaId(@Param("idFactura") Long idFactura);

    Page<CompraEntity> findByArticuloId(Long idArticulo, Pageable pageable);

    Page<CompraEntity> findByFacturaId(Long idFactura, Pageable pageable);

    // allow users to see purchases by their factura owner
    Page<CompraEntity> findByFacturaUsuarioId(Long idUsuario, Pageable pageable);

    // helpers for equipo-admin
    Page<CompraEntity> findByArticuloTipoarticuloClubId(Long clubId, Pageable pageable);
    Page<CompraEntity> findByFacturaUsuarioClubId(Long clubId, Pageable pageable);

}