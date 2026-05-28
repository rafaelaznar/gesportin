package net.ausiasmarch.gesportin.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.PaymentSessionEntity;

public interface PaymentSessionRepository extends JpaRepository<PaymentSessionEntity, Long> {

    Optional<PaymentSessionEntity> findBySessionToken(String sessionToken);

    Page<PaymentSessionEntity> findByTipo(String tipo, Pageable pageable);

    Page<PaymentSessionEntity> findByEstado(String estado, Pageable pageable);

    Page<PaymentSessionEntity> findByTipoAndEstado(String tipo, String estado, Pageable pageable);
}
