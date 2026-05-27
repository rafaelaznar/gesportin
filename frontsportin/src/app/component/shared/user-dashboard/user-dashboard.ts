import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { SessionService } from '../../../service/session';
import { CarritoService } from '../../../service/carrito';
import { FacturaService } from '../../../service/factura-service';
import { JugadorService } from '../../../service/jugador-service';
import { catchError, finalize } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboardComponent implements OnInit {
  private static readonly DASHBOARD_PAGE_SIZE = 1;

  userName = signal('');
  carritoCount = signal(0);
  facturasCount = signal(0);
  equiposCount = signal(0);
  loading = signal(true);
  readonly hasRecentActivitySignal = computed(() => this.carritoCount() > 0 || this.facturasCount() > 0 || this.equiposCount() > 0);
  readonly totalActivity = computed(() => this.carritoCount() + this.facturasCount() + this.equiposCount());
  readonly completedActivityCount = computed(() => this.facturasCount() + this.equiposCount());
  readonly pendingActivityCount = computed(() => this.carritoCount());
  readonly completionRate = computed(() => {
    const total = this.totalActivity();
    if (total <= 0) {
      return 0;
    }
    return Math.round((this.completedActivityCount() / total) * 100);
  });
  readonly activitySummary = computed(() => {
    if (!this.hasRecentActivitySignal()) {
      return 'Aun no hay actividad personal registrada.';
    }

    const total = this.totalActivity();
    return `Tienes ${total} elemento${total !== 1 ? 's' : ''} de actividad acumulada entre carrito, facturas y equipos.`;
  });
  readonly recommendedAction = computed(() => {
    const carrito = this.carritoCount();
    const facturas = this.facturasCount();
    const equipos = this.equiposCount();

    if (carrito > 0) {
      return {
        route: '/mi/tienda',
        title: 'Finaliza tu compra',
        detail: `Tienes ${carrito} articulo${carrito !== 1 ? 's' : ''} pendiente${carrito !== 1 ? 's' : ''} en el carrito.`
      };
    }

    if (facturas > 0) {
      return {
        route: '/mi/facturas',
        title: 'Revisa tus facturas',
        detail: `Dispones de ${facturas} factura${facturas !== 1 ? 's' : ''} para consultar.`
      };
    }

    if (equipos > 0) {
      return {
        route: '/mi/equipos',
        title: 'Consulta tus equipos',
        detail: `Participas en ${equipos} equipo${equipos !== 1 ? 's' : ''}.`
      };
    }

    return {
      route: '/mi/noticias',
      title: 'Empieza por noticias',
      detail: 'Mantente al dia con la actividad y avisos de tu club.'
    };
  });
  activityDoughnutChartData = signal<ChartData<'doughnut'>>({
    labels: ['Completada', 'Pendiente'],
    datasets: [{ data: [0, 0], backgroundColor: ['#198754', '#c92a3d'] }]
  });

  readonly activityDoughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    }
  };

  constructor(
    private session: SessionService,
    private carritoService: CarritoService,
    private facturaService: FacturaService,
    private jugadorService: JugadorService,
  ) {}

  ngOnInit(): void {
    this.updateCharts(0, 0, 0);

    const token = this.session.getToken();
    if (token) {
      const jwt = this.session.parseJWT(token);
      this.userName.set(jwt.username || '');
    }

    const userId = this.session.getUserId();
    if (!userId) {
      this.loading.set(false);
      return;
    }

    forkJoin({
      carrito: this.carritoService
        .getPage(0, UserDashboardComponent.DASHBOARD_PAGE_SIZE, 'id', 'asc', '', 0, userId)
        .pipe(catchError(() => of(null))),
      facturas: this.facturaService
        .getPage(0, UserDashboardComponent.DASHBOARD_PAGE_SIZE, 'id', 'desc', userId)
        .pipe(catchError(() => of(null))),
      equipos: this.jugadorService
        .getPage(0, UserDashboardComponent.DASHBOARD_PAGE_SIZE, 'id', 'asc', '', userId, 0)
        .pipe(catchError(() => of(null))),
    }).pipe(
      finalize(() => this.loading.set(false)),
    ).subscribe(({ carrito, facturas, equipos }) => {
      const carritoTotal = carrito?.totalElements ?? 0;
      const facturasTotal = facturas?.totalElements ?? 0;
      const equiposTotal = equipos?.totalElements ?? 0;

      this.carritoCount.set(carritoTotal);
      this.facturasCount.set(facturasTotal);
      this.equiposCount.set(equiposTotal);
      this.updateCharts(carritoTotal, facturasTotal, equiposTotal);
    });
  }

  hasRecentActivity(): boolean {
    return this.hasRecentActivitySignal();
  }

  private updateCharts(carritoTotal: number, facturasTotal: number, equiposTotal: number): void {
    const completed = facturasTotal + equiposTotal;
    const pending = carritoTotal;

    this.activityDoughnutChartData.set({
      labels: ['Completada', 'Pendiente'],
      datasets: [
        {
          data: [completed, pending],
          backgroundColor: ['#198754', '#c92a3d']
        }
      ]
    });
  }
}
