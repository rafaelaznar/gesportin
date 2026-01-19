package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository oUsuarioRepository;

    @Autowired
    private ClubService oClubService;

    @Autowired
    private TipousuarioService oTipousuarioService; 

    private final Random random = new Random();

    private final String[] nombres = {
        "Juan", "María", "Carlos", "Ana", "Luis", "Laura", "Pedro", "Carmen", "José", "Isabel",
        "Francisco", "Dolores", "Antonio", "Pilar", "Manuel", "Teresa", "David", "Rosa", "Javier", "Ángeles",
        "Miguel", "Concepción", "Alejandro", "Josefa", "Rafael", "Francisca", "Daniel", "Antonia", "Fernando", "Mercedes",
        "Sergio", "Dolores", "Jorge", "Julia", "Alberto", "Cristina", "Raúl", "Lucía", "Pablo", "Elena",
        "Rubén", "Marta", "Adrián", "Sara", "Diego", "Patricia", "Iván", "Beatriz", "Óscar", "Rocío"
    };

    private final String[] apellidos = {
        "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Martín",
        "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez",
        "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos", "Gil", "Ramírez", "Serrano", "Blanco", "Suárez",
        "Molina", "Castro", "Ortega", "Rubio", "Morales", "Delgado", "Ortiz", "Marín", "Iglesias", "Santos",
        "Castillo", "Garrido", "Calvo", "Peña", "Cruz", "Cano", "Núñez", "Prieto", "Díez", "Lozano"
    };

    public UsuarioEntity get(Long id) {
        return oUsuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
    }

    public Page<UsuarioEntity> getPage(Pageable pageable, String nombre, String username, Long idTipousuario, Long idClub) {
        if (nombre != null && !nombre.isEmpty()) {
            return oUsuarioRepository.findByNombreContainingIgnoreCase(nombre, pageable);
        } else if (username != null && !username.isEmpty()) {
            return oUsuarioRepository.findByUsernameContainingIgnoreCase(username, pageable);
        }//  else if (idTipousuario != null) {
        //     return oUsuarioRepository.findByIdTipousuario(idTipousuario, pageable);
        //  } // else if (idClub != null) {
        //     // return oUsuarioRepository.findByIdClub(idClub, pageable);
        //} else {
        {
            return oUsuarioRepository.findAll(pageable);
        }
    }

    public UsuarioEntity create(UsuarioEntity usuario) {
        usuario.setId(null);
        return oUsuarioRepository.save(usuario);
    }

    public UsuarioEntity update(UsuarioEntity usuario) {
        UsuarioEntity usuarioExistente = oUsuarioRepository.findById(usuario.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + usuario.getId()));

        usuarioExistente.setNombre(usuario.getNombre());
        usuarioExistente.setApellido1(usuario.getApellido1());
        usuarioExistente.setApellido2(usuario.getApellido2());
        usuarioExistente.setUsername(usuario.getUsername());
        usuarioExistente.setPassword(usuario.getPassword());
        usuarioExistente.setFechaAlta(usuario.getFechaAlta());
        usuarioExistente.setGenero(usuario.getGenero());
        usuarioExistente.setTipousuario(oTipousuarioService.getOneRandom());
        usuarioExistente.setClub(oClubService.getOneRandom());

        return oUsuarioRepository.save(usuarioExistente);
    }

    public Long delete(Long id) {
        UsuarioEntity usuario = oUsuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
        oUsuarioRepository.delete(usuario);
        return id;
    }

    public Long empty() {
        oUsuarioRepository.deleteAll();
        oUsuarioRepository.flush();
        return 0L;
    }

    public Long count() {
        return oUsuarioRepository.count();
    }

    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            UsuarioEntity usuario = new UsuarioEntity();
            usuario.setNombre(nombres[random.nextInt(nombres.length)]);
            usuario.setApellido1(apellidos[random.nextInt(apellidos.length)]);
            usuario.setApellido2(apellidos[random.nextInt(apellidos.length)]);
            usuario.setUsername("user" + (i + 1) + "_" + random.nextInt(1000));
            usuario.setPassword("password" + (i + 1));
            usuario.setFechaAlta(LocalDateTime.now().minusDays(random.nextInt(365)));
            usuario.setGenero(random.nextInt(2));
            usuario.setTipousuario(oTipousuarioService.getOneRandom());
            usuario.setClub(oClubService.getOneRandom());
            oUsuarioRepository.save(usuario);
        }
        return cantidad;
    }

    public UsuarioEntity getOneRandom() {
        Long count = oUsuarioRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oUsuarioRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }
}
