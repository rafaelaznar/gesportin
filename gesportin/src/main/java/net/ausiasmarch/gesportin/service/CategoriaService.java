package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.CategoriaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
// import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.CategoriaRepository;

@Service
public class CategoriaService {
    
    @Autowired
    AleatorioService aleatorioService;

    @Autowired
    CategoriaRepository categoriaRepository;

    // @Autowired
    // SessionService sessionService;

    // Lista de Categorias
    private static final String[] CATEGORIAS = {"Querubín", "Pre-benjamín", "Benjamín", "Alevín", "Infantil", "Cadete", "Juvenil", "Amateur"};

    // ----------------------------CRUD---------------------------------
    public CategoriaEntity get(Long id){
        // if(!sessionService.isSessionActive()) {
        //     throw new UnauthorizedException("No active session");
        // } else {
        //     return categoriaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        // }
        return categoriaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    public Page<CategoriaEntity> getPage(Pageable pageable) {
        // if(!sessionService.isSessionActive()) {
        //     throw new UnauthorizedException("No active session");
        // } else {
        //     return categoriaRepository.findAll(pageable);
        // }
        return categoriaRepository.findAll(pageable);
    }

    public Long create(CategoriaEntity categoriaEntity) {
     
        // if(!sessionService.isSessionActive()) {
        //     throw new UnauthorizedException("No active session");
        // }

        categoriaRepository.save(categoriaEntity);
        return categoriaEntity.getId();
    }

    public Long update(CategoriaEntity categoriaEntity) {

        // if (!sessionService.isSessionActive()) {
        //     throw new UnauthorizedException("No active session");
        // }

        CategoriaEntity existingCategoria = categoriaRepository.findById(categoriaEntity.getId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        existingCategoria.setNombre(categoriaEntity.getNombre());
        categoriaRepository.save(existingCategoria);
        return existingCategoria.getId();
    }

    public Long delete(Long id) {

        // if (!sessionService.isSessionActive()) {
        //     throw new UnauthorizedException("No active session");
        // }

        categoriaRepository.deleteById(id);
        return id;
    }

    public Long fill(Long numCategorias) {
        // if (!sessionService.isSessionActive()) {
        //     throw new UnauthorizedException("No active session");
        // }

        for (long j = 0; j < numCategorias; j++) {
            CategoriaEntity categoriaEntity = new CategoriaEntity();
            categoriaEntity.setNombre(CATEGORIAS[aleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, CATEGORIAS.length - 1)]);
            categoriaRepository.save(categoriaEntity);
        }

        return count();
    }

    public Long empty() {
        // if (!sessionService.isSessionActive()) {
        //     throw new UnauthorizedException("No active session");
        // }

        Long total = count();
        categoriaRepository.deleteAll();
        return total;

    }

    public Long count() {
        return categoriaRepository.count();
    }

}
