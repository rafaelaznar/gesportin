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
    // SessionService oSessionService;

    // get quantity of records in the DB
    public Long count() {
        return oPuntuacionRepository.count();
    }

    // get page
    public Page<PuntuacionEntity> getPage(@NotNull Pageable oPageable) {
        return oPuntuacionRepository.findAll(oPageable);
    }

    // get record by id
    public PuntuacionEntity get(@NotNull Long id) {
        return oPuntuacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The record not found in the database."));
    }

    // create a new record
    public PuntuacionEntity create(PuntuacionEntity oPuntuacionEntity) {
        oPuntuacionEntity.setId(null);
        return oPuntuacionRepository.save(oPuntuacionEntity);
    }

    // update the record
    public PuntuacionEntity update(PuntuacionEntity oPuntuacionEntity) {
        PuntuacionEntity existingRecord = oPuntuacionRepository.findById(oPuntuacionEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("The record not found."));

        existingRecord.setPuntuacion(oPuntuacionEntity.getPuntuacion());
        existingRecord.setIdNoticia(oPuntuacionEntity.getIdNoticia());
        existingRecord.setIdUsuario(oPuntuacionEntity.getIdUsuario());

        return oPuntuacionRepository.save(existingRecord);
    }

    // delete the record by id
    public Long delete(@NotNull Long id) {
        oPuntuacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The record not found."));

        oPuntuacionRepository.deleteById(id);

        return id;
    }

    // delete all records
    public Long empty() {
        oPuntuacionRepository.deleteAll();
        oPuntuacionRepository.flush();
        return 0L;
    }

    // fill database with fake data
    public Long fill(Long quantity) {

        for (int i = 0; i < quantity; i++) {
            PuntuacionEntity newEntity = new PuntuacionEntity();

            newEntity.setPuntuacion(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 5));
            newEntity.setIdNoticia(Long.valueOf(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50)));
            newEntity.setIdUsuario(Long.valueOf(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50)));

            oPuntuacionRepository.save(newEntity);
        }

        return quantity;
    }

}
