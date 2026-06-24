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

import net.ausiasmarch.gesportin.dto.JugadorDTO;
import net.ausiasmarch.gesportin.entity.JugadorEntity;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.service.JugadorService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/jugador")
public class JugadorApi {

    @Autowired
    private JugadorService oJugadorService;

    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<JugadorDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(oJugadorService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<JugadorDTO>> getPage(
            @PageableDefault(size = 1000) Pageable pageable,
            @RequestParam(required = false) String posicion,
            @RequestParam(required = false) Long id_usuario,
            @RequestParam(required = false) Long id_equipo) {
        return ResponseEntity.ok(oJugadorService.getPage(pageable, posicion, id_usuario, id_equipo));
    }

    @PostMapping
    public ResponseEntity<JugadorDTO> create(@RequestBody JugadorEntity jugadorEntity) {
        return ResponseEntity.ok(oJugadorService.create(jugadorEntity));
    }

    @PutMapping
    public ResponseEntity<JugadorDTO> update(@RequestBody JugadorEntity jugadorEntity) {
        return ResponseEntity.ok(oJugadorService.update(jugadorEntity));
    }

    @PatchMapping("/picture/{id}")
    public void updatePicture(@PathVariable Long id, @RequestPart("image") MultipartFile image) throws IOException {
        oJugadorService.updatePicture(id, image.getBytes());
    }

    @DeleteMapping("/{id:[0-9]+}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oJugadorService.delete(id));
    }

    @PostMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oJugadorService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oJugadorService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oJugadorService.count());
    }

    @GetMapping("/usuariosDisponibles")
    public ResponseEntity<Page<UsuarioEntity>> getUsuariosDisponibles(
            @PageableDefault(size = 1000) Pageable pageable,
            @RequestParam Long id_equipo,
            @RequestParam(required = false) String nombre) {
        return ResponseEntity.ok(oJugadorService.getUsuariosDisponibles(id_equipo, nombre, pageable));
    }

}
