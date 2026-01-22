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

import net.ausiasmarch.gesportin.entity.EquipoEntity;
import net.ausiasmarch.gesportin.service.EquipoService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/equipo")
public class EquipoApi {

    @Autowired
    private EquipoService oEquipoService;

    @GetMapping("/{id}")
    public ResponseEntity<EquipoEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oEquipoService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<EquipoEntity>> getPage(Pageable pageable, String description, Long idCuota, Long idUsuario) {
        return ResponseEntity.ok(oEquipoService.getPage(pageable, description, idCuota, idUsuario));
    }

    @PostMapping
    public ResponseEntity<EquipoEntity> create(@RequestBody EquipoEntity equipoEntity) {
        return ResponseEntity.ok(oEquipoService.create(equipoEntity));
    }

    @PutMapping
    public ResponseEntity<EquipoEntity> update(@RequestBody EquipoEntity equipoEntity) {
        return ResponseEntity.ok(oEquipoService.update(equipoEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oEquipoService.delete(id));
    }

    @PostMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oEquipoService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oEquipoService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oEquipoService.count());
    }

}