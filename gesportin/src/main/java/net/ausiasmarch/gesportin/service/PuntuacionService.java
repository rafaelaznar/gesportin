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
    public Long create(PuntuacionEntity oPuntuacionEntity) {
        oPuntuacionEntity.setId(null);
        oPuntuacionRepository.save(oPuntuacionEntity);
        return oPuntuacionEntity.getId();
    }

    // update the record
    public Long update(PuntuacionEntity oPuntuacionEntity) {
        PuntuacionEntity existingRecord = oPuntuacionRepository.findById(oPuntuacionEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("The record not found."));

        existingRecord.setPuntuacion(oPuntuacionEntity.getPuntuacion());
        existingRecord.setIdArticulo(oPuntuacionEntity.getIdArticulo());
        existingRecord.setIdUsuario(oPuntuacionEntity.getIdUsuario());

        oPuntuacionRepository.save(existingRecord);

        return existingRecord.getId();
    }

    // delete the record by id
    public Long delete(@NotNull Long id) {
        oPuntuacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The record not found."));

        oPuntuacionRepository.deleteById(id);

        return id;
    }

    // delete all records
    public Long deleteAll() {
        Long total = oPuntuacionRepository.count();
        oPuntuacionRepository.deleteAll();

        return total;
    }

    // fill database with fake data
    public Long fillDatabase(int quantity) {

        for (int i = 0; i < quantity; i++) {
            PuntuacionEntity newEntity = new PuntuacionEntity();

            newEntity.setPuntuacion(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 5));
            newEntity.setIdArticulo(Long.valueOf(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50)));
            newEntity.setIdUsuario(Long.valueOf(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50)));

            oPuntuacionRepository.save(newEntity);
        }

        return oPuntuacionRepository.count();
    }

}
