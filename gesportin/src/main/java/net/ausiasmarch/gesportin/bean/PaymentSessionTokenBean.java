package net.ausiasmarch.gesportin.bean;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** DTO mínimo para transportar el token de una sesión de pago fuera de la URL. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSessionTokenBean {
    @NotBlank
    private String sessionToken;
}