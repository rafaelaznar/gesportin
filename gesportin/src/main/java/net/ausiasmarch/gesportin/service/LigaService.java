package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.dto.LigaDTO;
import net.ausiasmarch.gesportin.entity.LigaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.LigaRepository;
import net.ausiasmarch.gesportin.dtoconverter.LigaConverter;

@Service
public class LigaService {

    @Autowired
    private LigaRepository oLigaRepository;

    @Autowired
    private EquipoService oEquipoService;

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private LigaConverter oLigaConverter;

    private final String[] nombres = {
            "Liga", "Copa", "Supercopa", "Liga de Campeones", "Liga Europa", "Torneo",
            "Trofeo", "Campeonato", "Playoff", "Liguilla Clasificatoria", "Liguilla Eliminatoria"
    };

    private final String[] nombres2 = {
        "Primera División", "Segunda División", "Tercera División", "División de Honor",
        "División de Plata", "División de Bronce", "Nacional", "Regional", "Provincial", "Local",
        "Amateur", "de Campeones", "Outdoor", "Indoor", "de Verano", "de Invierno", 
        "Internacional", "de Clubes", "de Selecciones", "de ascenso", "de descenso", "de élite",
        "de Honor", "de Plata", "de Bronce"
    };



    public LigaDTO get(Long id) {
        LigaEntity e = oLigaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Liga no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubId = e.getEquipo().getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        return oLigaConverter.toDTO(e);
    }

    public Page<LigaDTO> getPage(Pageable pageable, String nombre, Long id_equipo) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (id_equipo != null) {
                Long clubEquipo = oEquipoService.get(id_equipo).getCategoria().getTemporada().getClub().getId();
                if (!myClub.equals(clubEquipo)) {
                    throw new UnauthorizedException("Acceso denegado: solo ligas de su club");
                }
            }
            if ((nombre == null || nombre.isEmpty()) && id_equipo == null) {
                // restrict everything to club by using repository method
                return oLigaConverter.toPageDTO(oLigaRepository.findByEquipoCategoriaTemporadaClubId(myClub, pageable));
            }
        }
        Page<LigaEntity> result;
        if (nombre != null && !nombre.isEmpty()) {
            result = oLigaRepository.findByNombreContainingIgnoreCase(nombre, pageable);
        } else if (id_equipo != null) {
            result = oLigaRepository.findByEquipoId(id_equipo, pageable);
        } else {
            result = oLigaRepository.findAll(pageable);
        }
        return oLigaConverter.toPageDTO(result);
    }

    public LigaDTO create(LigaEntity oLigaEntity) {
        // regular usuarios cannot create ligas
        oSessionService.denyUsuario();
        if (oSessionService.isEquipoAdmin()) {
            Long clubId = oEquipoService.get(oLigaEntity.getEquipo().getId()).getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        oLigaEntity.setId(null);
        LigaEntity saved = oLigaRepository.save(oLigaEntity);
        return oLigaConverter.toDTO(saved);
    }

    public LigaDTO update(LigaEntity oLigaEntity) {
        // regular usuarios cannot modify ligas
        oSessionService.denyUsuario();
        LigaEntity oLigaExistente = oLigaRepository.findById(oLigaEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Liga no encontrado con id: " + oLigaEntity.getId()));
        if (oSessionService.isEquipoAdmin()) {
            Long clubOld = oLigaExistente.getEquipo().getCategoria().getTemporada().getClub().getId();
            Long clubNew = oEquipoService.get(oLigaEntity.getEquipo().getId()).getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubOld);
            oSessionService.checkSameClub(clubNew);
        }
        oLigaExistente.setNombre(oLigaEntity.getNombre());
        // oLigaExistente.setIdEquipo(oLigaEntity.getIdEquipo());

        LigaEntity saved = oLigaRepository.save(oLigaExistente);
        return oLigaConverter.toDTO(saved);
    }

    public Long delete(Long id) {
        // regular usuarios cannot delete ligas
        oSessionService.denyUsuario();
        LigaEntity oLiga = oLigaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Liga no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin()) {
            Long clubId = oLiga.getEquipo().getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        oLigaRepository.delete(oLiga);
        return id;
    }

    public Long count() {
        return oLigaRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oLigaRepository.deleteAll();
        oLigaRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (int i = 0; i < cantidad; i++) {
            LigaEntity oLiga = new LigaEntity();
            String nombre = nombres[(int) (Math.random() * nombres.length)] + " " +
                    nombres2[(int) (Math.random() * nombres2.length)];
            oLiga.setNombre(nombre);
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
