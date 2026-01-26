package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.CarritoEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.CarritoRepository;

@Service
public class CarritoService {

    @Autowired
    private CarritoRepository oCarritoRepository;

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private ArticuloService oArticuloService;

    @Autowired
    private UsuarioService oUsuarioService;

    public CarritoEntity get(Long id) {
        return oCarritoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado con id: " + id));
    }

    public Page<CarritoEntity> getPage(Pageable oPageable, Long idUsuario, Long idArticulo) {
        if (idUsuario != null) {
            return oCarritoRepository.findUsuarioById(idUsuario, oPageable);
        } else if (idArticulo != null ) {
            return oCarritoRepository.findArticuloById(idArticulo, oPageable);
        } else {
            return oCarritoRepository.findAll(oPageable);
        }
    }

    public CarritoEntity create(CarritoEntity oCarritoEntity) {
        oCarritoEntity.setId(null);
        oCarritoEntity.setArticulo(oArticuloService.get(oCarritoEntity.getArticulo().getId()));
        oCarritoEntity.setUsuario(oUsuarioService.get(oCarritoEntity.getUsuario().getId()));
        return oCarritoRepository.save(oCarritoEntity);
    }

    public CarritoEntity update(CarritoEntity oCarritoEntity) {
        CarritoEntity oCarritoExistente = oCarritoRepository.findById(oCarritoEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado con id: " + oCarritoEntity.getId()));
        oCarritoExistente.setCantidad(oCarritoEntity.getCantidad());
        oCarritoExistente.setArticulo(oArticuloService.get(oCarritoEntity.getArticulo().getId()));
        oCarritoExistente.setUsuario(oUsuarioService.get(oCarritoEntity.getUsuario().getId()));
        return oCarritoRepository.save(oCarritoExistente);
    }

    public Long delete(Long id) {
        CarritoEntity carrito = oCarritoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado con id: " + id));
        oCarritoRepository.delete(carrito);
        return id;
    }

    public Long empty() {
        oCarritoRepository.deleteAll();
        oCarritoRepository.flush();
        return 0L;
    }

    public Long count() {
        return oCarritoRepository.count();
    }

    public Long fill(Long cantidad) {
        for (long i = 0L; i < cantidad; i++) {
            CarritoEntity carrito = new CarritoEntity();
            carrito.setCantidad(oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 50));
            //carrito.setIdArticulo((long) oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 50));
            //carrito.setIdUsuario((long) oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 50));
            oCarritoRepository.save(carrito);
        }
        return cantidad;
    }}