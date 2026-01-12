package net.ausiasmarch.gesportin.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.CompraEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
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

    @Autowired
    SessionService oSessionService;

    public Long fill(Long cantidad) {

        if (!oSessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }

        for (long j = 0; j < cantidad; j++) {
            // crea entity compra y la rellena con datos aleatorios
            CompraEntity oCompraEntity = new CompraEntity();
            // generar cantidad aleatoria entre 1 y 50
            oCompraEntity.setCantidad(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            // obtener un articulo aleatorio de la base de datos
            Long totalArticulos = oArticuloRepository.count();
            if (totalArticulos > 0) {
                List alArticulos = oArticuloRepository.findAll();
                Object oArticulo = alArticulos.get(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, alArticulos.size() - 1));
                try {
                    oCompraEntity.setId_articulo((Long) oArticulo.getClass().getMethod("getId").invoke(oArticulo));
                    oCompraEntity.setPrecio((BigDecimal) oArticulo.getClass().getMethod("getPrecio").invoke(oArticulo));
                } catch (Exception e) {
                    oCompraEntity.setId_articulo((long) oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 100));
                    oCompraEntity.setPrecio(BigDecimal.valueOf(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1000, 50000) / 100.0));
                }
            } else {
                oCompraEntity.setId_articulo((long) oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 100));
                oCompraEntity.setPrecio(BigDecimal.valueOf(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1000, 50000) / 100.0));
            }
            // obtener una factura aleatoria de la base de datos
            Long totalFacturas = oFacturaRepository.count();
            if (totalFacturas > 0) {
                List alFacturas = oFacturaRepository.findAll();
                Object oFactura = alFacturas.get(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, alFacturas.size() - 1));
                try {
                    oCompraEntity.setId_factura((Long) oFactura.getClass().getMethod("getId").invoke(oFactura));
                } catch (Exception e) {
                    oCompraEntity.setId_factura((long) oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
                }
            } else {
                oCompraEntity.setId_factura((long) oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            }
            // guardar entity en base de datos
            oCompraRepository.save(oCompraEntity);
        }
        return oCompraRepository.count();
    }

    // ----------------------------CRUD---------------------------------
    public CompraEntity get(Long id) {
        return oCompraRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Compra not found"));
    }

    public Long create(CompraEntity compraEntity) {
        if (!oSessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        oCompraRepository.save(compraEntity);
        return compraEntity.getId();
    }

    public Long update(CompraEntity compraEntity) {
        if (!oSessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        CompraEntity existingCompra = oCompraRepository.findById(compraEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Compra not found"));
        existingCompra.setCantidad(compraEntity.getCantidad());
        existingCompra.setPrecio(compraEntity.getPrecio());
        existingCompra.setId_articulo(compraEntity.getId_articulo());
        existingCompra.setId_factura(compraEntity.getId_factura());
        oCompraRepository.save(existingCompra);
        return existingCompra.getId();
    }

    public Long delete(Long id) {
        if (!oSessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        oCompraRepository.deleteById(id);
        return id;
    }

    public Page<CompraEntity> getPage(Pageable oPageable) {
        return oCompraRepository.findAll(oPageable);
    }

    public Long count() {
        return oCompraRepository.count();
    }

    // vaciar tabla compra (solo administrador)
    public Long empty() {
        if (!oSessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        Long total = oCompraRepository.count();
        oCompraRepository.deleteAll();
        return total;
    }

}