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

import net.ausiasmarch.gesportin.dto.EquipoDTO;
import net.ausiasmarch.gesportin.entity.EquipoEntity;
import net.ausiasmarch.gesportin.service.EquipoService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/equipo")
public class EquipoApi {

    @Autowired
    private EquipoService oEquipoService;

    @GetMapping("/{id}")
    public ResponseEntity<EquipoDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(oEquipoService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<EquipoDTO>> getPage(
            @PageableDefault(size = 1000) Pageable pageable,
            @RequestParam(required = false) String descripcion,
            @RequestParam(required = false) Long id_categoria,
            @RequestParam(required = false) Long id_usuario) {                        
        return ResponseEntity.ok(oEquipoService.getPage(pageable, descripcion, id_categoria, id_usuario));
    }

    @PostMapping
    public ResponseEntity<EquipoDTO> create(@RequestBody EquipoEntity equipoEntity) {
        return ResponseEntity.ok(oEquipoService.create(equipoEntity));
    }

    @PutMapping
    public ResponseEntity<EquipoDTO> update(@RequestBody EquipoEntity equipoEntity) {
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

    @GetMapping("/countByTemporada/{id_temporada}")
    public ResponseEntity<Long> countByTemporada(@PathVariable Long id_temporada) {
        return ResponseEntity.ok(oEquipoService.countByTemporada(id_temporada));
    }

}