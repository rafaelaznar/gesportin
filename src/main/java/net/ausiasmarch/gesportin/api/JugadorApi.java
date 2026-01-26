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

import net.ausiasmarch.gesportin.entity.JugadorEntity;
import net.ausiasmarch.gesportin.service.JugadorService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/jugador")
public class JugadorApi {

    @Autowired
    private JugadorService oJugadorService;

    @GetMapping("/{id}")
    public ResponseEntity<JugadorEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oJugadorService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<JugadorEntity>> getPage(
            @PageableDefault(size = 1000) Pageable pageable,
            @RequestParam(required = false) String posicion,
            @RequestParam(required = false) Long idUsuario,
            @RequestParam(required = false) Long idEquipo) {
        return ResponseEntity.ok(oJugadorService.getPage(pageable, posicion, idUsuario, idEquipo));
    }

    @PostMapping
    public ResponseEntity<JugadorEntity> create(@RequestBody JugadorEntity jugadorEntity) {
        return ResponseEntity.ok(oJugadorService.create(jugadorEntity));
    }

    @PutMapping
    public ResponseEntity<JugadorEntity> update(@RequestBody JugadorEntity jugadorEntity) {
        return ResponseEntity.ok(oJugadorService.update(jugadorEntity));
    }

    @DeleteMapping("/{id}")
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

}
