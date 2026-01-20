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
    private FacturaRepository oFacturaRepository;

    @Autowired
    private FacturaEntity oFacturaEntity;

    @Autowired
    private UsuarioService oUsuarioService;

    public FacturaEntity get(Long id) {
        return oFacturaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Factura no encontrado con id: " + id));
    }

    public Page<FacturaEntity> getPage(Pageable pageable) {
        return oFacturaRepository.findAll(pageable);
    }

    public FacturaEntity create(FacturaEntity factura) {
        factura.setId(null);
        factura.setFecha(LocalDateTime.now());
        factura.setUsuario(oUsuarioService.get(oFacturaEntity.getUsuario().getId()));
        return oFacturaRepository.save(factura);
    }

    public FacturaEntity update(FacturaEntity factura) {
        FacturaEntity existingFactura = oFacturaRepository.findById(factura.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Factura no encontrado con id: " + factura.getId()));
        existingFactura.setUsuario(oUsuarioService.get(oFacturaEntity.getUsuario().getId()));
        existingFactura.setFecha(factura.getFecha());
        return oFacturaRepository.save(existingFactura);
    }

    public Long delete(Long id) {
        FacturaEntity factura = oFacturaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Factura no encontrado con id: " + id));
        oFacturaRepository.delete(factura);
        return id;
    }

    public Long empty() {
        oFacturaRepository.deleteAll();
        oFacturaRepository.flush();
        return 0L;
    }

    public Long count() {
        return oFacturaRepository.count();
    }

    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            FacturaEntity factura = new FacturaEntity();
            factura.setFecha(LocalDateTime.now());
            factura.setUsuario(oUsuarioService.getOneRandom());
            oFacturaRepository.save(factura);
        }
        return cantidad;
    }

    public FacturaEntity getOneRandom() {
        Long count = oFacturaRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oFacturaRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }

}
