package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.CompraEntity;

public interface CompraRepository extends JpaRepository<CompraEntity, Long> {

    Page<CompraEntity> findByIdFactura(Long idFactura, Pageable oPageable);

    Page<CompraEntity> findByIdArticulo(Long idArticulo, Pageable oPageable);

}