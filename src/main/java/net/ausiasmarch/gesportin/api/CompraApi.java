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

import net.ausiasmarch.gesportin.entity.CompraEntity;
import net.ausiasmarch.gesportin.service.CompraService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/compra")
public class CompraApi {

    @Autowired
    private CompraService oCompraService;

    @GetMapping("/{id}")
    public ResponseEntity<CompraEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oCompraService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<CompraEntity>> getPage(
            Pageable oPageable,
            @PathVariable(required = false) Long id_articulo,
            @PathVariable(required = false) Long id_factura
        ) {
        return ResponseEntity.ok(oCompraService.getPage(oPageable, id_articulo, id_factura));
    }

    @PostMapping
    public ResponseEntity<CompraEntity> create(@RequestBody CompraEntity compraEntity) {
        return ResponseEntity.ok(oCompraService.create(compraEntity));
    }

    @PutMapping
    public ResponseEntity<CompraEntity> update(@RequestBody CompraEntity compraEntity) {
        return ResponseEntity.ok(oCompraService.update(compraEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oCompraService.delete(id));
    }

    @PostMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oCompraService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oCompraService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oCompraService.count());
    }

}