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

import net.ausiasmarch.gesportin.entity.LigaEntity;
import net.ausiasmarch.gesportin.service.LigaService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/liga")
public class LigaApi {

    @Autowired
    private LigaService oLigaService;

    @GetMapping("/{id}")
    public ResponseEntity<LigaEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oLigaService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<LigaEntity>> getPage(
            @PageableDefault(size = 1000) Pageable pageable,
            @RequestParam(required = false) String nombre) {
        return ResponseEntity.ok(oLigaService.getPage(pageable, nombre));
    }

    @PostMapping
    public ResponseEntity<LigaEntity> create(@RequestBody LigaEntity liga) {
        return ResponseEntity.ok(oLigaService.create(liga));
    }

    @PutMapping
    public ResponseEntity<LigaEntity> update(@RequestBody LigaEntity liga) {
        return ResponseEntity.ok(oLigaService.update(liga));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oLigaService.delete(id));
    }

    @PostMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oLigaService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oLigaService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oLigaService.count());
    }
}
