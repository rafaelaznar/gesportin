package net.ausiasmarch.gesportin.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.ComentarioartEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.ComentarioartRepository;

@Service
public class ComentarioartService {

    @Autowired
    ComentarioartRepository oComentarioartRepository;

    @Autowired
    AleatorioService oAleatorioService;

    @Autowired
    UsuarioService oUsuarioService;

    @Autowired
    ArticuloService oArticuloService;

    ArrayList<String> alComentarios = new ArrayList<>();

    public ComentarioartService() {
        alComentarios.add("Excelente artículo, muy informativo.");
        alComentarios.add("No estoy de acuerdo con algunos puntos.");
        alComentarios.add("Muy interesante, gracias por compartir.");
        alComentarios.add("¿Podrías ampliar más sobre este tema?");
        alComentarios.add("Me ha encantado, muy bien explicado.");
        alComentarios.add("Creo que falta profundizar en algunos aspectos.");
        alComentarios.add("Gran aportación a la comunidad.");
        alComentarios.add("Totalmente de acuerdo con tu opinión.");
        alComentarios.add("Necesito más ejemplos para entenderlo mejor.");
        alComentarios.add("Fantástico contenido, sigue así.");
        alComentarios.add("Me parece un enfoque muy innovador.");
        alComentarios.add("Hay algunos errores que deberías corregir.");
        alComentarios.add("Esto me ha ayudado mucho, gracias.");
        alComentarios.add("No me queda claro el último punto.");
        alComentarios.add("Muy útil para mi proyecto actual.");
    }

    public ComentarioartEntity get(Long id) {
        return oComentarioartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentarioart no encontrado con id: " + id));
    }

    public Page<ComentarioartEntity> getPage(Pageable oPageable, Long id_articulo, Long id_usuario) {
        if (id_articulo != null) {
            return oComentarioartRepository.findByArticuloId(id_articulo, oPageable);
        } else if (id_usuario != null) {
            return oComentarioartRepository.findByUsuarioId(id_usuario, oPageable);
        }else{
            return oComentarioartRepository.findAll(oPageable);
        }
    }

    public ComentarioartEntity create(ComentarioartEntity oComentarioartEntity) {
        oComentarioartEntity.setId(null);
        oComentarioartEntity.setArticulo(oArticuloService.get(oComentarioartEntity.getArticulo().getId()));
        oComentarioartEntity.setUsuario(oUsuarioService.get(oComentarioartEntity.getUsuario().getId()));
        return oComentarioartRepository.save(oComentarioartEntity);
    }

    public ComentarioartEntity update(ComentarioartEntity oComentarioartEntity) {
        ComentarioartEntity oComentarioartExistente = oComentarioartRepository.findById(oComentarioartEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Comentarioart no encontrado con id: " + oComentarioartEntity.getId()));
        oComentarioartExistente.setContenido(oComentarioartEntity.getContenido());
        oComentarioartExistente.setArticulo(oArticuloService.get(oComentarioartEntity.getArticulo().getId()));
        oComentarioartExistente.setUsuario(oUsuarioService.get(oComentarioartEntity.getUsuario().getId()));
        return oComentarioartRepository.save(oComentarioartExistente);
    }

    public Long delete(Long id) {
        ComentarioartEntity oComentarioart = oComentarioartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentarioart no encontrado con id: " + id));
        oComentarioartRepository.delete(oComentarioart);
        return id;
    }

    public Long count() {
        return oComentarioartRepository.count();
    }

    public Long empty() {
        oComentarioartRepository.deleteAll();
        oComentarioartRepository.flush();
        return 0L;
    }

    public Long fill(Long numComentarios) {
        for (long j = 0; j < numComentarios; j++) {
            ComentarioartEntity oComentarioartEntity = new ComentarioartEntity();

            // Generar contenido aleatorio
            String contenidoGenerado = "";
            int numFrases = oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 3);
            for (int i = 1; i <= numFrases; i++) {
                contenidoGenerado += alComentarios
                        .get(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, alComentarios.size() - 1)) + " ";
            }
            oComentarioartEntity.setContenido(contenidoGenerado.trim());
            oComentarioartEntity.setArticulo(oArticuloService.getOneRandom());
            oComentarioartEntity.setUsuario(oUsuarioService.getOneRandom());
            oComentarioartRepository.save(oComentarioartEntity);
        }
        return oComentarioartRepository.count();
    }

}
