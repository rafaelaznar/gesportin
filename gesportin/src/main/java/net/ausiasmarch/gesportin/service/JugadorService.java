package net.ausiasmarch.gesportin.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.EquipoEntity;
import net.ausiasmarch.gesportin.entity.JugadorEntity;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.GeneralException;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.JugadorRepository;

@Service
public class JugadorService {

    @Autowired
    private JugadorRepository oJugadorRepository;

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private UsuarioService oUsuarioService;

    @Autowired
    private EquipoService oEquipoService;

    @Autowired
    private SessionService oSessionService;

    ArrayList<String> posiciones = new ArrayList<>();

    public JugadorService() {
        posiciones.add("Portero");
        posiciones.add("Defensa central");
        posiciones.add("Lateral derecho");
        posiciones.add("Lateral izquierdo");
        posiciones.add("Centrocampista defensivo");
        posiciones.add("Centrocampista");
        posiciones.add("Centrocampista ofensivo");
        posiciones.add("Extremo derecho");
        posiciones.add("Extremo izquierdo");
        posiciones.add("Delantero centro");
        posiciones.add("Zaguero");
        posiciones.add("Medio melé");
        posiciones.add("Ala");
        posiciones.add("Pívot");
        posiciones.add("Ala-pívot");
        posiciones.add("Escolta");
        posiciones.add("Base");
        posiciones.add("Ala cerrado");
        posiciones.add("Ala abierto");
        posiciones.add("Líbero");
        posiciones.add("Central");
        posiciones.add("Apertura");
        posiciones.add("Medio");
        posiciones.add("Punta");
    }

    public JugadorEntity get(Long id) {
        JugadorEntity e = oJugadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubUsuario = e.getUsuario().getClub().getId();
            Long clubEquipo = e.getEquipo().getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubUsuario);
            oSessionService.checkSameClub(clubEquipo);
        }
        return e;
    }

    public Page<JugadorEntity> getPage(
            Pageable pageable,
            String posicion,
            Long idUsuario,
            Long idEquipo) {

        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (idUsuario != null) {
                Long clubUsr = oUsuarioService.get(idUsuario).getClub().getId();
                if (!myClub.equals(clubUsr)) {
                    throw new UnauthorizedException("Acceso denegado: solo jugadores de su club");
                }
            }
            if (idEquipo != null) {
                Long clubEq = oEquipoService.get(idEquipo).getCategoria().getTemporada().getClub().getId();
                if (!myClub.equals(clubEq)) {
                    throw new UnauthorizedException("Acceso denegado: solo jugadores de su club");
                }
            }
            if ((posicion == null || posicion.isEmpty()) && idUsuario == null && idEquipo == null) {
                return oJugadorRepository.findByEquipoCategoriaTemporadaClubId(myClub, pageable);
            }
        }

        if (posicion != null && !posicion.isEmpty()) {
            return oJugadorRepository.findByPosicionContainingIgnoreCase(posicion, pageable);
        } else if (idUsuario != null) {
            return oJugadorRepository.findByUsuarioId(idUsuario, pageable);
        } else if (idEquipo != null) {
            return oJugadorRepository.findByEquipoId(idEquipo, pageable);
        } else {
            return oJugadorRepository.findAll(pageable);
        }
    }

    public JugadorEntity create(JugadorEntity oJugadorEntity) {
        oSessionService.denyUsuario();
        if (oSessionService.isEquipoAdmin()) {
            Long clubUsr = oUsuarioService.get(oJugadorEntity.getUsuario().getId()).getClub().getId();
            Long clubEq = oEquipoService.get(oJugadorEntity.getEquipo().getId())
                    .getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubUsr);
            oSessionService.checkSameClub(clubEq);
        }
        oJugadorEntity.setId(null);
        oJugadorEntity.setEquipo(oEquipoService.get(oJugadorEntity.getEquipo().getId()));
        oJugadorEntity.setUsuario(oUsuarioService.get(oJugadorEntity.getUsuario().getId()));

        if (oJugadorRepository.existsByEquipoIdAndUsuarioId(
                oJugadorEntity.getEquipo().getId(), oJugadorEntity.getUsuario().getId())) {
            throw new GeneralException("El usuario ya está asignado como jugador en este equipo");
        }

        return oJugadorRepository.save(oJugadorEntity);
    }

    public JugadorEntity update(JugadorEntity oJugadorEntity) {
        oSessionService.denyUsuario();
        JugadorEntity oJugadorExistente = oJugadorRepository.findById(oJugadorEntity.getId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Jugador no encontrado con id: " + oJugadorEntity.getId()));
        if (oSessionService.isEquipoAdmin()) {
            Long clubOldUsr = oJugadorExistente.getUsuario().getClub().getId();
            Long clubOldEq = oJugadorExistente.getEquipo().getCategoria().getTemporada().getClub().getId();
            Long clubNewUsr = oUsuarioService.get(oJugadorEntity.getUsuario().getId()).getClub().getId();
            Long clubNewEq = oEquipoService.get(oJugadorEntity.getEquipo().getId())
                    .getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubOldUsr);
            oSessionService.checkSameClub(clubOldEq);
            oSessionService.checkSameClub(clubNewUsr);
            oSessionService.checkSameClub(clubNewEq);
        }
        UsuarioEntity nuevoUsuario = oUsuarioService.get(oJugadorEntity.getUsuario().getId());
        EquipoEntity nuevoEquipo = oEquipoService.get(oJugadorEntity.getEquipo().getId());

        if (oJugadorRepository.existsByEquipoIdAndUsuarioIdAndIdNot(
                nuevoEquipo.getId(), nuevoUsuario.getId(), oJugadorEntity.getId())) {
            throw new GeneralException("El usuario ya está asignado como jugador en este equipo");
        }

        oJugadorExistente.setDorsal(oJugadorEntity.getDorsal());
        oJugadorExistente.setPosicion(oJugadorEntity.getPosicion());
        oJugadorExistente.setCapitan(oJugadorEntity.getCapitan());
        oJugadorExistente.setImagen(oJugadorEntity.getImagen());
        oJugadorExistente.setUsuario(nuevoUsuario);
        oJugadorExistente.setEquipo(nuevoEquipo);
        return oJugadorRepository.save(oJugadorExistente);
    }

    public Long delete(Long id) {
        oSessionService.denyUsuario();
        JugadorEntity oJugador = oJugadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin()) {
            Long clubUsr = oJugador.getUsuario().getClub().getId();
            Long clubEq = oJugador.getEquipo().getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubUsr);
            oSessionService.checkSameClub(clubEq);
        }
        oJugadorRepository.delete(oJugador);
        return id;
    }

    public Long count() {
        if (oSessionService.isEquipoAdmin()) {
            Long myClub = oSessionService.getIdClub();
            if (myClub == null)
                return 0L;
            // approximate by counting equipos or users? simplest: count players whose
            // equipo.club == myClub
            return oJugadorRepository.findByEquipoCategoriaTemporadaClubId(myClub, Pageable.ofSize(1))
                    .getTotalElements();
        }
        return oJugadorRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oJugadorRepository.deleteAll();
        oJugadorRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (long j = 0; j < cantidad; j++) {
            JugadorEntity oJugador = new JugadorEntity();
            oJugador.setDorsal(oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 99));
            oJugador.setPosicion(
                    posiciones.get(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, posiciones.size() - 1)));
            oJugador.setCapitan(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 1) == 1);
            oJugador.setImagen(null);
            // El jugador (tipousuario=3) y el equipo deben pertenecer al mismo club
            EquipoEntity equipo = oEquipoService.getOneRandom();
            if (equipo == null) continue;
            Long clubId = equipo.getCategoria().getTemporada().getClub().getId();
            UsuarioEntity oUsuarioEntity = oUsuarioService.getOneRandomFromClubAndTipousuario(clubId, 3L);
            int intentos = 0;
            while (oUsuarioEntity == null ||
                    oJugadorRepository.existsByEquipoIdAndUsuarioId(equipo.getId(), oUsuarioEntity.getId())) {
                oUsuarioEntity = oUsuarioService.getOneRandomFromClubAndTipousuario(clubId, 3L);
                if (++intentos >= 100) break;
            }
            if (oUsuarioEntity == null ||
                    oJugadorRepository.existsByEquipoIdAndUsuarioId(equipo.getId(), oUsuarioEntity.getId())) {
                continue;
            }
            oJugador.setUsuario(oUsuarioEntity);
            oJugador.setEquipo(equipo);
            oJugadorRepository.save(oJugador);
        }
        return cantidad;
    }

    public JugadorEntity getOneRandom() {
        Long count = oJugadorRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oJugadorRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }

    public JugadorEntity getOneRandomFromEquipo(Long equipoId) {
        long count = oJugadorRepository.findByEquipoId(equipoId, Pageable.ofSize(1)).getTotalElements();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        var page = oJugadorRepository.findByEquipoId(equipoId, Pageable.ofSize(1).withPage(index));
        return page.hasContent() ? page.getContent().get(0) : null;
    }

    public Page<UsuarioEntity> getUsuariosDisponibles(Long idEquipo, String nombre, Pageable pageable) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubEquipo = oEquipoService.get(idEquipo).getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubEquipo);
        }
        String nombreFiltro = (nombre != null && !nombre.isBlank()) ? nombre : null;
        return oJugadorRepository.findUsuariosDisponiblesParaEquipo(idEquipo, nombreFiltro, nombreFiltro, nombreFiltro,
                pageable);
    }
}
