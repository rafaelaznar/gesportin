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
    private EquipoRepository oEquipoRepository;

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private UsuarioService oUsuarioService;

    @Autowired
    private CategoriaService oCategoriaService;

    public EquipoEntity get(Long id) {
        return oEquipoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Equipo no encontrado con id: " + id));
    }

    public Page<EquipoEntity> getPage(Pageable pageable) {
        return oEquipoRepository.findAll(pageable);
    }

    public EquipoEntity create(EquipoEntity equipo) {
        equipo.setId(null);
        return oEquipoRepository.save(equipo);
    }

    public EquipoEntity update(EquipoEntity equipo) {
        EquipoEntity oEquipoEntity = oEquipoRepository.findById(equipo.getId()).orElseThrow(() -> new ResourceNotFoundException("Equipo no encontrado con id: " + equipo.getId()));
        oEquipoEntity.setNombre(equipo.getNombre());
        // oEquipoEntity.setIdEntrenador(equipo.getIdEntrenador());
        // oEquipoEntity.setIdCategoria(equipo.getIdCategoria());
        return oEquipoRepository.save(oEquipoEntity);
    }

    public Long delete(Long id) {
        EquipoEntity equipo = oEquipoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipo no encontrado con id: " + id));
        oEquipoRepository.delete(equipo);
        return id;
    }

    public Long empty() {
        oEquipoRepository.deleteAll();
        oEquipoRepository.flush();
        return 0L;
    }

    public Long count() {
        return oEquipoRepository.count();
    }

    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            EquipoEntity equipo = new EquipoEntity();
            equipo.setNombre("Equipo " + i);
            equipo.setEntrenador(oUsuarioService.getOneRandom());
            equipo.setCategoria(oCategoriaService.getOneRandom());
            oEquipoRepository.save(equipo);
        }
        return cantidad;
    }

    public EquipoEntity getOneRandom() {
        Long count = oEquipoRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oEquipoRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }
}
