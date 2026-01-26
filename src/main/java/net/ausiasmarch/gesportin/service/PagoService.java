package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import net.ausiasmarch.gesportin.entity.PagoEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
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

    public PagoEntity get(Long id) {
        return oPagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado con id: " + id));
    }

    public Page<PagoEntity> getPage(Pageable oPageable, Long idCuota, Long idJugador) {
        if (idCuota != null) {
            return oPagoRepository.findByCuotaId(idCuota, oPageable);
        } else if (idJugador != null) {
            return oPagoRepository.findByJugadorId(idJugador, oPageable);
        } else {
            return oPagoRepository.findAll(oPageable);
        }
    }

    public PagoEntity create(PagoEntity oPagoEntity) {
        oPagoEntity.setId(null);
        oPagoEntity.setFecha(LocalDateTime.now());
        oPagoEntity.setCuota(oCuotaService.get(oPagoEntity.getCuota().getId()));
        oPagoEntity.setJugador(oJugadorService.get(oPagoEntity.getJugador().getId()));
        return oPagoRepository.save(oPagoEntity);
    }

    public PagoEntity update(PagoEntity oPagoEntity) {
        PagoEntity oPagoExistente = oPagoRepository.findById(oPagoEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado con id: " + oPagoEntity.getId()));
        oPagoExistente.setCuota(oCuotaService.get(oPagoEntity.getCuota().getId()));
        oPagoExistente.setJugador(oJugadorService.get(oPagoEntity.getJugador().getId()));
        oPagoExistente.setAbonado(oPagoEntity.getAbonado());
        oPagoExistente.setFecha(oPagoEntity.getFecha());
        return oPagoRepository.save(oPagoExistente);
    }

    public Long delete(Long id) {
        PagoEntity oPago = oPagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado con id: " + id));
        oPagoRepository.delete(oPago);
        return id;
    }

    public Long count() {
        return oPagoRepository.count();
    }

    public Long empty() {
        oPagoRepository.deleteAll();
        oPagoRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            PagoEntity oPagoNuevo = new PagoEntity();
            oPagoNuevo.setCuota(oCuotaService.getOneRandom());
            oPagoNuevo.setJugador(oJugadorService.getOneRandom());
            oPagoNuevo.setAbonado(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 1));
            oPagoNuevo.setFecha(LocalDateTime.now());
            oPagoRepository.save(oPagoNuevo);
        }
        return cantidad;
    }


}
