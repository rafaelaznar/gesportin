package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.FacturaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.FacturaRepository;

@Service
public class FacturaService {

    @Autowired
    FacturaRepository oFacturaRepository;

    @Autowired
    AleatorioService oAleatorioService;

    public FacturaEntity get(Long id) {
    return oFacturaRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Factura no encontrada"));
    }

    public FacturaEntity create(FacturaEntity facturaEntity) {
        facturaEntity.setId(null);
        facturaEntity.setFecha(LocalDateTime.now());
        Long idUsuario = facturaEntity.getIdUsuario();
        if (idUsuario == null || idUsuario <= 0) {
            facturaEntity.setIdUsuario((long)oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
        }
        return oFacturaRepository.save(facturaEntity);
    }

    public FacturaEntity update(FacturaEntity facturaEntity) {
        FacturaEntity existingFacturaCompra = oFacturaRepository.findById(facturaEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Factura no encontrada"));
        existingFacturaCompra.setIdUsuario(facturaEntity.getIdUsuario());
        existingFacturaCompra.setFecha(facturaEntity.getFecha());
        return oFacturaRepository.save(existingFacturaCompra);
    }

    public Long delete(Long id) {
        FacturaEntity factura = oFacturaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Factura no encontrada"));
        oFacturaRepository.delete(factura);
        return id;
    }

    public Page<FacturaEntity> getPage(Pageable oPageable) {
        return oFacturaRepository.findAll(oPageable);
    }

    public Long count() {
        return oFacturaRepository.count();
    }

    public Long fill(Long numQuestions) {
        for (int i = 0; i < numQuestions; i++) {
            FacturaEntity oFacturaEntity = new FacturaEntity();
            oFacturaEntity.setFecha(LocalDateTime.now());
            oFacturaEntity.setIdUsuario((long)oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            oFacturaRepository.save(oFacturaEntity);
        }
        return numQuestions;
    }

    public Long empty() {
        oFacturaRepository.deleteAll();
        oFacturaRepository.flush();
        return 0L;
    }
}