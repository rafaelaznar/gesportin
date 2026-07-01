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

import net.ausiasmarch.gesportin.dto.ComentarioDTO;
import net.ausiasmarch.gesportin.entity.ComentarioEntity;
import net.ausiasmarch.gesportin.service.ComentarioService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/comentario")
public class ComentarioApi {

    @Autowired
    private ComentarioService oComentarioService;

    @GetMapping("/{id}")
    public ResponseEntity<ComentarioDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(oComentarioService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<ComentarioDTO>> getPage(
            @PageableDefault(size = 1000) Pageable pageable,
            @RequestParam(required = false) String contenido,
            @RequestParam(required = false) Long id_usuario,
            @RequestParam(required = false) Long id_noticia) {
        return ResponseEntity.ok(oComentarioService.getPage(pageable, contenido, id_usuario,  id_noticia));
    }

    @PostMapping
    public ResponseEntity<ComentarioDTO> create(@RequestBody ComentarioEntity comentario) {
        return ResponseEntity.ok(oComentarioService.create(comentario));
    }

    @PutMapping
    public ResponseEntity<ComentarioDTO> update(@RequestBody ComentarioEntity comentario) {
        return ResponseEntity.ok(oComentarioService.update(comentario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oComentarioService.delete(id));
    }
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oComentarioService.count());
    }
}
