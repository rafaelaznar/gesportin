package net.ausiasmarch.gesportin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;

@Getter
@Setter
@NoArgsConstructor
public class UsuarioDTO extends UsuarioEntity {

    private int comentarios;
    private int puntuaciones;
    private int comentarioarts;
    private int carritos;
    private int facturas;
    private int equiposentrenados;
    private int jugadores;

    public UsuarioDTO(UsuarioEntity entity, int comentarios, int puntuaciones, int comentarioarts, 
                      int carritos, int facturas, int equiposentrenados, int jugadores) {
        setId(entity.getId());
        setNombre(entity.getNombre());
        setApellido1(entity.getApellido1());
        setApellido2(entity.getApellido2());
        setUsername(entity.getUsername());
        setPassword(entity.getPassword());
        setFechaAlta(entity.getFechaAlta());
        setGenero(entity.getGenero());
        setTipousuario(entity.getTipousuario());
        setRolusuario(entity.getRolusuario());
        setClub(entity.getClub());
        this.comentarios = comentarios;
        this.puntuaciones = puntuaciones;
        this.comentarioarts = comentarioarts;
        this.carritos = carritos;
        this.facturas = facturas;
        this.equiposentrenados = equiposentrenados;
        this.jugadores = jugadores;
    }
}
