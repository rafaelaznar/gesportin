package net.ausiasmarch.gesportin.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.ArticuloEntity;
import net.ausiasmarch.gesportin.entity.CompraEntity;
import net.ausiasmarch.gesportin.entity.FacturaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.ArticuloRepository;
import net.ausiasmarch.gesportin.repository.CompraRepository;
import net.ausiasmarch.gesportin.repository.FacturaRepository;

@Service
public class CompraService {

    @Autowired
    CompraRepository oCompraRepository;

    @Autowired
    ArticuloRepository oArticuloRepository;

    @Autowired
    FacturaRepository oFacturaRepository;

    @Autowired
    AleatorioService oAleatorioService;

    public Long fill(Long cantidad) {

        for (long j = 0; j < cantidad; j++) {
            // crea entity compra y la rellena con datos aleatorios
            CompraEntity oCompraEntity = new CompraEntity();
            // generar cantidad aleatoria entre 1 y 50
            oCompraEntity.setCantidad(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            // obtener un articulo aleatorio de la base de datos
            Long totalArticulos = oArticuloRepository.count();
            if (totalArticulos > 0) {
                List<ArticuloEntity> alArticulos = oArticuloRepository.findAll();
                ArticuloEntity oArticulo = alArticulos.get(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, alArticulos.size() - 1));
                oCompraEntity.setIdArticulo(oArticulo.getId());
                // usar el precio del articulo
                oCompraEntity.setPrecio(oArticulo.getPrecio());
            }
            // obtener una factura aleatoria de la base de datos
            Long totalFacturas = oFacturaRepository.count();
            if (totalFacturas > 0) {
                List<FacturaEntity> alFacturas = oFacturaRepository.findAll();
                FacturaEntity oFactura = alFacturas.get(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, alFacturas.size() - 1));
                oCompraEntity.setIdFactura(oFactura.getId());
            }
            // guardar entity en base de datos
            oCompraRepository.save(oCompraEntity);
        }
        return cantidad;
    }

    // ----------------------------CRUD---------------------------------
    public CompraEntity get(Long id) {
        return oCompraRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Compra not found"));
    }

    public CompraEntity create(CompraEntity compraEntity) {
        compraEntity.setId(null);
        return oCompraRepository.save(compraEntity);
    }

    public CompraEntity update(CompraEntity compraEntity) {
        CompraEntity existingCompra = oCompraRepository.findById(compraEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Compra not found"));
        existingCompra.setCantidad(compraEntity.getCantidad());
        existingCompra.setPrecio(compraEntity.getPrecio());
        existingCompra.setIdArticulo(compraEntity.getIdArticulo());
        existingCompra.setIdFactura(compraEntity.getIdFactura());
        return oCompraRepository.save(existingCompra);
    }

    public Long delete(Long id) {
        oCompraRepository.deleteById(id);
        return id;
    }

    public Page<CompraEntity> getPage(Pageable oPageable) {
        return oCompraRepository.findAll(oPageable);
    }

    public Long count() {
        return oCompraRepository.count();
    }

    // vaciar tabla compra (solo administrador más adelante)
    public Long empty() {
        oCompraRepository.deleteAll();
        oCompraRepository.flush();
        return 0L;
    }

}
