package net.ausiasmarch.gesportin.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import net.ausiasmarch.gesportin.dto.RolusuarioDTO;
import net.ausiasmarch.gesportin.entity.RolusuarioEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.RolusuarioRepository;
import net.ausiasmarch.gesportin.dtoconverter.RolusuarioConverter;

@Service
public class RolusuarioService {

    @Autowired
    private RolusuarioRepository oRolusuarioRepository;

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private RolusuarioConverter oRolusuarioConverter;

    @Autowired
    private AleatorioService oAleatorioService;

    public RolusuarioDTO get(Long id) {
        RolusuarioEntity entity = oRolusuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con id: " + id));
        return oRolusuarioConverter.toDTO(entity);
    }

    public List<RolusuarioEntity> all() {
        return oRolusuarioRepository.findAll();
    }

    public Page<RolusuarioDTO> getPage(Pageable oPageable, String descripcion) {
        Page<RolusuarioEntity> result;
        if (descripcion != null && !descripcion.isEmpty()) {
            result = oRolusuarioRepository.findByDescripcionContainingIgnoreCase(descripcion, oPageable);
        } else {
            result = oRolusuarioRepository.findAll(oPageable);
        }
        return oRolusuarioConverter.toPageDTO(result);
    }

    public RolusuarioDTO create(RolusuarioEntity oRolusuarioEntity) {
        oSessionService.requireAdmin();
        oRolusuarioEntity.setId(null);
        RolusuarioEntity saved = oRolusuarioRepository.save(oRolusuarioEntity);
        return oRolusuarioConverter.toDTO(saved);
    }

    public RolusuarioDTO update(RolusuarioEntity oRolusuarioEntity) {
        oSessionService.requireAdmin();
        RolusuarioEntity oRolusuarioExistente = oRolusuarioRepository.findById(oRolusuarioEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Rol de usuario no encontrado con id: " + oRolusuarioEntity.getId()));
        oRolusuarioExistente.setDescripcion(oRolusuarioEntity.getDescripcion());
        RolusuarioEntity saved = oRolusuarioRepository.save(oRolusuarioExistente);
        return oRolusuarioConverter.toDTO(saved);
    }

    public Long delete(Long id) {
        oSessionService.requireAdmin();
        RolusuarioEntity oRolusuario = oRolusuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rolusuario no encontrado con id: " + id));
        oRolusuarioRepository.delete(oRolusuario);
        return id;
    }

    public Long count() {
        return oRolusuarioRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oRolusuarioRepository.deleteAll();
        oRolusuarioRepository.flush();
        return 0L;
    }

    public Long fill() {
        oSessionService.requireAdmin();
        String[] descripciones = oAleatorioService.getDescripcionesRoles();
        for (int i = 0; i < descripciones.length; i++) {
            RolusuarioEntity oRolusuario = new RolusuarioEntity();
            oRolusuario.setDescripcion(descripciones[i % descripciones.length]);
            oRolusuarioRepository.save(oRolusuario);
        }
        return (long) descripciones.length;
    }

    public RolusuarioEntity getOneRandom() {
        Long count = oRolusuarioRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oRolusuarioRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }
}
