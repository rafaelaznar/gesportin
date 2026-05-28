package net.ausiasmarch.gesportin.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.ausiasmarch.gesportin.dto.ClubResumenDTO;
import net.ausiasmarch.gesportin.dto.DeudaMensualDTO;
import net.ausiasmarch.gesportin.dto.DeudaPorEquipoDTO;
import net.ausiasmarch.gesportin.dto.EquipoDetalleDTO;
import net.ausiasmarch.gesportin.dto.EquiposPorCategoriaDTO;
import net.ausiasmarch.gesportin.dto.EstadoPagosDTO;
import net.ausiasmarch.gesportin.dto.IngresoMensualDTO;
import net.ausiasmarch.gesportin.dto.PartidoMensualDTO;
import net.ausiasmarch.gesportin.service.StatsService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/stats")
public class StatsApi {

    @Autowired
    private StatsService oStatsService;

    @GetMapping("/club/{id}/resumen")
    public ResponseEntity<ClubResumenDTO> obtenerResumen(
            @PathVariable Long id,
            @RequestParam Long temporada) {
        return ResponseEntity.ok(oStatsService.obtenerResumen(id, temporada));
    }

    @GetMapping("/club/{id}/pagos-estado")
    public ResponseEntity<EstadoPagosDTO> obtenerEstadoPagos(
            @PathVariable Long id,
            @RequestParam Long temporada) {
        return ResponseEntity.ok(oStatsService.obtenerEstadoPagos(id, temporada));
    }

    @GetMapping("/club/{id}/equipos-por-categoria")
    public ResponseEntity<List<EquiposPorCategoriaDTO>> obtenerEquiposPorCategoria(
            @PathVariable Long id,
            @RequestParam Long temporada) {
        return ResponseEntity.ok(oStatsService.obtenerEquiposPorCategoria(id, temporada));
    }

    @GetMapping("/club/{id}/partidos-mensuales")
    public ResponseEntity<List<PartidoMensualDTO>> obtenerPartidosMensuales(
            @PathVariable Long id,
            @RequestParam Long temporada) {
        return ResponseEntity.ok(oStatsService.obtenerPartidosMensuales(id, temporada));
    }

    @GetMapping("/club/{id}/ingresos-mensuales")
    public ResponseEntity<List<IngresoMensualDTO>> obtenerIngresosMensuales(
            @PathVariable Long id,
            @RequestParam Long temporada) {
        return ResponseEntity.ok(oStatsService.obtenerIngresosMensuales(id, temporada));
    }

    @GetMapping("/club/{id}/deuda-por-equipo")
    public ResponseEntity<List<DeudaPorEquipoDTO>> obtenerDeudaPorEquipo(
            @PathVariable Long id,
            @RequestParam Long temporada) {
        return ResponseEntity.ok(oStatsService.obtenerDeudaPorEquipo(id, temporada));
    }

    @GetMapping("/club/{id}/deuda-mensual")
    public ResponseEntity<List<DeudaMensualDTO>> obtenerDeudaMensual(
            @PathVariable Long id,
            @RequestParam Long temporada) {
        return ResponseEntity.ok(oStatsService.obtenerDeudaMensual(id, temporada));
    }

    @GetMapping("/club/{id}/equipos-detalle")
    public ResponseEntity<List<EquipoDetalleDTO>> obtenerEquiposDetalle(
            @PathVariable Long id,
            @RequestParam Long temporada) {
        return ResponseEntity.ok(oStatsService.obtenerEquiposDetalle(id, temporada));
    }
}
