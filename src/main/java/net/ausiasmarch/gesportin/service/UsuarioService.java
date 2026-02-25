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

    @Autowired
    private AleatorioService oAleatorioService;

    private final Random random = new Random();

    private final String[] nombresVaron = {
        "Juan", "Carlos", "Luis", "Pedro", "José",
        "Francisco", "Antonio", "Manuel", "David", "Javier",
        "Miguel", "Alejandro", "Rafael", "Daniel", "Fernando",
        "Sergio", "Jorge", "Alberto", "Raúl", "Pablo",
        "Rubén", "Adrián", "Diego", "Iván", "Óscar"
    };

    private final String[] nombresMujer = {
        "María", "Carmen", "Ana", "Laura", "Isabel",
        "Patricia", "Sofía", "Lucía", "Marta", "Elena",
        "Sara", "Cristina", "Raquel", "Beatriz", "Julia",
        "Victoria", "Claudia", "Andrea", "Alba", "Noelia",
        "Silvia", "Natalia", "Irene", "Carla", "Lorena"
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

    public Page<UsuarioEntity> getPage(Pageable pageable, String nombre, String username, Long id_Tipousuario,
            Long id_Club, Long id_Rol) {
        if (nombre != null && !nombre.isEmpty()) {
            return oUsuarioRepository.findByNombreContainingIgnoreCase(nombre, pageable);
        } else if (username != null) {
            return oUsuarioRepository.findByUsernameContainingIgnoreCase(username, pageable);
        } else if (id_Tipousuario != null) {
            return oUsuarioRepository.findByTipousuarioId(id_Tipousuario, pageable);
        } else if (id_Club != null) {
            return oUsuarioRepository.findByClubId(id_Club, pageable);
        } else if (id_Rol != null) {
            return oUsuarioRepository.findByRolusuarioId(id_Rol, pageable);
        } else {
            return oUsuarioRepository.findAll(pageable);
        }
    }

    public UsuarioEntity create(UsuarioEntity oUsuarioEntity) {
        oUsuarioEntity.setId(null);
        // Establecer la fecha de alta al momento de la creación
        oUsuarioEntity.setFechaAlta(LocalDateTime.now());
        oUsuarioEntity.setTipousuario(oTipousuarioService.get(oUsuarioEntity.getTipousuario().getId()));
        oUsuarioEntity.setClub(oClubService.get(oUsuarioEntity.getClub().getId()));
        oUsuarioEntity.setRolusuario(oRolusuarioService.get(oUsuarioEntity.getRolusuario().getId()));
        return oUsuarioRepository.save(oUsuarioEntity);
    }

    public UsuarioEntity update(UsuarioEntity oUsuarioEntity) {
        UsuarioEntity oUsuarioExistente = oUsuarioRepository.findById(oUsuarioEntity.getId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Usuario no encontrado con id: " + oUsuarioEntity.getId()));

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
            // Generar género aleatorio: 0 para masculino, 1 para femenino
            int genero = random.nextInt(2);
            String[] nombres = (genero == 0) ? nombresVaron : nombresMujer;
            oUsuario.setNombre(nombres[random.nextInt(nombres.length)]);
            oUsuario.setApellido1(apellidos[random.nextInt(apellidos.length)]);
            oUsuario.setApellido2(apellidos[random.nextInt(apellidos.length)]);
            // sin acentos y minúsculas
            String username = oAleatorioService.eliminarAcentos(oUsuario.getNombre().substring(0, 3).toLowerCase()
                    + oUsuario.getApellido1().substring(0, 2).toLowerCase()
                    + oUsuario.getApellido2().substring(0, 2).toLowerCase())
                    + random.nextInt(10);
            oUsuario.setUsername(username);
            oUsuario.setPassword("password" + (i + 1));
            oUsuario.setFechaAlta(LocalDateTime.now().minusDays(random.nextInt(365)));
            oUsuario.setGenero((genero == 0) ? 0 : 1);
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
