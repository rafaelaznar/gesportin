package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;

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
    private EstadopartidoService oEstadopartidoService;

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
        oPartidoExistente.setFecha(oPartidoEntity.getFecha());
        oPartidoExistente.setLugar(oPartidoEntity.getLugar());
        oPartidoExistente.setComentario(oPartidoEntity.getComentario());
        if (oPartidoEntity.getEstadopartido() != null && oPartidoEntity.getEstadopartido().getId() != null) {
            oPartidoExistente.setEstadopartido(oEstadopartidoService.get(oPartidoEntity.getEstadopartido().getId()));
        } else {
            oPartidoExistente.setEstadopartido(null);
        }
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
        // IDs en estadopartido: 1=No jugado, 2=Aplazado, 3=Ganado, 4=Perdido, 5=Empatado
        Long totalEstados = oEstadopartidoService.count();
        for (long j = 0; j < cantidad; j++) {
            PartidoEntity oPartido = new PartidoEntity();
            oPartido.setRival(oAleatorioService.generarNombreEquipoAleatorio());
            oPartido.setLiga(oLigaService.getOneRandom());
            oPartido.setLocal(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 1) == 1);
            oPartido.setLugar(oAleatorioService.generarNombreLugarAleatorio());

            // Fecha entre -180 días (pasado) y +90 días (futuro)
            int diasOffset = oAleatorioService.generarNumeroAleatorioEnteroEnRango(-180, 90);
            LocalDateTime fecha = LocalDateTime.now().plusDays(diasOffset);
            oPartido.setFecha(fecha);

            boolean esPasado = diasOffset <= 0;
            if (esPasado) {
                // Partido ya jugado: resultado con marcador y estado Ganado/Perdido/Empatado
                int golesLocal = oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 10);
                int golesVisitante = oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 10);
                oPartido.setResultado(golesLocal + "-" + golesVisitante);
                if (totalEstados >= 5) {
                    // 3=Ganado, 4=Perdido, 5=Empatado
                    long estadoId = (golesLocal > golesVisitante) ? 3L
                            : (golesLocal < golesVisitante) ? 4L : 5L;
                    oPartido.setEstadopartido(oEstadopartidoService.get(estadoId));
                } else if (totalEstados > 0) {
                    oPartido.setEstadopartido(oEstadopartidoService.getOneRandom());
                }
            } else {
                // Partido futuro: sin resultado, estado No jugado (1) o Aplazado (2)
                oPartido.setResultado("---");
                if (totalEstados >= 2) {
                    long estadoId = oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 4) == 0 ? 2L : 1L;
                    oPartido.setEstadopartido(oEstadopartidoService.get(estadoId));
                } else if (totalEstados > 0) {
                    oPartido.setEstadopartido(oEstadopartidoService.getOneRandom());
                }
            }

            oPartidoRepository.save(oPartido);
        }
        return cantidad;
    }
}
