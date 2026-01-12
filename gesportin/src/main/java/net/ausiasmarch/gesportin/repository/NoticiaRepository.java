package net.ausiasmarch.gesportin.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.NoticiaEntity;

public interface NoticiaRepository extends JpaRepository<NoticiaEntity, Long> {

    
    Page<NoticiaEntity> findByPublicadoTrue(Pageable oPageable);

    Page<NoticiaEntity> findByPublicadoFalse(Pageable oPageable);

    NoticiaEntity findByIdAndPublicadoTrue(Long id);

}
