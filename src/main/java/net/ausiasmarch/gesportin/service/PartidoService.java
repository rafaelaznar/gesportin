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
    private PartidoRepository oPartidoRepository;

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private LigaService oLigaService;

    private final List<String> alRivales = Arrays.asList(
            "Atlético", "Barcelona", "Real Madrid", "Sevilla", "Valencia", "Villarreal", "Betis",
            "Real Sociedad", "Granada", "Celta", "Getafe", "Espanyol", "Mallorca", "Osasuna", "Alavés");

    public PartidoEntity get(Long id) {
        return oPartidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partido no encontrado con id: " + id));
    }

    public Page<PartidoEntity> getPage(Pageable pageable, Long id_liga) {
        if (id_liga != null) {
            return oPartidoRepository.findByLigaId(id_liga, pageable);
        } else {
            return oPartidoRepository.findAll(pageable);
        }
    }

    public PartidoEntity create(PartidoEntity oPartidoEntity) {
        oPartidoEntity.setId(null);
        oPartidoEntity.setLiga(oLigaService.get(oPartidoEntity.getLiga().getId()));
        return oPartidoRepository.save(oPartidoEntity);
    }

    public PartidoEntity update(PartidoEntity oPartidoEntity) {
        PartidoEntity oPartidoExistente = oPartidoRepository.findById(oPartidoEntity.getId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Partido no encontrado con id: " + oPartidoEntity.getId()));
        oPartidoExistente.setRival(oPartidoEntity.getRival());
        oPartidoExistente.setLiga(oLigaService.get(oPartidoEntity.getLiga().getId()));
        oPartidoExistente.setLocal(oPartidoEntity.getLocal());
        oPartidoExistente.setResultado(oPartidoEntity.getResultado());
        return oPartidoRepository.save(oPartidoExistente);
    }

    public Long delete(Long id) {
        PartidoEntity oPartido = oPartidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partido no encontrado con id: " + id));
        oPartidoRepository.delete(oPartido);
        return id;
    }

    public Long count() {
        return oPartidoRepository.count();
    }

    public Long empty() {
        oPartidoRepository.deleteAll();
        oPartidoRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        for (long j = 0; j < cantidad; j++) {
            PartidoEntity oPartido = new PartidoEntity();
            String rival = alRivales
                    .get(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, alRivales.size() - 1));
            oPartido.setRival(rival);
            oPartido.setLiga(oLigaService.getOneRandom());
            oPartido.setLocal(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 1) == 1);
            int golesLocal = oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 10);
            int golesVisitante = oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 10);
            oPartido.setResultado(golesLocal + "-" + golesVisitante);
            oPartidoRepository.save(oPartido);
        }
        return cantidad;
    }
}
