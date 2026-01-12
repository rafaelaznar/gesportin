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

import net.ausiasmarch.gesportin.entity.CuotaEntity;
import net.ausiasmarch.gesportin.service.CuotaService;

@CrossOrigin(origins = "*", allowedHeaders = "*")    //ESTO ES PARA SOLUCIONAR EL CORS
@RestController
@RequestMapping("/cuota")
public class CuotaApi {
    
    @Autowired
    CuotaService oCuotaService;

    // obtener post por id
    @GetMapping("/{id}")
    public ResponseEntity<CuotaEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oCuotaService.get(id));
    }

    // crear posts
    @PostMapping("")
    public ResponseEntity<Long> create(@RequestBody CuotaEntity cuotaEntity) {
        return ResponseEntity.ok(oCuotaService.create(cuotaEntity));
    }

    // modificar posts
    @PutMapping("")
    public ResponseEntity<Long> update(@RequestBody CuotaEntity cuotaEntity) {
        return ResponseEntity.ok(oCuotaService.update(cuotaEntity));
    }

    // borrar posts
    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oCuotaService.delete(id));
    }

    // listado paginado de posts
    @GetMapping("")
    public ResponseEntity<Page<CuotaEntity>> getPage(Pageable oPageable) {
        return ResponseEntity.ok(oCuotaService.getPage(oPageable));
        
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oCuotaService.count()); 
    }

}
