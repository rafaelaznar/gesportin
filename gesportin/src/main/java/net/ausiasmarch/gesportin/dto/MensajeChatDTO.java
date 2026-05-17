package net.ausiasmarch.gesportin.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import net.ausiasmarch.gesportin.entity.MensajeChatEntity;

public class MensajeChatDTO {

    private Long id;
    private String contenido;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", shape = JsonFormat.Shape.STRING)
    private LocalDateTime fechaEnvio;
    private Long idClub;
    private Long idUsuario;
    private String nombreUsuario;
    private String apellido1Usuario;

    public MensajeChatDTO() {}

    public static MensajeChatDTO fromEntity(MensajeChatEntity entity) {
        MensajeChatDTO dto = new MensajeChatDTO();
        dto.id = entity.getId();
        dto.contenido = entity.getContenido();
        dto.fechaEnvio = entity.getFechaEnvio();
        dto.idClub = entity.getClub().getId();
        dto.idUsuario = entity.getUsuario().getId();
        dto.nombreUsuario = entity.getUsuario().getNombre();
        dto.apellido1Usuario = entity.getUsuario().getApellido1();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }

    public LocalDateTime getFechaEnvio() { return fechaEnvio; }
    public void setFechaEnvio(LocalDateTime fechaEnvio) { this.fechaEnvio = fechaEnvio; }

    public Long getIdClub() { return idClub; }
    public void setIdClub(Long idClub) { this.idClub = idClub; }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }

    public String getApellido1Usuario() { return apellido1Usuario; }
    public void setApellido1Usuario(String apellido1Usuario) { this.apellido1Usuario = apellido1Usuario; }
}
