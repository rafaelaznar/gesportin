package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.PuntuacionEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.PuntuacionRepository;

@Service
public class PuntuacionService {

    @Autowired
    private PuntuacionRepository oPuntuacionRepository;

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private NoticiaService oNoticiaService;

    @Autowired
    private UsuarioService oUsuarioService;

    public PuntuacionEntity get(Long id) {
        return oPuntuacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Puntuación no encontrado con id: " + id));
    }

    public Page<PuntuacionEntity> getPage(Pageable pageable) {
        return oPuntuacionRepository.findAll(pageable);
    }

    public PuntuacionEntity create(PuntuacionEntity oPuntuacionEntity) {
        oPuntuacionEntity.setId(null); 
        oPuntuacionEntity.setNoticia(oNoticiaService.get(oPuntuacionEntity.getNoticia().getId()));
        oPuntuacionEntity.setUsuario(oUsuarioService.get(oPuntuacionEntity.getUsuario().getId()));
        return oPuntuacionRepository.save(oPuntuacionEntity);
    }

    public PuntuacionEntity update(PuntuacionEntity oPuntuacionEntity) {
        PuntuacionEntity oPuntuacionExistente = oPuntuacionRepository.findById(oPuntuacionEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Puntuación no encontrado con id: " + oPuntuacionEntity.getId()));

        oPuntuacionExistente.setPuntuacion(oPuntuacionEntity.getPuntuacion());
        oPuntuacionExistente.setNoticia(oNoticiaService.get(oPuntuacionEntity.getNoticia().getId()));
        oPuntuacionExistente.setUsuario(oUsuarioService.get(oPuntuacionEntity.getUsuario().getId()));
        return oPuntuacionRepository.save(oPuntuacionExistente);
    }

    public Long delete(Long id) {
        PuntuacionEntity puntuacion = oPuntuacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Puntuación no encontrado con id: " + id));
        oPuntuacionRepository.delete(puntuacion);
        return id;
    }

    public Long empty() {
        oPuntuacionRepository.deleteAll();
        oPuntuacionRepository.flush();
        return 0L;
    }

    public Long count() {
        return oPuntuacionRepository.count();
    }

    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            PuntuacionEntity oPuntuacion = new PuntuacionEntity();
            oPuntuacion.setPuntuacion(oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 5));
            oPuntuacion.setNoticia(oNoticiaService.getOneRandom());
            oPuntuacion.setUsuario(oUsuarioService.getOneRandom());
            oPuntuacionRepository.save(oPuntuacion);
        }
        return cantidad;
    }
}
