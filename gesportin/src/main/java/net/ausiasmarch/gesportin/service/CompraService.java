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
    private CompraRepository oCompraRepository;

    @Autowired
    private ArticuloRepository oArticuloRepository;

    @Autowired
    private FacturaRepository oFacturaRepository;

    @Autowired
    private AleatorioService oAleatorioService;

    public CompraEntity get(Long id) {
        return oCompraRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Compra no encontrada con id: " + id));
    }

    public Page<CompraEntity> getPage(Pageable pageable) {
        return oCompraRepository.findAll(pageable);
    }

    public CompraEntity create(CompraEntity compra) {
        compra.setId(null);
        return oCompraRepository.save(compra);
    }

    public CompraEntity update(CompraEntity compra) {
        CompraEntity existingCompra = oCompraRepository.findById(compra.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Compra no encontrada con id: " + compra.getId()));
        existingCompra.setCantidad(compra.getCantidad());
        existingCompra.setPrecio(compra.getPrecio());
       //existingCompra.setIdArticulo(compra.getIdArticulo());
       //existingCompra.setIdFactura(compra.getIdFactura());
        return oCompraRepository.save(existingCompra);
    }

    public Long delete(Long id) {
        CompraEntity compra = oCompraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compra no encontrada con id: " + id));
        oCompraRepository.delete(compra);
        return id;
    }

    public Long empty() {
        oCompraRepository.deleteAll();
        oCompraRepository.flush();
        return 0L;
    }

    public Long count() {
        return oCompraRepository.count();
    }

    public Long fill(Long cantidad) {
        for (long j = 0; j < cantidad; j++) {
            CompraEntity compra = new CompraEntity();
            compra.setCantidad(oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 50));
            Long totalArticulos = oArticuloRepository.count();
            if (totalArticulos > 0) {
                List<ArticuloEntity> articulos = oArticuloRepository.findAll();
                ArticuloEntity articulo = articulos.get(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, articulos.size() - 1));
                //compra.setIdArticulo(articulo.getId());
                //compra.setPrecio(articulo.getPrecio());
            }
            Long totalFacturas = oFacturaRepository.count();
            if (totalFacturas > 0) {
                List<FacturaEntity> facturas = oFacturaRepository.findAll();
                FacturaEntity factura = facturas.get(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, facturas.size() - 1));
                //compra.setIdFactura(factura.getId());
            }
            oCompraRepository.save(compra);
        }
        return cantidad;
    }

}
