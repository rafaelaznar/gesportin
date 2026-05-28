package net.ausiasmarch.gesportin.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import net.ausiasmarch.gesportin.dto.ClubResumenDTO;
import net.ausiasmarch.gesportin.dto.DeudaMensualDTO;
import net.ausiasmarch.gesportin.dto.DeudaPorEquipoDTO;
import net.ausiasmarch.gesportin.dto.EquipoDetalleDTO;
import net.ausiasmarch.gesportin.dto.EquiposPorCategoriaDTO;
import net.ausiasmarch.gesportin.dto.EstadoPagosDTO;
import net.ausiasmarch.gesportin.dto.IngresoMensualDTO;
import net.ausiasmarch.gesportin.dto.PartidoMensualDTO;
import net.ausiasmarch.gesportin.entity.TemporadaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.TemporadaRepository;

@Service
public class StatsService {

    @PersistenceContext
    private EntityManager oEntityManager;

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private TemporadaRepository oTemporadaRepository;

    private void verificarAcceso(Long idClub, Long idTemporada) {
        if (oSessionService.isUsuario() || !oSessionService.isSessionActive()) {
            throw new UnauthorizedException("Acceso denegado: se requieren permisos de administrador");
        }
        if (oSessionService.isEquipoAdmin()) {
            oSessionService.checkSameClub(idClub);
        }
        if (idTemporada == null || idTemporada <= 0) {
            return;
        }
        TemporadaEntity temporada = oTemporadaRepository.findById(idTemporada)
                .orElseThrow(() -> new ResourceNotFoundException("Temporada no encontrada con id: " + idTemporada));
        if (!temporada.getClub().getId().equals(idClub)) {
            throw new ResourceNotFoundException("La temporada no pertenece al club indicado");
        }
    }

    private Long toLong(Object value) {
        if (value == null) return 0L;
        return ((Number) value).longValue();
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) return BigDecimal.ZERO;
        if (value instanceof BigDecimal bd) return bd;
        return BigDecimal.valueOf(((Number) value).doubleValue());
    }

    public ClubResumenDTO obtenerResumen(Long idClub, Long idTemporada) {
        verificarAcceso(idClub, idTemporada);

        Long totalJugadores = toLong(oEntityManager.createNativeQuery("""
                SELECT COUNT(j.id) FROM jugador j
                JOIN equipo e ON j.id_equipo = e.id
                JOIN categoria c ON e.id_categoria = c.id
                JOIN temporada t ON c.id_temporada = t.id
                WHERE t.id_club = :idClub
                  AND (:idTemporada <= 0 OR c.id_temporada = :idTemporada)
                """)
                .setParameter("idClub", idClub)
                .setParameter("idTemporada", idTemporada == null ? 0L : idTemporada)
                .getSingleResult());

        Long totalEquipos = toLong(oEntityManager.createNativeQuery("""
                SELECT COUNT(e.id) FROM equipo e
                JOIN categoria c ON e.id_categoria = c.id
                JOIN temporada t ON c.id_temporada = t.id
                WHERE t.id_club = :idClub
                  AND (:idTemporada <= 0 OR c.id_temporada = :idTemporada)
                """)
                .setParameter("idClub", idClub)
                .setParameter("idTemporada", idTemporada == null ? 0L : idTemporada)
                .getSingleResult());

        Long totalPartidos = toLong(oEntityManager.createNativeQuery("""
                SELECT COUNT(p.id) FROM partido p
                JOIN liga l ON p.id_liga = l.id
                JOIN equipo e ON l.id_equipo = e.id
                JOIN categoria c ON e.id_categoria = c.id
                JOIN temporada t ON c.id_temporada = t.id
                WHERE t.id_club = :idClub
                  AND (:idTemporada <= 0 OR c.id_temporada = :idTemporada)
                """)
                .setParameter("idClub", idClub)
                .setParameter("idTemporada", idTemporada == null ? 0L : idTemporada)
                .getSingleResult());

        Long totalNoticias = toLong(oEntityManager.createNativeQuery("""
                SELECT COUNT(n.id) FROM noticia n
                WHERE n.id_club = :idClub
                """)
                .setParameter("idClub", idClub)
                .getSingleResult());

        Long totalPagos = toLong(oEntityManager.createNativeQuery("""
                SELECT COUNT(p.id) FROM pago p
                JOIN cuota cu ON p.id_cuota = cu.id
                JOIN equipo e ON cu.id_equipo = e.id
                JOIN categoria c ON e.id_categoria = c.id
                JOIN temporada t ON c.id_temporada = t.id
                WHERE t.id_club = :idClub
                  AND (:idTemporada <= 0 OR c.id_temporada = :idTemporada)
                """)
                .setParameter("idClub", idClub)
                .setParameter("idTemporada", idTemporada == null ? 0L : idTemporada)
                .getSingleResult());

        BigDecimal totalPagosRecibidos = toBigDecimal(oEntityManager.createNativeQuery("""
                SELECT COALESCE(SUM(cu.cantidad), 0) FROM pago p
                JOIN cuota cu ON p.id_cuota = cu.id
                JOIN equipo e ON cu.id_equipo = e.id
                JOIN categoria c ON e.id_categoria = c.id
                JOIN temporada t ON c.id_temporada = t.id
                WHERE t.id_club = :idClub
                  AND (:idTemporada <= 0 OR c.id_temporada = :idTemporada)
                  AND p.abonado = 1
                """)
                .setParameter("idClub", idClub)
                .setParameter("idTemporada", idTemporada == null ? 0L : idTemporada)
                .getSingleResult());

        BigDecimal totalDeudas = toBigDecimal(oEntityManager.createNativeQuery("""
                SELECT COALESCE(SUM(cu.cantidad), 0) FROM pago p
                JOIN cuota cu ON p.id_cuota = cu.id
                JOIN equipo e ON cu.id_equipo = e.id
                JOIN categoria c ON e.id_categoria = c.id
                JOIN temporada t ON c.id_temporada = t.id
                WHERE t.id_club = :idClub
                  AND (:idTemporada <= 0 OR c.id_temporada = :idTemporada)
                  AND p.abonado = 0
                """)
                .setParameter("idClub", idClub)
                .setParameter("idTemporada", idTemporada == null ? 0L : idTemporada)
                .getSingleResult());

        Long partidosJugados = toLong(oEntityManager.createNativeQuery("""
                SELECT COUNT(p.id) FROM partido p
                JOIN liga l ON p.id_liga = l.id
                JOIN equipo e ON l.id_equipo = e.id
                JOIN categoria c ON e.id_categoria = c.id
                JOIN temporada t ON c.id_temporada = t.id
                WHERE t.id_club = :idClub
                  AND (:idTemporada <= 0 OR c.id_temporada = :idTemporada)
                  AND p.id_estadopartido IN (3, 4, 5)
                """)
                .setParameter("idClub", idClub)
                .setParameter("idTemporada", idTemporada == null ? 0L : idTemporada)
                .getSingleResult());

        Long partidosPendientes = toLong(oEntityManager.createNativeQuery("""
                SELECT COUNT(p.id) FROM partido p
                JOIN liga l ON p.id_liga = l.id
                JOIN equipo e ON l.id_equipo = e.id
                JOIN categoria c ON e.id_categoria = c.id
                JOIN temporada t ON c.id_temporada = t.id
                WHERE t.id_club = :idClub
                  AND (:idTemporada <= 0 OR c.id_temporada = :idTemporada)
                  AND p.id_estadopartido IN (1, 2)
                """)
                .setParameter("idClub", idClub)
                .setParameter("idTemporada", idTemporada == null ? 0L : idTemporada)
                .getSingleResult());

        return new ClubResumenDTO(
                totalJugadores, totalEquipos, totalPartidos, totalNoticias, totalPagos,
                totalPagosRecibidos, totalDeudas, partidosJugados, partidosPendientes);
    }

    public EstadoPagosDTO obtenerEstadoPagos(Long idClub, Long idTemporada) {
        verificarAcceso(idClub, idTemporada);

        Long pagados = toLong(oEntityManager.createNativeQuery("""
                SELECT COUNT(p.id) FROM pago p
                JOIN cuota cu ON p.id_cuota = cu.id
                JOIN equipo e ON cu.id_equipo = e.id
                JOIN categoria c ON e.id_categoria = c.id
                JOIN temporada t ON c.id_temporada = t.id
                WHERE t.id_club = :idClub
                  AND (:idTemporada <= 0 OR c.id_temporada = :idTemporada)
                  AND p.abonado = 1
                """)
                .setParameter("idClub", idClub)
                .setParameter("idTemporada", idTemporada == null ? 0L : idTemporada)
                .getSingleResult());

        Long pendientes = toLong(oEntityManager.createNativeQuery("""
                SELECT COUNT(p.id) FROM pago p
                JOIN cuota cu ON p.id_cuota = cu.id
                JOIN equipo e ON cu.id_equipo = e.id
                JOIN categoria c ON e.id_categoria = c.id
                JOIN temporada t ON c.id_temporada = t.id
                WHERE t.id_club = :idClub
                  AND (:idTemporada <= 0 OR c.id_temporada = :idTemporada)
                  AND p.abonado = 0
                """)
                .setParameter("idClub", idClub)
                .setParameter("idTemporada", idTemporada == null ? 0L : idTemporada)
                .getSingleResult());

        return new EstadoPagosDTO(pagados, pendientes);
    }

    @SuppressWarnings("unchecked")
    public List<EquiposPorCategoriaDTO> obtenerEquiposPorCategoria(Long idClub, Long idTemporada) {
        verificarAcceso(idClub, idTemporada);

        Query query = oEntityManager.createNativeQuery("""
                SELECT c.nombre AS categoria, COUNT(e.id) AS totalEquipos
                FROM equipo e
                JOIN categoria c ON e.id_categoria = c.id
                JOIN temporada t ON c.id_temporada = t.id
                WHERE t.id_club = :idClub
                  AND (:idTemporada <= 0 OR c.id_temporada = :idTemporada)
                GROUP BY c.id, c.nombre
                ORDER BY c.nombre
                """)
                .setParameter("idClub", idClub)
                .setParameter("idTemporada", idTemporada == null ? 0L : idTemporada);

        List<Object[]> filas = query.getResultList();
        List<EquiposPorCategoriaDTO> resultado = new ArrayList<>();
        for (Object[] fila : filas) {
            resultado.add(new EquiposPorCategoriaDTO((String) fila[0], toLong(fila[1])));
        }
        return resultado;
    }

    @SuppressWarnings("unchecked")
    public List<PartidoMensualDTO> obtenerPartidosMensuales(Long idClub, Long idTemporada) {
        verificarAcceso(idClub, idTemporada);

        Query query = oEntityManager.createNativeQuery("""
                SELECT DATE_FORMAT(p.fecha, '%Y-%m') AS mes,
                       COUNT(p.id) AS jugados,
                       SUM(CASE WHEN p.id_estadopartido = 3 THEN 1 ELSE 0 END) AS victorias
                FROM partido p
                JOIN liga l ON p.id_liga = l.id
                JOIN equipo e ON l.id_equipo = e.id
                JOIN categoria c ON e.id_categoria = c.id
                JOIN temporada t ON c.id_temporada = t.id
                WHERE t.id_club = :idClub
                  AND (:idTemporada <= 0 OR c.id_temporada = :idTemporada)
                GROUP BY DATE_FORMAT(p.fecha, '%Y-%m')
                ORDER BY mes
                """)
                .setParameter("idClub", idClub)
                .setParameter("idTemporada", idTemporada == null ? 0L : idTemporada);

        List<Object[]> filas = query.getResultList();
        List<PartidoMensualDTO> resultado = new ArrayList<>();
        for (Object[] fila : filas) {
            resultado.add(new PartidoMensualDTO((String) fila[0], toLong(fila[1]), toLong(fila[2])));
        }
        return resultado;
    }

    @SuppressWarnings("unchecked")
    public List<IngresoMensualDTO> obtenerIngresosMensuales(Long idClub, Long idTemporada) {
        verificarAcceso(idClub, idTemporada);

        Query query = oEntityManager.createNativeQuery("""
                SELECT DATE_FORMAT(p.fecha, '%Y-%m') AS mes,
                       COALESCE(SUM(cu.cantidad), 0) AS total
                FROM pago p
                JOIN cuota cu ON p.id_cuota = cu.id
                JOIN equipo e ON cu.id_equipo = e.id
                JOIN categoria c ON e.id_categoria = c.id
                JOIN temporada t ON c.id_temporada = t.id
                WHERE t.id_club = :idClub
                  AND (:idTemporada <= 0 OR c.id_temporada = :idTemporada)
                  AND p.abonado = 1
                GROUP BY DATE_FORMAT(p.fecha, '%Y-%m')
                ORDER BY mes
                """)
                .setParameter("idClub", idClub)
                .setParameter("idTemporada", idTemporada == null ? 0L : idTemporada);

        List<Object[]> filas = query.getResultList();
        List<IngresoMensualDTO> resultado = new ArrayList<>();
        for (Object[] fila : filas) {
            resultado.add(new IngresoMensualDTO((String) fila[0], toBigDecimal(fila[1])));
        }
        return resultado;
    }

    @SuppressWarnings("unchecked")
    public List<DeudaPorEquipoDTO> obtenerDeudaPorEquipo(Long idClub, Long idTemporada) {
        verificarAcceso(idClub, idTemporada);

        Query query = oEntityManager.createNativeQuery("""
                SELECT e.nombre AS equipo,
                       COALESCE(SUM(cu.cantidad), 0) AS deuda
                FROM pago p
                JOIN cuota cu ON p.id_cuota = cu.id
                JOIN equipo e ON cu.id_equipo = e.id
                JOIN categoria c ON e.id_categoria = c.id
                JOIN temporada t ON c.id_temporada = t.id
                WHERE t.id_club = :idClub
                  AND (:idTemporada <= 0 OR c.id_temporada = :idTemporada)
                  AND p.abonado = 0
                GROUP BY e.id, e.nombre
                ORDER BY deuda DESC
                """)
                .setParameter("idClub", idClub)
                .setParameter("idTemporada", idTemporada == null ? 0L : idTemporada);

        List<Object[]> filas = query.getResultList();
        List<DeudaPorEquipoDTO> resultado = new ArrayList<>();
        for (Object[] fila : filas) {
            resultado.add(new DeudaPorEquipoDTO((String) fila[0], toBigDecimal(fila[1])));
        }
        return resultado;
    }

    @SuppressWarnings("unchecked")
    public List<DeudaMensualDTO> obtenerDeudaMensual(Long idClub, Long idTemporada) {
        verificarAcceso(idClub, idTemporada);

        Query query = oEntityManager.createNativeQuery("""
                SELECT DATE_FORMAT(p.fecha, '%Y-%m') AS mes,
                       COALESCE(SUM(cu.cantidad), 0) AS total
                FROM pago p
                JOIN cuota cu ON p.id_cuota = cu.id
                JOIN equipo e ON cu.id_equipo = e.id
                JOIN categoria c ON e.id_categoria = c.id
                JOIN temporada t ON c.id_temporada = t.id
                WHERE t.id_club = :idClub
                  AND (:idTemporada <= 0 OR c.id_temporada = :idTemporada)
                  AND p.abonado = 0
                GROUP BY DATE_FORMAT(p.fecha, '%Y-%m')
                ORDER BY mes
                """)
                .setParameter("idClub", idClub)
                .setParameter("idTemporada", idTemporada == null ? 0L : idTemporada);

        List<Object[]> filas = query.getResultList();
        List<DeudaMensualDTO> resultado = new ArrayList<>();
        for (Object[] fila : filas) {
            resultado.add(new DeudaMensualDTO((String) fila[0], toBigDecimal(fila[1])));
        }
        return resultado;
    }

    @SuppressWarnings("unchecked")
    public List<EquipoDetalleDTO> obtenerEquiposDetalle(Long idClub, Long idTemporada) {
        verificarAcceso(idClub, idTemporada);

        Query query = oEntityManager.createNativeQuery("""
                SELECT e.nombre AS equipo,
                       c.nombre AS categoria,
                       (SELECT COUNT(j.id) FROM jugador j WHERE j.id_equipo = e.id) AS numJugadores,
                       (SELECT COUNT(pa.id) FROM partido pa
                          JOIN liga li ON pa.id_liga = li.id
                          WHERE li.id_equipo = e.id
                            AND pa.id_estadopartido IN (3, 4, 5)) AS partidosJugados,
                       (SELECT COUNT(pa.id) FROM partido pa
                          JOIN liga li ON pa.id_liga = li.id
                          WHERE li.id_equipo = e.id
                            AND pa.id_estadopartido = 3) AS victorias
                FROM equipo e
                JOIN categoria c ON e.id_categoria = c.id
                JOIN temporada t ON c.id_temporada = t.id
                WHERE t.id_club = :idClub
                  AND (:idTemporada <= 0 OR c.id_temporada = :idTemporada)
                ORDER BY e.nombre
                """)
                .setParameter("idClub", idClub)
                .setParameter("idTemporada", idTemporada == null ? 0L : idTemporada);

        List<Object[]> filas = query.getResultList();
        List<EquipoDetalleDTO> resultado = new ArrayList<>();
        for (Object[] fila : filas) {
            resultado.add(new EquipoDetalleDTO(
                    (String) fila[0],
                    (String) fila[1],
                    toLong(fila[2]),
                    toLong(fila[3]),
                    toLong(fila[4])));
        }
        return resultado;
    }
}
