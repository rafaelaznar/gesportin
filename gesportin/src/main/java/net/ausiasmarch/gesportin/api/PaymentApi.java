package net.ausiasmarch.gesportin.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.ausiasmarch.gesportin.bean.PaymentConfirmRequestBean;
import net.ausiasmarch.gesportin.bean.PaymentConfirmBean;
import net.ausiasmarch.gesportin.bean.PaymentSessionBean;
import net.ausiasmarch.gesportin.bean.PaymentSessionTokenBean;
import net.ausiasmarch.gesportin.entity.PaymentSessionEntity;
import net.ausiasmarch.gesportin.service.PaymentService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/payment")
public class PaymentApi {

    @Autowired
    private PaymentService oPaymentService;

    /**
     * Inicia una sesión de pago para una cuota de club.
     * POST /payment/iniciar/cuota/{jugadorId}/{cuotaId}
     */
    @PostMapping("/iniciar/cuota/{jugadorId}/{cuotaId}")
    public ResponseEntity<PaymentSessionBean> iniciarCuota(
            @PathVariable Long jugadorId,
            @PathVariable Long cuotaId) {
        return ResponseEntity.ok(oPaymentService.iniciarPagoCuota(jugadorId, cuotaId));
    }

    /**
     * Inicia una sesión de pago para la tienda (carrito actual del usuario).
     * POST /payment/iniciar/tienda
     */
    @PostMapping("/iniciar/tienda")
    public ResponseEntity<PaymentSessionBean> iniciarTienda() {
        return ResponseEntity.ok(oPaymentService.iniciarPagoTienda());
    }

    /**
     * Obtiene los datos de una sesión de pago por su token sin exponerlo en la URL.
     * POST /payment/sesion
     */
    @PostMapping("/sesion")
    public ResponseEntity<PaymentSessionBean> getSesion(@RequestBody PaymentSessionTokenBean request) {
        return ResponseEntity.ok(oPaymentService.getSesion(request.getSessionToken()));
    }

    /**
     * Confirma el pago enviando los datos de la tarjeta (simulados).
     * POST /payment/confirmar
     */
    @PostMapping("/confirmar")
    public ResponseEntity<PaymentSessionBean> confirmar(@RequestBody PaymentConfirmRequestBean request) {
        PaymentConfirmBean confirmBean = new PaymentConfirmBean(
                request.getTitular(),
                request.getNumeroTarjeta(),
                request.getCaducidad(),
                request.getCvv());
        return ResponseEntity.ok(oPaymentService.confirmarPago(request.getSessionToken(), confirmBean));
    }

    /**
     * Cancela una sesión de pago pendiente.
     * POST /payment/cancelar
     */
    @PostMapping("/cancelar")
    public ResponseEntity<PaymentSessionBean> cancelar(@RequestBody PaymentSessionTokenBean request) {
        return ResponseEntity.ok(oPaymentService.cancelarPago(request.getSessionToken()));
    }

    /**
     * Listado paginado de sesiones de pago para administradores y admins de club.
     * GET /payment/admin/page
     */
    @GetMapping("/admin/page")
    public ResponseEntity<Page<PaymentSessionEntity>> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int rpp,
            @RequestParam(defaultValue = "fecha") String orderField,
            @RequestParam(defaultValue = "desc") String orderDirection,
            @RequestParam(defaultValue = "") String tipo,
            @RequestParam(defaultValue = "") String estado) {
        Sort sort = orderDirection.equalsIgnoreCase("asc")
                ? Sort.by(orderField).ascending()
                : Sort.by(orderField).descending();
        PageRequest pageable = PageRequest.of(page, rpp, sort);
        return ResponseEntity.ok(oPaymentService.getPage(pageable, tipo, estado));
    }
}
