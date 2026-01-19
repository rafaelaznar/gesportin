package net.ausiasmarch.gesportin.service;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.LigaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.LigaRepository;

@Service
public class LigaService {

    @Autowired
    private LigaRepository oLigaRepository;

    @Autowired
    private EquipoService oEquipoService;

    private final Random random = new Random();

    private final String[] nombres = {
        "Liga Primera División", "Liga Segunda División", "Liga Tercera División", "Liga Regional",
        "Liga Provincial", "Liga Infantil", "Liga Juvenil", "Liga Cadete", "Liga Alevín", "Liga Benjamín",
        "Liga Femenina", "Liga Masculina", "Liga Mixta", "Copa del Rey", "Copa de la Reina",
        "Supercopa", "Liga de Campeones", "Liga Europa", "Torneo de Primavera", "Torneo de Verano",
        "Torneo de Otoño", "Torneo de Invierno", "Liga Indoor", "Liga Outdoor", "Liga de Veteranos",
        "Liga Amateur", "Liga Profesional", "Liga Semi-profesional", "Liga Escolar", "Liga Universitaria",
        "Liga de Empresas", "Liga Comarcal", "Liga Autonómica", "Liga Nacional", "Liga Internacional",
        "Copa Federación", "Trofeo Local", "Campeonato Regional", "Campeonato Nacional", "Campeonato Internacional",
        "Liga de Leyendas", "Liga de Estrellas", "Liga de Promesas", "Liga de Talento", "Liga Elite",
        "Liga Premier", "Liga Master", "Liga Challenger", "Liga Open", "Liga Clasificatoria"
    };

    public LigaEntity get(Long id) {
        return oLigaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Liga no encontrado con id: " + id));
    }

    public Page<LigaEntity> getPage(Pageable pageable, String nombre) {
        if (nombre != null && !nombre.isEmpty()) {
            return oLigaRepository.findByNombreContainingIgnoreCase(nombre, pageable);
        } else {
            return oLigaRepository.findAll(pageable);
        }
    }

    public LigaEntity create(LigaEntity liga) {
        liga.setId(null);
        return oLigaRepository.save(liga);
    }

    public LigaEntity update(LigaEntity liga) {
        LigaEntity ligaExistente = oLigaRepository.findById(liga.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Liga no encontrado con id: " + liga.getId()));

        ligaExistente.setNombre(liga.getNombre());
        // ligaExistente.setIdEquipo(liga.getIdEquipo());

        return oLigaRepository.save(ligaExistente);
    }

    public Long delete(Long id) {
        LigaEntity liga = oLigaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Liga no encontrado con id: " + id));
        oLigaRepository.delete(liga);
        return id;
    }

    public Long empty() {
        oLigaRepository.deleteAll();
        oLigaRepository.flush();
        return 0L;
    }

    public Long count() {
        return oLigaRepository.count();
    }

    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            LigaEntity liga = new LigaEntity();
            liga.setNombre(nombres[i % nombres.length] + " " + (i + 1));
            liga.setEquipo(oEquipoService.getOneRandom());
            oLigaRepository.save(liga);
        }
        return cantidad;
    }

    public LigaEntity getOneRandom() {
        Long count = oLigaRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oLigaRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }
}
