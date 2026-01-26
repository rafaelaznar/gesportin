package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.PartidoEntity;

public interface PartidoRepository extends JpaRepository<PartidoEntity, Long> {

    Page<PartidoEntity> findByLigaId(Long id_liga, Pageable pageable);
    
}
