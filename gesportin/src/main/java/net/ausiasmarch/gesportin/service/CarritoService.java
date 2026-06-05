package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.ausiasmarch.gesportin.dto.CarritoDTO;
import net.ausiasmarch.gesportin.entity.CarritoEntity;
import net.ausiasmarch.gesportin.entity.CompraEntity;
import net.ausiasmarch.gesportin.entity.FacturaEntity;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.GeneralException;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.CarritoRepository;
import net.ausiasmarch.gesportin.dtoconverter.CarritoConverter;
import net.ausiasmarch.gesportin.repository.CompraRepository;
import net.ausiasmarch.gesportin.repository.FacturaRepository;

@Service
public class CarritoService {

    @Autowired
    private CarritoRepository oCarritoRepository;

    @Autowired
    private FacturaRepository oFacturaRepository;

    @Autowired
    private CompraRepository oCompraRepository;

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private ArticuloService oArticuloService;

    @Autowired
    private UsuarioService oUsuarioService;

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private CarritoConverter oCarritoConverter;

    public CarritoDTO get(Long id) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: no puede gestionar carritos");
        }
        CarritoEntity carrito = oCarritoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado con id: " + id));
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            if (!currentUserId.equals(carrito.getUsuario().getId())) {
                throw new UnauthorizedException("Acceso denegado: solo puede ver su propio carrito");
            }
            Long userClub = oSessionService.getIdClub();
            Long articuloClub = carrito.getArticulo().getTipoarticulo().getClub().getId();
            if (!userClub.equals(articuloClub)) {
                throw new UnauthorizedException("Acceso denegado: solo puede ver artículos de su club");
            }
        }
        return oCarritoConverter.toDTO(carrito);
    }

    public Page<CarritoDTO> getPage(Pageable pageable, Long id_usuario, Long id_articulo) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: no puede gestionar carritos");
        }
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            if (id_usuario != null && !id_usuario.equals(currentUserId)) {
                throw new UnauthorizedException("Acceso denegado: solo puede ver su propio carrito");
            }
            id_usuario = currentUserId;
        }
        if (id_usuario != null) {
            return oCarritoConverter.toPageDTO(oCarritoRepository.findByUsuarioId(id_usuario, pageable));
        } else if (id_articulo != null) {
            // ensure articulo belongs to user's club when user is a regular usuario
            if (oSessionService.isUsuario()) {
                Long userClub = oSessionService.getIdClub();
                Long articuloClub = oArticuloService.get(id_articulo).getTipoarticulo().getClub().getId();
                if (!userClub.equals(articuloClub)) {
                    throw new UnauthorizedException("Acceso denegado: solo puede ver artículos de su club");
                }
            }
            return oCarritoConverter.toPageDTO(oCarritoRepository.findByArticuloId(id_articulo, pageable));
        } else {
            if (oSessionService.isUsuario()) {
                return oCarritoConverter.toPageDTO(oCarritoRepository.findByUsuarioId(oSessionService.getIdUsuario(), pageable));
            }
            return oCarritoConverter.toPageDTO(oCarritoRepository.findAll(pageable));
        }
    }

    public CarritoDTO create(CarritoEntity carrito) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: no puede gestionar carritos");
        }
        // regular usuarios can only add items for themselves and from their club
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            carrito.setUsuario(oUsuarioService.get(currentUserId));
            Long userClub = oSessionService.getIdClub();
            Long articuloClub = oArticuloService.get(carrito.getArticulo().getId()).getTipoarticulo().getClub().getId();
            if (!userClub.equals(articuloClub)) {
                throw new UnauthorizedException("Acceso denegado: solo puede añadir artículos de su club");
            }
        } else {
            carrito.setUsuario(oUsuarioService.get(carrito.getUsuario().getId()));
        }
        carrito.setId(null);
        carrito.setArticulo(oArticuloService.get(carrito.getArticulo().getId()));
        return oCarritoConverter.toDTO(oCarritoRepository.save(carrito));
    }

    public CarritoDTO update(CarritoEntity carrito) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: no puede gestionar carritos");
        }
        CarritoEntity existente = oCarritoRepository.findById(carrito.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado con id: " + carrito.getId()));
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            if (!currentUserId.equals(existente.getUsuario().getId())) {
                throw new UnauthorizedException("Acceso denegado: solo puede modificar su propio carrito");
            }
            Long userClub = oSessionService.getIdClub();
            Long articuloClub = oArticuloService.get(carrito.getArticulo().getId()).getTipoarticulo().getClub().getId();
            if (!userClub.equals(articuloClub)) {
                throw new UnauthorizedException("Acceso denegado: solo puede usar artículos de su club");
            }
            existente.setUsuario(oUsuarioService.get(currentUserId));
        } else {
            existente.setUsuario(oUsuarioService.get(carrito.getUsuario().getId()));
        }
        existente.setCantidad(carrito.getCantidad());
        existente.setArticulo(oArticuloService.get(carrito.getArticulo().getId()));
        return oCarritoConverter.toDTO(oCarritoRepository.save(existente));
    }

    public Long delete(Long id) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: no puede gestionar carritos");
        }
        CarritoEntity carrito = oCarritoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado con id: " + id));
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            if (!currentUserId.equals(carrito.getUsuario().getId())) {
                throw new UnauthorizedException("Acceso denegado: solo puede eliminar su propio carrito");
            }
            Long userClub = oSessionService.getIdClub();
            Long articuloClub = carrito.getArticulo().getTipoarticulo().getClub().getId();
            if (!userClub.equals(articuloClub)) {
                throw new UnauthorizedException("Acceso denegado: solo puede eliminar artículos de su club");
            }
        }
        oCarritoRepository.delete(carrito);
        return id;
    }

    @Transactional
    public FacturaEntity comprar() {
        if (!oSessionService.isUsuario()) {
            throw new UnauthorizedException("Acceso denegado: solo los usuarios pueden realizar compras");
        }
        Long currentUserId = oSessionService.getIdUsuario();
        List<CarritoEntity> items = oCarritoRepository.findByUsuarioId(currentUserId);
        if (items == null || items.isEmpty()) {
            throw new GeneralException("No se pueden realizar compras sin productos en el carrito");
        }
        UsuarioEntity usuario = oUsuarioService.get(currentUserId);
        FacturaEntity factura = new FacturaEntity();
        factura.setUsuario(usuario);
        factura.setFecha(LocalDateTime.now());
        factura = oFacturaRepository.save(factura);
        for (CarritoEntity item : items) {
            CompraEntity compra = new CompraEntity();
            compra.setArticulo(item.getArticulo());
            compra.setCantidad(item.getCantidad());
            compra.setPrecio(item.getArticulo().getPrecio().doubleValue());
            compra.setFactura(factura);
            oCompraRepository.save(compra);
        }
        oCarritoRepository.deleteAll(items);
        return factura;
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oCarritoRepository.deleteAll();
        oCarritoRepository.flush();
        return 0L;
    }

    public Long count() {
        return oCarritoRepository.count();
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (long i = 0L; i < cantidad; i++) {
            CarritoEntity carrito = new CarritoEntity();
            carrito.setCantidad(oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 50));
            // El usuario debe pertenecer al mismo club que el artículo
            net.ausiasmarch.gesportin.entity.ArticuloEntity articulo = oArticuloService.getOneRandom();
            Long clubId = articulo.getTipoarticulo().getClub().getId();
            net.ausiasmarch.gesportin.entity.UsuarioEntity usuario = oUsuarioService.getOneRandomFromClub(clubId);
            if (usuario == null) {
                continue;
            }
            carrito.setArticulo(articulo);
            carrito.setUsuario(usuario);
            oCarritoRepository.save(carrito);
        }
        return cantidad;
    }
}
