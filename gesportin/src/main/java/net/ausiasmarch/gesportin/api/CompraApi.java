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

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/compra")
public class CompraApi {

    @Autowired
    CompraService oCompraService;

    // ---------------------------Rellenar datos fake compra---------------------------------

    @GetMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oCompraService.fill(cantidad));
    }

    // ----------------------------CRUD---------------------------------

    // Obtener compra por id
    @GetMapping("/{id}")
    public ResponseEntity<CompraEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oCompraService.get(id));
    }

    // Crear compra
    @PostMapping("")
    public ResponseEntity<Long> create(@RequestBody CompraEntity compraEntity) {
        return ResponseEntity.ok(oCompraService.create(compraEntity));
    }

    // Modificar compra
    @PutMapping("")
    public ResponseEntity<Long> update(@RequestBody CompraEntity compraEntity) {
        return ResponseEntity.ok(oCompraService.update(compraEntity));
    }

    // Borrar compra
    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oCompraService.delete(id));
    }

    // Vaciar tabla compra (solo administradores)
    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oCompraService.empty());
    }

    // Listado paginado de compras
    @GetMapping("")
    public ResponseEntity<Page<CompraEntity>> getPage(Pageable oPageable) {
        return ResponseEntity.ok(oCompraService.getPage(oPageable));
    }

    // Contar compras
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oCompraService.count());
    }

}