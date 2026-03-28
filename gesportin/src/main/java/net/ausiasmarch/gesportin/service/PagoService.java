package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.PagoEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.PagoRepository;

@Service
public class PagoService {

    @Autowired
    PagoRepository oPagoRepository;

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
        oSessionService.denyUsuario();
        if (oSessionService.isEquipoAdmin()) {
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
        oPagoExistente.setAbonado(oPagoEntity.getAbonado());
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
            // la cuota y el jugador deben ser del mismo club -> pte
            oPagoNuevo.setCuota(oCuotaService.getOneRandom());
            oPagoNuevo.setJugador(oJugadorService.getOneRandom());
            oPagoNuevo.setAbonado(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 1) == 1);
            oPagoNuevo.setFecha(LocalDateTime.now());
            oPagoRepository.save(oPagoNuevo);
        }
        return cantidad;
    }


}
