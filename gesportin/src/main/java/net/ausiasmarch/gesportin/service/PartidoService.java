package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.PartidoEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.PartidoRepository;

@Service
public class PartidoService {

    @Autowired
    private PartidoRepository oPartidoRepository;

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private LigaService oLigaService;

    @Autowired
    private SessionService oSessionService;

    public PartidoEntity get(Long id) {
        PartidoEntity e = oPartidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partido no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubId = e.getLiga().getEquipo().getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        return e;
    }

    public Page<PartidoEntity> getPage(Pageable pageable, Long id_liga) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (id_liga != null) {
                Long clubLiga = oLigaService.get(id_liga).getEquipo().getCategoria().getTemporada().getClub().getId();
                if (!myClub.equals(clubLiga)) {
                    throw new UnauthorizedException("Acceso denegado: solo partidos de su club");
                }
            } else {
                return oPartidoRepository.findByLigaEquipoCategoriaTemporadaClubId(myClub, pageable);
            }
        }
        if (id_liga != null) {
            return oPartidoRepository.findByLigaId(id_liga, pageable);
        } else {
            return oPartidoRepository.findAll(pageable);
        }
    }

    public PartidoEntity create(PartidoEntity oPartidoEntity) {
        // regular usuarios cannot create partidos
        oSessionService.denyUsuario();
        if (oSessionService.isEquipoAdmin()) {
            Long clubId = oLigaService.get(oPartidoEntity.getLiga().getId())
                    .getEquipo().getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        oPartidoEntity.setId(null);
        oPartidoEntity.setLiga(oLigaService.get(oPartidoEntity.getLiga().getId()));
        return oPartidoRepository.save(oPartidoEntity);
    }

    public PartidoEntity update(PartidoEntity oPartidoEntity) {
        // regular usuarios cannot modify partidos
        oSessionService.denyUsuario();
        PartidoEntity oPartidoExistente = oPartidoRepository.findById(oPartidoEntity.getId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Partido no encontrado con id: " + oPartidoEntity.getId()));
        if (oSessionService.isEquipoAdmin()) {
            Long clubOld = oPartidoExistente.getLiga().getEquipo().getCategoria().getTemporada().getClub().getId();
            Long clubNew = oLigaService.get(oPartidoEntity.getLiga().getId())
                    .getEquipo().getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubOld);
            oSessionService.checkSameClub(clubNew);
        }
        oPartidoExistente.setRival(oPartidoEntity.getRival());
        oPartidoExistente.setLiga(oLigaService.get(oPartidoEntity.getLiga().getId()));
        oPartidoExistente.setLocal(oPartidoEntity.getLocal());
        oPartidoExistente.setResultado(oPartidoEntity.getResultado());
        return oPartidoRepository.save(oPartidoExistente);
    }

    public Long delete(Long id) {
        // regular usuarios cannot delete partidos
        oSessionService.denyUsuario();
        PartidoEntity oPartido = oPartidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partido no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin()) {
            Long clubId = oPartido.getLiga().getEquipo().getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        oPartidoRepository.delete(oPartido);
        return id;
    }

    public Long count() {
        return oPartidoRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oPartidoRepository.deleteAll();
        oPartidoRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (long j = 0; j < cantidad; j++) {
            PartidoEntity oPartido = new PartidoEntity();            
            oPartido.setRival(oAleatorioService.generarNombreEquipoAleatorio());
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
