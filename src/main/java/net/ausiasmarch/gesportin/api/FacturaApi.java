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

import net.ausiasmarch.gesportin.entity.FacturaEntity;
import net.ausiasmarch.gesportin.service.FacturaService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/factura")
public class FacturaApi {

    @Autowired
    private FacturaService oFacturaService;

    @GetMapping("/{id}")
    public ResponseEntity<FacturaEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oFacturaService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<FacturaEntity>> getPage(
        @PageableDefault(size = 1000) Pageable pageable,
        @RequestParam(required = false) Long idUsuario) {
        return ResponseEntity.ok(oFacturaService.getPage(pageable, idUsuario));
    }

    @PostMapping
    public ResponseEntity<FacturaEntity> create(@RequestBody FacturaEntity facturaEntity) {
        return ResponseEntity.ok(oFacturaService.create(facturaEntity));
    }

    @PutMapping
    public ResponseEntity<FacturaEntity> update(@RequestBody FacturaEntity facturaEntity) {
        return ResponseEntity.ok(oFacturaService.update(facturaEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oFacturaService.delete(id));
    }

    @PostMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oFacturaService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oFacturaService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oFacturaService.count());
    }

}