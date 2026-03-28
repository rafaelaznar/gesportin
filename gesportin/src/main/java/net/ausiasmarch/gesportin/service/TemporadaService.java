package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.TemporadaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.TemporadaRepository;

@Service
public class TemporadaService {

    @Autowired
    private TemporadaRepository oTemporadaRepository;

    @Autowired
    private ClubService oClubService;

    @Autowired
    private SessionService oSessionService;

    private final String[] años = {
            "2019/2020",
            "2020/2021",
            "2021/2022",
            "2022/2023",
            "2023/2024",
            "2024/2025",
    };

    private final String[] categorias = {
            "Infantil",
            "Junior",
            "Senior",
            "Femenino",
            "Masculino",
            "Unisex",
            "Escolar",
            "Competición",
            "Ocio"
    };

    private final String[] estacion = {
            "Primavera",
            "Otoño",
            "Verano",
            "Invierno",
            "Todo el año"
    };

    public TemporadaEntity get(Long id) {
        TemporadaEntity e = oTemporadaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Temporada no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            oSessionService.checkSameClub(e.getClub().getId());
        }
        return e;
    }

    public Page<TemporadaEntity> getPage(Pageable pageable, String descripcion, Long id_club) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (id_club != null && !id_club.equals(myClub)) {
                throw new UnauthorizedException("Acceso denegado: solo puede ver temporadas de su club");
            }
            // force filter by own club
            id_club = myClub;
        }
        if (descripcion != null && !descripcion.isEmpty()) {
            return oTemporadaRepository.findByDescripcionContainingIgnoreCase(descripcion, pageable);
        } else if (id_club != null) {
            return oTemporadaRepository.findByClubId(id_club, pageable);
        } else {
            return oTemporadaRepository.findAll(pageable);
        }
    }

    public TemporadaEntity create(TemporadaEntity oTemporadaEntity) {
        // regular usuarios cannot create temporadas
        oSessionService.denyUsuario();
        if (oSessionService.isEquipoAdmin()) {
            oSessionService.checkSameClub(oTemporadaEntity.getClub().getId());
        }
        oTemporadaEntity.setId(null);
        oTemporadaEntity.setClub(oClubService.get(oTemporadaEntity.getClub().getId()));
        return oTemporadaRepository.save(oTemporadaEntity);
    }

    public TemporadaEntity update(TemporadaEntity oTemporadaEntity) {
        // regular usuarios cannot modify temporadas
        oSessionService.denyUsuario();
        TemporadaEntity oTemporadaExistente = oTemporadaRepository.findById(oTemporadaEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Temporada no encontrado con id: " + oTemporadaEntity.getId()));
        if (oSessionService.isEquipoAdmin()) {
            // ensure existing and target club are both ours
            oSessionService.checkSameClub(oTemporadaExistente.getClub().getId());
            oSessionService.checkSameClub(oTemporadaEntity.getClub().getId());
        }
        oTemporadaExistente.setDescripcion(oTemporadaEntity.getDescripcion());
        oTemporadaExistente.setClub(oClubService.get(oTemporadaEntity.getClub().getId()));
        return oTemporadaRepository.save(oTemporadaExistente);
    }

    public Long delete(Long id) {
        // regular usuarios cannot delete temporadas
        oSessionService.denyUsuario();
        TemporadaEntity oTemporada = oTemporadaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Temporada no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin()) {
            oSessionService.checkSameClub(oTemporada.getClub().getId());
        }
        oTemporadaRepository.delete(oTemporada);
        return id;
    }

    public Long count() {
        return oTemporadaRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oTemporadaRepository.deleteAll();
        oTemporadaRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (long i = 0; i < cantidad; i++) {
            TemporadaEntity oTemporada = new TemporadaEntity();
            String nombre = "Temporada " + categorias[(int) (Math.random() * categorias.length)] + " de " +
                    estacion[(int) (Math.random() * estacion.length)] + " en " +
                    años[(int) (Math.random() * años.length)];
            oTemporada.setDescripcion(nombre);
            oTemporada.setClub(oClubService.getOneRandom());
            oTemporadaRepository.save(oTemporada);
        }
        return cantidad;
    }

    public TemporadaEntity getOneRandom() {
        Long count = oTemporadaRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oTemporadaRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }
}
