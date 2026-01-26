package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.CompraEntity;
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
    private ArticuloService oArticuloService;

    @Autowired
    private FacturaService oFacturaService;

    @Autowired
    private AleatorioService oAleatorioService;

    public CompraEntity get(Long id) {
        return oCompraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compra no encontrada con id: " + id));
    }

    public Page<CompraEntity> getPage(Pageable pageable, Long id_articulo, Long id_factura) {
        if (id_articulo != null) {
            return oCompraRepository.findByArticuloId(id_articulo, pageable);
        } else if (id_factura != null) {
            return oCompraRepository.findByFacturaId(id_factura, pageable);
        } else {
            return oCompraRepository.findAll(pageable);
        }

    }

    public CompraEntity create(CompraEntity oCompraEntity) {
        oCompraEntity.setId(null);
        oCompraEntity.setArticulo(oArticuloService.get(oCompraEntity.getArticulo().getId()));
        oCompraEntity.setFactura(oFacturaService.get(oCompraEntity.getFactura().getId()));
        return oCompraRepository.save(oCompraEntity);
    }

    public CompraEntity update(CompraEntity oCompraEntity) {
        CompraEntity oCompraExistente = oCompraRepository.findById(oCompraEntity.getId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Compra no encontrada con id: " + oCompraEntity.getId()));
        oCompraExistente.setCantidad(oCompraEntity.getCantidad());
        oCompraExistente.setPrecio(oCompraEntity.getPrecio());
        oCompraExistente.setArticulo(oArticuloService.get(oCompraEntity.getArticulo().getId()));
        oCompraExistente.setFactura(oFacturaService.get(oCompraEntity.getFactura().getId()));
        return oCompraRepository.save(oCompraExistente);
    }

    public Long delete(Long id) {
        CompraEntity oCompra = oCompraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compra no encontrada con id: " + id));
        oCompraRepository.delete(oCompra);
        return id;
    }

    public Long count() {
        return oCompraRepository.count();
    }

    public Long empty() {
        oCompraRepository.deleteAll();
        oCompraRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        for (long j = 0; j < cantidad; j++) {
            CompraEntity oCompra = new CompraEntity();
            oCompra.setCantidad(oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 50));
            Long totalArticulos = oArticuloRepository.count();
            if (totalArticulos > 0) {
                // List<ArticuloEntity> articulos = oArticuloRepository.findAll();
                // ArticuloEntity articulo =
                // articulos.get(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0,
                // articulos.size() - 1));
                oCompra.setArticulo(oArticuloService.getOneRandom());
                // oCompra.setPrecio(articulo.getPrecio());
            }
            Long totalFacturas = oFacturaRepository.count();
            if (totalFacturas > 0) {
                // List<FacturaEntity> facturas = oFacturaRepository.findAll();
                // FacturaEntity factura =
                // facturas.get(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0,
                // facturas.size() - 1));
                oCompra.setFactura(oFacturaService.getOneRandom());
            }
            oCompraRepository.save(oCompra);
        }
        return cantidad;
    }

}
