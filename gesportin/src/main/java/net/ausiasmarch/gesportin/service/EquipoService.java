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
    private UsuarioService oUsuarioService;

    @Autowired
    private CategoriaService oCategoriaService;

    public EquipoEntity get(Long id) {
        return oEquipoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Equipo no encontrado con id: " + id));
    }

    public Page<EquipoEntity> getPage(Pageable pageable, String descripcion, Long id_categoria, Long id_usuario) {
        if (descripcion != null && !descripcion.isEmpty()) {
            return oEquipoRepository.findByNombreContainingIgnoreCase(descripcion, pageable);
        } else if (id_categoria != null) {
            return oEquipoRepository.findByCategoriaId(id_categoria, pageable);
        } else if (id_usuario != null) {
            return oEquipoRepository.findByEntrenadorId(id_usuario, pageable);
        } else {
            return oEquipoRepository.findAll(pageable);
        }
    }

    public EquipoEntity create(EquipoEntity oEquipoEntity) {
        oEquipoEntity.setId(null);
        oEquipoEntity.setEntrenador(oUsuarioService.get(oEquipoEntity.getEntrenador().getId()));
        oEquipoEntity.setCategoria(oCategoriaService.get(oEquipoEntity.getCategoria().getId()));
        return oEquipoRepository.save(oEquipoEntity);
    }

    public EquipoEntity update(EquipoEntity oEquipoEntity) {
        EquipoEntity oEquipoExistente = oEquipoRepository.findById(oEquipoEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Equipo no encontrado con id: " + oEquipoEntity.getId()));
        oEquipoExistente.setNombre(oEquipoEntity.getNombre());
        oEquipoExistente.setEntrenador(oUsuarioService.get(oEquipoEntity.getEntrenador().getId()));
        oEquipoExistente.setCategoria(oCategoriaService.get(oEquipoEntity.getCategoria().getId()));
        return oEquipoRepository.save(oEquipoExistente);
    }

    public Long delete(Long id) {
        EquipoEntity oEquipo = oEquipoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipo no encontrado con id: " + id));
        oEquipoRepository.delete(oEquipo);
        return id;
    }

    public Long count() {
        return oEquipoRepository.count();
    }

    public Long empty() {
        oEquipoRepository.deleteAll();
        oEquipoRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            EquipoEntity oEquipo = new EquipoEntity();
            oEquipo.setNombre("Equipo " + i);
            oEquipo.setEntrenador(oUsuarioService.getOneRandom());
            oEquipo.setCategoria(oCategoriaService.getOneRandom());
            oEquipoRepository.save(oEquipo);
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
