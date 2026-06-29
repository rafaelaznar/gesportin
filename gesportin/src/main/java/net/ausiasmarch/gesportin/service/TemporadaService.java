package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.dto.TemporadaDTO;
import net.ausiasmarch.gesportin.entity.TemporadaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.TemporadaRepository;
import net.ausiasmarch.gesportin.dtoconverter.TemporadaConverter;

@Service
public class TemporadaService {

    @Autowired
    private TemporadaRepository oTemporadaRepository;

    @Autowired
    private ClubService oClubService;

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private TemporadaConverter oTemporadaConverter;

    @Autowired
    private AleatorioService oAleatorioService;

    public TemporadaDTO get(Long id) {
        TemporadaEntity e = oTemporadaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Temporada no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            oSessionService.checkSameClub(e.getClub().getId());
        }
        return oTemporadaConverter.toDTO(e);
    }

    public Page<TemporadaDTO> getPage(Pageable pageable, String descripcion, Long id_club) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (id_club != null && !id_club.equals(myClub)) {
                throw new UnauthorizedException("Acceso denegado: solo puede ver temporadas de su club");
            }
            // force filter by own club
            id_club = myClub;
        }
        Page<TemporadaEntity> result;
        if (descripcion != null && !descripcion.isEmpty()) {
            if (id_club != null) {
                result = oTemporadaRepository.findByDescripcionContainingIgnoreCaseAndClubId(descripcion, id_club, pageable);
            } else {
                result = oTemporadaRepository.findByDescripcionContainingIgnoreCase(descripcion, pageable);
            }
        } else if (id_club != null) {
            result = oTemporadaRepository.findByClubId(id_club, pageable);
        } else {
            result = oTemporadaRepository.findAll(pageable);
        }
        return oTemporadaConverter.toPageDTO(result);
    }

    public TemporadaDTO create(TemporadaEntity oTemporadaEntity) {
        // regular usuarios cannot create temporadas
        oSessionService.denyUsuario();
        if (oSessionService.isEquipoAdmin()) {
            oSessionService.checkSameClub(oTemporadaEntity.getClub().getId());
        }
        oTemporadaEntity.setId(null);
        oTemporadaEntity.setClub(oClubService.get(oTemporadaEntity.getClub().getId()));
        TemporadaEntity saved = oTemporadaRepository.save(oTemporadaEntity);
        return oTemporadaConverter.toDTO(saved);
    }

    public TemporadaDTO update(TemporadaEntity oTemporadaEntity) {
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
        TemporadaEntity saved = oTemporadaRepository.save(oTemporadaExistente);
        return oTemporadaConverter.toDTO(saved);
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
        String[] años = oAleatorioService.getAñosTemporada();
        String[] categorias = oAleatorioService.getCategoriasTemporada();
        String[] estaciones = oAleatorioService.getEstaciones();
        for (long i = 0; i < cantidad; i++) {
            TemporadaEntity oTemporada = new TemporadaEntity();
            String nombre = "Temporada " + categorias[(int) (Math.random() * categorias.length)] + " de " +
                    estaciones[(int) (Math.random() * estaciones.length)] + " en " +
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
