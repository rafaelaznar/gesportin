import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { SessionService } from '../../../../service/session';
import { EquipoService } from '../../../../service/equipo';
import { JugadorService } from '../../../../service/jugador-service';
import { PagoService } from '../../../../service/pago';
import { NoticiaService } from '../../../../service/noticia';
import { IResumenUsuario } from '../../../../model/dashboard-stats';
import { KpiCardComponent } from '../../../../component/shared/kpi-card/kpi-card';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-usuario-plist-page',
  standalone: true,
  imports: [CommonModule, RouterLink, KpiCardComponent, BaseChartDirective],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class DashboardUsuarioPlistPage implements OnInit {
  private session = inject(SessionService);
  private equipoService = inject(EquipoService);
  private jugadorService = inject(JugadorService);
  private pagoService = inject(PagoService);
  private noticiaService = inject(NoticiaService);

  username = signal<string>('');
  resumen = signal<IResumenUsuario | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);

  porcentajePagadas = computed(() => {
    const r = this.resumen();
    if (!r) return 0;
    const total = r.cuotasPagadas + r.cuotasPendientes;
    return total > 0 ? Math.round((r.cuotasPagadas / total) * 100) : 0;
  });

  chartCuotasType = 'doughnut' as const;
  chartCuotasData = computed<ChartConfiguration<'doughnut'>['data']>(() => {
    const r = this.resumen();
    return {
      labels: ['Pagadas', 'Pendientes'],
      datasets: [
        {
          data: [r?.cuotasPagadas ?? 0, r?.cuotasPendientes ?? 0],
          backgroundColor: ['#198754', '#dc3545'],
          borderWidth: 0,
        },
      ],
    };
  });
  chartCuotasOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  ngOnInit(): void {
    const token = this.session.getToken();
    if (token) {
      this.username.set(this.session.parseJWT(token).username || '');
    }
    this.cargarDatos();
  }

  private cargarDatos(): void {
    const userId = this.session.getUserId();
    const clubId = this.session.getClubId();

    if (userId == null || clubId == null) {
      this.cargando.set(false);
      this.error.set('No se ha podido identificar al usuario');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    forkJoin({
      equipos: this.equipoService.getPage(0, 1, 'id', 'asc', '', 0, userId),
      noticias: this.noticiaService.getPage(0, 1, 'id', 'asc', '', clubId),
      pagos: this.cargarMisPagos(userId),
    }).subscribe({
      next: ({ equipos, noticias, pagos }) => {
        this.resumen.set({
          totalEquipos: equipos.totalElements,
          totalNoticiasClub: noticias.totalElements,
          cuotasPagadas: pagos.pagados,
          cuotasPendientes: pagos.pendientes,
        });
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('Error al cargar los datos del dashboard');
      },
    });
  }

  private cargarMisPagos(userId: number) {
    return this.jugadorService.getPage(0, 1000, 'id', 'asc', '', userId, 0).pipe(
      switchMap((jugadoresPage) => {
        const jugadores = jugadoresPage.content;
        if (jugadores.length === 0) {
          return of({ pagados: 0, pendientes: 0 });
        }
        return forkJoin(
          jugadores.map((j) =>
            this.pagoService.getPage(0, 1000, 'id', 'asc', 0, j.id).pipe(
              map((pagoPage) => pagoPage.content),
            ),
          ),
        ).pipe(
          map((listas) => {
            const todos = listas.flat();
            const pagados = todos.filter((p) => !!p.abonado).length;
            const pendientes = todos.length - pagados;
            return { pagados, pendientes };
          }),
        );
      }),
    );
  }
}
