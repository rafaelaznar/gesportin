package net.ausiasmarch.gesportin.service;

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

    public Long create(PagoEntity pagoEntity) {
        oPagoRepository.save(pagoEntity);
        return pagoEntity.getId();
    }

    public Long update(PagoEntity pagoEntity) {
        PagoEntity existingPago = oPagoRepository.findById(pagoEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado"));
        existingPago.setId_cuota(pagoEntity.getId_cuota());
        existingPago.setId_usuario(pagoEntity.getId_usuario());
        existingPago.setAbonado(pagoEntity.isAbonado());
        oPagoRepository.save(existingPago);
        return existingPago.getId();
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
        Long total = oPagoRepository.count();
        oPagoRepository.deleteAll();
        return total;
    }

    // llenar tabla pago con datos de prueba
    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            PagoEntity pago = new PagoEntity();
            pago.setId_cuota((Long) (long) oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            pago.setId_usuario((Long) (long) oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            pago.setAbonado(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, 1) == 1);
            oPagoRepository.save(pago);
        }
        return cantidad;
    }
}
