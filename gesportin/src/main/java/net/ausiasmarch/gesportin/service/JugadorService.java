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
    private JugadorRepository oJugadorRepository;

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private UsuarioService oUsuarioService;

    @Autowired
    private EquipoService oEquipoService;

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

    public JugadorEntity get(Long id) {
        return oJugadorRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado con id: " + id));
    }

    public Page<JugadorEntity> getPage(Pageable pageable) {
        return oJugadorRepository.findAll(pageable);
    }

    public JugadorEntity create(JugadorEntity jugador) {
        jugador.setId(null);
        return oJugadorRepository.save(jugador);
    }

    public JugadorEntity update(JugadorEntity jugador) {
        JugadorEntity oExistingJugador = oJugadorRepository.findById(jugador.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado con id: " + jugador.getId()));
        oExistingJugador.setDorsal(jugador.getDorsal());
        oExistingJugador.setPosicion(jugador.getPosicion());
        oExistingJugador.setCapitan(jugador.getCapitan());
        oExistingJugador.setImagen(jugador.getImagen());
        oExistingJugador.setIdUsuario(jugador.getIdUsuario());
        oExistingJugador.setIdEquipo(jugador.getIdEquipo());
        return oJugadorRepository.save(oExistingJugador);
    }

    public Long delete(Long id) {
        JugadorEntity jugador = oJugadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado con id: " + id));
        oJugadorRepository.delete(jugador);
        return id;
    }

    public Long empty() {
        oJugadorRepository.deleteAll();
        oJugadorRepository.flush();
        return 0L;
    }

    public Long count() {
        return oJugadorRepository.count();
    }

    public Long fill(Long cantidad) {
        for (long j = 0; j < cantidad; j++) {
            JugadorEntity jugador = new JugadorEntity();
            jugador.setDorsal(oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 99));
            jugador.setPosicion(posiciones.get(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, posiciones.size() - 1)));
            jugador.setCapitan(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 1) == 1);
            jugador.setImagen(null);
            jugador.setIdUsuario(oUsuarioService.getOneRandom());
            jugador.setIdEquipo(oEquipoService.getOneRandom());
            oJugadorRepository.save(jugador);
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
