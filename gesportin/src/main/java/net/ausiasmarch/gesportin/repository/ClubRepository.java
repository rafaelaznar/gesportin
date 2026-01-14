package net.ausiasmarch.gesportin.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.ClubEntity;

public interface ClubRepository extends JpaRepository<ClubEntity, Long> {
}
