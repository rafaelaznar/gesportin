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
        return oPartidoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Partido no encontrado con id: " + id));
    }

    public Page<PartidoEntity> getPage(Pageable pageable) {
        return oPartidoRepository.findAll(pageable);
    }

    public PartidoEntity create(PartidoEntity partido) {
        partido.setId(null);
        return oPartidoRepository.save(partido);
    }

    public PartidoEntity update(PartidoEntity partido) {
        PartidoEntity existingPartido = oPartidoRepository.findById(partido.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Partido no encontrado con id: " + partido.getId()));
        existingPartido.setRival(partido.getRival());
        existingPartido.setLiga(oLigaService.getOneRandom());
        existingPartido.setLocal(partido.getLocal());
        existingPartido.setResultado(partido.getResultado());
        return oPartidoRepository.save(existingPartido);
    }

    public Long delete(Long id) {
        PartidoEntity partido = oPartidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partido no encontrado con id: " + id));
        oPartidoRepository.delete(partido);
        return id;
    }

    public Long empty() {
        oPartidoRepository.deleteAll();
        oPartidoRepository.flush();
        return 0L;
    }

    public Long count() {
        return oPartidoRepository.count();
    }

    public Long fill(Long cantidad) {
        for (long j = 0; j < cantidad; j++) {
            PartidoEntity partido = new PartidoEntity();
            String rival = alRivales.get(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, alRivales.size() - 1));
            partido.setRival(rival);
            partido.setLiga(oLigaService.getOneRandom());
            partido.setLocal(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 1) == 1);
            int golesLocal = oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 10);
            int golesVisitante = oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 10);
            partido.setResultado(golesLocal + "-" + golesVisitante);
            oPartidoRepository.save(partido);
        }
        return cantidad;
    }
}
