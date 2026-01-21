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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.ausiasmarch.gesportin.entity.ComentarioartEntity;
import net.ausiasmarch.gesportin.service.ComentarioartService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/comentarioart")
public class ComentarioartApi {

    @Autowired
    private ComentarioartService oComentarioartService;

    @GetMapping("/{id}")
    public ResponseEntity<ComentarioartEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oComentarioartService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<ComentarioartEntity>> getPage(
            @PageableDefault(size = 1000) Pageable pageable,
            @RequestParam(required = false) Long id_articulo,
            @RequestParam(required = false) Long id_usuario
            ) {
        return ResponseEntity.ok(oComentarioartService.getPage(pageable, id_articulo, id_usuario));
    }

    @PostMapping
    public ResponseEntity<ComentarioartEntity> create(@RequestBody ComentarioartEntity comentarioart) {
        return ResponseEntity.ok(oComentarioartService.create(comentarioart));
    }

    @PutMapping
    public ResponseEntity<ComentarioartEntity> update(@RequestBody ComentarioartEntity comentarioart) {
        return ResponseEntity.ok(oComentarioartService.update(comentarioart));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oComentarioartService.delete(id));
    }

    @PostMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oComentarioartService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oComentarioartService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oComentarioartService.count());
    }
}
