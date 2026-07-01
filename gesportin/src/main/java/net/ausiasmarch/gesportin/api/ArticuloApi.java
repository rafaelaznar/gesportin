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

import net.ausiasmarch.gesportin.dto.ArticuloDTO;
import net.ausiasmarch.gesportin.entity.ArticuloEntity;
import net.ausiasmarch.gesportin.service.ArticuloService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/articulo")
public class ArticuloApi {

    @Autowired
    private ArticuloService oArticuloService;

    @GetMapping("/{id}")
    public ResponseEntity<ArticuloDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(oArticuloService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<ArticuloDTO>> getPage(
            @PageableDefault(size = 1000) Pageable pageable,
            @RequestParam(required = false) String descripcion,
            @RequestParam(required = false) Long id_tipoarticulo,
            @RequestParam(required = false) Long id_club) {
        return ResponseEntity.ok(oArticuloService.getPage(pageable, descripcion, id_tipoarticulo, id_club));
    }

    @PostMapping
    public ResponseEntity<ArticuloDTO> create(@RequestBody ArticuloEntity articulo) {
        return ResponseEntity.ok(oArticuloService.create(articulo));
    }

    @PutMapping
    public ResponseEntity<ArticuloDTO> update(@RequestBody ArticuloEntity articulo) {
        return ResponseEntity.ok(oArticuloService.update(articulo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oArticuloService.delete(id));
    }
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oArticuloService.count());
    }

}
