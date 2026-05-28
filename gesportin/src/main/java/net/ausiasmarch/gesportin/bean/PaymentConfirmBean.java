package net.ausiasmarch.gesportin.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** DTO recibido al confirmar el pago (datos de tarjeta simulados). */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentConfirmBean {
    private String titular;
    private String numeroTarjeta;
    private String caducidad;
    private String cvv;
}
