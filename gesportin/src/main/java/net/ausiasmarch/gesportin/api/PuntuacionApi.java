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

import net.ausiasmarch.gesportin.dto.PuntuacionDTO;
import net.ausiasmarch.gesportin.entity.PuntuacionEntity;
import net.ausiasmarch.gesportin.service.PuntuacionService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/puntuacion")
public class PuntuacionApi {

    @Autowired
    private PuntuacionService oPuntuacionService;

    @GetMapping("/{id}")
    public ResponseEntity<PuntuacionDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(oPuntuacionService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<PuntuacionDTO>> getPage(
            @PageableDefault(size = 1000) Pageable pageable,
            @RequestParam(required = false) Long id_noticia,
            @RequestParam(required = false) Long id_usuario) {
        return ResponseEntity.ok(oPuntuacionService.getPage(pageable, id_noticia, id_usuario));
    }

    @PostMapping
    public ResponseEntity<PuntuacionDTO> create(@RequestBody PuntuacionEntity oPuntuacionEntity) {
        return ResponseEntity.ok(oPuntuacionService.create(oPuntuacionEntity));
    }

    @PutMapping
    public ResponseEntity<PuntuacionDTO> update(@RequestBody PuntuacionEntity oPuntuacionEntity) {
        return ResponseEntity.ok(oPuntuacionService.update(oPuntuacionEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oPuntuacionService.delete(id));
    }
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oPuntuacionService.count());
    }

}
