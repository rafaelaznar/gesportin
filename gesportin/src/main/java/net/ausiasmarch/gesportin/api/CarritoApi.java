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

import net.ausiasmarch.gesportin.entity.CarritoEntity;
import net.ausiasmarch.gesportin.service.CarritoService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/carrito")
public class CarritoApi {

    @Autowired
    private CarritoService oCarritoService;
    
    @GetMapping("/{id}")
    public ResponseEntity<CarritoEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oCarritoService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<CarritoEntity>> getPage(
        @PageableDefault(size = 1000) Pageable oPageable,
        @RequestParam(required = false) Long idUsuario,
        @RequestParam(required = false) Long idArticulo) {
        return ResponseEntity.ok(oCarritoService.getPage(oPageable, idUsuario, idArticulo));
    }

    @PostMapping
    public ResponseEntity<CarritoEntity> create(@RequestBody CarritoEntity oCarritoEntity) {
        return ResponseEntity.ok(oCarritoService.create(oCarritoEntity));
    }

    @PutMapping
    public ResponseEntity<CarritoEntity> update(@RequestBody CarritoEntity oCarritoEntity) {
        return ResponseEntity.ok(oCarritoService.update(oCarritoEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oCarritoService.delete(id));
    }

    @PostMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oCarritoService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oCarritoService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oCarritoService.count());
    }
}
