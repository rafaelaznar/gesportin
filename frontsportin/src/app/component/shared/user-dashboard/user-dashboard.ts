import { Component, OnInit, signal } from '@angular/core';
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
  activityBarChartData = signal<ChartData<'bar'>>({
    labels: ['Mi carrito', 'Mis facturas', 'Mis equipos'],
    datasets: [{ data: [0, 0, 0], label: 'Actividad personal', backgroundColor: ['#cb4335', '#7d3c98', '#1e8449'] }]
  });
  activityDoughnutChartData = signal<ChartData<'doughnut'>>({
    labels: ['Mi carrito', 'Mis facturas', 'Mis equipos'],
    datasets: [{ data: [0, 0, 0], backgroundColor: ['#cb4335', '#7d3c98', '#1e8449'] }]
  });

  readonly activityBarOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    }
  };

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

  private updateCharts(carritoTotal: number, facturasTotal: number, equiposTotal: number): void {
    const values = [carritoTotal, facturasTotal, equiposTotal];

    this.activityBarChartData.set({
      labels: ['Mi carrito', 'Mis facturas', 'Mis equipos'],
      datasets: [
        {
          label: 'Actividad personal',
          data: values,
          backgroundColor: ['#cb4335', '#7d3c98', '#1e8449'],
          borderRadius: 10,
          maxBarThickness: 56
        }
      ]
    });

    this.activityDoughnutChartData.set({
      labels: ['Mi carrito', 'Mis facturas', 'Mis equipos'],
      datasets: [
        {
          data: values,
          backgroundColor: ['#cb4335', '#7d3c98', '#1e8449']
        }
      ]
    });
  }
}
