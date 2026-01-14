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
    AleatorioService oAleatorioService;

    // ----------------------------CRUD---------------------------------
    public PagoEntity get(Long id) {
        return oPagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado"));
    }

    public PagoEntity create(PagoEntity pagoEntity) {
        pagoEntity.setId(null);
        return oPagoRepository.save(pagoEntity);
    }

    public PagoEntity update(PagoEntity pagoEntity) {
        PagoEntity existingPago = oPagoRepository.findById(pagoEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado"));
        existingPago.setIdCuota(pagoEntity.getIdCuota());
        existingPago.setIdJugador(pagoEntity.getIdJugador());
        existingPago.setAbonado(pagoEntity.getAbonado());
        existingPago.setFecha(pagoEntity.getFecha());
        return oPagoRepository.save(existingPago);
    }

    public Long delete(Long id) {
        oPagoRepository.deleteById(id);
        return id;
    }

    public Page<PagoEntity> getPage(Pageable oPageable) {
        return oPagoRepository.findAll(oPageable);
    }

    public Long count() {
        return oPagoRepository.count();
    }


    // vaciar tabla pago
    public Long empty() {
        oPagoRepository.deleteAll();
        oPagoRepository.flush();
        return 0L;
    }

    // llenar tabla pago con datos de prueba
    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            PagoEntity pago = new PagoEntity();
            pago.setIdCuota((Long) (long) oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            pago.setIdJugador((Long) (long) oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            pago.setAbonado(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, 1));
            pago.setFecha(LocalDateTime.now());
            oPagoRepository.save(pago);
        }
        return cantidad;
    }
}
