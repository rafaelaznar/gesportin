package net.ausiasmarch.gesportin.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.dto.ComentarioartDTO;
import net.ausiasmarch.gesportin.entity.ComentarioartEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.ComentarioartRepository;
import net.ausiasmarch.gesportin.dtoconverter.ComentarioartConverter;

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

    @Autowired
    SessionService oSessionService;

    @Autowired
    ComentarioartConverter oComentarioartConverter;

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

    public ComentarioartDTO get(Long id) {
        ComentarioartEntity e = oComentarioartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentarioart no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubId = e.getArticulo().getTipoarticulo().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        return oComentarioartConverter.toDTO(e);
    }

    public Page<ComentarioartDTO> getPage(Pageable oPageable, String contenido, Long id_articulo, Long id_usuario) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (id_articulo != null) {
                Long clubArt = oArticuloService.get(id_articulo).getTipoarticulo().getClub().getId();
                if (!myClub.equals(clubArt)) {
                    throw new UnauthorizedException("Acceso denegado: solo comentarios de su club");
                }
            }
            if (id_usuario != null) {
                Long clubUsr = oUsuarioService.get(id_usuario).getClub().getId();
                if (!myClub.equals(clubUsr)) {
                    throw new UnauthorizedException("Acceso denegado: solo comentarios de su club");
                }
            }
            if ((contenido == null || contenido.isEmpty()) && id_articulo == null && id_usuario == null) {
                return oComentarioartConverter.toPageDTO(oComentarioartRepository.findByArticuloTipoarticuloClubId(myClub, oPageable));
            }
        }

        if (contenido != null && !contenido.isEmpty()) {
            return oComentarioartConverter.toPageDTO(oComentarioartRepository.findByContenidoContainingIgnoreCase(contenido, oPageable));
        } else if (id_articulo != null) {
            return oComentarioartConverter.toPageDTO(oComentarioartRepository.findByArticuloId(id_articulo, oPageable));
        } else if (id_usuario != null) {
            return oComentarioartConverter.toPageDTO(oComentarioartRepository.findByUsuarioId(id_usuario, oPageable));
        } else {
            return oComentarioartConverter.toPageDTO(oComentarioartRepository.findAll(oPageable));
        }
    }

    public ComentarioartDTO create(ComentarioartEntity oComentarioartEntity) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: no puede gestionar comentarios");
        }
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            oComentarioartEntity.setUsuario(oUsuarioService.get(currentUserId));
            Long userClub = oSessionService.getIdClub();
            Long articuloClub = oArticuloService.get(oComentarioartEntity.getArticulo().getId()).getTipoarticulo().getClub().getId();
            if (!userClub.equals(articuloClub)) {
                throw new UnauthorizedException("Acceso denegado: solo puede comentar artículos de su club");
            }
        } else {
            oComentarioartEntity.setUsuario(oUsuarioService.get(oComentarioartEntity.getUsuario().getId()));
        }
        oComentarioartEntity.setId(null);
        oComentarioartEntity.setArticulo(oArticuloService.get(oComentarioartEntity.getArticulo().getId()));
        return oComentarioartConverter.toDTO(oComentarioartRepository.save(oComentarioartEntity));
    }

    public ComentarioartDTO update(ComentarioartEntity oComentarioartEntity) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: no puede gestionar comentarios");
        }
        ComentarioartEntity oComentarioartExistente = oComentarioartRepository.findById(oComentarioartEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                "Comentarioart no encontrado con id: " + oComentarioartEntity.getId()));
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            if (!currentUserId.equals(oComentarioartExistente.getUsuario().getId())) {
                throw new UnauthorizedException("Acceso denegado: solo puede modificar sus propios comentarios");
            }
            Long userClub = oSessionService.getIdClub();
            Long articuloClub = oArticuloService.get(oComentarioartEntity.getArticulo().getId()).getTipoarticulo().getClub().getId();
            if (!userClub.equals(articuloClub)) {
                throw new UnauthorizedException("Acceso denegado: solo puede comentar artículos de su club");
            }
            oComentarioartExistente.setUsuario(oUsuarioService.get(currentUserId));
        } else {
            oComentarioartExistente.setUsuario(oUsuarioService.get(oComentarioartEntity.getUsuario().getId()));
        }
        oComentarioartExistente.setContenido(oComentarioartEntity.getContenido());
        oComentarioartExistente.setArticulo(oArticuloService.get(oComentarioartEntity.getArticulo().getId()));
        return oComentarioartConverter.toDTO(oComentarioartRepository.save(oComentarioartExistente));
    }

    public Long delete(Long id) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: no puede gestionar comentarios");
        }
        ComentarioartEntity oComentarioart = oComentarioartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentarioart no encontrado con id: " + id));
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            if (!currentUserId.equals(oComentarioart.getUsuario().getId())) {
                throw new UnauthorizedException("Acceso denegado: solo puede eliminar sus propios comentarios");
            }
            oSessionService.checkSameClub(oComentarioart.getArticulo().getTipoarticulo().getClub().getId());
        }
        oComentarioartRepository.delete(oComentarioart);
        return id;
    }

    public Long count() {
        return oComentarioartRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oComentarioartRepository.deleteAll();
        oComentarioartRepository.flush();
        return 0L;
    }

    public Long fill(Long numComentarios) {
        oSessionService.requireAdmin();
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
            // El usuario debe pertenecer al mismo club que el artículo
            net.ausiasmarch.gesportin.entity.ArticuloEntity articulo = oArticuloService.getOneRandom();
            Long clubId = articulo.getTipoarticulo().getClub().getId();
            net.ausiasmarch.gesportin.entity.UsuarioEntity usuario = oUsuarioService.getOneRandomFromClub(clubId);
            if (usuario == null) {
                continue;
            }
            oComentarioartEntity.setArticulo(articulo);
            oComentarioartEntity.setUsuario(usuario);
            oComentarioartRepository.save(oComentarioartEntity);
        }
        return oComentarioartRepository.count();
    }

}
