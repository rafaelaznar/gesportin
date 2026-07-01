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

import net.ausiasmarch.gesportin.dto.NoticiaDTO;
import net.ausiasmarch.gesportin.entity.NoticiaEntity;
import net.ausiasmarch.gesportin.service.NoticiaService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/noticia")
public class NoticiaApi {

    @Autowired
    private NoticiaService oNoticiaService;

    @GetMapping("/{id}")
    public ResponseEntity<NoticiaDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(oNoticiaService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<NoticiaDTO>> getPage(
            @PageableDefault(size = 1000) Pageable oPageable,
            @RequestParam(required = false) String contenido,
            @RequestParam(required = false) Long id_club) {
        return ResponseEntity.ok(oNoticiaService.getPage(oPageable, contenido, id_club));
    }

    @PostMapping
    public ResponseEntity<NoticiaDTO> create(@RequestBody NoticiaEntity noticiaEntity) {
        return ResponseEntity.ok(oNoticiaService.create(noticiaEntity));
    }

    @PutMapping
    public ResponseEntity<NoticiaDTO> update(@RequestBody NoticiaEntity noticiaEntity) {
        return ResponseEntity.ok(oNoticiaService.update(noticiaEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oNoticiaService.delete(id));
    }
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oNoticiaService.count());
    }

}
