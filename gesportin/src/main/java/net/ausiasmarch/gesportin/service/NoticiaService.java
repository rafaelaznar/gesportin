package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.NoticiaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.NoticiaRepository;

@Service
public class NoticiaService {

    @Autowired
    NoticiaRepository oNoticiaRepository;

    @Autowired
    AleatorioService oAleatorioService;

    @Autowired
    SessionService oSessionService;

    ArrayList<String> alFrases = new ArrayList<>();

    public NoticiaService() {
        alFrases.add("La vida es bella.");
        alFrases.add("El conocimiento es poder.");
        alFrases.add("La perseverancia es la clave del éxito.");
        alFrases.add("El tiempo es oro.");
        alFrases.add("La creatividad es la inteligencia divirtiéndose.");
        alFrases.add("Más vale tarde que nunca.");
        alFrases.add("El cambio es la única constante en la vida.");
        alFrases.add("La esperanza es lo último que se pierde.");
        alFrases.add("La unión hace la fuerza.");
        alFrases.add("El respeto es la base de toda relación.");
        alFrases.add("La comunicación es clave en cualquier relación.");
        alFrases.add("Más vale pájaro en mano que ciento volando.");
        alFrases.add("A mal tiempo, buena cara.");
        alFrases.add("El que no arriesga no gana.");
        alFrases.add("La suerte favorece a los audaces.");
        alFrases.add("El tiempo lo dirá.");
    }

    public Long rellenaNoticia(Long numPosts) {

        if (!oSessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }

        for (long j = 0; j < numPosts; j++) {
            NoticiaEntity oNoticiaEntity = new NoticiaEntity();
            oNoticiaEntity.setTitulo(alFrases.get(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, alFrases.size() - 1)));
            String contenidoGenerado = "";
            int numFrases = oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 30);
            for (int i = 1; i <= numFrases; i++) {
                contenidoGenerado += alFrases.get(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, alFrases.size() - 1)) + " ";
                if (oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, 10) == 1) {
                    contenidoGenerado += "\n";
                }
            }
            oNoticiaEntity.setContenido(contenidoGenerado.trim());
            contenidoGenerado += "\n";
            oNoticiaEntity.setFechaCreacion(LocalDateTime.now());
            oNoticiaEntity.setFechaModificacion(null);
            oNoticiaEntity.setPublicado(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, 1) == 1);
            // id_club aleatorio entre 1 y 10 (puedes ajustar el rango)
            oNoticiaEntity.setId_club((long) oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 10));
            // imagen null (o puedes poner datos de prueba)
            oNoticiaEntity.setImagen(null);
            oNoticiaRepository.save(oNoticiaEntity);
        }
        return oNoticiaRepository.count();
    }

    // ----------------------------CRUD---------------------------------
    public NoticiaEntity get(Long id) {
        if (oSessionService.isSessionActive()) {
            return oNoticiaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        } else{
            NoticiaEntity noticiaEntity = oNoticiaRepository.findByIdAndPublicadoTrue(id);
            if (noticiaEntity == null) {
                throw new ResourceNotFoundException("Post not found or not published");
            }
            return noticiaEntity;
        }
    }

    public Long create(NoticiaEntity noticiaEntity) {
        if (!oSessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        noticiaEntity.setFechaCreacion(LocalDateTime.now());
        noticiaEntity.setFechaModificacion(null);
        oNoticiaRepository.save(noticiaEntity);
        return noticiaEntity.getId();
    }

    public Long update(NoticiaEntity noticiaEntity) {
        if (!oSessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        NoticiaEntity existingNoticia = oNoticiaRepository.findById(noticiaEntity.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        existingNoticia.setTitulo(noticiaEntity.getTitulo());
        existingNoticia.setContenido(noticiaEntity.getContenido());
        existingNoticia.setPublicado(noticiaEntity.getPublicado());
        existingNoticia.setFechaModificacion(LocalDateTime.now());
        existingNoticia.setId_club(noticiaEntity.getId_club());
        existingNoticia.setImagen(noticiaEntity.getImagen());
        oNoticiaRepository.save(existingNoticia);
        return existingNoticia.getId();
    }

    public Long delete(Long id) {
        if (!oSessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        oNoticiaRepository.deleteById(id);
        return id;
    }

    public Page<NoticiaEntity> getPage(Pageable oPageable) {
        // si no hay session activa, solo devolver los publicados
        if (!oSessionService.isSessionActive()) {
            return oNoticiaRepository.findByPublicadoTrue(oPageable);
        } else {
            return oNoticiaRepository.findAll(oPageable);
        }
    }

    public Long count() {
        return oNoticiaRepository.count();
    }

    // ---
    public Long publicar(Long id) {
        if (!oSessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        NoticiaEntity existingNoticia = oNoticiaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        existingNoticia.setPublicado(true);
        existingNoticia.setFechaModificacion(LocalDateTime.now());
        oNoticiaRepository.save(existingNoticia);
        return existingNoticia.getId();
    }

    public Long despublicar(Long id) {
        if (!oSessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        NoticiaEntity existingNoticia = oNoticiaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        existingNoticia.setPublicado(false);
        existingNoticia.setFechaModificacion(LocalDateTime.now());
        oNoticiaRepository.save(existingNoticia);
        return existingNoticia.getId();
    }

    // vaciar tabla Noticia (solo administrador)
    public Long empty() {
        if (!oSessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        Long total = oNoticiaRepository.count();
        oNoticiaRepository.deleteAll();
        return total;
    }

}
