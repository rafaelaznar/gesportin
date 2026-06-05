package net.ausiasmarch.gesportin.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.dto.TipousuarioDTO;
import net.ausiasmarch.gesportin.entity.TipousuarioEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.TipousuarioRepository;
import net.ausiasmarch.gesportin.dtoconverter.TipousuarioConverter;

@Service
public class TipousuarioService {

    @Autowired
    TipousuarioRepository tipousuarioRepository;

    @Autowired
    SessionService oSessionService;

    @Autowired
    TipousuarioConverter oTipousuarioConverter;

    public TipousuarioDTO get(Long id) {
        TipousuarioEntity entity = tipousuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipousuario no encontrado con id: " + id));
        return oTipousuarioConverter.toDTO(entity);
    }

    public List<TipousuarioEntity> getAll() {
        return tipousuarioRepository.findAll();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        tipousuarioRepository.deleteAll();
        tipousuarioRepository.flush();
        return 0L;
    }

    public Long count() {
        return tipousuarioRepository.count();
    }

    public Long fill() {
        oSessionService.requireAdmin();
        // Los tipos de usuario son datos del sistema gestionados por reset()/seed().
        // Este método no crea registros adicionales.
        return this.count();
    }

    public TipousuarioEntity getOneRandom() {
        Long count = tipousuarioRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return tipousuarioRepository.findAll(org.springframework.data.domain.Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }

}
