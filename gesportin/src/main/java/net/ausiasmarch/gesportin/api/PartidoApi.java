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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.ausiasmarch.gesportin.entity.PartidoEntity;
import net.ausiasmarch.gesportin.service.PartidoService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/partido")
public class PartidoApi {

    @Autowired
    private PartidoService oPartidoService;

    @GetMapping("/{id}")
    public ResponseEntity<PartidoEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oPartidoService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<PartidoEntity>> getPage(Pageable oPageable,
            @RequestParam(required = false) Long id_liga) {
        return ResponseEntity.ok(oPartidoService.getPage(oPageable, id_liga));
    }

    @PostMapping
    public ResponseEntity<PartidoEntity> create(@RequestBody PartidoEntity partidoEntity) {
        return ResponseEntity.ok(oPartidoService.create(partidoEntity));
    }

    @PutMapping
    public ResponseEntity<PartidoEntity> update(@RequestBody PartidoEntity partidoEntity) {
        return ResponseEntity.ok(oPartidoService.update(partidoEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oPartidoService.delete(id));
    }

    @PostMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oPartidoService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oPartidoService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oPartidoService.count());
    }

}
