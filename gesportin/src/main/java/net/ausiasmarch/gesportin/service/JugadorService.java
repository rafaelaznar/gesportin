package net.ausiasmarch.gesportin.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.JugadorEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.JugadorRepository;

@Service
public class JugadorService {

    @Autowired
    JugadorRepository oJugadorRepository;

    @Autowired
    AleatorioService oAleatorioService;

    // @Autowired
    // SessionService oSessionService;

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
    }

    public Long fill(Long numPosts) {
        // if (!oSessionService.isSessionActive()) {
        //     throw new UnauthorizedException("Sesión no activa");
        // }

        for (long j = 0; j < numPosts; j++) {

            // Crea una entidad y la rellana con datos aleatorios
            JugadorEntity oJugadorEntity = new JugadorEntity();

            oJugadorEntity.setDorsal(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 99));

            oJugadorEntity.setPosicion(
                    posiciones.get(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, posiciones.size() - 1)));
            
            oJugadorEntity.setCapitan(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, 1) == 1);

            oJugadorEntity.setImagen(null);

            oJugadorEntity.setIdUsuario(Long.valueOf(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50)));
            
            oJugadorEntity.setIdEquipo(Long.valueOf(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50)));
            
            // Guardar la entidad en la base de datos
            oJugadorRepository.save(oJugadorEntity);
        }
        return numPosts;
    }

    // -------------------------------------------------- CRUD --------------------------------------------------

    public JugadorEntity get(Long id) {
        // if (!oSessionService.isSessionActive()) {
        //     throw new UnauthorizedException("Sesión no activa");
        // }

        return oJugadorRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado"));
    }

    public JugadorEntity create(JugadorEntity jugadorEntity) {
        // if (!oSessionService.isSessionActive()) {
        //     throw new UnauthorizedException("Sesión no activa");
        // }
        jugadorEntity.setId(null);
        return oJugadorRepository.save(jugadorEntity);
    }

    public JugadorEntity update(JugadorEntity JugadorEntity) {
        // if (!oSessionService.isSessionActive()) {
        //     throw new UnauthorizedException("Sesión no activa");
        // }

        JugadorEntity oExistingJugador = oJugadorRepository.findById(JugadorEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado"));
        oExistingJugador.setDorsal(JugadorEntity.getDorsal());
        oExistingJugador.setPosicion(JugadorEntity.getPosicion());
        oExistingJugador.setCapitan(JugadorEntity.getCapitan());
        oExistingJugador.setImagen(JugadorEntity.getImagen());
        oExistingJugador.setIdUsuario(JugadorEntity.getIdUsuario());
        oExistingJugador.setIdEquipo(JugadorEntity.getIdEquipo());
        return oJugadorRepository.save(oExistingJugador);
    }

    public Long delete(Long id) {
        // if (!oSessionService.isSessionActive()) {
        //     throw new UnauthorizedException("Sesión no activa");
        // }

        oJugadorRepository.deleteById(id);
        return id;
    }

    public Page<JugadorEntity> getPage(Pageable oPageable) {
        // if (!oSessionService.isSessionActive()) {
        //     throw new UnauthorizedException("Sesión no activa");
        // } else {
        //     return oJugadorRepository.findAll(oPageable);
        // }
        return oJugadorRepository.findAll(oPageable);
    }


    public Long count() {
        return oJugadorRepository.count();
    }

    // Vaciar la tabla (solo para administradores)
    public Long empty() {
        // if (!oSessionService.isSessionActive()) {
        //     throw new UnauthorizedException("Sesión no activa");
        // }

        oJugadorRepository.deleteAll();
        oJugadorRepository.flush();
        return 0L;
    }
}
