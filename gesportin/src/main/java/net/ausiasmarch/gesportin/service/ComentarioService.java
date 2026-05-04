package net.ausiasmarch.gesportin.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.ComentarioEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
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

    @Autowired
    SessionService oSessionService;

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
        alComentarios.add("Podrías incluir más referencias?");
        alComentarios.add("Excelente redacción y estructura.");
        alComentarios.add("No comparto tu perspectiva sobre este tema.");
        alComentarios.add("Gracias por la información, muy valiosa.");
        alComentarios.add("Espero leer más artículos como este.");
    }

    public ComentarioEntity get(Long id) {
        ComentarioEntity e = oComentariosRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentario no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubId = e.getNoticia().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        return e;
    }

    public Page<ComentarioEntity> getPage(Pageable oPageable, String contenido, Long id_usuario, Long id_noticia) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (id_usuario != null) {
                // regular users can only query their own comments
                if (oSessionService.isUsuario() && !id_usuario.equals(oSessionService.getIdUsuario())) {
                    throw new UnauthorizedException("Acceso denegado: solo puede ver sus propios comentarios");
                }
                Long clubUsr = oUsuarioService.get(id_usuario).getClub().getId();
                if (!myClub.equals(clubUsr)) {
                    throw new UnauthorizedException("Acceso denegado: solo comentarios de su club");
                }
            }
            if (id_noticia != null) {
                Long clubNot = oNoticaService.get(id_noticia).getClub().getId();
                if (!myClub.equals(clubNot)) {
                    throw new UnauthorizedException("Acceso denegado: solo comentarios de su club");
                }
            }
            if ((contenido == null || contenido.isEmpty()) && id_usuario == null && id_noticia == null) {
                return oComentariosRepository.findByNoticiaClubId(myClub, oPageable);
            }
        }
        if (contenido != null && !contenido.isEmpty()) {
            return oComentariosRepository.findByContenidoContainingIgnoreCase(contenido, oPageable);
        } else if (id_usuario != null) {
            return oComentariosRepository.findByUsuarioId(id_usuario, oPageable);
        } else if (id_noticia != null) {
            return oComentariosRepository.findByNoticiaId(id_noticia, oPageable);
        } else
        return oComentariosRepository.findAll(oPageable);
    }

    public ComentarioEntity create(ComentarioEntity oComentarioEntity) {
        // Ensure the noticia exists and belongs to the allowed club (if any)
        var noticia = oNoticaService.get(oComentarioEntity.getNoticia().getId());
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            // force comment to be attributed to the current user and check same club
            Long currentUserId = oSessionService.getIdUsuario();
            oComentarioEntity.setUsuario(oUsuarioService.get(currentUserId));
            oSessionService.checkSameClub(noticia.getClub().getId());
        } else {
            // allow admins to act without restriction
            oComentarioEntity.setUsuario(oUsuarioService.get(oComentarioEntity.getUsuario().getId()));
        }
        oComentarioEntity.setId(null);
        oComentarioEntity.setNoticia(noticia);
        return oComentariosRepository.save(oComentarioEntity);
    }

    public ComentarioEntity update(ComentarioEntity oComentarioEntity) {
        ComentarioEntity oComentarioExistente = oComentariosRepository.findById(oComentarioEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Comentario no encontrado con id: " + oComentarioEntity.getId()));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            if (!currentUserId.equals(oComentarioExistente.getUsuario().getId())) {
                throw new UnauthorizedException("Acceso denegado: solo puede modificar sus propios comentarios");
            }
            // ensure comment belongs to the user's club
            oSessionService.checkSameClub(oComentarioExistente.getNoticia().getClub().getId());
            oComentarioExistente.setUsuario(oUsuarioService.get(currentUserId));
        } else {
            oComentarioExistente.setUsuario(oUsuarioService.get(oComentarioEntity.getUsuario().getId()));
        }
        oComentarioExistente.setContenido(oComentarioEntity.getContenido());
        oComentarioExistente.setNoticia(oNoticaService.get(oComentarioEntity.getNoticia().getId()));
        return oComentariosRepository.save(oComentarioExistente);
    }

    public Long delete(Long id) {
        ComentarioEntity oComentario = oComentariosRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentario no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            if (!currentUserId.equals(oComentario.getUsuario().getId())) {
                throw new UnauthorizedException("Acceso denegado: solo puede borrar sus propios comentarios");
            }
            oSessionService.checkSameClub(oComentario.getNoticia().getClub().getId());
        }
        oComentariosRepository.delete(oComentario);
        return id;
    }

    public Long count() {
        return oComentariosRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oComentariosRepository.deleteAll();
        oComentariosRepository.flush();
        return 0L;
    }

    public Long fill(Long numComentarios) {
        oSessionService.requireAdmin();
        for (long j = 0; j < numComentarios; j++) {
            ComentarioEntity oComentariosEntity = new ComentarioEntity();
            String contenidoGenerado = "";
            int numFrases = oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 3);
            for (int i = 1; i <= numFrases; i++) {
                contenidoGenerado += alComentarios
                        .get(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, alComentarios.size() - 1)) + " ";
            }
            oComentariosEntity.setContenido(contenidoGenerado.trim());
            // El usuario debe pertenecer al mismo club que la noticia
            net.ausiasmarch.gesportin.entity.NoticiaEntity noticia = oNoticaService.getOneRandom();
            net.ausiasmarch.gesportin.entity.UsuarioEntity usuario = oUsuarioService.getOneRandomFromClub(noticia.getClub().getId());
            if (usuario == null) {
                continue;
            }
            oComentariosEntity.setNoticia(noticia);
            oComentariosEntity.setUsuario(usuario);
            oComentariosRepository.save(oComentariosEntity);
        }
        return oComentariosRepository.count();
    }

}
