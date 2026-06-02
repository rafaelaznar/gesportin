package net.ausiasmarch.gesportin.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.ausiasmarch.gesportin.dto.EstadopartidoDTO;
import net.ausiasmarch.gesportin.entity.EstadopartidoEntity;
import net.ausiasmarch.gesportin.service.EstadopartidoService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/estadopartido")
public class EstadopartidoApi {

    @Autowired
    private EstadopartidoService oEstadopartidoService;

    @GetMapping("/{id}")
    public ResponseEntity<EstadopartidoDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(oEstadopartidoService.get(id));
    }

    @GetMapping
    public ResponseEntity<List<EstadopartidoDTO>> getAll() {
        return ResponseEntity.ok(oEstadopartidoService.getAll());
    }

    @PostMapping
    public ResponseEntity<EstadopartidoDTO> create(@RequestBody EstadopartidoEntity oEstadopartidoEntity) {
        return ResponseEntity.ok(oEstadopartidoService.create(oEstadopartidoEntity));
    }

    @PutMapping
    public ResponseEntity<EstadopartidoDTO> update(@RequestBody EstadopartidoEntity oEstadopartidoEntity) {
        return ResponseEntity.ok(oEstadopartidoService.update(oEstadopartidoEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oEstadopartidoService.delete(id));
    }

    @GetMapping("/fill")
    public ResponseEntity<Long> fill() {
        return ResponseEntity.ok(oEstadopartidoService.fill());
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oEstadopartidoService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oEstadopartidoService.count());
    }
}
