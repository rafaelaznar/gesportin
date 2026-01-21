package net.ausiasmarch.gesportin.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
 
import jakarta.annotation.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "noticia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoticiaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Size(min = 3, max = 1024)
    private String titulo;
    
    @NotNull
    @Size(min = 3)
    private String contenido;
    
    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", shape = JsonFormat.Shape.STRING)
    private LocalDateTime fecha;
    
    @Nullable
    @Lob
    private byte[] imagen;
    
    @NotNull    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_club")
    private ClubEntity club;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "noticia", fetch = FetchType.LAZY)
    private java.util.List<ComentarioEntity> comentarios;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "noticia", fetch = FetchType.LAZY)
    private java.util.List<PuntuacionEntity> puntuaciones;


    public int getComentarios() {
        return comentarios.size();
        }

    public int getPuntuaciones() {
        return puntuaciones.size();
    }
}

