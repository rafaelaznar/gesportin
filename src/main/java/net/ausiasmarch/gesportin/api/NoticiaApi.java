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

import net.ausiasmarch.gesportin.entity.NoticiaEntity;
import net.ausiasmarch.gesportin.service.NoticiaService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/noticia")
public class NoticiaApi {

    @Autowired
    private NoticiaService oNoticiaService;

    @GetMapping("/{id}")
    public ResponseEntity<NoticiaEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oNoticiaService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<NoticiaEntity>> getPage(
            @PageableDefault(size = 1000) Pageable oPageable,
            @RequestParam(required = false) Long idClub) {
        return ResponseEntity.ok(oNoticiaService.getPage(oPageable, idClub));
    }

    @PostMapping
    public ResponseEntity<NoticiaEntity> create(@RequestBody NoticiaEntity noticiaEntity) {
        return ResponseEntity.ok(oNoticiaService.create(noticiaEntity));
    }

    @PutMapping
    public ResponseEntity<NoticiaEntity> update(@RequestBody NoticiaEntity noticiaEntity) {
        return ResponseEntity.ok(oNoticiaService.update(noticiaEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oNoticiaService.delete(id));
    }

    @PostMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oNoticiaService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oNoticiaService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oNoticiaService.count());
    }

}
