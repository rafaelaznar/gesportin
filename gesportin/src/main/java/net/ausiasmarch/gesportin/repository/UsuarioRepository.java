package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.UsuarioEntity;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long> {
    Page<UsuarioEntity> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
    Page<UsuarioEntity> findByUsernameContainingIgnoreCase(String username, Pageable pageable);
    Page<UsuarioEntity> findByTipousuarioId(Long idTipousuario, Pageable pageable);
    Page<UsuarioEntity> findByClubId(Long idClub, Pageable pageable);
    Page<UsuarioEntity> findByRolusuarioId(Long idRolusuario, Pageable pageable);
}
