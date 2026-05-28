package net.ausiasmarch.gesportin.bean;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** DTO de confirmación que incluye el token de sesión en el cuerpo de la petición. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentConfirmRequestBean {
    @NotBlank
    private String sessionToken;
    private String titular;
    private String numeroTarjeta;
    private String caducidad;
    private String cvv;
}