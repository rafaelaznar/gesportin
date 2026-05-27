package net.ausiasmarch.gesportin.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.PagoEntity;


public interface PagoRepository extends JpaRepository<PagoEntity, Long> {
    
    Page<PagoEntity> findByPaymentSessionIsNotNull(Pageable oPageable);

    Page<PagoEntity> findByPaymentSessionIsNull(Pageable oPageable);

    PagoEntity findByIdAndPaymentSessionIsNotNull(Long id);

    Page<PagoEntity> findByCuotaId(Long idCuota, Pageable oPageable);

    Page<PagoEntity> findByJugadorId(Long idJugador, Pageable oPageable);

    // support equipo-admin restrictions
    Page<PagoEntity> findByCuotaEquipoCategoriaTemporadaClubId(Long clubId, Pageable pageable);
    Page<PagoEntity> findByJugadorUsuarioClubId(Long clubId, Pageable pageable);

    // unicidad: un jugador no puede pagar la misma cuota dos veces
    boolean existsByCuotaIdAndJugadorId(Long cuotaId, Long jugadorId);

    // comprobación de pago ya confirmado por pasarela
    boolean existsByCuotaIdAndJugadorIdAndPaymentSessionIsNotNull(Long cuotaId, Long jugadorId);

    // pago pendiente (sin sesión de pago) para reutilizarlo al confirmar la pasarela
    Optional<PagoEntity> findFirstByCuotaIdAndJugadorIdAndPaymentSessionIsNullOrderByIdDesc(Long cuotaId, Long jugadorId);
}
