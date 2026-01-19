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

    public Long rellenaComentarios(Long numComentarios) {
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

    // ----------------------------CRUD---------------------------------
    public ComentarioartEntity get(Long id) {
        return oComentarioartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentarioart not found"));
    }

    public Long create(ComentarioartEntity oComentarioartEntity) {
        // Si no se especifican id_articulo o id_usuario, generar valores aleatorios
        // if (comentarioartEntity.getIdArticulo() == null) {
        //     comentarioartEntity.setIdArticulo((Long) (long) oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 50));
        // }
        // if (comentarioartEntity.getIdUsuario() == null) {
        //     comentarioartEntity.setIdUsuario((Long) (long) oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 50));
        // }

        oComentarioartEntity.setArticulo(oComentarioartEntity.getArticulo());
        oComentarioartEntity.setUsuario(oComentarioartEntity.getUsuario());

        oComentarioartRepository.save(oComentarioartEntity);
        return oComentarioartEntity.getId();
    }

    public Long update(ComentarioartEntity comentarioartEntity) {
        ComentarioartEntity existingComentario = oComentarioartRepository.findById(comentarioartEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Comentarioart not found"));
        existingComentario.setContenido(comentarioartEntity.getContenido());
        // existingComentario.setIdArticulo(comentarioartEntity.getIdArticulo());
        // existingComentario.setIdUsuario(comentarioartEntity.getIdUsuario());
        oComentarioartRepository.save(existingComentario);
        return existingComentario.getId();
    }

    public Long delete(Long id) {
        oComentarioartRepository.deleteById(id);
        return id;
    }

    public Page<ComentarioartEntity> getPage(Pageable oPageable) {
        return oComentarioartRepository.findAll(oPageable);
    }

    public Long count() {
        return oComentarioartRepository.count();
    }

    // Vaciar tabla comentarioart
    public Long empty() {
        Long total = oComentarioartRepository.count();
        oComentarioartRepository.deleteAll();
        return total;
    }

}
