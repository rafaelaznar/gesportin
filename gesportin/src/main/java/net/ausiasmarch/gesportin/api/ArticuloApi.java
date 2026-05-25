package net.ausiasmarch.gesportin.api;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import net.ausiasmarch.gesportin.entity.ArticuloEntity;
import net.ausiasmarch.gesportin.service.ArticuloService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/articulo")
public class ArticuloApi {

    @Autowired
    private ArticuloService oArticuloService;

    @GetMapping("/{id}")
    public ResponseEntity<ArticuloEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oArticuloService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<ArticuloEntity>> getPage(
            @PageableDefault(size = 1000) Pageable pageable,
            @RequestParam(required = false) String descripcion,
            @RequestParam(required = false) Long id_tipoarticulo) {
        return ResponseEntity.ok(oArticuloService.getPage(pageable, descripcion, id_tipoarticulo));
    }

    @PostMapping
    public ResponseEntity<ArticuloEntity> create(@RequestBody ArticuloEntity articulo) {
        return ResponseEntity.ok(oArticuloService.create(articulo));
    }

    @PutMapping
    public ResponseEntity<ArticuloEntity> update(@RequestBody ArticuloEntity articulo) {
        return ResponseEntity.ok(oArticuloService.update(articulo));
    }

    @PatchMapping("/picture")
    public void updatePicture(@RequestPart("articulo") ArticuloEntity articulo, @RequestPart("image") MultipartFile image) throws IOException {
        oArticuloService.updatePicture(articulo, image.getBytes());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oArticuloService.delete(id));
    }

    @PostMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oArticuloService.fill(cantidad));
    }

    @GetMapping("/fill")
    public ResponseEntity<Long> fillDefault() {
        return ResponseEntity.ok(oArticuloService.fill(50L));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oArticuloService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oArticuloService.count());
    }

}
