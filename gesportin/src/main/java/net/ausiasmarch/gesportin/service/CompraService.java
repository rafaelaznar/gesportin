package net.ausiasmarch.gesportin.service;

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

    @Autowired
    private SessionService oSessionService;

    public CompraEntity get(Long id) {
        CompraEntity e = oCompraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compra no encontrada con id: " + id));
        if (oSessionService.isEquipoAdmin()) {
            Long clubArt = e.getArticulo().getTipoarticulo().getClub().getId();
            Long clubFac = e.getFactura().getUsuario().getClub().getId();
            oSessionService.checkSameClub(clubArt);
            oSessionService.checkSameClub(clubFac);
        }
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            if (!currentUserId.equals(e.getFactura().getUsuario().getId())) {
                throw new UnauthorizedException("Acceso denegado: solo puede ver sus propias compras");
            }
            oSessionService.checkSameClub(e.getArticulo().getTipoarticulo().getClub().getId());
        }
        return e;
    }

    public Page<CompraEntity> getPage(Pageable pageable, Long id_articulo, Long id_factura) {
        if (oSessionService.isEquipoAdmin()) {
            Long myClub = oSessionService.getIdClub();
            if (id_articulo != null) {
                Long clubArt = oArticuloService.get(id_articulo).getTipoarticulo().getClub().getId();
                if (!myClub.equals(clubArt)) {
                    throw new UnauthorizedException("Acceso denegado: solo compras de su club");
                }
            }
            if (id_factura != null) {
                Long clubFac = oFacturaService.get(id_factura).getUsuario().getClub().getId();
                if (!myClub.equals(clubFac)) {
                    throw new UnauthorizedException("Acceso denegado: solo compras de su club");
                }
            }
            if (id_articulo == null && id_factura == null) {
                return oCompraRepository.findByArticuloTipoarticuloClubId(myClub, pageable);
            }
        }
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            if (id_factura != null) {
                if (!currentUserId.equals(oFacturaService.get(id_factura).getUsuario().getId())) {
                    throw new UnauthorizedException("Acceso denegado: solo puede ver sus propias compras");
                }
            } else if (id_articulo == null) {
                return oCompraRepository.findByFacturaUsuarioId(currentUserId, pageable);
            }
            // when filtering by articulo, ensure it belongs to the user's club
            if (id_articulo != null) {
                Long userClub = oSessionService.getIdClub();
                Long articuloClub = oArticuloService.get(id_articulo).getTipoarticulo().getClub().getId();
                if (!userClub.equals(articuloClub)) {
                    throw new UnauthorizedException("Acceso denegado: solo compras de su club");
                }
            }
        }
        if (id_articulo != null) {
            return oCompraRepository.findByArticuloId(id_articulo, pageable);
        } else if (id_factura != null) {
            return oCompraRepository.findByFacturaId(id_factura, pageable);
        } else {
            return oCompraRepository.findAll(pageable);
        }

    }

    public CompraEntity create(CompraEntity oCompraEntity) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: equipo‑admin no puede crear compras");
        }
        if (oSessionService.isUsuario()) {
            throw new UnauthorizedException("Acceso denegado: utilice el proceso de compra del carrito");
        }
        oCompraEntity.setArticulo(oArticuloService.get(oCompraEntity.getArticulo().getId()));
        oCompraEntity.setFactura(oFacturaService.get(oCompraEntity.getFactura().getId()));
        oCompraEntity.setId(null);
        return oCompraRepository.save(oCompraEntity);
    }

    public CompraEntity update(CompraEntity oCompraEntity) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: equipo‑admin no puede modificar compras");
        }
        if (oSessionService.isUsuario()) {
            throw new UnauthorizedException("Acceso denegado: no puede modificar compras directamente");
        }
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
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: equipo‑admin no puede borrar compras");
        }
        if (oSessionService.isUsuario()) {
            throw new UnauthorizedException("Acceso denegado: no puede borrar compras directamente");
        }
        CompraEntity oCompra = oCompraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compra no encontrada con id: " + id));
        oCompraRepository.delete(oCompra);
        return id;
    }

    public Long count() {
        return oCompraRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oCompraRepository.deleteAll();
        oCompraRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (long j = 0; j < cantidad; j++) {
            CompraEntity oCompra = new CompraEntity();
            oCompra.setCantidad(oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 50));
            oCompra.setPrecio(oAleatorioService.generarNumeroAleatorioDecimalEnRango(5, 500));
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
