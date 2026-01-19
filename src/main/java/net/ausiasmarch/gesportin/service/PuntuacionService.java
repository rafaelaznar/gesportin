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

    public PuntuacionEntity create(PuntuacionEntity puntuacion) {
        puntuacion.setId(null);
        return oPuntuacionRepository.save(puntuacion);
    }

    public PuntuacionEntity update(PuntuacionEntity puntuacion) {
        PuntuacionEntity existingRecord = oPuntuacionRepository.findById(puntuacion.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Puntuación no encontrado con id: " + puntuacion.getId()));

        existingRecord.setPuntuacion(puntuacion.getPuntuacion());
        existingRecord.setNoticia(oNoticiaService.getOneRandom());
        existingRecord.setUsuario(oUsuarioService.getOneRandom());

        return oPuntuacionRepository.save(existingRecord);
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
