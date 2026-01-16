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

    private static final String[] CATEGORIAS = {"Querubín", "Pre-benjamín", "Benjamín", "Alevín", "Infantil", "Cadete", "Juvenil", "Amateur"};

    public CategoriaEntity get(Long id) {
        return oCategoriaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrado con id: " + id));
    }

    public Page<CategoriaEntity> getPage(Pageable pageable) {
        return oCategoriaRepository.findAll(pageable);
    }

    public CategoriaEntity create(CategoriaEntity categoria) {
        categoria.setId(null);
        return oCategoriaRepository.save(categoria);
    }

    public CategoriaEntity update(CategoriaEntity categoria) {
        CategoriaEntity existingCategoria = oCategoriaRepository.findById(categoria.getId()).orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrado con id: " + categoria.getId()));
        existingCategoria.setNombre(categoria.getNombre());
        //existingCategoria.setIdTemporada(categoria.getIdTemporada());
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
            CategoriaEntity categoria = new CategoriaEntity();
            categoria.setNombre(CATEGORIAS[oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, CATEGORIAS.length - 1)]);
            //categoria.setIdTemporada((long) oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 50));
            oCategoriaRepository.save(categoria);
        }
        return cantidad;
    }
}
