package net.ausiasmarch.gesportin.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.ComentarioEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.ComentarioRepository;

@Service
public class ComentarioService {

    @Autowired
    ComentarioRepository oComentariosRepository;

    @Autowired
    AleatorioService oAleatorioService;

    @Autowired
    UsuarioService oUsuarioService;

    @Autowired
    NoticiaService oNoticaService;

    ArrayList<String> alComentarios = new ArrayList<>();

    public ComentarioService() {
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

    public ComentarioEntity get(Long id) {
        return oComentariosRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentario no encontrado con id: " + id));
    }

    public Page<ComentarioEntity> getPage(Pageable oPageable, String contenido, Long id_usuario, Long id_noticia) {
        if (contenido != null && !contenido.isEmpty()) {
            return oComentariosRepository.findByContenidoContainingIgnoreCase(contenido, oPageable);
        } else if (id_usuario != null) {
            return oComentariosRepository.findByIdUsuario(id_usuario, oPageable);
        } else if (id_noticia != null) {
            return oComentariosRepository.findByIdNoticia(id_noticia, oPageable);
        } else
        return oComentariosRepository.findAll(oPageable);
    }

    public ComentarioEntity create(ComentarioEntity oComentarioEntity) {
        oComentarioEntity.setId(null);
        oComentarioEntity.setNoticia(oNoticaService.get(oComentarioEntity.getNoticia().getId()));
        oComentarioEntity.setUsuario(oUsuarioService.get(oComentarioEntity.getUsuario().getId()));
        return oComentariosRepository.save(oComentarioEntity);
    }

    public ComentarioEntity update(ComentarioEntity oComentarioEntity) {
        ComentarioEntity oComentarioExistente = oComentariosRepository.findById(oComentarioEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Comentario no encontrado con id: " + oComentarioEntity.getId()));
        oComentarioExistente.setContenido(oComentarioEntity.getContenido());
        oComentarioExistente.setNoticia(oNoticaService.get(oComentarioEntity.getNoticia().getId()));
        oComentarioExistente.setUsuario(oUsuarioService.get(oComentarioEntity.getUsuario().getId()));
        return oComentariosRepository.save(oComentarioExistente);
    }

    public Long delete(Long id) {
        ComentarioEntity oComentario = oComentariosRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentario no encontrado con id: " + id));
        oComentariosRepository.delete(oComentario);
        return id;
    }

    public Long count() {
        return oComentariosRepository.count();
    }

    public Long empty() {
        oComentariosRepository.deleteAll();
        oComentariosRepository.flush();
        return 0L;
    }

    public Long fill(Long numComentarios) {
        for (long j = 0; j < numComentarios; j++) {
            ComentarioEntity oComentariosEntity = new ComentarioEntity();
            String contenidoGenerado = "";
            int numFrases = oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 3);
            for (int i = 1; i <= numFrases; i++) {
                contenidoGenerado += alComentarios
                        .get(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, alComentarios.size() - 1)) + " ";
            }
            oComentariosEntity.setContenido(contenidoGenerado.trim());
            oComentariosEntity.setUsuario(oUsuarioService.getOneRandom());
            oComentariosRepository.save(oComentariosEntity);
        }
        return oComentariosRepository.count();
    }

}
