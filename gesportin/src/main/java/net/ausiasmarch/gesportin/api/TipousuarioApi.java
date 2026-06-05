package net.ausiasmarch.gesportin.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.ausiasmarch.gesportin.dto.TipousuarioDTO;
import net.ausiasmarch.gesportin.entity.TipousuarioEntity;
import net.ausiasmarch.gesportin.service.TipousuarioService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/tipousuario")
public class TipousuarioApi {

    @Autowired
    private TipousuarioService oTipousuarioService;

    @GetMapping("/{id}")
    public ResponseEntity<TipousuarioDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(oTipousuarioService.get(id));
    }

    @GetMapping
    public ResponseEntity<List<TipousuarioEntity>> getAll() {
        return ResponseEntity.ok(oTipousuarioService.getAll());
    }


    @GetMapping("/fill")
    public ResponseEntity<Long> fill() {
        return ResponseEntity.ok(oTipousuarioService.fill());
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oTipousuarioService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oTipousuarioService.count());
    }
}

