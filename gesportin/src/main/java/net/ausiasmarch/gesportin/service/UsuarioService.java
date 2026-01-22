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

    @Autowired
    private RolusuarioService oRolusuarioService;

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

     public Page<UsuarioEntity> getPage(Pageable pageable, String nombre, String username, Long id_Tipousuario, Long id_Club, Long id_Rol) {
        if (nombre != null && !nombre.isEmpty()) {
            return oUsuarioRepository.findByNombreContainingIgnoreCase(nombre, pageable);
        } else if (username != null) {
            return oUsuarioRepository.findByUsernameContainingIgnoreCase(username, pageable);
        } else if (id_Tipousuario != null) {
            return oUsuarioRepository.findByTipousuarioId(id_Tipousuario, pageable);
        } else if (id_Club != null) {
            return oUsuarioRepository.findByClubId(id_Club, pageable);
        }
        else if (id_Rol != null) {
            return oUsuarioRepository.findByRolusuarioId(id_Rol, pageable);
        }
        else 
            return oUsuarioRepository.findAll(pageable);
        }
    

    public UsuarioEntity create(UsuarioEntity oUsuarioEntity) {
        oUsuarioEntity.setId(null);
        oUsuarioEntity.setTipousuario(oTipousuarioService.get(oUsuarioEntity.getTipousuario().getId()));
        oUsuarioEntity.setClub(oClubService.get(oUsuarioEntity.getClub().getId()));
        oUsuarioEntity.setRolusuario(oRolusuarioService.get(oUsuarioEntity.getRolusuario().getId()));
        return oUsuarioRepository.save(oUsuarioEntity);
    }

    public UsuarioEntity update(UsuarioEntity oUsuarioEntity) {
        UsuarioEntity oUsuarioExistente = oUsuarioRepository.findById(oUsuarioEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + oUsuarioEntity.getId()));

        oUsuarioExistente.setNombre(oUsuarioEntity.getNombre());
        oUsuarioExistente.setApellido1(oUsuarioEntity.getApellido1());
        oUsuarioExistente.setApellido2(oUsuarioEntity.getApellido2());
        oUsuarioExistente.setUsername(oUsuarioEntity.getUsername());
        oUsuarioExistente.setPassword(oUsuarioEntity.getPassword());
        oUsuarioExistente.setFechaAlta(oUsuarioEntity.getFechaAlta());
        oUsuarioExistente.setGenero(oUsuarioEntity.getGenero());
        oUsuarioExistente.setTipousuario(oTipousuarioService.get(oUsuarioEntity.getTipousuario().getId()));
        oUsuarioExistente.setClub(oClubService.get(oUsuarioEntity.getClub().getId()));
        oUsuarioExistente.setRolusuario(oRolusuarioService.get(oUsuarioEntity.getRolusuario().getId()));
        return oUsuarioRepository.save(oUsuarioExistente);
    }

    public Long delete(Long id) {
        UsuarioEntity oUsuario = oUsuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
        oUsuarioRepository.delete(oUsuario);
        return id;
    }

    public Long count() {
        return oUsuarioRepository.count();
    }

    public Long empty() {
        oUsuarioRepository.deleteAll();
        oUsuarioRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            UsuarioEntity oUsuario = new UsuarioEntity();
            oUsuario.setNombre(nombres[random.nextInt(nombres.length)]);
            oUsuario.setApellido1(apellidos[random.nextInt(apellidos.length)]);
            oUsuario.setApellido2(apellidos[random.nextInt(apellidos.length)]);
            oUsuario.setUsername("user" + (i + 1) + "_" + random.nextInt(1000));
            oUsuario.setPassword("password" + (i + 1));
            oUsuario.setFechaAlta(LocalDateTime.now().minusDays(random.nextInt(365)));
            oUsuario.setGenero(random.nextInt(2));
            oUsuario.setTipousuario(oTipousuarioService.getOneRandom());
            oUsuario.setClub(oClubService.getOneRandom());
            oUsuario.setRolusuario(oRolusuarioService.getOneRandom());
            oUsuarioRepository.save(oUsuario);
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
