package net.ausiasmarch.gesportin.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            @PageableDefault(size = 1000) Pageable pageable,
            @RequestParam(required = false) Long id_usuario,
            @RequestParam(required = false) Long id_articulo) {
        return ResponseEntity.ok(oCarritoService.getPage(pageable, id_usuario, id_articulo));
    }

    @PostMapping
    public ResponseEntity<CarritoEntity> create(@RequestBody CarritoEntity carrito) {
        return ResponseEntity.ok(oCarritoService.create(carrito));
    }

    @PutMapping
    public ResponseEntity<CarritoEntity> update(@RequestBody CarritoEntity carrito) {
        return ResponseEntity.ok(oCarritoService.update(carrito));
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
