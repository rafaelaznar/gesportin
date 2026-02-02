package net.ausiasmarch.gesportin.api;

import java.util.Optional;

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
    private CategoriaService oCategoriaService;

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oCategoriaService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<CategoriaEntity>> getPage(
            Pageable pageable,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Optional<String> nombre,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Optional<Long> id_temporada) {
        return ResponseEntity.ok(oCategoriaService.getPage(pageable, nombre, id_temporada));
    }

    @PostMapping
    public ResponseEntity<CategoriaEntity> create(@RequestBody CategoriaEntity categoriaEntity) {
        return ResponseEntity.ok(oCategoriaService.create(categoriaEntity));
    }

    @PutMapping
    public ResponseEntity<CategoriaEntity> update(@RequestBody CategoriaEntity categoriaEntity) {
        return ResponseEntity.ok(oCategoriaService.update(categoriaEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oCategoriaService.delete(id));
    }

    @PostMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oCategoriaService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oCategoriaService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oCategoriaService.count());
    }
} 
