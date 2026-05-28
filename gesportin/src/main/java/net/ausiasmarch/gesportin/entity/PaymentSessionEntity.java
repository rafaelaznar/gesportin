package net.ausiasmarch.gesportin.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "payment_session")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** UUID aleatorio que identifica la sesión de pago. */
    @NotBlank
    @Column(name = "session_token", nullable = false, unique = true, length = 64)
    private String sessionToken;

    /** "TIENDA" o "CUOTA" */
    @NotBlank
    @Column(nullable = false, length = 16)
    private String tipo;

    /** Para CUOTA: id del jugador; para TIENDA: id del usuario */
    @NotNull
    @Column(name = "id_referencia", nullable = false)
    private Long idReferencia;

    /** Solo para tipo CUOTA: id de la cuota a pagar */
    @Column(name = "id_cuota")
    private Long idCuota;

    /** "PENDIENTE", "COMPLETADO", "CANCELADO" */
    @NotBlank
    @Column(nullable = false, length = 16)
    private String estado;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal importe;

    @NotBlank
    @Column(nullable = false, length = 512)
    private String descripcion;

    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", shape = JsonFormat.Shape.STRING)
    @Column(nullable = false)
    private LocalDateTime fecha;

    /** Id de la entidad creada tras confirmar el pago (pago.id o factura.id). */
    @Column(name = "id_resultado")
    private Long idResultado;
}
