package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.validation.constraints.NotNull;
import net.ausiasmarch.gesportin.entity.PuntuacionEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.PuntuacionRepository;

@Service
public class PuntuacionService {

    @Autowired
    PuntuacionRepository oPuntuacionRepository;

    @Autowired
    AleatorioService oAleatorioService;

    // @Autowired
    // SessionService

    // constructor
    public PuntuacionService() {

    }

    // get page
    public Page<PuntuacionEntity> getPage(@NotNull Pageable oPageable) {
        return oPuntuacionRepository.findAll(oPageable);
    }

    // get by id
    public PuntuacionEntity get(@NotNull Long id) {
        return oPuntuacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The record not found in DB."));
    }

    // create
    public Long create(PuntuacionEntity oPuntuacionEntity) {
        oPuntuacionEntity.setId(null);
        oPuntuacionRepository.save(oPuntuacionEntity);
        return oPuntuacionEntity.getId();
    }
}
