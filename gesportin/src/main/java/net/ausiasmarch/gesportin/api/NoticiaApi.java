package net.ausiasmarch.gesportin.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

import net.ausiasmarch.gesportin.entity.NoticiaEntity;
import net.ausiasmarch.gesportin.service.AleatorioService;
import net.ausiasmarch.gesportin.service.NoticiaService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/Noticia")
public class NoticiaApi {

    @Autowired
    AleatorioService oAleatorioService;

    @Autowired
    NoticiaService oNoticiaService;

    @GetMapping("/aleatorio") // endpoint
    public ResponseEntity<Integer> aleatorio() {
        int numeroAleatorio = (int) (Math.random() * 100) + 1;
        return ResponseEntity.ok(numeroAleatorio);
    }

    @GetMapping("/aleatorio/{min}/{max}") // endpoint
    public ResponseEntity<Integer> aleatorioEnRango(
            @PathVariable int min,
            @PathVariable int max) {
        int numeroAleatorio = (int) (Math.random() * (max - min + 1)) + min;
        return ResponseEntity.ok(numeroAleatorio);
    }

    @GetMapping("/aleatorio/service/{min}/{max}") // endpoint
    public ResponseEntity<Integer> aleatorioUsandoServiceEnRango(
            @PathVariable int min,
            @PathVariable int max) {
        return ResponseEntity.ok(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(min, max));
    }

    // ---------------------------Rellenar datos fake
    // Noticia---------------------------------

    @GetMapping("/rellena/{numPosts}")
    public ResponseEntity<Long> rellenaNoticia(
            @PathVariable Long numPosts) {
        return ResponseEntity.ok(oNoticiaService.rellenaNoticia(numPosts));
    }

    // ----------------------------CRUD---------------------------------

    // obtener post por id
    @GetMapping("/{id}")
    public ResponseEntity<NoticiaEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oNoticiaService.get(id));
    }

    // crear posts
    @PostMapping("")
    public ResponseEntity<Long> create(@RequestBody NoticiaEntity NoticiaEntity) {
        return ResponseEntity.ok(oNoticiaService.create(NoticiaEntity));
    }

    // modificar posts
    @PutMapping("")
    public ResponseEntity<Long> update(@RequestBody NoticiaEntity NoticiaEntity) {
        return ResponseEntity.ok(oNoticiaService.update(NoticiaEntity));
    }

    // borrar posts
    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oNoticiaService.delete(id));
    }
 
    // vaciar tabla Noticia (solo administradores)
    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oNoticiaService.empty());
    }

    // listado paginado de posts
    @GetMapping("")
    public ResponseEntity<Page<NoticiaEntity>> getPage(Pageable oPageable) {
        return ResponseEntity.ok(oNoticiaService.getPage(oPageable));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oNoticiaService.count());
    }

}
