package net.ausiasmarch.gesportin.api;

import java.util.List;

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

import net.ausiasmarch.gesportin.entity.RolusuarioEntity;
import net.ausiasmarch.gesportin.service.RolusuarioService;


@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/rolusuario")
public class RolusuarioApi {

    @Autowired
    private RolusuarioService oRolusuarioService;

    @GetMapping("/{id}")
    public ResponseEntity<RolusuarioEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oRolusuarioService.get(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<RolusuarioEntity>> all() {
        return ResponseEntity.ok(oRolusuarioService.all());
    }

    @GetMapping
    public ResponseEntity<Page<RolusuarioEntity>> getPage(
            @PageableDefault(size = 1000) Pageable pageable,
            @RequestParam(required = false) String descripcion) {
        return ResponseEntity.ok(oRolusuarioService.getPage(pageable, descripcion));
    }

    @PostMapping
    public ResponseEntity<RolusuarioEntity> create(@RequestBody RolusuarioEntity oRolusuarioEntity) {
        return ResponseEntity.ok(oRolusuarioService.create(oRolusuarioEntity));
    }

    @PutMapping
    public ResponseEntity<RolusuarioEntity> update(@RequestBody RolusuarioEntity oRolusuarioEntity) {
        return ResponseEntity.ok(oRolusuarioService.update(oRolusuarioEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oRolusuarioService.delete(id));
    }

    @PostMapping("/fill")
    public ResponseEntity<Long> fill() {
        return ResponseEntity.ok(oRolusuarioService.fill());
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oRolusuarioService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oRolusuarioService.count());
    }
}
