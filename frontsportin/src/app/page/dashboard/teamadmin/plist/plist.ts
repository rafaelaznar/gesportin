import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { TreemapController, TreemapElement } from 'chartjs-chart-treemap';
import { BaseChartDirective } from 'ng2-charts';

import { DashboardService } from '../../../../service/dashboard';
import { TemporadaService } from '../../../../service/temporada';
import { SessionService } from '../../../../service/session';
import { ITemporada } from '../../../../model/temporada';
import { IDashboardState } from '../../../../model/dashboard-stats';
import { KpiCardComponent } from '../../../../component/shared/kpi-card/kpi-card';

Chart.register(...registerables, TreemapController, TreemapElement);

@Component({
  selector: 'app-dashboard-teamadmin-plist-page',
  standalone: true,
  imports: [CommonModule, FormsModule, KpiCardComponent, BaseChartDirective],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class DashboardTeamadminPlistPage implements OnInit {
  private dashboardService = inject(DashboardService);
  private temporadaService = inject(TemporadaService);
  private session = inject(SessionService);

  temporadas = signal<ITemporada[]>([]);
  temporadaSel = signal<number | null>(null);
  stats = signal<IDashboardState | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);

  ingresosSparkline = computed(() => {
    const ingresos = this.stats()?.ingresos ?? [];
    return ingresos.slice(-6).map((i) => i.total);
  });

  deudaSparkline = computed(() => {
    const deuda = this.stats()?.deudaMensual ?? [];
    return deuda.slice(-6).map((d) => d.total);
  });

  porcentajeCobranza = computed(() => {
    const e = this.stats()?.pagosEstado;
    if (!e) return 0;
    const total = e.pagados + e.pendientes;
    return total > 0 ? Math.round((e.pagados / total) * 100) : 0;
  });

  // ---- G1: Bar — Equipos por categoría ----
  chartEquiposCategoriaType = 'bar' as const;
  chartEquiposCategoriaData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const datos = this.stats()?.equiposCat ?? [];
    return {
      labels: datos.map((d) => d.categoria),
      datasets: [
        {
          label: 'Equipos',
          data: datos.map((d) => d.totalEquipos),
          backgroundColor: '#0d6efd',
          borderRadius: 6,
        },
      ],
    };
  });
  chartEquiposCategoriaOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  // ---- G2: Doughnut — Estado de pagos ----
  chartPagosEstadoType = 'doughnut' as const;
  chartPagosEstadoData = computed<ChartConfiguration<'doughnut'>['data']>(() => {
    const e = this.stats()?.pagosEstado;
    return {
      labels: ['Pagados', 'Pendientes'],
      datasets: [
        {
          data: [e?.pagados ?? 0, e?.pendientes ?? 0],
          backgroundColor: ['#198754', '#dc3545'],
        },
      ],
    };
  });
  chartPagosEstadoOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  // ---- G3: Grouped Bar — Rendimiento por equipo ----
  chartRendimientoType = 'bar' as const;
  chartRendimientoData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const datos = this.stats()?.equiposDetalle ?? [];
    return {
      labels: datos.map((d) => d.equipo),
      datasets: [
        {
          label: 'Partidos jugados',
          data: datos.map((d) => d.partidosJugados),
          backgroundColor: '#0d6efd',
          borderRadius: 4,
        },
        {
          label: 'Victorias',
          data: datos.map((d) => d.victorias),
          backgroundColor: '#198754',
          borderRadius: 4,
        },
      ],
    };
  });
  chartRendimientoOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  // ---- G4: Horizontal Bar — Pagos recibidos vs. Deuda pendiente ----
  chartPagosResumenType = 'bar' as const;
  chartPagosResumenData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const r = this.stats()?.resumen;
    return {
      labels: ['Recibido', 'Pendiente'],
      datasets: [
        {
          label: 'Importe €',
          data: [
            r ? Number(r.totalPagosRecibidos) : 0,
            r ? Number(r.totalDeudas) : 0,
          ],
          backgroundColor: ['#198754', '#dc3545'],
          borderRadius: 6,
        },
      ],
    };
  });
  chartPagosResumenOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true } },
  };

  // ---- G5: Gauge (doughnut config) — % cobranza ----
  chartCobranzaType = 'doughnut' as const;
  chartCobranzaData = computed<ChartConfiguration<'doughnut'>['data']>(() => {
    const p = this.porcentajeCobranza();
    return {
      labels: ['Cobrado', 'Pendiente'],
      datasets: [
        {
          data: [p, 100 - p],
          backgroundColor: ['#0d6efd', '#e9ecef'],
          borderWidth: 0,
        },
      ],
    };
  });
  chartCobranzaOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    circumference: 180,
    rotation: 270,
    cutout: '75%',
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };

  // ---- G6: Treemap — Deuda por equipo ----
  chartDeudaEquipoType = 'treemap' as any;
  chartDeudaEquipoData = computed<any>(() => {
    const datos = this.stats()?.deudaEquipo ?? [];
    return {
      datasets: [
        {
          tree: datos,
          key: 'deuda',
          labels: {
            display: true,
            color: '#fff',
            font: { weight: 'bold', size: 11 },
            formatter: (ctx: any) => ctx.raw?._data?.equipo ?? '',
          },
          backgroundColor: (ctx: any) => {
            const value = ctx.raw?.v ?? 0;
            const max = Math.max(...datos.map((d) => d.deuda), 1);
            const ratio = value / max;
            return `rgba(220, 53, 69, ${0.4 + ratio * 0.55})`;
          },
          borderColor: '#fff',
          borderWidth: 1,
          spacing: 2,
        },
      ],
    };
  });
  chartDeudaEquipoOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items: any[]) => items[0]?.raw?._data?.equipo ?? '',
          label: (item: any) => `Deuda: ${(item.raw?.v ?? 0).toFixed(2)} €`,
        },
      },
    },
  };

  ngOnInit(): void {
    this.cargarTemporadas();
  }

  private cargarTemporadas(): void {
    this.temporadaService.getPage(0, 100).subscribe({
      next: (page) => {
        this.temporadas.set(page.content);
        if (page.content.length > 0) {
          this.temporadaSel.set(page.content[0].id);
          this.cargarDatos();
        } else {
          this.cargando.set(false);
          this.error.set('No hay temporadas disponibles para tu club');
        }
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('Error al cargar las temporadas');
      },
    });
  }

  alCambiarTemporada(id: number): void {
    this.temporadaSel.set(Number(id));
    this.cargarDatos();
  }

  private cargarDatos(): void {
    const idClub = this.session.getClubId();
    const idTemp = this.temporadaSel();
    if (idClub == null || idTemp == null) return;

    this.cargando.set(true);
    this.error.set(null);

    forkJoin({
      resumen: this.dashboardService.obtenerResumen(idClub, idTemp),
      pagosEstado: this.dashboardService.obtenerEstadoPagos(idClub, idTemp),
      equiposCat: this.dashboardService.obtenerEquiposPorCategoria(idClub, idTemp),
      partidosMes: this.dashboardService.obtenerPartidosMensuales(idClub, idTemp),
      ingresos: this.dashboardService.obtenerIngresosMensuales(idClub, idTemp),
      deudaEquipo: this.dashboardService.obtenerDeudaPorEquipo(idClub, idTemp),
      deudaMensual: this.dashboardService.obtenerDeudaMensual(idClub, idTemp),
      equiposDetalle: this.dashboardService.obtenerEquiposDetalle(idClub, idTemp),
    }).subscribe({
      next: (s) => {
        this.stats.set(s as IDashboardState);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('Error al cargar las estadísticas del dashboard');
      },
    });
  }
}
