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

import net.ausiasmarch.gesportin.entity.PagoEntity;
import net.ausiasmarch.gesportin.service.PagoService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/pago")
public class PagoApi {

    @Autowired
    private PagoService oPagoService;

    @GetMapping("/{id}")
    public ResponseEntity<PagoEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oPagoService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<PagoEntity>> getPage(
            @PageableDefault(size = 1000) Pageable oPageable,
            @RequestParam(required = false) Long idCuota,
            @RequestParam(required = false) Long idJugador) {
        return ResponseEntity.ok(oPagoService.getPage(oPageable, idCuota, idJugador));
    }

    @PostMapping
    public ResponseEntity<PagoEntity> create(@RequestBody PagoEntity pagoEntity) {
        return ResponseEntity.ok(oPagoService.create(pagoEntity));
    }

    @PutMapping
    public ResponseEntity<PagoEntity> update(@RequestBody PagoEntity pagoEntity) {
        return ResponseEntity.ok(oPagoService.update(pagoEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oPagoService.delete(id));
    }

    @PostMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oPagoService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oPagoService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oPagoService.count());
    }

}