package net.ausiasmarch.gesportin.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import net.ausiasmarch.gesportin.entity.NoticiaEntity;

public interface NoticiaRepository extends JpaRepository<NoticiaEntity, Long> {

    Page<NoticiaEntity> findByClubId(Long idClub, Pageable pageable);

    Page<NoticiaEntity> findByTituloContainingIgnoreCaseOrContenidoContainingIgnoreCase(String titulo, String contenido, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT n FROM NoticiaEntity n WHERE n.club.id = :clubId AND (LOWER(n.titulo) LIKE LOWER(CONCAT('%', :texto, '%')) OR LOWER(n.contenido) LIKE LOWER(CONCAT('%', :texto, '%')))")
    Page<NoticiaEntity> findByClubIdAndTextoContainingIgnoreCase(@org.springframework.data.repository.query.Param("clubId") Long clubId, @org.springframework.data.repository.query.Param("texto") String texto, Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM ComentarioEntity c WHERE c.noticia.id = :noticiaId")
    int countComentariosByNoticiaId(@Param("noticiaId") Long noticiaId);
    
    @Query("SELECT COUNT(p) FROM PuntuacionEntity p WHERE p.noticia.id = :noticiaId")
    int countPuntuacionesByNoticiaId(@Param("noticiaId") Long noticiaId);
    
    @Query("SELECT COALESCE(AVG(p.puntuacion), 0.0) FROM PuntuacionEntity p WHERE p.noticia.id = :noticiaId")
    double getAveragePuntuacionByNoticiaId(@Param("noticiaId") Long noticiaId);
}
