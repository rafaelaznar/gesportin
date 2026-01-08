package net.ausiasmarch.gesportin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.ausiasmarch.gesportin.entity.PuntuacionEntity;

@Repository
public interface PuntuacionRepository extends JpaRepository<PuntuacionEntity, Long> {
}
