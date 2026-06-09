package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import net.ausiasmarch.gesportin.entity.JugadorEntity;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;

public interface JugadorRepository extends JpaRepository<JugadorEntity, Long> {
    Page<JugadorEntity> findByPosicionContainingIgnoreCase(String posicion, Pageable pageable);

    Page<JugadorEntity> findByUsuarioId(Long idUsuario, Pageable pageable);

    Page<JugadorEntity> findByEquipoId(Long idEquipo, Pageable pageable);

    // club-restricted queries used by equipo administrators
    Page<JugadorEntity> findByUsuarioClubId(Long clubId, Pageable pageable);

    Page<JugadorEntity> findByEquipoCategoriaTemporadaClubId(Long clubId, Pageable pageable);

    // optional shortcut for when no filter is provided: union of both
    default Page<JugadorEntity> findByClubId(Long clubId, Pageable pageable) {
        // this default implementation is not executed by Spring Data; we’ll call one of the above
        throw new UnsupportedOperationException();
    }
    // Unicidad: un usuario no puede estar dos veces como jugador en el mismo equipo
    boolean existsByEquipoIdAndUsuarioId(Long equipoId, Long usuarioId);

    boolean existsByEquipoIdAndUsuarioIdAndIdNot(Long equipoId, Long usuarioId, Long excludeId);

    // Usuarios del club del equipo que aún no están asignados como jugadores en ese equipo
    @Query("SELECT u FROM UsuarioEntity u " +
           "WHERE u.club.id = (SELECT e.categoria.temporada.club.id FROM EquipoEntity e WHERE e.id = :equipoId) " +
           "AND u.id NOT IN (SELECT j.usuario.id FROM JugadorEntity j WHERE j.equipo.id = :equipoId) " +
           "AND ((:nombre IS NULL OR LOWER(u.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))) " +
           "OR (:apellido1 IS NULL OR LOWER(u.apellido1) LIKE LOWER(CONCAT('%', :apellido1, '%'))) " +
           "OR (:apellido2 IS NULL OR LOWER(u.apellido2) LIKE LOWER(CONCAT('%', :apellido2, '%'))))")
    Page<UsuarioEntity> findUsuariosDisponiblesParaEquipo(
            @Param("equipoId") Long equipoId,
            @Param("nombre") String nombre,
            @Param("apellido1") String apellido1,
            @Param("apellido2") String apellido2,
            Pageable pageable);
    
    @Query("SELECT COUNT(p) FROM PagoEntity p WHERE p.jugador.id = :jugadorId")
    int countPagosByJugadorId(@Param("jugadorId") Long jugadorId);
}
