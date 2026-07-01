package net.ausiasmarch.gesportin.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import net.ausiasmarch.gesportin.entity.ArticuloEntity;
import net.ausiasmarch.gesportin.entity.CarritoEntity;
import net.ausiasmarch.gesportin.entity.CategoriaEntity;
import net.ausiasmarch.gesportin.entity.ClubEntity;
import net.ausiasmarch.gesportin.entity.ComentarioEntity;
import net.ausiasmarch.gesportin.entity.ComentarioartEntity;
import net.ausiasmarch.gesportin.entity.CompraEntity;
import net.ausiasmarch.gesportin.entity.CuotaEntity;
import net.ausiasmarch.gesportin.entity.EquipoEntity;
import net.ausiasmarch.gesportin.entity.FacturaEntity;
import net.ausiasmarch.gesportin.entity.JugadorEntity;
import net.ausiasmarch.gesportin.entity.LigaEntity;
import net.ausiasmarch.gesportin.entity.NoticiaEntity;
import net.ausiasmarch.gesportin.entity.PagoEntity;
import net.ausiasmarch.gesportin.entity.PartidoEntity;
import net.ausiasmarch.gesportin.entity.PuntuacionEntity;
import net.ausiasmarch.gesportin.entity.PuntuacionartEntity;
import net.ausiasmarch.gesportin.entity.RolusuarioEntity;
import net.ausiasmarch.gesportin.entity.TemporadaEntity;
import net.ausiasmarch.gesportin.entity.TipoarticuloEntity;
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
import net.ausiasmarch.gesportin.repository.EstadopartidoRepository;
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

    @Autowired
    private AleatorioService oAleatorioService;

    private final Random random = new Random();

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

        // club columns dirección / teléfono have accented names — backtick-escaping
        entityManager.createNativeQuery(
                "INSERT INTO club (id, nombre, `dirección`, `teléfono`, fecha_alta, imagen) " +
                "VALUES (1, 'Gesportin', 'Calle Principal, 1', '600000001', NOW(), '')")
                .executeUpdate();

        entityManager.createNativeQuery(
                "INSERT INTO usuario " +
                "(id, nombre, apellido1, apellido2, username, password, fecha_alta, genero, " +
                " id_tipousuario, id_rolusuario, id_club) VALUES " +
                "(1, 'Jose',  'Gutiérrez', 'Cruz',     'admin',     :pwd, NOW(), 0, 1, 1, 1), " +
                "(2, 'Maria', 'García',    'López',    'clubadmin', :pwd, NOW(), 1, 2, 1, 1), " +
                "(3, 'Carla', 'Sánchez',   'Martínez', 'usuario',   :pwd, NOW(), 1, 3, 1, 1)")
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
            u1.setUsername("admin"); u1.setPassword(PASSWORD_AUSIAS);
            u1.setFechaAlta(LocalDateTime.now()); u1.setGenero(0);
            u1.setTipousuario(tipo1); u1.setRolusuario(rol1); u1.setClub(club1);
            oUsuarioRepository.save(u1);
            count++;

            UsuarioEntity u2 = new UsuarioEntity();
            u2.setNombre("Maria"); u2.setApellido1("García"); u2.setApellido2("López");
            u2.setUsername("clubadmin"); u2.setPassword(PASSWORD_AUSIAS);
            u2.setFechaAlta(LocalDateTime.now()); u2.setGenero(1);
            u2.setTipousuario(tipo2); u2.setRolusuario(rol1); u2.setClub(club1);
            oUsuarioRepository.save(u2);
            count++;

            UsuarioEntity u3 = new UsuarioEntity();
            u3.setNombre("Carla"); u3.setApellido1("Sánchez"); u3.setApellido2("Martínez");
            u3.setUsername("usuario"); u3.setPassword(PASSWORD_AUSIAS);
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

    // ────────────────────────────────────────────────────────────────────────────
    // generateData() — centralized data generation. Does NOT reset.
    // For each 1:N relationship, creates n(d) child records per parent,
    // where d = distance from Club in the FK chain, n(d) = max(2, 12-2d).
    // d=1→10, d=2→8, d=3→6, d=4→4, d=5→2.
    @Transactional
    public Map<String, Long> generateData() {
        oSessionService.requireAdmin();

        // Helper: records per parent based on distance from Club
        java.util.function.IntUnaryOperator perParent = d -> Math.max(2, 12 - 2 * d);

        Map<String, Long> counts = new LinkedHashMap<>();

        // Load system data references (peripheral tables — not subject to 10x)
        List<TipousuarioEntity> tipousuarios = oTipousuarioRepository.findAll();
        List<RolusuarioEntity> roles = oRolusuarioRepository.findAll();
        while (roles.size() < 12) {
            RolusuarioEntity r = new RolusuarioEntity();
            r.setDescripcion(oAleatorioService.getDescripcionRol(roles.size()));
            r = oRolusuarioRepository.save(r);
            roles.add(r);
        }

        // ── Utility: create a user for a club ─────────────────────────────────
        java.util.function.BiFunction<ClubEntity, Integer, UsuarioEntity> createUser =
                (club, idx) -> {
            boolean esHombre = random.nextBoolean();
            String nombre = esHombre ? oAleatorioService.getNombreVaronAleatorio()
                                     : oAleatorioService.getNombreMujerAleatorio();
            String apellido1 = oAleatorioService.getApellidoAleatorio();
            String apellido2 = oAleatorioService.getApellidoAleatorio();
            UsuarioEntity u = new UsuarioEntity();
            u.setNombre(nombre);
            u.setApellido1(apellido1);
            u.setApellido2(apellido2);
            u.setUsername(oAleatorioService.eliminarAcentos(
                    (nombre.charAt(0) + apellido1).toLowerCase()) + "_" + club.getId() + "_" + idx);
            u.setPassword(PASSWORD_AUSIAS);
            u.setFechaAlta(LocalDateTime.now().minusDays(random.nextInt(365 * 3)));
            u.setGenero(esHombre ? 0 : 1);
            u.setTipousuario(idx < 2
                    ? tipousuarios.stream().filter(t -> t.getId() == 2L).findFirst().orElse(tipousuarios.get(0))
                    : tipousuarios.stream().filter(t -> t.getId() == 3L).findFirst().orElse(tipousuarios.get(0)));
            u.setRolusuario(roles.get(random.nextInt(roles.size())));
            u.setClub(club);
            return u;
        };

        String[] years = {"2019/2020","2020/2021","2021/2022","2022/2023","2023/2024",
                          "2024/2025","2025/2026","2026/2027","2027/2028","2028/2029"};
        String[] catNames = {"Querubín","Pre-benjamín","Benjamín","Alevín","Infantil",
                             "Cadete","Juvenil","Amateur","Senior","Veterano"};
        String[] posiciones = {"Portero","Defensa","Centrocampista","Delantero",
                               "Lateral izquierdo","Lateral derecho","Mediapunta",
                               "Extremo","Defensa central","Pivote"};

        // ── Level 0: Ensure 10 clubs ──────────────────────────────────────────
        List<ClubEntity> clubs = new ArrayList<>(oClubRepository.findAll());
        long newClubs = 0;
        while (clubs.size() < 10) {
            ClubEntity c = new ClubEntity();
            c.setNombre("Club " + oAleatorioService.generarNombreEquipoAleatorio());
            c.setDireccion("Calle " + oAleatorioService.getNombreLigaAleatorio() + " " + (random.nextInt(100)+1));
            c.setTelefono(String.valueOf(600000000 + random.nextInt(99999999)));
            c.setFechaAlta(LocalDateTime.now().minusDays(random.nextInt(365*5)));
            c.setImagen(new byte[0]);
            c = oClubRepository.save(c);
            clubs.add(c);
            newClubs++;
        }
        clubs = clubs.subList(0, 10);
        counts.put("clubs", newClubs);

        // ── Level 1: Club → Temporada (d=1 → 10 per club) ──────────────────
        int c1 = perParent.applyAsInt(1);
        List<TemporadaEntity> allTemporadas = new ArrayList<>();
        for (ClubEntity club : clubs) {
            for (int t = 0; t < c1; t++) {
                TemporadaEntity te = new TemporadaEntity();
                te.setDescripcion(years[t]);
                te.setClub(club);
                allTemporadas.add(oTemporadaRepository.save(te));
            }
        }
        counts.put("temporadas", (long) allTemporadas.size());

        // ── Level 2: Temporada → Categoria (d=2 → 4 per temporada, fewer) ──
        int c2 = perParent.applyAsInt(2);
        int catPerTemporada = Math.max(2, c2 - 4);
        List<CategoriaEntity> allCategorias = new ArrayList<>();
        for (TemporadaEntity temp : allTemporadas) {
            for (int cat = 0; cat < catPerTemporada; cat++) {
                CategoriaEntity ca = new CategoriaEntity();
                ca.setNombre(catNames[cat] + " " + temp.getDescripcion());
                ca.setTemporada(temp);
                allCategorias.add(oCategoriaRepository.save(ca));
            }
        }
        counts.put("categorias", (long) allCategorias.size());

        // ── Level 1b: Club → Usuario (d=1 → 10 per club) ── before Equipos ─
        Map<Long, List<UsuarioEntity>> usersByClub = new LinkedHashMap<>();
        long totalUsers = 0;
        for (ClubEntity club : clubs) {
            List<UsuarioEntity> existing = oUsuarioRepository.findByClubId(club.getId(),
                    org.springframework.data.domain.PageRequest.of(0, 1000)).getContent();
            List<UsuarioEntity> list = new ArrayList<>(existing);
            while (list.size() < c1) {
                UsuarioEntity u = createUser.apply(club, list.size());
                list.add(oUsuarioRepository.save(u));
                totalUsers++;
            }
            usersByClub.put(club.getId(), list);
        }
        counts.put("usuarios", totalUsers);

        // ── Level 3: Categoria → Equipo (d=3 → 6 per categoria) ─────────────
        int c3 = perParent.applyAsInt(3);
        Map<Long, List<EquipoEntity>> equiposByClub = new LinkedHashMap<>();
        for (ClubEntity club : clubs) equiposByClub.put(club.getId(), new ArrayList<>());

        List<EquipoEntity> allEquipos = new ArrayList<>();
        for (CategoriaEntity cat : allCategorias) {
            Long clubId = cat.getTemporada().getClub().getId();
            UsuarioEntity entrenador = usersByClub.get(clubId).stream()
                    .filter(u -> u.getTipousuario().getId() == 2L)
                    .findFirst().orElse(usersByClub.get(clubId).get(0));
            for (int e = 0; e < c3; e++) {
                EquipoEntity eq = new EquipoEntity();
                eq.setNombre(oAleatorioService.generarNombreEquipoAleatorio());
                eq.setCategoria(cat);
                eq.setEntrenador(entrenador);
                eq = oEquipoRepository.save(eq);
                allEquipos.add(eq);
                equiposByClub.get(clubId).add(eq);
            }
        }
        counts.put("equipos", (long) allEquipos.size());

        // ── Level 4a: Equipo → Liga (d=4 → 4 per equipo) ──────────────────
        int c4 = perParent.applyAsInt(4);
        List<LigaEntity> allLigas = new ArrayList<>();
        for (EquipoEntity eq : allEquipos) {
            for (int l = 0; l < c4; l++) {
                LigaEntity li = new LigaEntity();
                li.setNombre(oAleatorioService.getNombreLigaCompuestoAleatorio());
                li.setEquipo(eq);
                allLigas.add(oLigaRepository.save(li));
            }
        }
        counts.put("ligas", (long) allLigas.size());

        // ── Level 4b: Equipo → Cuota (d=4 → 4 per equipo) ─────────────────
        List<CuotaEntity> allCuotas = new ArrayList<>();
        for (EquipoEntity eq : allEquipos) {
            for (int cu = 0; cu < c4; cu++) {
                CuotaEntity co = new CuotaEntity();
                co.setDescripcion("Cuota " + (cu+1) + " equipo " + eq.getNombre());
                co.setCantidad(new BigDecimal(oAleatorioService.generarNumeroAleatorioDecimalEnRango(20.0, 80.0)));
                co.setFecha(LocalDateTime.now().minusDays(random.nextInt(365)));
                co.setEquipo(eq);
                allCuotas.add(oCuotaRepository.save(co));
            }
        }
        counts.put("cuotas", (long) allCuotas.size());

        // ── Level 5: Equipo → Jugador (d=4 → 2 per equipo, fewer to distribute evenly) ─
        int jugPerEquipo = Math.max(2, c4 - 2);
        Map<Long, List<JugadorEntity>> jugadoresByClub = new LinkedHashMap<>();
        for (ClubEntity club : clubs) jugadoresByClub.put(club.getId(), new ArrayList<>());

        int eqIdx = 0;
        for (EquipoEntity eq : allEquipos) {
            Long clubId = eq.getCategoria().getTemporada().getClub().getId();
            List<UsuarioEntity> clubUsers = usersByClub.get(clubId);
            for (int j = 0; j < jugPerEquipo; j++) {
                JugadorEntity ju = new JugadorEntity();
                ju.setDorsal(random.nextInt(99) + 1);
                ju.setPosicion(posiciones[(eqIdx + j) % 10]);
                ju.setCapitan(j == 0);
                ju.setUsuario(clubUsers.get((eqIdx + j) % clubUsers.size()));
                ju.setEquipo(eq);
                ju = oJugadorRepository.save(ju);
                jugadoresByClub.get(clubId).add(ju);
            }
            eqIdx++;
        }
        long totalJugadores = (long) allEquipos.size() * jugPerEquipo;
        counts.put("jugadores", totalJugadores);

        // ── Level 6: Cuota → Pago (d=5 → 2 per cuota) ─────────────────────
        int c5 = perParent.applyAsInt(5);
        // Each pago links a cuota and a jugador of the same club
        for (CuotaEntity cuota : allCuotas) {
            Long clubId = cuota.getEquipo().getCategoria().getTemporada().getClub().getId();
            List<JugadorEntity> clubJugs = jugadoresByClub.get(clubId);
            for (int pg = 0; pg < c5; pg++) {
                PagoEntity pa = new PagoEntity();
                pa.setCuota(cuota);
                pa.setJugador(clubJugs.get(random.nextInt(clubJugs.size())));
                pa.setAbonado(random.nextBoolean());
                pa.setFecha(LocalDateTime.now().minusDays(random.nextInt(180)));
                oPagoRepository.save(pa);
            }
        }
        counts.put("pagos", (long) allCuotas.size() * c5);

        // ── Level 7: Liga → Partido (d=5 → 2 per liga) ────────────────────
        for (LigaEntity liga : allLigas) {
            for (int p = 0; p < c5; p++) {
                PartidoEntity pa = new PartidoEntity();
                pa.setRival("Rival " + oAleatorioService.generarNombreEquipoAleatorio());
                pa.setLiga(liga);
                pa.setLocal(random.nextBoolean());
                pa.setResultado(random.nextInt(5) + " - " + random.nextInt(5));
                pa.setFecha(LocalDateTime.now().minusDays(random.nextInt(365)));
                pa.setLugar(oAleatorioService.generarNombreLugarAleatorio());
                pa.setEstadopartido(oEstadopartidoRepository.findById(
                        (long)(random.nextInt(5)+1)).orElse(null));
                pa.setComentario("Partido de liga " + liga.getNombre());
                oPartidoRepository.save(pa);
            }
        }
        counts.put("partidos", (long) allLigas.size() * c5);

        // ── Level 1c: Club → Noticia (d=1 → 10 per club) ──────────────────
        Map<Long, List<NoticiaEntity>> noticiasByClub = new LinkedHashMap<>();
        for (ClubEntity club : clubs) noticiasByClub.put(club.getId(), new ArrayList<>());

        for (ClubEntity club : clubs) {
            for (int n = 0; n < c1; n++) {
                NoticiaEntity no = new NoticiaEntity();
                no.setTitulo("Noticia " + (n+1) + " del " + club.getNombre());
                no.setContenido(oAleatorioService.getFraseNoticiaAleatoria()
                        + " El club " + club.getNombre() + " informa.");
                no.setFecha(LocalDateTime.now().minusDays(random.nextInt(365)));
                no.setClub(club);
                no = oNoticiaRepository.save(no);
                noticiasByClub.get(club.getId()).add(no);
            }
        }
        counts.put("noticias", (long) clubs.size() * c1);

        // ── Level 8: Noticia → Comentario (d=2 → 8 per noticia) ───────────
        for (ClubEntity club : clubs) {
            List<UsuarioEntity> clubUsers = usersByClub.get(club.getId());
            for (NoticiaEntity noticia : noticiasByClub.get(club.getId())) {
                for (int co = 0; co < c2; co++) {
                    ComentarioEntity cm = new ComentarioEntity();
                    cm.setContenido("Comentario " + (co+1) + ": " + noticia.getTitulo());
                    cm.setNoticia(noticia);
                    cm.setUsuario(clubUsers.get(co % clubUsers.size()));
                    oComentarioRepository.save(cm);
                }
            }
        }
        counts.put("comentarios", (long) clubs.size() * c1 * c2);

        // ── Level 9: Noticia → Puntuacion (d=2 → 8 per noticia) ───────────
        for (ClubEntity club : clubs) {
            List<UsuarioEntity> clubUsers = usersByClub.get(club.getId());
            for (NoticiaEntity noticia : noticiasByClub.get(club.getId())) {
                for (int pu = 0; pu < c2; pu++) {
                    PuntuacionEntity pt = new PuntuacionEntity();
                    pt.setPuntuacion(random.nextInt(5) + 1);
                    pt.setNoticia(noticia);
                    pt.setUsuario(clubUsers.get(pu % clubUsers.size()));
                    oPuntuacionRepository.save(pt);
                }
            }
        }
        counts.put("puntuaciones", (long) clubs.size() * c1 * c2);

        // ── Level 1d: Club → Tipoarticulo (d=1 → 10 per club) ──────────────
        Map<Long, List<TipoarticuloEntity>> tiposByClub = new LinkedHashMap<>();
        for (ClubEntity club : clubs) tiposByClub.put(club.getId(), new ArrayList<>());

        for (ClubEntity club : clubs) {
            for (int ta = 0; ta < c1; ta++) {
                TipoarticuloEntity ti = new TipoarticuloEntity();
                ti.setDescripcion(oAleatorioService.getDescripcionTipoArticulo(ta % 50));
                ti.setClub(club);
                ti = oTipoarticuloRepository.save(ti);
                tiposByClub.get(club.getId()).add(ti);
            }
        }
        counts.put("tipoarticulos", (long) clubs.size() * c1);

        // ── Level 10: Tipoarticulo → Articulo (d=2 → 8 per tipoarticulo) ──
        Map<Long, List<ArticuloEntity>> articulosByClub = new LinkedHashMap<>();
        for (ClubEntity club : clubs) articulosByClub.put(club.getId(), new ArrayList<>());

        for (ClubEntity club : clubs) {
            for (TipoarticuloEntity tipo : tiposByClub.get(club.getId())) {
                for (int a = 0; a < c2; a++) {
                    ArticuloEntity ar = new ArticuloEntity();
                    ar.setDescripcion(oAleatorioService.getDescripcionArticulo());
                    ar.setPrecio(new BigDecimal(oAleatorioService.generarNumeroAleatorioDecimalEnRango(5.0, 150.0)));
                    ar.setDescuento(random.nextDouble() < 0.3
                            ? new BigDecimal(oAleatorioService.generarNumeroAleatorioDecimalEnRango(5.0, 30.0)) : null);
                    ar.setTipoarticulo(tipo);
                    ar = oArticuloRepository.save(ar);
                    articulosByClub.get(club.getId()).add(ar);
                }
            }
        }
        counts.put("articulos", (long) clubs.size() * c1 * c2);

        // ── Level 11a: Articulo → Comentarioart (d=3 → 6 per articulo) ────
        for (ClubEntity club : clubs) {
            List<UsuarioEntity> clubUsers = usersByClub.get(club.getId());
            List<ArticuloEntity> arts = articulosByClub.get(club.getId());
            for (int i = 0; i < arts.size(); i++) {
                for (int ca = 0; ca < c3; ca++) {
                    ComentarioartEntity cm = new ComentarioartEntity();
                    cm.setContenido("Comentario art. " + (ca+1) + " del " + club.getNombre());
                    cm.setArticulo(arts.get(i));
                    cm.setUsuario(clubUsers.get((i + ca) % clubUsers.size()));
                    oComentarioartRepository.save(cm);
                }
            }
        }
        counts.put("comentarioarts", (long) clubs.size() * c1 * c2 * c3);

        // ── Level 11b: Articulo → Puntuacionart (d=3 → 6 per articulo) ────
        for (ClubEntity club : clubs) {
            List<UsuarioEntity> clubUsers = usersByClub.get(club.getId());
            List<ArticuloEntity> arts = articulosByClub.get(club.getId());
            for (int i = 0; i < arts.size(); i++) {
                for (int pa = 0; pa < c3; pa++) {
                    PuntuacionartEntity pt = new PuntuacionartEntity();
                    pt.setPuntuacion(random.nextInt(5) + 1);
                    pt.setArticulo(arts.get(i));
                    pt.setUsuario(clubUsers.get((i + pa + 3) % clubUsers.size()));
                    oPuntuacionartRepository.save(pt);
                }
            }
        }
        counts.put("puntuacionarts", (long) clubs.size() * c1 * c2 * c3);

        // ── Level 11c: Articulo → Carrito (d=3 → 6 per articulo) ──────────
        for (ClubEntity club : clubs) {
            List<UsuarioEntity> clubUsers = usersByClub.get(club.getId());
            List<ArticuloEntity> arts = articulosByClub.get(club.getId());
            for (int i = 0; i < arts.size(); i++) {
                for (int cr = 0; cr < c3; cr++) {
                    CarritoEntity ca = new CarritoEntity();
                    ca.setCantidad(random.nextInt(5) + 1);
                    ca.setArticulo(arts.get(i));
                    ca.setUsuario(clubUsers.get((i + cr + 5) % clubUsers.size()));
                    oCarritoRepository.save(ca);
                }
            }
        }
        counts.put("carritos", (long) clubs.size() * c1 * c2 * c3);

        // ── Level 12: Usuario → Factura (d=2 → 8 per usuario) ──────────────
        Map<Long, List<FacturaEntity>> facturasByClub = new LinkedHashMap<>();
        for (ClubEntity club : clubs) facturasByClub.put(club.getId(), new ArrayList<>());

        for (ClubEntity club : clubs) {
            for (UsuarioEntity user : usersByClub.get(club.getId())) {
                for (int f = 0; f < c2; f++) {
                    FacturaEntity fa = new FacturaEntity();
                    fa.setFecha(LocalDateTime.now().minusDays(random.nextInt(365)));
                    fa.setUsuario(user);
                    fa = oFacturaRepository.save(fa);
                    facturasByClub.get(club.getId()).add(fa);
                }
            }
        }
        counts.put("facturas", (long) clubs.size() * c1 * c2);

        // ── Level 13: Factura → Compra (d=3 → 6 per factura) ───────────────
        // Each compra links a factura and an articulo of the same club
        for (ClubEntity club : clubs) {
            List<ArticuloEntity> arts = articulosByClub.get(club.getId());
            for (FacturaEntity factura : facturasByClub.get(club.getId())) {
                for (int cp = 0; cp < c3; cp++) {
                    CompraEntity co = new CompraEntity();
                    co.setCantidad(random.nextInt(3) + 1);
                    co.setFactura(factura);
                    ArticuloEntity art = arts.get(random.nextInt(arts.size()));
                    co.setArticulo(art);
                    co.setPrecio(art.getPrecio().doubleValue());
                    oCompraRepository.save(co);
                }
            }
        }
        counts.put("compras", (long) clubs.size() * c1 * c2 * c3);

        return counts;
    }

}
