package net.ausiasmarch.gesportin.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.EquipoEntity;
import net.ausiasmarch.gesportin.entity.JugadorEntity;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
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
        oJugadorExistente.setDorsal(oJugadorEntity.getDorsal());
        oJugadorExistente.setPosicion(oJugadorEntity.getPosicion());
        oJugadorExistente.setCapitan(oJugadorEntity.getCapitan());
        oJugadorExistente.setImagen(oJugadorEntity.getImagen());
        oJugadorExistente.setUsuario(oUsuarioService.get(oJugadorEntity.getUsuario().getId()));
        oJugadorExistente.setEquipo(oEquipoService.get(oJugadorEntity.getEquipo().getId()));
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
            if (myClub == null) return 0L;
            // approximate by counting equipos or users? simplest: count players whose equipo.club == myClub
            return oJugadorRepository.findByEquipoCategoriaTemporadaClubId(myClub, Pageable.ofSize(1)).getTotalElements();
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
            // ptes de asignar el usuario y el equipo
            UsuarioEntity oUsuarioEntity = oUsuarioService.getOneRandom();
            while (oEquipoService.getOneRandomFromClub(oUsuarioEntity.getClub().getId()) == null) {
                oUsuarioEntity = oUsuarioService.getOneRandom();
            }            
            oJugador.setUsuario(oUsuarioEntity);
            EquipoEntity equipo = oEquipoService.getOneRandomFromClub(oUsuarioEntity.getClub().getId());
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
}
