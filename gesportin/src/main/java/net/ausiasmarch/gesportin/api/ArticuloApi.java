package net.ausiasmarch.gesportin.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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

import net.ausiasmarch.gesportin.bean.ArticuloFiller;
import net.ausiasmarch.gesportin.entity.ArticuloEntity;
import net.ausiasmarch.gesportin.filter.ArticuloFilter;
import net.ausiasmarch.gesportin.service.ArticuloService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/articulo")
public class ArticuloApi {

    @Autowired
    private ArticuloService articuloService;

    @Autowired
    private ArticuloFiller articuloFiller;

    @GetMapping("/{id}")
    public ResponseEntity<ArticuloEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(articuloService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<ArticuloEntity>> getPage(@PageableDefault(size = 1000) Pageable pageable, ArticuloFilter filter) {
        return ResponseEntity.ok(articuloService.getPage(pageable, filter));
    }

    @PostMapping
    public ResponseEntity<ArticuloEntity> create(@RequestBody ArticuloEntity articulo) {
        return ResponseEntity.ok(articuloService.create(articulo));
    }

    @PutMapping
    public ResponseEntity<ArticuloEntity> update(@RequestBody ArticuloEntity articulo) {
        return ResponseEntity.ok(articuloService.update(articulo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(articuloService.delete(id));
    }

    @GetMapping("/fill")
    public ResponseEntity<Long> fill() {
        return ResponseEntity.ok(articuloFiller.fill());
    }

}
