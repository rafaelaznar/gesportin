package net.ausiasmarch.gesportin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import net.ausiasmarch.gesportin.entity.ComentarioEntity;

public interface ComentarioRepository extends JpaRepository<ComentarioEntity, Long> {
    Page<ComentarioEntity> findByContenidoContainingIgnoreCase(String contenido, Pageable pageable);
    Page<ComentarioEntity> findByIdUsuario(Long id_usuario, Pageable pageable);
    Page<ComentarioEntity> findByIdNoticia(Long id_noticia, Pageable pageable);

}
