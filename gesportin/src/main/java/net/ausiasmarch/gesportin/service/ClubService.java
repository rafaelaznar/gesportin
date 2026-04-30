package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.ArticuloEntity;
import net.ausiasmarch.gesportin.entity.CategoriaEntity;
import net.ausiasmarch.gesportin.entity.ClubEntity;
import net.ausiasmarch.gesportin.entity.ComentarioEntity;
import net.ausiasmarch.gesportin.entity.CompraEntity;
import net.ausiasmarch.gesportin.entity.EquipoEntity;
import net.ausiasmarch.gesportin.entity.JugadorEntity;
import net.ausiasmarch.gesportin.entity.NoticiaEntity;
import net.ausiasmarch.gesportin.entity.PuntuacionEntity;
import net.ausiasmarch.gesportin.entity.TemporadaEntity;
import net.ausiasmarch.gesportin.entity.TipoarticuloEntity;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.ArticuloRepository;
import net.ausiasmarch.gesportin.repository.CategoriaRepository;
import net.ausiasmarch.gesportin.repository.ClubRepository;
import net.ausiasmarch.gesportin.repository.ComentarioRepository;
import net.ausiasmarch.gesportin.repository.CompraRepository;
import net.ausiasmarch.gesportin.repository.EquipoRepository;
import net.ausiasmarch.gesportin.repository.FacturaRepository;
import net.ausiasmarch.gesportin.repository.JugadorRepository;
import net.ausiasmarch.gesportin.repository.NoticiaRepository;
import net.ausiasmarch.gesportin.repository.PuntuacionRepository;
import net.ausiasmarch.gesportin.repository.RolusuarioRepository;
import net.ausiasmarch.gesportin.repository.TemporadaRepository;
import net.ausiasmarch.gesportin.repository.TipoarticuloRepository;
import net.ausiasmarch.gesportin.repository.TipousuarioRepository;
import net.ausiasmarch.gesportin.repository.UsuarioRepository;

@Service
public class ClubService {

    @Autowired
    private ClubRepository oClubRepository;

    @Autowired
    private NoticiaRepository oNoticiaRepository;

    @Autowired
    private TipoarticuloRepository oTipoarticuloRepository;

    @Autowired
    private TemporadaRepository oTemporadaRepository;

    @Autowired
    private UsuarioRepository oUsuarioRepository;

    @Autowired
    private ComentarioRepository oComentarioRepository;

    @Autowired
    private PuntuacionRepository oPuntuacionRepository;

    @Autowired
    private CompraRepository oCompraRepository;

    @Autowired
    private JugadorRepository oJugadorRepository;

    @Autowired
    private ArticuloRepository oArticuloRepository;

    @Autowired
    private EquipoRepository oEquipoRepository;

    @Autowired
    private CategoriaRepository oCategoriaRepository;

    @Autowired
    private FacturaRepository oFacturaRepository;

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private TipousuarioRepository oTipousuarioRepository;

    @Autowired
    private RolusuarioRepository oRolusuarioRepository;

    private final Random random = new Random();

    private final String[] descripciones1 = {
        "Atlético", "Deportivo", "Real club", "Unión deportiva",
        "Sociedad deportiva", "Socidad nacional", "Agrupación deportiva", "Club deportivo",
        "Asociación deportiva", "Federación deportiva", "Equipo deportivo", "Comunidad deportiva",
        "Círculo deportivo"};
    private final String[] descripciones2 = {
        "Fúbol", "Baloncesto", "Voleibol", "Hockey",
        "Rugby", "Tenis", "Natación", "Atletismo",
        "Ciclismo", "Boxeo", "Esgrima", "Gimnastia",
        "Piragüismo", "Remo", "Judo", "Taekwondo",
        "Karate", "Golf", "Surf", "Esquí"};
    private final String[] descripciones3 = {
        "Barcelona", "Madrid", "Valencia", "Sevilla",
        "Zaragoza", "Villarreal", "Granada", "Cádiz",
        "Bilbao", "San Sebastián", "Vigo", "La Coruña",
        "Mallorca", "Ibiza", "Tenerife", "Las Palmas"};
    private final String[] direcciones1 = {
        "Calle", "Avenida", "Plaza", "Camino", "Paseo", "Ronda", "Glorieta", "Travesía"};

    private final String[] nombres = {"Juan", "Carlos", "Luis", "Miguel", "Javier", "David", "Ángel", "Sergio",
        "Pablo", "Diego",
        "Manuel", "Francisco", "José", "Antonio", "Jesús", "Alberto", "Fernando", "Raúl", "Rubén", "Óscar"};

    private final String[] apellidos = {"García", "Martínez", "López", "Sánchez", "Pérez", "González", "Rodríguez",
        "Fernández",
        "Jiménez", "Moreno", "Muñoz", "Alonso", "Gutiérrez", "Romero", "Díaz", "Torres", "Ruiz", "Hernández",
        "Vázquez", "Castro"};

    public ClubEntity get(Long id) {
        // equipo administrators may only view their own club
        oSessionService.checkSameClub(id);
        return oClubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado con id: " + id));
    }

    public Page<ClubEntity> getPage(Pageable pageable) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (myClub == null) {
                // should not happen, but just in case
                return org.springframework.data.domain.Page.empty(pageable);
            }
            // return a single-item page containing only the user's club
            ClubEntity club = oClubRepository.findById(myClub).orElse(null);
            if (club == null) {
                return org.springframework.data.domain.Page.empty(pageable);
            }
            java.util.List<ClubEntity> list = java.util.Collections.singletonList(club);
            return new org.springframework.data.domain.PageImpl<>(list, pageable, 1);
        }
        return oClubRepository.findAll(pageable);
    }

    public ClubEntity create(ClubEntity oClubEntity) {
        // equipo admins and regular usuarios are not allowed to create clubs
        oSessionService.denyEquipoAdmin();
        oSessionService.denyUsuario();
        oClubEntity.setId(null);
        oClubEntity.setFechaAlta(LocalDateTime.now());
        return oClubRepository.save(oClubEntity);
    }

    public ClubEntity update(ClubEntity oClubEntity) {
        // equipo admins and regular usuarios are not allowed to modify club data
        oSessionService.denyEquipoAdmin();
        oSessionService.denyUsuario();
        ClubEntity oClubExistente = oClubRepository.findById(oClubEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado con id: " + oClubEntity.getId()));

        oClubExistente.setNombre(oClubEntity.getNombre());
        oClubExistente.setDireccion(oClubEntity.getDireccion());
        oClubExistente.setTelefono(oClubEntity.getTelefono());
        oClubExistente.setFechaAlta(oClubEntity.getFechaAlta());
        return oClubRepository.save(oClubExistente);
    }

    public Long delete(Long id) {
        // equipo admins and regular usuarios are not allowed to delete clubs
        oSessionService.denyEquipoAdmin();
        oSessionService.denyUsuario();
        ClubEntity oClub = oClubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado con id: " + id));
        oClubRepository.delete(oClub);
        return id;
    }

    public Long count() {
        // equipo admins and regular usuarios should only be aware of their own club count
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            return (oSessionService.getIdClub() != null) ? 1L : 0L;
        }
        return oClubRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oClubRepository.deleteAll();
        oClubRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (int i = 0; i < cantidad; i++) {
            ClubEntity oClub = new ClubEntity();
            String nombre = descripciones1[random.nextInt(descripciones1.length)] + " de "
                    + descripciones2[random.nextInt(descripciones2.length)] + " en "
                    + descripciones3[random.nextInt(descripciones3.length)];
            oClub.setNombre(nombre);
            String direccion = direcciones1[random.nextInt(direcciones1.length)] + " de "
                    + nombres[random.nextInt(nombres.length)] + " "
                    + apellidos[random.nextInt(apellidos.length)] + ", " + (random.nextInt(100) + 1);
            oClub.setDireccion(direccion);
            oClub.setTelefono("6" + (random.nextInt(900000) + 1000000));
            oClub.setFechaAlta(LocalDateTime.now());
            // oClub.setImagen(("imagen" + i).getBytes());
            oClubRepository.save(oClub);
        }
        return cantidad;
    }

    public ClubEntity getOneRandom() {
        Long count = oClubRepository.count();
        if (count == 0) {
            return null;
        }
        int index = random.nextInt(count.intValue());
        return oClubRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }

    public Long fillGesportin() {
        oSessionService.requireAdmin();
        ClubEntity gesportin = oClubRepository.findById(1L)
                .orElseThrow(() -> new ResourceNotFoundException("Club Gesportin no encontrado con id: 1"));
        long affected = 0L;

        // antes de empezar el proceso crear 10 nuevos usuarios aleatrorios para el club Gesportin, que se usarán para asignar a noticias/comentarios/puntuaciones/facturas/jugadores
        for (int i = 0; i < 10; i++) {
            UsuarioEntity usuario = new UsuarioEntity();
            String nombre = nombres[random.nextInt(nombres.length)];
            String apellido1 = apellidos[random.nextInt(apellidos.length)];
            String apellido2 = apellidos[random.nextInt(apellidos.length)];
            String usernameBase = (nombre.charAt(0) + apellido1 + apellido2.charAt(0)).toLowerCase();
            usuario.setNombre(nombre);
            usuario.setApellido1(apellido1);
            usuario.setApellido2(apellido2);
            usuario.setUsername(usernameBase + random.nextInt(10000));
            usuario.setFechaAlta(LocalDateTime.now());
            usuario.setGenero(random.nextInt(2)); // 0 para hombre, 1 para mujer
            usuario.setPassword("7e4b4f5529e084ecafb996c891cfbd5b5284f5b00dc155c37bbb62a9f161a72e");
            usuario.setTipousuario(oTipousuarioRepository.findById(3L).orElse(null)); // tipo usuario "usuario"
            usuario.setRolusuario(oRolusuarioRepository.findById(1L).orElse(null)); 
            usuario.setClub(gesportin);
            oUsuarioRepository.save(usuario);
        }

        // ──────────────────────────────────────────────────────────────────────────────
        // 1. NOTICIAS: cambiar al club Gesportin y actualizar comentarios/puntuaciones
        // ──────────────────────────────────────────────────────────────────────────────
        long noticiaCount = oNoticiaRepository.count();
        if (noticiaCount > 0) {
            int pages = (int) Math.ceil((double) noticiaCount / 5.0);
            List<NoticiaEntity> noticias = oNoticiaRepository
                    .findAll(PageRequest.of(random.nextInt(pages), 5)).getContent();
            for (NoticiaEntity noticia : noticias) {
                noticia.setClub(gesportin);
                oNoticiaRepository.save(noticia);
                affected++;

                // Cambiar usuarios de comentarios al club Gesportin (integridad referencial)
                List<ComentarioEntity> comentarios = oComentarioRepository.findByNoticiaId(noticia.getId(),
                        org.springframework.data.domain.PageRequest.of(0, 1000)).getContent();
                for (ComentarioEntity comentario : comentarios) {
                    UsuarioEntity usuarioGesportin = getRandomUsuarioDeClub(gesportin);
                    if (usuarioGesportin != null) {
                        comentario.setUsuario(usuarioGesportin);
                        oComentarioRepository.save(comentario);
                    }
                }

                // Cambiar usuarios de puntuaciones al club Gesportin (integridad referencial)
                List<PuntuacionEntity> puntuaciones = oPuntuacionRepository.findByNoticiaId(noticia.getId(),
                        org.springframework.data.domain.PageRequest.of(0, 1000)).getContent();
                for (PuntuacionEntity puntuacion : puntuaciones) {
                    UsuarioEntity usuarioGesportin = getRandomUsuarioDeClub(gesportin);
                    if (usuarioGesportin != null) {
                        puntuacion.setUsuario(usuarioGesportin);
                        oPuntuacionRepository.save(puntuacion);
                    }
                }
            }
        }

        // ──────────────────────────────────────────────────────────────────────────────
        // 2. TIPOS DE ARTICULO: cambiar al club Gesportin y actualizar facturas de compras
        // ──────────────────────────────────────────────────────────────────────────────
        long tipoarticuloCount = oTipoarticuloRepository.count();
        if (tipoarticuloCount > 0) {
            int pages = (int) Math.ceil((double) tipoarticuloCount / 5.0);
            List<TipoarticuloEntity> tipos = oTipoarticuloRepository
                    .findAll(PageRequest.of(random.nextInt(pages), 5)).getContent();
            for (TipoarticuloEntity tipo : tipos) {
                tipo.setClub(gesportin);
                oTipoarticuloRepository.save(tipo);
                affected++;

                // Cambiar usuarios de facturas de compras de artículos de este tipo
                List<ArticuloEntity> articulos = oArticuloRepository.findByTipoarticuloId(tipo.getId(),
                        org.springframework.data.domain.PageRequest.of(0, 1000)).getContent();
                for (ArticuloEntity articulo : articulos) {
                    List<CompraEntity> compras = oCompraRepository.findByArticuloId(articulo.getId(),
                            org.springframework.data.domain.PageRequest.of(0, 1000)).getContent();
                    for (CompraEntity compra : compras) {
                        UsuarioEntity usuarioGesportin = getRandomUsuarioDeClub(gesportin);
                        if (usuarioGesportin != null) {
                            compra.getFactura().setUsuario(usuarioGesportin);
                            oFacturaRepository.save(compra.getFactura());
                        }
                    }
                }
            }
        }

        // ──────────────────────────────────────────────────────────────────────────────
        // 3. TEMPORADAS: cambiar al club Gesportin y actualizar jugadores de sus equipos
        // ──────────────────────────────────────────────────────────────────────────────
        long temporadaCount = oTemporadaRepository.count();
        if (temporadaCount > 0) {
            int pages = (int) Math.ceil((double) temporadaCount / 5.0);
            List<TemporadaEntity> temporadas = oTemporadaRepository
                    .findAll(PageRequest.of(random.nextInt(pages), 5)).getContent();
            for (TemporadaEntity temporada : temporadas) {
                temporada.setClub(gesportin);
                oTemporadaRepository.save(temporada);
                affected++;

                // Obtener categorías de esta temporada
                List<CategoriaEntity> categorias = oCategoriaRepository.findByTemporadaId(temporada.getId(),
                        org.springframework.data.domain.PageRequest.of(0, 1000)).getContent();

                for (CategoriaEntity categoria : categorias) {
                    // Obtener equipos de esta categoría
                    List<EquipoEntity> equipos = oEquipoRepository.findByCategoriaId(categoria.getId(),
                            org.springframework.data.domain.PageRequest.of(0, 1000)).getContent();

                    for (EquipoEntity equipo : equipos) {
                        // Obtener jugadores de este equipo
                        List<JugadorEntity> jugadores = oJugadorRepository.findByEquipoId(equipo.getId(),
                                org.springframework.data.domain.PageRequest.of(0, 1000)).getContent();

                        for (JugadorEntity jugador : jugadores) {
                            UsuarioEntity usuarioGesportin = getRandomUsuarioDeClub(gesportin);
                            if (usuarioGesportin != null) {
                                jugador.setUsuario(usuarioGesportin);
                                oJugadorRepository.save(jugador);
                            }
                        }
                    }
                }
            }
        }

        return affected;
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // Helper: obtener un usuario aleatorio de un club
    // ──────────────────────────────────────────────────────────────────────────────
    private UsuarioEntity getRandomUsuarioDeClub(ClubEntity club) {
        try {
            long usuarioCount = oUsuarioRepository.count();
            if (usuarioCount == 0) {
                return null;
            }
            // Obtener una página aleatoria con tamaño 50
            int pages = (int) Math.ceil((double) usuarioCount / 50.0);
            if (pages <= 0) {
                pages = 1;
            }
            List<UsuarioEntity> usuariosClub = oUsuarioRepository
                    .findByClubId(club.getId(),
                            org.springframework.data.domain.PageRequest.of(random.nextInt(pages), 50))
                    .getContent();
            if (usuariosClub.isEmpty()) {
                return null;
            }
            return usuariosClub.get(random.nextInt(usuariosClub.size()));
        } catch (Exception e) {
            return null;
        }
    }
}
