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

    public CarritoEntity get(Long id) {
        return oCarritoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado con id: " + id));
    }

    public Page<CarritoEntity> getPage(Pageable pageable) {
        return oCarritoRepository.findAll(pageable);
    }

    public CarritoEntity create(CarritoEntity carrito) {
        carrito.setId(null);
        return oCarritoRepository.save(carrito);
    }

    public CarritoEntity update(CarritoEntity carrito) {
        CarritoEntity existingCarrito = oCarritoRepository.findById(carrito.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado con id: " + carrito.getId()));
        existingCarrito.setCantidad(carrito.getCantidad());
        //existingCarrito.setIdArticulo(carrito.getIdArticulo());
        //existingCarrito.setIdUsuario(carrito.getIdUsuario());
        return oCarritoRepository.save(existingCarrito);
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