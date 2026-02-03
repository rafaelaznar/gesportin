package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.CarritoEntity;

public interface CarritoRepository extends JpaRepository<CarritoEntity, Long> {

    Page<CarritoEntity> findByUsuarioId(Long idUsuario, Pageable pageable);

    Page<CarritoEntity> findByArticuloId(Long idArticulo, Pageable pageable);
}
