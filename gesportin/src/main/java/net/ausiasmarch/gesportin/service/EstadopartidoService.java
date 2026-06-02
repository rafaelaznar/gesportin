package net.ausiasmarch.gesportin.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.dto.EstadopartidoDTO;
import net.ausiasmarch.gesportin.entity.EstadopartidoEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.EstadopartidoRepository;

@Service
public class EstadopartidoService {

    @Autowired
    EstadopartidoRepository estadopartidoRepository;

    @Autowired
    SessionService oSessionService;

    private EstadopartidoDTO toDTO(EstadopartidoEntity entity) {
        int partidos = estadopartidoRepository.countPartidosByEstadopartidoId(entity.getId());
        return new EstadopartidoDTO(entity, partidos);
    }

    public EstadopartidoDTO get(Long id) {
        return toDTO(estadopartidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EstadoPartido no encontrado con id: " + id)));
    }

    public List<EstadopartidoDTO> getAll() {
        return estadopartidoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Long count() {
        return estadopartidoRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        estadopartidoRepository.deleteAll();
        estadopartidoRepository.flush();
        return 0L;
    }

    public Long fill() {
        oSessionService.requireAdmin();
        // EstadoPartido values are system data managed by reset()/seed().
        // This method does not create additional records.
        return this.count();
    }

    public EstadopartidoEntity getOneRandom() {
        Long count = estadopartidoRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return estadopartidoRepository.findAll(org.springframework.data.domain.Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }

    public EstadopartidoDTO create(EstadopartidoEntity oEstadopartidoEntity) {
        oSessionService.requireAdmin();
        oEstadopartidoEntity.setId(null);
        EstadopartidoEntity saved = estadopartidoRepository.save(oEstadopartidoEntity);
        return toDTO(saved);
    }

    public EstadopartidoDTO update(EstadopartidoEntity oEstadopartidoEntity) {
        oSessionService.requireAdmin();
        EstadopartidoEntity existing = estadopartidoRepository.findById(oEstadopartidoEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("EstadoPartido no encontrado con id: " + oEstadopartidoEntity.getId()));
        existing.setDescripcion(oEstadopartidoEntity.getDescripcion());
        EstadopartidoEntity saved = estadopartidoRepository.save(existing);
        return toDTO(saved);
    }

    public Long delete(Long id) {
        oSessionService.requireAdmin();
        EstadopartidoEntity oEstadopartido = estadopartidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EstadoPartido no encontrado con id: " + id));
        estadopartidoRepository.delete(oEstadopartido);
        return id;
    }
}
