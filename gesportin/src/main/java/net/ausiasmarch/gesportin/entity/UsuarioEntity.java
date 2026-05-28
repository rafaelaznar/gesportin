package net.ausiasmarch.gesportin.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nombre;

    @NotBlank
    @Column(nullable = false)
    private String apellido1;

    @NotBlank
    @Column(nullable = false)
    private String apellido2;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String username;

    @Email
    @Column(unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @JsonIgnore
    @Column(name = "token_password", length = 64, unique = true)
    private String tokenPassword;

    @NotNull
    @Column(name = "fecha_alta", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", shape = JsonFormat.Shape.STRING)
    private LocalDateTime fechaAlta;

    @NotNull
    @Column(nullable = false)
    private Integer genero;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_tipousuario")
    private TipousuarioEntity tipousuario;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_rolusuario")
    private RolusuarioEntity rolusuario;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_club")
    private ClubEntity club;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private List<ComentarioEntity> comentarios;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private List<PuntuacionEntity> puntuaciones;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private List<ComentarioartEntity> comentarioarts;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private List<CarritoEntity> carritos;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private List<FacturaEntity> facturas;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "entrenador", fetch = FetchType.LAZY)
    private List<EquipoEntity> equiposentrenados;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private List<JugadorEntity> jugadores;

    public int getComentarios() {
        return comentarios != null ? comentarios.size() : 0;
    }

    public int getPuntuaciones() {
        return puntuaciones != null ? puntuaciones.size() : 0;
    }

    public int getComentarioarts() {
        return comentarioarts != null ? comentarioarts.size() : 0;
    }

    public int getCarritos() {
        return carritos != null ? carritos.size() : 0;
    }

    public int getFacturas() {
        return facturas != null ? facturas.size() : 0;
    }

    public int getEquiposentrenados() {
        return equiposentrenados != null ? equiposentrenados.size() : 0;
    }

    public int getJugadores() {
        return jugadores != null ? jugadores.size() : 0;
    }
}
