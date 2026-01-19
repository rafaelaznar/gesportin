package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.CategoriaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.CategoriaRepository;

@Service
public class CategoriaService {

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private CategoriaRepository oCategoriaRepository;

    @Autowired
    private TemporadaService oTemporadaService;

    private static final String[] CATEGORIAS = {"Querubín", "Pre-benjamín", "Benjamín", "Alevín", "Infantil", "Cadete", "Juvenil", "Amateur"};

    public CategoriaEntity get(Long id) {
        return oCategoriaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrado con id: " + id));
    }

    public Page<CategoriaEntity> getPage(Pageable pageable) {
        return oCategoriaRepository.findAll(pageable);
    }

    public CategoriaEntity create(CategoriaEntity oCategoriaEntity) {        
        oCategoriaEntity.setId(null);
        oCategoriaEntity.setTemporada(oCategoriaEntity.getTemporada());
        return oCategoriaRepository.save(oCategoriaEntity);
    }

    public CategoriaEntity update(CategoriaEntity oCategoriaEntity) {
        CategoriaEntity existingCategoria = oCategoriaRepository.findById(oCategoriaEntity.getId()).orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrado con id: " + oCategoriaEntity.getId()));
        existingCategoria.setNombre(oCategoriaEntity.getNombre());
        existingCategoria.setTemporada(oCategoriaEntity.getTemporada());
        return oCategoriaRepository.save(existingCategoria);
    }

    public Long delete(Long id) {
        CategoriaEntity categoria = oCategoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrado con id: " + id));
        oCategoriaRepository.delete(categoria);
        return id;
    }

    public Long empty() {
        oCategoriaRepository.deleteAll();
        oCategoriaRepository.flush();
        return 0L;
    }

    public Long count() {
        return oCategoriaRepository.count();
    }

    public Long fill(Long cantidad) {
        for (long j = 0; j < cantidad; j++) {
            CategoriaEntity oCategoria = new CategoriaEntity();
            oCategoria.setNombre(CATEGORIAS[oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, CATEGORIAS.length - 1)]);
            oCategoria.setTemporada(oTemporadaService.getOneRandom());
            oCategoriaRepository.save(oCategoria);
        }
        return cantidad;
    }

    public CategoriaEntity getOneRandom() {
        Long count = oCategoriaRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oCategoriaRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }
}
