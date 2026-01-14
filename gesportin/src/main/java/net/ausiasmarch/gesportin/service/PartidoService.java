package net.ausiasmarch.gesportin.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.PartidoEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.PartidoRepository;

@Service
public class PartidoService {

    @Autowired
    PartidoRepository oPartidoRepository;

    @Autowired
    AleatorioService oAleatorioService;

    private final List<String> alRivales = Arrays.asList(
            "Atlético", "Barcelona", "Real Madrid", "Sevilla", "Valencia", "Villarreal", "Betis",
            "Real Sociedad", "Granada", "Celta", "Getafe", "Espanyol", "Mallorca", "Osasuna", "Alavés");

    // -------------CRUD-----------------
    //GET:
    public PartidoEntity get(Long id) {
        return oPartidoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Partido not found"));
    }

    //GET PAGE:
    public Page<PartidoEntity> getPage(Pageable oPageable) {
        return oPartidoRepository.findAll(oPageable);
    }

    //CREATE:
    public PartidoEntity create(PartidoEntity partidoEntity) {
        partidoEntity.setId(null);
        return oPartidoRepository.save(partidoEntity);
    }

    //UPDATE:
    public PartidoEntity update(PartidoEntity partidoEntity) {
        PartidoEntity existingPartido = oPartidoRepository.findById(partidoEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        existingPartido.setRival(partidoEntity.getRival());
        existingPartido.setIdLiga(partidoEntity.getIdLiga());
        existingPartido.setLocal(partidoEntity.getLocal());
        existingPartido.setResultado(partidoEntity.getResultado());
        return oPartidoRepository.save(existingPartido);
    }

    //DELETE:
    public Long delete(Long id) {
        oPartidoRepository.deleteById(id);
        return id;
    }

    //FILL:
    public Long fill(Long numPosts) {

        for (long j = 0; j < numPosts; j++) {
            PartidoEntity oPartidoEntity = new PartidoEntity();
            String rival = alRivales.get(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, alRivales.size() - 1));
            oPartidoEntity.setRival(rival);
            oPartidoEntity.setIdLiga((long) oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            oPartidoEntity.setLocal(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, 1) == 1);
            int golesLocal = oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, 10);
            int golesVisitante = oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, 10);
            oPartidoEntity.setResultado(golesLocal + "-" + golesVisitante);
            oPartidoRepository.save(oPartidoEntity);
        }
        return numPosts;
    }

    //EMPTY (VACIAR TABLA):
    public Long empty() {
        oPartidoRepository.deleteAll();
        oPartidoRepository.flush();
        return 0L;
    }

    //COUNT:
    public Long count() {
        return oPartidoRepository.count();
    }

}
