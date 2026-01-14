package net.ausiasmarch.gesportin.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.ausiasmarch.gesportin.entity.CategoriaEntity;
import net.ausiasmarch.gesportin.service.CategoriaService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/categoria")
public class CategoriaApi {
    
    @Autowired
    CategoriaService categoriaService;

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<CategoriaEntity>> getPage(Pageable pageable) {
        return ResponseEntity.ok(categoriaService.getPage(pageable));
    }

    @PostMapping
    public ResponseEntity<CategoriaEntity> create(@RequestBody CategoriaEntity categoriaEntity) {
        return ResponseEntity.ok(categoriaService.create(categoriaEntity));
    }

    @PutMapping
    public ResponseEntity<CategoriaEntity> update(@RequestBody CategoriaEntity categoriaEntity) {
        return ResponseEntity.ok(categoriaService.update(categoriaEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.delete(id));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(categoriaService.count());
    }

    @GetMapping("/fill/{numCategorias}")
    public ResponseEntity<Long> fill(@PathVariable Long numCategorias) {
        return ResponseEntity.ok(categoriaService.fill(numCategorias));
    }

    @GetMapping("/fill")
    public ResponseEntity<Long> fillDefault() {
        return ResponseEntity.ok(categoriaService.fill(50L));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(categoriaService.empty());
    }
} 
