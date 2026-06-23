package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import net.ausiasmarch.gesportin.entity.TemporadaEntity;

public interface TemporadaRepository extends JpaRepository<TemporadaEntity, Long> {

    Page<TemporadaEntity> findByClubId(Long id_club, Pageable pageable);

    Page<TemporadaEntity> findByDescripcionContainingIgnoreCase(String descripcion, Pageable pageable);

    Page<TemporadaEntity> findByDescripcionContainingIgnoreCaseAndClubId(String descripcion, Long clubId, Pageable pageable);

    @Query("SELECT COUNT(c) FROM CategoriaEntity c WHERE c.temporada.id = :temporadaId")
    int countCategoriasByTemporadaId(@Param("temporadaId") Long temporadaId);

    @Query("SELECT COUNT(e) FROM EquipoEntity e WHERE e.categoria.temporada.id = :temporadaId")
    int countEquiposByTemporadaId(@Param("temporadaId") Long temporadaId);

    @Query("SELECT COUNT(l) FROM LigaEntity l WHERE l.equipo.categoria.temporada.id = :temporadaId")
    int countLigasByTemporadaId(@Param("temporadaId") Long temporadaId);
}


