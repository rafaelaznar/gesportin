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

import net.ausiasmarch.gesportin.entity.TipoarticuloEntity;
import net.ausiasmarch.gesportin.service.TipoarticuloService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/tipoarticulo")
public class TipoarticuloApi {

    @Autowired
    private TipoarticuloService oTipoarticuloService;

    @GetMapping("/{id}")
    public ResponseEntity<TipoarticuloEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oTipoarticuloService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<TipoarticuloEntity>> getPage(
            @PageableDefault(size = 1000) Pageable oPageable,
            @RequestParam(required = false) String descripcion,
            @RequestParam(required = false) Long idClub) {
        return ResponseEntity.ok(oTipoarticuloService.getPage(oPageable, descripcion, idClub));
    }

    @PostMapping
    public ResponseEntity<TipoarticuloEntity> create(@RequestBody TipoarticuloEntity tipoarticulo) {
        return ResponseEntity.ok(oTipoarticuloService.create(tipoarticulo));
    }

    @PutMapping
    public ResponseEntity<TipoarticuloEntity> update(@RequestBody TipoarticuloEntity tipoarticulo) {
        return ResponseEntity.ok(oTipoarticuloService.update(tipoarticulo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oTipoarticuloService.delete(id));
    }

    @PostMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oTipoarticuloService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oTipoarticuloService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oTipoarticuloService.count());
    }
}
