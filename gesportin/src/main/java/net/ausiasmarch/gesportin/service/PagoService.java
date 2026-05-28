package net.ausiasmarch.gesportin.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.JugadorEntity;
import net.ausiasmarch.gesportin.entity.PagoEntity;
import net.ausiasmarch.gesportin.entity.PaymentSessionEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.PagoRepository;
import net.ausiasmarch.gesportin.repository.PaymentSessionRepository;

@Service
public class PagoService {

    @Autowired
    PagoRepository oPagoRepository;

    @Autowired
    PaymentSessionRepository oPaymentSessionRepository;

    @Autowired
    CuotaService oCuotaService;

    @Autowired
    JugadorService oJugadorService;

    @Autowired
    AleatorioService oAleatorioService;

    @Autowired
    SessionService oSessionService;

    public PagoEntity get(Long id) {
        PagoEntity e = oPagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubCuota = e.getCuota().getEquipo().getCategoria().getTemporada().getClub().getId();
            Long clubJugador = e.getJugador().getUsuario().getClub().getId();
            oSessionService.checkSameClub(clubCuota);
            oSessionService.checkSameClub(clubJugador);
        }
        return e;
    }

    public Page<PagoEntity> getPage(Pageable oPageable, Long idCuota, Long idJugador) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (idCuota != null) {
                Long clubC = oCuotaService.get(idCuota).getEquipo().getCategoria().getTemporada().getClub().getId();
                if (!myClub.equals(clubC)) {
                    throw new UnauthorizedException("Acceso denegado: solo pagos de su club");
                }
            }
            if (idJugador != null) {
                Long clubJ = oJugadorService.get(idJugador).getUsuario().getClub().getId();
                if (!myClub.equals(clubJ)) {
                    throw new UnauthorizedException("Acceso denegado: solo pagos de su club");
                }
            }
            if (idCuota == null && idJugador == null) {
                return oPagoRepository.findByCuotaEquipoCategoriaTemporadaClubId(myClub, oPageable);
            }
        }
        if (idCuota != null) {
            return oPagoRepository.findByCuotaId(idCuota, oPageable);
        } else if (idJugador != null) {
            return oPagoRepository.findByJugadorId(idJugador, oPageable);
        } else {
            return oPagoRepository.findAll(oPageable);
        }
    }

    public PagoEntity create(PagoEntity oPagoEntity) {
        if (oSessionService.isUsuario()) {
            // Usuario can only create a pago for their own jugador record
            JugadorEntity jugador = oJugadorService.get(oPagoEntity.getJugador().getId());
            if (!jugador.getUsuario().getId().equals(oSessionService.getIdUsuario())) {
                throw new UnauthorizedException("Acceso denegado: solo puede pagar sus propias cuotas");
            }
            Long clubCuota = oCuotaService.get(oPagoEntity.getCuota().getId())
                    .getEquipo().getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubCuota);
        } else if (oSessionService.isEquipoAdmin()) {
            Long clubC = oCuotaService.get(oPagoEntity.getCuota().getId())
                    .getEquipo().getCategoria().getTemporada().getClub().getId();
            Long clubJ = oJugadorService.get(oPagoEntity.getJugador().getId())
                    .getUsuario().getClub().getId();
            oSessionService.checkSameClub(clubC);
            oSessionService.checkSameClub(clubJ);
        }
        oPagoEntity.setId(null);
        oPagoEntity.setFecha(LocalDateTime.now());
        oPagoEntity.setCuota(oCuotaService.get(oPagoEntity.getCuota().getId()));
        oPagoEntity.setJugador(oJugadorService.get(oPagoEntity.getJugador().getId()));
        return oPagoRepository.save(oPagoEntity);
    }

    public PagoEntity update(PagoEntity oPagoEntity) {
        oSessionService.denyUsuario();
        PagoEntity oPagoExistente = oPagoRepository.findById(oPagoEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado con id: " + oPagoEntity.getId()));
        if (oSessionService.isEquipoAdmin()) {
            Long clubOldC = oPagoExistente.getCuota().getEquipo().getCategoria().getTemporada().getClub().getId();
            Long clubOldJ = oPagoExistente.getJugador().getUsuario().getClub().getId();
            Long clubNewC = oCuotaService.get(oPagoEntity.getCuota().getId())
                    .getEquipo().getCategoria().getTemporada().getClub().getId();
            Long clubNewJ = oJugadorService.get(oPagoEntity.getJugador().getId())
                    .getUsuario().getClub().getId();
            oSessionService.checkSameClub(clubOldC);
            oSessionService.checkSameClub(clubOldJ);
            oSessionService.checkSameClub(clubNewC);
            oSessionService.checkSameClub(clubNewJ);
        }
        oPagoExistente.setCuota(oCuotaService.get(oPagoEntity.getCuota().getId()));
        oPagoExistente.setJugador(oJugadorService.get(oPagoEntity.getJugador().getId()));
        oPagoExistente.setFecha(oPagoEntity.getFecha());
        return oPagoRepository.save(oPagoExistente);
    }

    public Long delete(Long id) {
        oSessionService.denyUsuario();
        PagoEntity oPago = oPagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin()) {
            Long clubId = oPago.getCuota().getEquipo().getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        oPagoRepository.delete(oPago);
        return id;
    }

    public Long count() {
        if (oSessionService.isEquipoAdmin()) {
            Long myClub = oSessionService.getIdClub();
            if (myClub == null) return 0L;
            return oPagoRepository.findByCuotaEquipoCategoriaTemporadaClubId(myClub, Pageable.ofSize(1)).getTotalElements();
        }
        return oPagoRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oPagoRepository.deleteAll();
        oPagoRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (int i = 0; i < cantidad; i++) {
            PagoEntity oPagoNuevo = new PagoEntity();
            // La cuota y el jugador deben pertenecer al mismo equipo
            net.ausiasmarch.gesportin.entity.CuotaEntity cuota = oCuotaService.getOneRandom();
            Long equipoId = cuota.getEquipo().getId();
            net.ausiasmarch.gesportin.entity.JugadorEntity jugador = oJugadorService.getOneRandomFromEquipo(equipoId);
            if (jugador == null) {
                continue;
            }
            // unicidad: un jugador no puede pagar la misma cuota dos veces
            if (oPagoRepository.existsByCuotaIdAndJugadorId(cuota.getId(), jugador.getId())) {
                continue;
            }
            oPagoNuevo.setCuota(cuota);
            oPagoNuevo.setJugador(jugador);
            oPagoNuevo.setFecha(LocalDateTime.now());
            // ~50% de los pagos generados se marcan como pagados con una payment session
            if (Math.random() < 0.5) {
                PaymentSessionEntity session = new PaymentSessionEntity();
                session.setSessionToken(UUID.randomUUID().toString().replace("-", ""));
                session.setTipo("CUOTA");
                session.setIdReferencia(jugador.getId());
                session.setIdCuota(cuota.getId());
                session.setEstado("COMPLETADO");
                session.setImporte(cuota.getCantidad().setScale(2, java.math.RoundingMode.HALF_UP));
                session.setDescripcion("Pago cuota: " + cuota.getDescripcion());
                session.setFecha(LocalDateTime.now());
                session = oPaymentSessionRepository.save(session);
                oPagoNuevo.setPaymentSession(session);
            }
            PagoEntity saved = oPagoRepository.save(oPagoNuevo);
            // Actualizar idResultado de la session con el id del pago creado
            if (saved.getPaymentSession() != null) {
                PaymentSessionEntity s = saved.getPaymentSession();
                s.setIdResultado(saved.getId());
                oPaymentSessionRepository.save(s);
            }
        }
        return cantidad;
    }


}
