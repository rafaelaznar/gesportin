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

    public Page<CarritoEntity> getPage(Pageable pageable, Long id_usuario, Long id_articulo) {
        if (id_usuario != null) {
            return oCarritoRepository.findByUsuarioId(id_usuario, pageable);
        } else if (id_articulo != null) {
            return oCarritoRepository.findByArticuloId(id_articulo, pageable);
        } else {
            return oCarritoRepository.findAll(pageable);
        }
    }

    public CarritoEntity create(CarritoEntity carrito) {
        carrito.setId(null);
        carrito.setArticulo(oArticuloService.get(carrito.getArticulo().getId()));
        carrito.setUsuario(oUsuarioService.get(carrito.getUsuario().getId()));
        return oCarritoRepository.save(carrito);
    }

    public CarritoEntity update(CarritoEntity carrito) {
        CarritoEntity existente = oCarritoRepository.findById(carrito.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado con id: " + carrito.getId()));
        existente.setCantidad(carrito.getCantidad());
        existente.setArticulo(oArticuloService.get(carrito.getArticulo().getId()));
        existente.setUsuario(oUsuarioService.get(carrito.getUsuario().getId()));
        return oCarritoRepository.save(existente);
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
            carrito.setArticulo(oArticuloService.getOneRandom());
            carrito.setUsuario(oUsuarioService.getOneRandom());
            oCarritoRepository.save(carrito);
        }
        return cantidad;
    }
}
