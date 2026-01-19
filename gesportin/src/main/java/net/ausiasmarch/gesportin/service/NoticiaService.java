package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.NoticiaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.NoticiaRepository;

@Service
public class NoticiaService {

    @Autowired
    private NoticiaRepository oNoticiaRepository;

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private ClubService oClubService;

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

    public NoticiaEntity get(Long id) {
        return oNoticiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Noticia no encontrado con id: " + id));
    }

    public Page<NoticiaEntity> getPage(Pageable pageable) {
        return oNoticiaRepository.findAll(pageable);
    }

    public NoticiaEntity create(NoticiaEntity noticia) {
        noticia.setId(null);
        noticia.setFecha(LocalDateTime.now());
        return oNoticiaRepository.save(noticia);
    }

    public NoticiaEntity update(NoticiaEntity noticia) {
        NoticiaEntity existingNoticia = oNoticiaRepository.findById(noticia.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Noticia no encontrado con id: " + noticia.getId()));
        existingNoticia.setTitulo(noticia.getTitulo());
        existingNoticia.setContenido(noticia.getContenido());
        existingNoticia.setFecha(noticia.getFecha());
        //existingNoticia.setIdClub(noticia.getIdClub());
        existingNoticia.setImagen(noticia.getImagen());
        return oNoticiaRepository.save(existingNoticia);
    }

    public Long delete(Long id) {
        NoticiaEntity noticia = oNoticiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Noticia no encontrado con id: " + id));
        oNoticiaRepository.delete(noticia);
        return id;
    }

    public Long empty() {
        Long total = oNoticiaRepository.count();
        oNoticiaRepository.deleteAll();
        return total;
    }

    public Long count() {
        return oNoticiaRepository.count();
    }

    public Long fill(Long cantidad) {
        for (long j = 0; j < cantidad; j++) {
            NoticiaEntity noticia = new NoticiaEntity();
            noticia.setTitulo(alFrases.get(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, alFrases.size() - 1)));
            String contenidoGenerado = "";
            int numFrases = oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 30);
            for (int i = 1; i <= numFrases; i++) {
                contenidoGenerado += alFrases.get(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, alFrases.size() - 1)) + " ";
                if (oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 10) == 1) {
                    contenidoGenerado += "\n";
                }
            }
            noticia.setContenido(contenidoGenerado.trim());
            noticia.setFecha(LocalDateTime.now());
            noticia.setClub(oClubService.getOneRandom());
            noticia.setImagen(null);
            oNoticiaRepository.save(noticia);
        }
        return cantidad;
    }

    public NoticiaEntity getOneRandom() {
        Long count = oNoticiaRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oNoticiaRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);

    }
}
