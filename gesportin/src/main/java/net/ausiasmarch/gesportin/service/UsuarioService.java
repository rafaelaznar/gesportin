package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
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

    @Autowired
    private SessionService oSessionService;

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
        UsuarioEntity e = oUsuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubId = (e.getClub()!=null) ? e.getClub().getId() : null;
            oSessionService.checkSameClub(clubId);
        }
        return e;
    }

    public Page<UsuarioEntity> getPage(Pageable pageable, String nombre, String username, Long id_Tipousuario,
            Long id_Club, Long id_Rol) {
        // equipo admins and regular users can only see users from their own club
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (id_Club != null) {
                // requested club filter must match own club
                if (myClub == null || !myClub.equals(id_Club)) {
                    throw new UnauthorizedException("Acceso denegado: solo usuarios de su club");
                }
            }
            // if no filtering at all, return club-specific page directly
            if ((nombre == null || nombre.isEmpty()) && username == null && id_Tipousuario == null && id_Club == null
                    && id_Rol == null) {
                return oUsuarioRepository.findByClubId(myClub, pageable);
            }
        }

        Page<UsuarioEntity> result;
        if (nombre != null && !nombre.isEmpty()) {
            result = oUsuarioRepository.findByNombreContainingIgnoreCase(nombre, pageable);
        } else if (username != null) {
            result = oUsuarioRepository.findByUsernameContainingIgnoreCase(username, pageable);
        } else if (id_Tipousuario != null) {
            result = oUsuarioRepository.findByTipousuarioId(id_Tipousuario, pageable);
        } else if (id_Club != null) {
            result = oUsuarioRepository.findByClubId(id_Club, pageable);
        } else if (id_Rol != null) {
            result = oUsuarioRepository.findByRolusuarioId(id_Rol, pageable);
        } else {
            result = oUsuarioRepository.findAll(pageable);
        }

        // if equipo admin or usuario, filter out any user not belonging to club
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (myClub != null && result != null) {
                java.util.List<UsuarioEntity> filtered = result.getContent().stream()
                        .filter(u -> u.getClub() != null && myClub.equals(u.getClub().getId()))
                        .collect(Collectors.toList());
                return new org.springframework.data.domain.PageImpl<>(filtered, pageable, filtered.size());
            }
        }
        return result;
    }

    public UsuarioEntity create(UsuarioEntity oUsuarioEntity) {
        oSessionService.denyUsuario();
        // equipo admins can create users of type "usuario" (tipousuario=3) but only in their own club
        if (oSessionService.isEquipoAdmin()) {
            Long myClub = oSessionService.getIdClub();
            if (myClub == null) {
                throw new UnauthorizedException("Acceso denegado: no tiene club asignado");
            }
            if (oUsuarioEntity.getClub() == null || oUsuarioEntity.getClub().getId() == null) {
                throw new UnauthorizedException("Acceso denegado: debe especificar el club");
            }
            // Only allow creating users in own club
            oSessionService.checkSameClub(oUsuarioEntity.getClub().getId());
            // Only allow creating users with tipousuario "usuario" (id=3)
            if (oUsuarioEntity.getTipousuario() == null || oUsuarioEntity.getTipousuario().getId() == null
                    || oUsuarioEntity.getTipousuario().getId() != 3L) {
                throw new UnauthorizedException("Acceso denegado: solo puede crear usuarios del tipo usuario");
            }
            // Force club to the admin's club
            oUsuarioEntity.setClub(oClubService.get(myClub));
        } else {
            oUsuarioEntity.setClub(oClubService.get(oUsuarioEntity.getClub().getId()));
        }

        oUsuarioEntity.setId(null);
        // Establecer la fecha de alta al momento de la creación
        oUsuarioEntity.setFechaAlta(LocalDateTime.now());
        oUsuarioEntity.setTipousuario(oTipousuarioService.get(oUsuarioEntity.getTipousuario().getId()));
        oUsuarioEntity.setRolusuario(oRolusuarioService.get(oUsuarioEntity.getRolusuario().getId()));
        return oUsuarioRepository.save(oUsuarioEntity);
    }

    public UsuarioEntity update(UsuarioEntity oUsuarioEntity) {
        oSessionService.denyUsuario();
        UsuarioEntity oUsuarioExistente = oUsuarioRepository.findById(oUsuarioEntity.getId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Usuario no encontrado con id: " + oUsuarioEntity.getId()));

        // equipo admins can only modify "usuario" users belonging to their own club and cannot change their club
        if (oSessionService.isEquipoAdmin()) {
            Long myClub = oSessionService.getIdClub();
            if (myClub == null) {
                throw new UnauthorizedException("Acceso denegado: no tiene club asignado");
            }
            // only allow updating users of type "usuario"
            if (oUsuarioExistente.getTipousuario() == null || oUsuarioExistente.getTipousuario().getId() != 3L) {
                throw new UnauthorizedException("Acceso denegado: solo puede modificar usuarios del tipo usuario");
            }
            // must be in same club
            oSessionService.checkSameClub(oUsuarioExistente.getClub() != null ? oUsuarioExistente.getClub().getId() : null);
            // cannot change club
            if (oUsuarioEntity.getClub() != null && oUsuarioEntity.getClub().getId() != null
                    && !oUsuarioEntity.getClub().getId().equals(oUsuarioExistente.getClub().getId())) {
                throw new UnauthorizedException("Acceso denegado: no puede cambiar el club del usuario");
            }
            // must remain tipousuario "usuario"
            if (oUsuarioEntity.getTipousuario() == null || oUsuarioEntity.getTipousuario().getId() != 3L) {
                throw new UnauthorizedException("Acceso denegado: solo puede modificar usuarios del tipo usuario");
            }

            // ensure club remains the same
            oUsuarioEntity.setClub(oUsuarioExistente.getClub());
        }

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
        oSessionService.denyUsuario();
        UsuarioEntity oUsuario = oUsuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        // equipo admins can only delete "usuario" users in their own club
        if (oSessionService.isEquipoAdmin()) {
            Long myClub = oSessionService.getIdClub();
            if (myClub == null) {
                throw new UnauthorizedException("Acceso denegado: no tiene club asignado");
            }
            if (oUsuario.getTipousuario() == null || oUsuario.getTipousuario().getId() != 3L) {
                throw new UnauthorizedException("Acceso denegado: solo puede eliminar usuarios del tipo usuario");
            }
            oSessionService.checkSameClub(oUsuario.getClub() != null ? oUsuario.getClub().getId() : null);
        }

        oUsuarioRepository.delete(oUsuario);
        return id;
    }

    public Long count() {
        if (oSessionService.isEquipoAdmin()) {
            Long myClub = oSessionService.getIdClub();
            if (myClub == null) {
                return 0L;
            }
            return oUsuarioRepository.findByClubId(myClub, Pageable.ofSize(1)).getTotalElements();
        }
        return oUsuarioRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oUsuarioRepository.deleteAll();
        oUsuarioRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        // Los usuarios del sistema (admin, clubadmin, usuario) son gestionados
        // exclusivamente por reset()/seed() y nunca se crean aquí.
        UsuarioEntity oUsuario;
        for (int i = 0; i < cantidad; i++) {
            oUsuario = new UsuarioEntity();
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
            oUsuario.setPassword("7e4b4f5529e084ecafb996c891cfbd5b5284f5b00dc155c37bbb62a9f161a72e");
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

    public UsuarioEntity getOneRandomFromClub(Long clubId) {
        long count = oUsuarioRepository.findByClubId(clubId, Pageable.ofSize(1)).getTotalElements();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        var page = oUsuarioRepository.findByClubId(clubId, Pageable.ofSize(1).withPage(index));
        return page.hasContent() ? page.getContent().get(0) : null;
    }

    public UsuarioEntity getOneRandomFromClubAndTipousuario(Long clubId, Long tipousuarioId) {
        long count = oUsuarioRepository.findByClubIdAndTipousuarioId(clubId, tipousuarioId, Pageable.ofSize(1)).getTotalElements();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        var page = oUsuarioRepository.findByClubIdAndTipousuarioId(clubId, tipousuarioId, Pageable.ofSize(1).withPage(index));
        return page.hasContent() ? page.getContent().get(0) : null;
    }
}
