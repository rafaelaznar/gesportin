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

import net.ausiasmarch.gesportin.dto.PuntuacionartDTO;
import net.ausiasmarch.gesportin.entity.PuntuacionartEntity;
import net.ausiasmarch.gesportin.service.PuntuacionartService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/puntuacionart")
public class PuntuacionartApi {

    @Autowired
    private PuntuacionartService oPuntuacionartService;

    @GetMapping("/{id}")
    public ResponseEntity<PuntuacionartDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(oPuntuacionartService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<PuntuacionartDTO>> getPage(
            @PageableDefault(size = 1000) Pageable pageable,
            @RequestParam(required = false) Long id_articulo,
            @RequestParam(required = false) Long id_usuario) {
        return ResponseEntity.ok(oPuntuacionartService.getPage(pageable, id_articulo, id_usuario));
    }

    @PostMapping
    public ResponseEntity<PuntuacionartDTO> create(@RequestBody PuntuacionartEntity oPuntuacionartEntity) {
        return ResponseEntity.ok(oPuntuacionartService.create(oPuntuacionartEntity));
    }

    @PutMapping
    public ResponseEntity<PuntuacionartDTO> update(@RequestBody PuntuacionartEntity oPuntuacionartEntity) {
        return ResponseEntity.ok(oPuntuacionartService.update(oPuntuacionartEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oPuntuacionartService.delete(id));
    }

    @PostMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oPuntuacionartService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oPuntuacionartService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oPuntuacionartService.count());
    }
}
