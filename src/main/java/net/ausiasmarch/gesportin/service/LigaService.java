package net.ausiasmarch.gesportin.service;

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

    public Page<LigaEntity> getPage(Pageable pageable, String nombre, Long id_equipo) {
        if (nombre != null && !nombre.isEmpty()) {
            return oLigaRepository.findByNombreContainingIgnoreCase(nombre, pageable);
        } else if (id_equipo != null) {
            return oLigaRepository.findByIdEquipo(id_equipo, pageable);
        } else {
            return oLigaRepository.findAll(pageable);
        }
    }

    public LigaEntity create(LigaEntity oLigaEntity) {
        oLigaEntity.setId(null);
        return oLigaRepository.save(oLigaEntity);
    }

    public LigaEntity update(LigaEntity oLigaEntity) {
        LigaEntity oLigaExistente = oLigaRepository.findById(oLigaEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Liga no encontrado con id: " + oLigaEntity.getId()));

        oLigaExistente.setNombre(oLigaEntity.getNombre());
        // oLigaExistente.setIdEquipo(oLigaEntity.getIdEquipo());

        return oLigaRepository.save(oLigaExistente);
    }

    public Long delete(Long id) {
        LigaEntity oLiga = oLigaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Liga no encontrado con id: " + id));
        oLigaRepository.delete(oLiga);
        return id;
    }

    public Long count() {
        return oLigaRepository.count();
    }

    public Long empty() {
        oLigaRepository.deleteAll();
        oLigaRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            LigaEntity oLiga = new LigaEntity();
            oLiga.setNombre(nombres[i % nombres.length] + " " + (i + 1));
            oLiga.setEquipo(oEquipoService.getOneRandom());
            oLigaRepository.save(oLiga);
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
