package net.ausiasmarch.gesportin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.ausiasmarch.gesportin.entity.NoticiaEntity;

@Getter
@Setter
@NoArgsConstructor
public class NoticiaDTO extends NoticiaEntity {

    private int comentarios;
    private int puntuaciones;
    private double mediaPuntuacion;

    public NoticiaDTO(NoticiaEntity entity, int comentarios, int puntuaciones, double mediaPuntuacion) {
        setId(entity.getId());
        setTitulo(entity.getTitulo());
        setContenido(entity.getContenido());
        setFecha(entity.getFecha());
        setImagen(entity.getImagen());
        setClub(entity.getClub());
        this.comentarios = comentarios;
        this.puntuaciones = puntuaciones;
        this.mediaPuntuacion = mediaPuntuacion;
    }
}
