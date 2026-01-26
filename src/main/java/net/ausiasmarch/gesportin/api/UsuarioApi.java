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

import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.service.UsuarioService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/usuario")
public class UsuarioApi {

    @Autowired
    private UsuarioService oUsuarioService;

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oUsuarioService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<UsuarioEntity>> getPage(
            @PageableDefault(size = 1000) Pageable pageable,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) Long idTipousuario,
            @RequestParam(required = false) Long idClub,
            @RequestParam(required = false) Long idRol)
            {
        return ResponseEntity.ok(oUsuarioService.getPage(pageable, nombre, username, idTipousuario, idClub, idRol));
    }

    @PostMapping
    public ResponseEntity<UsuarioEntity> create(@RequestBody UsuarioEntity usuario) {
        return ResponseEntity.ok(oUsuarioService.create(usuario));
    }

    @PutMapping
    public ResponseEntity<UsuarioEntity> update(@RequestBody UsuarioEntity usuario) {
        return ResponseEntity.ok(oUsuarioService.update(usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oUsuarioService.delete(id));
    }

    @PostMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oUsuarioService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oUsuarioService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oUsuarioService.count());
    }
}
