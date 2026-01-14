package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.TipousuarioEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.TipousuarioRepository;

@Service
public class TipousuarioService {
    
    @Autowired
    TipousuarioRepository tipousuarioRepository;

    private static final String[] TIPOS = {
        "Administrador", "Entrenador", "Jugador", "Aficionado", "Directivo"
    };

    public TipousuarioEntity get(Long id) {
        return tipousuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipousuario no encontrado con id: " + id));
    }

    public Page<TipousuarioEntity> getPage(Pageable pageable) {
        return tipousuarioRepository.findAll(pageable);
    }

    public TipousuarioEntity create(TipousuarioEntity tipousuario) {
        tipousuario.setId(null);
        return tipousuarioRepository.save(tipousuario);
    }

    public TipousuarioEntity update(TipousuarioEntity tipousuario) {
        TipousuarioEntity tipousuarioExistente = tipousuarioRepository.findById(tipousuario.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Tipousuario no encontrado con id: " + tipousuario.getId()));
        
        tipousuarioExistente.setDescripcion(tipousuario.getDescripcion());
        
        return tipousuarioRepository.save(tipousuarioExistente);
    }

    public Long delete(Long id) {
        TipousuarioEntity tipousuario = tipousuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipousuario no encontrado con id: " + id));
        tipousuarioRepository.delete(tipousuario);
        return id;
    }

    public Long empty() {
        tipousuarioRepository.deleteAll();
        tipousuarioRepository.flush();
        return 0L;
    }

    public Long count() {
        return tipousuarioRepository.count();
    }

    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            TipousuarioEntity tipousuario = new TipousuarioEntity();
            tipousuario.setDescripcion(TIPOS[i % TIPOS.length]);
            tipousuarioRepository.save(tipousuario);
        }
        return cantidad;
    }
}
