package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.JugadorEntity;

public interface JugadorRepository extends JpaRepository<JugadorEntity, Long> {
    Page<JugadorEntity> findByPosicionContainingIgnoreCase(String posicion, Pageable pageable);

    Page<JugadorEntity> findByUsuarioId(Long idUsuario, Pageable pageable);

    Page<JugadorEntity> findByEquipoId(Long idEquipo, Pageable pageable);

}
