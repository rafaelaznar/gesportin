package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.MensajeChatEntity;

public interface MensajeChatRepository extends JpaRepository<MensajeChatEntity, Long> {
    Page<MensajeChatEntity> findByClubIdOrderByFechaEnvioDesc(Long idClub, Pageable pageable);
    long countByClubId(Long idClub);
}
