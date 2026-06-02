package net.ausiasmarch.gesportin.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import net.ausiasmarch.gesportin.entity.UsuarioEntity;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long> {
    Page<UsuarioEntity> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
    Page<UsuarioEntity> findByUsernameContainingIgnoreCase(String username, Pageable pageable);
    Optional<UsuarioEntity> findFirstByUsername(String username);
    Optional<UsuarioEntity> findFirstByUsernameAndPassword(String username, String password);
    Page<UsuarioEntity> findByTipousuarioId(Long idTipousuario, Pageable pageable);
    Page<UsuarioEntity> findByClubId(Long idClub, Pageable pageable);
    Page<UsuarioEntity> findByRolusuarioId(Long idRolusuario, Pageable pageable);
    Page<UsuarioEntity> findByClubIdAndTipousuarioId(Long idClub, Long idTipousuario, Pageable pageable);

    @Query("SELECT COUNT(c) FROM ComentarioEntity c WHERE c.usuario.id = :usuarioId")
    int countComentariosByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT COUNT(p) FROM PuntuacionEntity p WHERE p.usuario.id = :usuarioId")
    int countPuntuacionesByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT COUNT(ca) FROM ComentarioartEntity ca WHERE ca.usuario.id = :usuarioId")
    int countComentarioartsByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT COUNT(ca) FROM CarritoEntity ca WHERE ca.usuario.id = :usuarioId")
    int countCarritosByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT COUNT(f) FROM FacturaEntity f WHERE f.usuario.id = :usuarioId")
    int countFacturasByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT COUNT(e) FROM EquipoEntity e WHERE e.entrenador.id = :usuarioId")
    int countEquiposEntrenadosByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT COUNT(j) FROM JugadorEntity j WHERE j.usuario.id = :usuarioId")
    int countJugadoresByUsuarioId(@Param("usuarioId") Long usuarioId);
}
