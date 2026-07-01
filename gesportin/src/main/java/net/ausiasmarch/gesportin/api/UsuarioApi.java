package net.ausiasmarch.gesportin.api;

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

import net.ausiasmarch.gesportin.dto.UsuarioDTO;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.service.UsuarioService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/usuario")
public class UsuarioApi {

    @Autowired
    private UsuarioService oUsuarioService;

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(oUsuarioService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<UsuarioDTO>> getPage(
            @PageableDefault(size = 1000) Pageable pageable,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) Long id_tipousuario,
            @RequestParam(required = false) Long id_club,
            @RequestParam(required = false) Long id_rol)
            {
        return ResponseEntity.ok(oUsuarioService.getPage(pageable, nombre, username, id_tipousuario, id_club, id_rol));
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> create(@RequestBody UsuarioEntity usuario) {
        return ResponseEntity.ok(oUsuarioService.create(usuario));
    }

    @PutMapping
    public ResponseEntity<UsuarioDTO> update(@RequestBody UsuarioEntity usuario) {
        return ResponseEntity.ok(oUsuarioService.update(usuario));
    }

    @PatchMapping("/picture/{id}")
    public void updatePicture(@PathVariable Long id, @RequestPart("image") MultipartFile image) throws java.io.IOException {
        oUsuarioService.updatePicture(id, image.getBytes());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oUsuarioService.delete(id));
    }
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oUsuarioService.count());
    }
}
