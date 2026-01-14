package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.EquipoEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.EquipoRepository;

@Service
public class EquipoService {

    @Autowired
    EquipoRepository equipoRepository;

    @Autowired
    AleatorioService aleatorioService;

    public EquipoEntity get(Long id) {
        return equipoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Equipo not found"));
    }

    public Page<EquipoEntity> getPage(Pageable pageable) {
        return equipoRepository.findAll(pageable);
    }

    public EquipoEntity create(EquipoEntity equipoEntity) {
        equipoEntity.setId(null);
        return equipoRepository.save(equipoEntity);
    }

    public EquipoEntity update(EquipoEntity equipoEntity) {
        EquipoEntity oEquipoEntity = equipoRepository.findById(equipoEntity.getId()).orElseThrow(() -> new ResourceNotFoundException("Equipo not found"));
        oEquipoEntity.setNombre(equipoEntity.getNombre());
        oEquipoEntity.setIdEntrenador(equipoEntity.getIdEntrenador());
        oEquipoEntity.setIdCategoria(equipoEntity.getIdCategoria());
        return equipoRepository.save(oEquipoEntity);
    }

    public Long delete(Long id) {
        if (!equipoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Equipo not found");
        }
        equipoRepository.deleteById(id);
        return id;
    }

    public Long count() {
        return equipoRepository.count();
    }

    public Long empty() {
        equipoRepository.deleteAll();
        equipoRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            EquipoEntity equipoEntity = new EquipoEntity();
            equipoEntity.setNombre("Equipo " + i);
            equipoEntity.setIdEntrenador((long) aleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            equipoEntity.setIdCategoria((long) aleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            equipoRepository.save(equipoEntity);
        }
        return cantidad;
    }
}