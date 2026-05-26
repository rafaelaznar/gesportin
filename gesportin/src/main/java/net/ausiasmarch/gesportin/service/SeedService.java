package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import net.ausiasmarch.gesportin.entity.ClubEntity;
import net.ausiasmarch.gesportin.entity.RolusuarioEntity;
import net.ausiasmarch.gesportin.entity.TipousuarioEntity;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.repository.ArticuloRepository;
import net.ausiasmarch.gesportin.repository.CarritoRepository;
import net.ausiasmarch.gesportin.repository.CategoriaRepository;
import net.ausiasmarch.gesportin.repository.ClubRepository;
import net.ausiasmarch.gesportin.repository.ComentarioRepository;
import net.ausiasmarch.gesportin.repository.ComentarioartRepository;
import net.ausiasmarch.gesportin.repository.CompraRepository;
import net.ausiasmarch.gesportin.repository.CuotaRepository;
import net.ausiasmarch.gesportin.repository.EquipoRepository;
import net.ausiasmarch.gesportin.repository.FacturaRepository;
import net.ausiasmarch.gesportin.repository.JugadorRepository;
import net.ausiasmarch.gesportin.repository.LigaRepository;
import net.ausiasmarch.gesportin.repository.NoticiaRepository;
import net.ausiasmarch.gesportin.repository.PagoRepository;
import net.ausiasmarch.gesportin.repository.PartidoRepository;
import net.ausiasmarch.gesportin.repository.PuntuacionRepository;
import net.ausiasmarch.gesportin.repository.PuntuacionartRepository;
import net.ausiasmarch.gesportin.repository.RolusuarioRepository;
import net.ausiasmarch.gesportin.repository.TemporadaRepository;
import net.ausiasmarch.gesportin.repository.TipoarticuloRepository;
import net.ausiasmarch.gesportin.repository.TipousuarioRepository;
import net.ausiasmarch.gesportin.repository.UsuarioRepository;
import net.ausiasmarch.gesportin.repository.EstadopartidoRepository;

@Service
public class SeedService {

    private static final String PASSWORD_AUSIAS =
            "7e4b4f5529e084ecafb996c891cfbd5b5284f5b00dc155c37bbb62a9f161a72e";
    private static final byte[] EMPTY_IMAGE = new byte[0];

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PersistenceContext
    private EntityManager entityManager;

    // ── Repositories ─────────────────────────────────────────────────────────────
    @Autowired private CompraRepository       oCompraRepository;
    @Autowired private FacturaRepository      oFacturaRepository;
    @Autowired private CarritoRepository      oCarritoRepository;
    @Autowired private PuntuacionartRepository oPuntuacionartRepository;
    @Autowired private ComentarioartRepository oComentarioartRepository;
    @Autowired private PuntuacionRepository   oPuntuacionRepository;
    @Autowired private ComentarioRepository   oComentarioRepository;
    @Autowired private PagoRepository         oPagoRepository;
    @Autowired private PartidoRepository      oPartidoRepository;
    @Autowired private CuotaRepository        oCuotaRepository;
    @Autowired private JugadorRepository      oJugadorRepository;
    @Autowired private LigaRepository         oLigaRepository;
    @Autowired private EquipoRepository       oEquipoRepository;
    @Autowired private ArticuloRepository     oArticuloRepository;
    @Autowired private CategoriaRepository    oCategoriaRepository;
    @Autowired private TipoarticuloRepository oTipoarticuloRepository;
    @Autowired private NoticiaRepository      oNoticiaRepository;
    @Autowired private TemporadaRepository    oTemporadaRepository;
    @Autowired private UsuarioRepository      oUsuarioRepository;
    @Autowired private ClubRepository         oClubRepository;
    @Autowired private RolusuarioRepository   oRolusuarioRepository;
    @Autowired private EstadopartidoRepository oEstadopartidoRepository;
    @Autowired private TipousuarioRepository  oTipousuarioRepository;

    // ────────────────────────────────────────────────────────────────────────────
    // reset() — single @Transactional operation:
    //   1. requireAdmin() once (before any deletion)
    //   2. deleteAllInBatch() in reverse FK order (no per-call auth)
    //   3. entityManager.clear() to flush the JPA first-level cache
    //   4. Native SQL INSERTs with explicit IDs (1,2,3) — guarantees correct IDs
    //      regardless of the AUTO_INCREMENT counter state after DELETE.
    // ────────────────────────────────────────────────────────────────────────────
    @Transactional
    public long reset() {

        oSessionService.requireAdmin();

        // ── Step 2: empty all tables, children before parents ───────────────────
        oCompraRepository.deleteAllInBatch();
        oFacturaRepository.deleteAllInBatch();
        oCarritoRepository.deleteAllInBatch();
        oPuntuacionartRepository.deleteAllInBatch();
        oComentarioartRepository.deleteAllInBatch();
        oPuntuacionRepository.deleteAllInBatch();
        oComentarioRepository.deleteAllInBatch();
        oPagoRepository.deleteAllInBatch();
        oPartidoRepository.deleteAllInBatch();
        oCuotaRepository.deleteAllInBatch();
        oJugadorRepository.deleteAllInBatch();
        oLigaRepository.deleteAllInBatch();
        oEquipoRepository.deleteAllInBatch();
        oArticuloRepository.deleteAllInBatch();
        oCategoriaRepository.deleteAllInBatch();
        oTipoarticuloRepository.deleteAllInBatch();
        oNoticiaRepository.deleteAllInBatch();
        oTemporadaRepository.deleteAllInBatch();
        oUsuarioRepository.deleteAllInBatch();
        oClubRepository.deleteAllInBatch();
        oRolusuarioRepository.deleteAllInBatch();
        oEstadopartidoRepository.deleteAllInBatch();
        oTipousuarioRepository.deleteAllInBatch();

        // ── Step 3: clear JPA first-level cache ─────────────────────────────────
        entityManager.clear();

        // ── Step 4: seed with explicit IDs via native SQL ────────────────────────
        // MySQL accepts explicit IDs even on AUTO_INCREMENT columns;
        // the counter stays high but future JPA saves get correct next values.

        entityManager.createNativeQuery(
                "INSERT INTO tipousuario (id, descripcion) VALUES " +
                "(1, 'Administrador'), (2, 'Administrador de club'), (3, 'Usuario')")
                .executeUpdate();

        entityManager.createNativeQuery(
                "INSERT INTO estadopartido (id, descripcion) VALUES " +
                "(1, 'No jugado'), (2, 'Ganado'), (3, 'Perdido'), (4, 'Empatado'), (5, 'Aplazado')")
                .executeUpdate();

        entityManager.createNativeQuery(
                "INSERT INTO rolusuario (id, descripcion) VALUES (1, 'Presidente')")
                .executeUpdate();

        entityManager.createNativeQuery(
                "INSERT INTO club (id, nombre, direccion, telefono, fecha_alta, imagen) " +
                "VALUES (1, 'Gesportin', 'Calle Principal, 1', '600000001', NOW(), '')")
                .executeUpdate();

        entityManager.createNativeQuery(
                "INSERT INTO usuario " +
                "(id, nombre, apellido1, apellido2, username, email, password, fecha_alta, genero, " +
                " id_tipousuario, id_rolusuario, id_club) VALUES " +
                "(1, 'Jose',  'Gutiérrez', 'Cruz',     'admin',     'admin@gesportin.local',     :pwd, NOW(), 0, 1, 1, 1), " +
                "(2, 'Maria', 'García',    'López',    'clubadmin', 'clubadmin@gesportin.local', :pwd, NOW(), 1, 2, 1, 1), " +
                "(3, 'Carla', 'Sánchez',   'Martínez', 'usuario',   'usuario@gesportin.local',   :pwd, NOW(), 1, 3, 1, 1)")
                .setParameter("pwd", PASSWORD_AUSIAS)
                .executeUpdate();

        // 3 tipousuario + 5 estadopartido + 1 rolusuario + 1 club + 3 usuario
        return 13L;
    }

    // ────────────────────────────────────────────────────────────────────────────
    // seed() — idempotent: fills only tables that are currently empty.
    // Intended for fresh installations. Does NOT use findById(N) — instead keeps
    // references from save() to avoid dependency on specific ID values.
    // ────────────────────────────────────────────────────────────────────────────
    @Transactional
    public Long seed() {
        oSessionService.requireAdmin();
        long count = 0;

        // tipousuario
        TipousuarioEntity tipo1, tipo2, tipo3;
        if (oTipousuarioRepository.count() == 0) {
            TipousuarioEntity t1 = new TipousuarioEntity();
            t1.setDescripcion("Administrador");
            tipo1 = oTipousuarioRepository.save(t1);

            TipousuarioEntity t2 = new TipousuarioEntity();
            t2.setDescripcion("Administrador de club");
            tipo2 = oTipousuarioRepository.save(t2);

            TipousuarioEntity t3 = new TipousuarioEntity();
            t3.setDescripcion("Usuario");
            tipo3 = oTipousuarioRepository.save(t3);

            oTipousuarioRepository.flush();
            count += 3;
        } else {
            java.util.List<TipousuarioEntity> tipos = oTipousuarioRepository.findAll();
            tipo1 = tipos.stream().filter(t -> "Administrador".equals(t.getDescripcion()))
                    .findFirst().orElse(tipos.get(0));
            tipo2 = tipos.stream().filter(t -> "Administrador de club".equals(t.getDescripcion()))
                    .findFirst().orElse(tipos.size() > 1 ? tipos.get(1) : tipo1);
            tipo3 = tipos.stream().filter(t -> "Usuario".equals(t.getDescripcion()))
                    .findFirst().orElse(tipos.size() > 2 ? tipos.get(2) : tipo1);
        }

        // rolusuario
        RolusuarioEntity rol1;
        if (oRolusuarioRepository.count() == 0) {
            RolusuarioEntity r = new RolusuarioEntity();
            r.setDescripcion("Presidente");
            rol1 = oRolusuarioRepository.save(r);
            oRolusuarioRepository.flush();
            count++;
        } else {
            rol1 = oRolusuarioRepository.findAll().get(0);
        }

        // club
        ClubEntity club1;
        if (oClubRepository.count() == 0) {
            ClubEntity c = new ClubEntity();
            c.setNombre("Gesportin");
            c.setDireccion("Calle Principal, 1");
            c.setTelefono("600000001");
            c.setFechaAlta(LocalDateTime.now());
            c.setImagen(EMPTY_IMAGE);
            club1 = oClubRepository.save(c);
            oClubRepository.flush();
            count++;
        } else {
            club1 = oClubRepository.findAll().get(0);
        }

        // usuario
        if (oUsuarioRepository.count() == 0) {
            UsuarioEntity u1 = new UsuarioEntity();
            u1.setNombre("Jose"); u1.setApellido1("Gutiérrez"); u1.setApellido2("Cruz");
            u1.setUsername("admin"); u1.setEmail("admin@gesportin.local"); u1.setPassword(PASSWORD_AUSIAS);
            u1.setFechaAlta(LocalDateTime.now()); u1.setGenero(0);
            u1.setTipousuario(tipo1); u1.setRolusuario(rol1); u1.setClub(club1);
            oUsuarioRepository.save(u1);
            count++;

            UsuarioEntity u2 = new UsuarioEntity();
            u2.setNombre("Maria"); u2.setApellido1("García"); u2.setApellido2("López");
            u2.setUsername("clubadmin"); u2.setEmail("clubadmin@gesportin.local"); u2.setPassword(PASSWORD_AUSIAS);
            u2.setFechaAlta(LocalDateTime.now()); u2.setGenero(1);
            u2.setTipousuario(tipo2); u2.setRolusuario(rol1); u2.setClub(club1);
            oUsuarioRepository.save(u2);
            count++;

            UsuarioEntity u3 = new UsuarioEntity();
            u3.setNombre("Carla"); u3.setApellido1("Sánchez"); u3.setApellido2("Martínez");
            u3.setUsername("usuario"); u3.setEmail("usuario@gesportin.local"); u3.setPassword(PASSWORD_AUSIAS);
            u3.setFechaAlta(LocalDateTime.now()); u3.setGenero(1);
            u3.setTipousuario(tipo3); u3.setRolusuario(rol1); u3.setClub(club1);
            oUsuarioRepository.save(u3);
            count++;

            oUsuarioRepository.flush();
        }

        return count;
    }

    // ────────────────────────────────────────────────────────────────────────────
    // resetAutoIncrements() — NOT @Transactional.
    // ALTER TABLE causes an implicit commit in MySQL, so this must run OUTSIDE
    // any open transaction. For empty tables it resets the counter to 1.
    // For tables with seed rows MySQL silently raises the counter to max(id)+1.
    // ────────────────────────────────────────────────────────────────────────────
    public void resetAutoIncrements() {
        List<String> tables = List.of(
            "compra", "factura", "carrito", "puntuacionart", "comentarioart",
            "puntuacion", "comentario", "pago", "partido", "cuota", "jugador",
            "liga", "equipo", "articulo", "categoria", "tipoarticulo", "noticia",
            "temporada", "usuario", "club", "rolusuario", "estadopartido", "tipousuario"
        );
        for (String table : tables) {
            jdbcTemplate.execute("ALTER TABLE `" + table + "` AUTO_INCREMENT = 1");
        }
    }

}
