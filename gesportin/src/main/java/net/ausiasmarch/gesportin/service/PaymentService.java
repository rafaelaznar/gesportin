package net.ausiasmarch.gesportin.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.ausiasmarch.gesportin.bean.PaymentConfirmBean;
import net.ausiasmarch.gesportin.bean.PaymentSessionBean;
import net.ausiasmarch.gesportin.entity.CarritoEntity;
import net.ausiasmarch.gesportin.entity.CompraEntity;
import net.ausiasmarch.gesportin.entity.CuotaEntity;
import net.ausiasmarch.gesportin.entity.FacturaEntity;
import net.ausiasmarch.gesportin.entity.JugadorEntity;
import net.ausiasmarch.gesportin.entity.PagoEntity;
import net.ausiasmarch.gesportin.entity.PaymentSessionEntity;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.GeneralException;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.CarritoRepository;
import net.ausiasmarch.gesportin.repository.CompraRepository;
import net.ausiasmarch.gesportin.repository.CuotaRepository;
import net.ausiasmarch.gesportin.repository.FacturaRepository;
import net.ausiasmarch.gesportin.repository.JugadorRepository;
import net.ausiasmarch.gesportin.repository.PagoRepository;
import net.ausiasmarch.gesportin.repository.PaymentSessionRepository;
import net.ausiasmarch.gesportin.repository.UsuarioRepository;

@Service
public class PaymentService {

    private static final String ESTADO_PENDIENTE = "PENDIENTE";
    private static final String ESTADO_COMPLETADO = "COMPLETADO";
    private static final String ESTADO_CANCELADO = "CANCELADO";
    private static final String TIPO_TIENDA = "TIENDA";
    private static final String TIPO_CUOTA = "CUOTA";

    @Autowired
    private PaymentSessionRepository oPaymentSessionRepository;

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private CuotaRepository oCuotaRepository;

    @Autowired
    private JugadorRepository oJugadorRepository;

    @Autowired
    private PagoRepository oPagoRepository;

    @Autowired
    private CarritoRepository oCarritoRepository;

    @Autowired
    private FacturaRepository oFacturaRepository;

    @Autowired
    private CompraRepository oCompraRepository;

    @Autowired
    private UsuarioRepository oUsuarioRepository;

    // ---------------------------------------------------------------
    // LISTADO PARA ADMIN Y EQUIPO-ADMIN
    // ---------------------------------------------------------------

    public Page<PaymentSessionEntity> getPage(Pageable pageable, String tipo, String estado) {
        if (!oSessionService.isAdmin() && !oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado");
        }
        boolean hasTipo = tipo != null && !tipo.isBlank();
        boolean hasEstado = estado != null && !estado.isBlank();

        if (hasTipo && hasEstado) {
            return oPaymentSessionRepository.findByTipoAndEstado(tipo, estado, pageable);
        } else if (hasTipo) {
            return oPaymentSessionRepository.findByTipo(tipo, pageable);
        } else if (hasEstado) {
            return oPaymentSessionRepository.findByEstado(estado, pageable);
        } else {
            return oPaymentSessionRepository.findAll(pageable);
        }
    }

    // ---------------------------------------------------------------
    // INICIAR SESIÓN DE PAGO — CUOTA
    // ---------------------------------------------------------------

    public PaymentSessionBean iniciarPagoCuota(Long jugadorId, Long cuotaId) {
        if (!oSessionService.isUsuario()) {
            throw new UnauthorizedException("Acceso denegado: solo los usuarios pueden pagar cuotas");
        }
        Long currentUserId = oSessionService.getIdUsuario();

        JugadorEntity jugador = oJugadorRepository.findById(jugadorId)
                .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado con id: " + jugadorId));

        // El jugador debe pertenecer al usuario logado
        if (!jugador.getUsuario().getId().equals(currentUserId)) {
            throw new UnauthorizedException("Acceso denegado: este jugador no te pertenece");
        }

        CuotaEntity cuota = oCuotaRepository.findById(cuotaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuota no encontrada con id: " + cuotaId));

        // Verificar que la cuota pertenece al mismo club que el usuario
        Long clubCuota = cuota.getEquipo().getCategoria().getTemporada().getClub().getId();
        Long clubUsuario = jugador.getUsuario().getClub().getId();
        if (!clubCuota.equals(clubUsuario)) {
            throw new UnauthorizedException("Acceso denegado: cuota de otro club");
        }

        // Verificar que la cuota no está ya pagada por este jugador
        boolean yaPagado = oPagoRepository.existsByCuotaIdAndJugadorIdAndPaymentSessionIsNotNull(cuotaId, jugadorId);
        if (yaPagado) {
            throw new GeneralException("Esta cuota ya está abonada");
        }

        // Garantiza que existe un registro pendiente (sin sesión) para luego vincularlo al confirmar.
        oPagoRepository.findFirstByCuotaIdAndJugadorIdAndPaymentSessionIsNullOrderByIdDesc(cuotaId, jugadorId)
                .orElseGet(() -> {
                    PagoEntity pagoPendiente = new PagoEntity();
                    pagoPendiente.setCuota(cuota);
                    pagoPendiente.setJugador(jugador);
                    pagoPendiente.setFecha(LocalDateTime.now());
                    return oPagoRepository.save(pagoPendiente);
                });

        String descripcion = "Pago de cuota: " + cuota.getDescripcion()
                + " — Equipo: " + jugador.getEquipo().getNombre()
                + " — Importe: " + cuota.getCantidad() + " €";

        PaymentSessionEntity session = new PaymentSessionEntity();
        session.setSessionToken(UUID.randomUUID().toString());
        session.setTipo(TIPO_CUOTA);
        session.setIdReferencia(jugadorId);
        session.setIdCuota(cuotaId);
        session.setEstado(ESTADO_PENDIENTE);
        session.setImporte(cuota.getCantidad());
        session.setDescripcion(descripcion);
        session.setFecha(LocalDateTime.now());
        oPaymentSessionRepository.save(session);

        return toBean(session);
    }

    // ---------------------------------------------------------------
    // INICIAR SESIÓN DE PAGO — TIENDA
    // ---------------------------------------------------------------

    public PaymentSessionBean iniciarPagoTienda() {
        if (!oSessionService.isUsuario()) {
            throw new UnauthorizedException("Acceso denegado: solo los usuarios pueden comprar en la tienda");
        }
        Long currentUserId = oSessionService.getIdUsuario();

        List<CarritoEntity> items = oCarritoRepository.findByUsuarioId(currentUserId);
        if (items == null || items.isEmpty()) {
            throw new GeneralException("El carrito está vacío");
        }

        BigDecimal total = items.stream()
                .map(item -> {
                    BigDecimal precio = item.getArticulo().getPrecio();
                    BigDecimal descuento = item.getArticulo().getDescuento() != null
                            ? item.getArticulo().getDescuento()
                            : BigDecimal.ZERO;
                    BigDecimal factor = BigDecimal.ONE.subtract(descuento.divide(BigDecimal.valueOf(100)));
                    return precio.multiply(factor).multiply(BigDecimal.valueOf(item.getCantidad()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, java.math.RoundingMode.HALF_UP);

        String descripcion = "Compra en tienda — " + items.size() + " artículo(s) — Total: " + total + " €";

        PaymentSessionEntity session = new PaymentSessionEntity();
        session.setSessionToken(UUID.randomUUID().toString());
        session.setTipo(TIPO_TIENDA);
        session.setIdReferencia(currentUserId);
        session.setEstado(ESTADO_PENDIENTE);
        session.setImporte(total);
        session.setDescripcion(descripcion);
        session.setFecha(LocalDateTime.now());
        oPaymentSessionRepository.save(session);

        return toBean(session);
    }

    // ---------------------------------------------------------------
    // OBTENER INFO DE UNA SESIÓN
    // ---------------------------------------------------------------

    public PaymentSessionBean getSesion(String sessionToken) {
        if (!oSessionService.isUsuario()) {
            throw new UnauthorizedException("Acceso denegado");
        }
        PaymentSessionEntity session = oPaymentSessionRepository.findBySessionToken(sessionToken)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión de pago no encontrada"));

        // Verificar que la sesión pertenece al usuario logado
        Long currentUserId = oSessionService.getIdUsuario();
        if (TIPO_TIENDA.equals(session.getTipo())) {
            if (!session.getIdReferencia().equals(currentUserId)) {
                throw new UnauthorizedException("Acceso denegado: sesión de otro usuario");
            }
        } else {
            JugadorEntity jugador = oJugadorRepository.findById(session.getIdReferencia())
                    .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado"));
            if (!jugador.getUsuario().getId().equals(currentUserId)) {
                throw new UnauthorizedException("Acceso denegado: sesión de otro usuario");
            }
        }

        return toBean(session);
    }

    // ---------------------------------------------------------------
    // CONFIRMAR PAGO
    // ---------------------------------------------------------------

    @Transactional
    public PaymentSessionBean confirmarPago(String sessionToken, PaymentConfirmBean confirmBean) {
        if (!oSessionService.isUsuario()) {
            throw new UnauthorizedException("Acceso denegado");
        }

        PaymentSessionEntity session = oPaymentSessionRepository.findBySessionToken(sessionToken)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión de pago no encontrada"));

        if (!ESTADO_PENDIENTE.equals(session.getEstado())) {
            throw new GeneralException("La sesión de pago ya fue procesada (estado: " + session.getEstado() + ")");
        }

        // Verificar que la sesión pertenece al usuario logado
        Long currentUserId = oSessionService.getIdUsuario();
        if (TIPO_TIENDA.equals(session.getTipo())) {
            if (!session.getIdReferencia().equals(currentUserId)) {
                throw new UnauthorizedException("Acceso denegado: sesión de otro usuario");
            }
        } else {
            JugadorEntity jugador = oJugadorRepository.findById(session.getIdReferencia())
                    .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado"));
            if (!jugador.getUsuario().getId().equals(currentUserId)) {
                throw new UnauthorizedException("Acceso denegado: sesión de otro usuario");
            }
        }

        // Validar datos de tarjeta (simulación — no se almacenan)
        validarTarjeta(confirmBean);

        if (TIPO_CUOTA.equals(session.getTipo())) {
            Long idResultado = procesarPagoCuota(session);
            session.setIdResultado(idResultado);
        } else {
            Long idResultado = procesarPagoTienda(session);
            session.setIdResultado(idResultado);
        }

        session.setEstado(ESTADO_COMPLETADO);
        oPaymentSessionRepository.save(session);

        return toBean(session);
    }

    // ---------------------------------------------------------------
    // CANCELAR SESIÓN DE PAGO
    // ---------------------------------------------------------------

    public PaymentSessionBean cancelarPago(String sessionToken) {
        if (!oSessionService.isUsuario()) {
            throw new UnauthorizedException("Acceso denegado");
        }
        PaymentSessionEntity session = oPaymentSessionRepository.findBySessionToken(sessionToken)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión de pago no encontrada"));

        if (!ESTADO_PENDIENTE.equals(session.getEstado())) {
            throw new GeneralException("La sesión de pago ya fue procesada");
        }

        session.setEstado(ESTADO_CANCELADO);
        oPaymentSessionRepository.save(session);
        return toBean(session);
    }

    // ---------------------------------------------------------------
    // MÉTODOS PRIVADOS
    // ---------------------------------------------------------------

    /** Procesa el pago de una cuota: asocia la payment_session al pago pendiente. */
    private Long procesarPagoCuota(PaymentSessionEntity session) {
        Long jugadorId = session.getIdReferencia();
        Long cuotaId = session.getIdCuota();

        // Doble comprobación: no vincular pago duplicado
        if (oPagoRepository.existsByCuotaIdAndJugadorIdAndPaymentSessionIsNotNull(cuotaId, jugadorId)) {
            throw new GeneralException("Esta cuota ya está abonada");
        }

        PagoEntity pagoPendiente = oPagoRepository
            .findFirstByCuotaIdAndJugadorIdAndPaymentSessionIsNullOrderByIdDesc(cuotaId, jugadorId)
            .orElseGet(() -> {
                // Compatibilidad con sesiones antiguas sin pago pendiente previo.
                JugadorEntity jugador = oJugadorRepository.findById(jugadorId)
                    .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado"));
                CuotaEntity cuota = oCuotaRepository.findById(cuotaId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cuota no encontrada"));
                PagoEntity nuevoPago = new PagoEntity();
                nuevoPago.setCuota(cuota);
                nuevoPago.setJugador(jugador);
                nuevoPago.setFecha(LocalDateTime.now());
                return oPagoRepository.save(nuevoPago);
            });

        pagoPendiente.setPaymentSession(session);
        pagoPendiente.setFecha(LocalDateTime.now());
        pagoPendiente = oPagoRepository.save(pagoPendiente);
        return pagoPendiente.getId();
    }

    /** Procesa la compra de la tienda: crea factura + compras y vacía el carrito. */
    @Transactional
    private Long procesarPagoTienda(PaymentSessionEntity session) {
        Long usuarioId = session.getIdReferencia();

        List<CarritoEntity> items = oCarritoRepository.findByUsuarioId(usuarioId);
        if (items == null || items.isEmpty()) {
            throw new GeneralException("El carrito está vacío");
        }

        UsuarioEntity usuario = oUsuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

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
        return factura.getId();
    }

    /**
     * Validación simulada de tarjeta de crédito.
     * No almacena los datos — solo comprueba el formato.
     */
    private void validarTarjeta(PaymentConfirmBean bean) {
        if (bean.getTitular() == null || bean.getTitular().trim().length() < 3) {
            throw new GeneralException("El nombre del titular no es válido");
        }
        String numero = bean.getNumeroTarjeta() == null ? "" : bean.getNumeroTarjeta().replaceAll("\\s+", "");
        if (!numero.matches("\\d{13,19}")) {
            throw new GeneralException("El número de tarjeta no es válido");
        }
        if (bean.getCaducidad() == null || !bean.getCaducidad().matches("(0[1-9]|1[0-2])/\\d{2}")) {
            throw new GeneralException("La fecha de caducidad no es válida (formato MM/AA)");
        }
        if (bean.getCvv() == null || !bean.getCvv().matches("\\d{3,4}")) {
            throw new GeneralException("El CVV no es válido");
        }
    }

    private PaymentSessionBean toBean(PaymentSessionEntity e) {
        return new PaymentSessionBean(
                e.getSessionToken(),
                e.getTipo(),
                e.getDescripcion(),
                e.getImporte().doubleValue(),
                e.getEstado());
    }
}
