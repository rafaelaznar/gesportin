import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';

import { SecurityService } from '../../../service/security.service';
import { DashboardService, DashboardRawData } from '../../../service/dashboard/dashboard.service';
import { IPage } from '../../../model/plist';
import { Observable, timer } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';

interface DashboardKpiCard {
  title: string;
  icon: string;
  count: number;
  color: string;
}

interface QuickAccessCard {
  title: string;
  icon: string;
  route: string;
  color: string;
}

interface ClubInsightCard {
  title: string;
  value: number;
  icon: string;
  color: string;
}

interface DashboardViewModel {
  title: string;
  subtitle: string;
  barTitle: string;
  lineTitle: string;
  showRolesChart: boolean;
  showClubInsights: boolean;
  kpiCards: DashboardKpiCard[];
  clubInsights: ClubInsightCard[];
  quickAccessCards: QuickAccessCard[];
  barChartData: ChartData<'bar'>;
  lineChartData: ChartData<'line'>;
  rolesDoughnutChartData: ChartData<'doughnut'>;
  paymentStatusDoughnutChartData: ChartData<'doughnut'>;
  sportCategoriesDoughnutChartData: ChartData<'doughnut'>;
  clubCompositionDoughnutChartData: ChartData<'doughnut'>;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  private readonly refreshIntervalMs = 60_000;

  loading = signal(true);
  today = new Date();
  readonly vm$: Observable<DashboardViewModel>;

  private readonly dashboardService = inject(DashboardService);
  private readonly security = inject(SecurityService);
  readonly isClubAdmin = this.security.isClubAdmin();

  public readonly barChartOptions: ChartConfiguration<'bar'>['options'] = {
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

  public readonly doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#1a2540',
          font: {
            size: 18,
            weight: 'bold'
          },
          boxWidth: 14,
          boxHeight: 14,
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        titleFont: { size: 18, weight: 'bold' },
        bodyFont: { size: 17, weight: 'bold' },
        footerFont: { size: 15, weight: 'normal' }
      }
    }
  };

  public readonly lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        labels: {
          color: '#1a2540',
          font: {
            size: 18,
            weight: 'bold'
          },
          boxWidth: 14,
          boxHeight: 14,
          padding: 18,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        titleFont: { size: 18, weight: 'bold' },
        bodyFont: { size: 17, weight: 'bold' },
        footerFont: { size: 15, weight: 'normal' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    }
  };

  constructor() {
    this.vm$ = timer(0, this.refreshIntervalMs).pipe(
      tap(() => this.loading.set(true)),
      switchMap(() => this.dashboardService.fetchDashboardData()),
      map((raw) => this.buildViewModel(raw)),
      tap(() => this.loading.set(false)),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  ngOnInit() {
    // El flujo reactivo de vm$ se activa con async pipe en plantilla.
  }

  private buildQuickAccessCards(): QuickAccessCard[] {
    if (this.security.isClubAdmin()) {
      return [
        { title: 'Mi Club', icon: 'building', color: 'primary', route: '/club/teamadmin' },
        { title: 'Equipos', icon: 'people-fill', color: 'success', route: '/equipo/teamadmin' },
        { title: 'Usuarios', icon: 'person-lines-fill', color: 'info', route: '/usuario/teamadmin' },
        { title: 'Partidos', icon: 'calendar2-event', color: 'warning', route: '/partido/teamadmin' },
        { title: 'Noticias', icon: 'megaphone-fill', color: 'danger', route: '/noticia/teamadmin' },
        { title: 'Tienda', icon: 'bag-fill', color: 'primary', route: '/articulo/teamadmin' },
        { title: 'Facturas', icon: 'receipt', color: 'secondary', route: '/factura/teamadmin' }
      ];
    }

    if (this.security.isUser()) {
      return [
        { title: 'Noticias', icon: 'newspaper', color: 'primary', route: '/mi/noticias' },
        { title: 'Mis Equipos', icon: 'people-fill', color: 'success', route: '/mi/equipos' },
        { title: 'Cuotas', icon: 'cash-coin', color: 'warning', route: '/mi/cuotas' },
        { title: 'Tienda', icon: 'bag-fill', color: 'info', route: '/mi/tienda' },
        { title: 'Facturas', icon: 'receipt', color: 'secondary', route: '/mi/facturas' },
        { title: 'Mi Perfil', icon: 'person-circle', color: 'danger', route: '/mi/perfil' }
      ];
    }

    return [
      { title: 'Clubes', icon: 'building', color: 'primary', route: '/club' },
      { title: 'Equipos', icon: 'people-fill', color: 'success', route: '/equipo' },
      { title: 'Ligas', icon: 'trophy-fill', color: 'warning', route: '/liga' },
      { title: 'Partidos', icon: 'calendar2-event', color: 'info', route: '/partido' },
      { title: 'Comentarios', icon: 'chat-left-text-fill', color: 'secondary', route: '/comentario' },
      { title: 'Eventos', icon: 'megaphone-fill', color: 'danger', route: '/noticia' },
      { title: 'Tienda', icon: 'bag-fill', color: 'primary', route: '/articulo' }
    ];
  }

  // Métodos de carga y utilidad movidos a DashboardService

  private buildViewModel(data: DashboardRawData): DashboardViewModel {
    const monthKeys = this.getMonthKeys(6);
    const monthLabels = monthKeys.map((item) => item.label);
    const isAdmin = this.security.isAdmin();
    const isClubAdmin = this.security.isClubAdmin();
    const isUser = this.security.isUser();

    const paymentsMonthly = this.countByMonth(data.pagosPage.content, monthKeys, (item) => item.fecha);
    const matchesMonthly = this.countByMonth(data.partidosPage.content, monthKeys, (item) => item.fecha ?? null);
    const usersMonthly = this.countByMonth(data.usuariosPage.content, monthKeys, (item) => item.fechaAlta);
    const usersCumulative = usersMonthly.reduce<number[]>((acc, value, index) => {
      const prev = index === 0 ? 0 : acc[index - 1];
      acc.push(prev + value);
      return acc;
    }, []);

    const paidCount = data.pagosPage.content.filter((item) => this.isPaymentSettled(item.abonado)).length;
    const unpaidCount = Math.max(data.pagosPage.content.length - paidCount, 0);

    const roleMap = data.usuariosPage.content.reduce<Map<string, number>>((acc, user) => {
      const role = user.tipousuario?.descripcion?.trim() || 'Sin rol';
      acc.set(role, (acc.get(role) ?? 0) + 1);
      return acc;
    }, new Map<string, number>());
    const roleLabels = Array.from(roleMap.keys());
    const roleValues = Array.from(roleMap.values());

    const categoryMap = data.categoriasPage.content.reduce<Map<string, number>>((acc, item) => {
      const key = item.nombre?.trim() || 'Sin categoría';
      const value = item.equipos > 0 ? item.equipos : 1;
      acc.set(key, (acc.get(key) ?? 0) + value);
      return acc;
    }, new Map<string, number>());

    const categoryPairs = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
    const categoryLabels = categoryPairs.map(([label]) => label);
    const categoryValues = categoryPairs.map(([, value]) => value);
    const categoryTotal = categoryValues.reduce((acc, value) => acc + value, 0);
    const topCategoryValue = categoryValues[0] ?? 0;

    const purchaseConversionPct = this.toPercentage(data.compras, data.facturas);
    const paymentsCoveragePct = this.toPercentage(data.pagos, data.cuotas);
    const topCategoryPct = this.toPercentage(topCategoryValue, categoryTotal);

    const kpiCards: DashboardKpiCard[] = [
      { title: isClubAdmin ? 'Mi Club' : 'Clubes Activos', icon: 'building-fill', count: data.clubes, color: 'primary' },
      { title: 'Equipos', icon: 'people-fill', count: data.equipos, color: 'success' },
      { title: 'Jugadores', icon: 'person-bounding-box', count: data.jugadores, color: 'info' },
      { title: 'Partidos', icon: 'calendar2-check-fill', count: data.partidos, color: 'warning' },
      ...((isAdmin || isClubAdmin) ? [
        { title: 'Noticias', icon: 'newspaper', count: data.noticias, color: 'primary' },
        { title: 'Artículos', icon: 'bag-fill', count: data.articulos, color: 'success' },
        { title: 'Cuotas', icon: 'cash-coin', count: data.cuotas, color: 'info' },
        { title: 'Facturas', icon: 'receipt', count: data.facturas, color: 'secondary' },
        { title: 'Compras', icon: 'cart-check-fill', count: data.compras, color: 'danger' },
      ] : []),
      { title: 'Pagos', icon: 'wallet2', count: data.pagos, color: 'warning' },
      { title: 'Comentarios', icon: 'chat-left-text-fill', count: data.comentarios + data.comentarioarts, color: 'secondary' },
      { title: 'Puntuaciones', icon: 'star-fill', count: data.puntuaciones, color: 'danger' }
    ];

    const lineDatasets: ChartData<'line'>['datasets'] = isClubAdmin
      ? [
        {
          label: 'Pagos mensuales',
          data: paymentsMonthly,
          borderColor: '#13b980',
          backgroundColor: 'rgba(19, 185, 128, 0.14)',
          pointRadius: 3,
          tension: 0.35,
          fill: true
        },
        {
          label: 'Actividad partidos',
          data: matchesMonthly,
          borderColor: '#0ca6b8',
          backgroundColor: 'rgba(12, 166, 184, 0.08)',
          pointRadius: 3,
          tension: 0.3,
          fill: false
        }
      ]
      : [
        {
          label: 'Evolución mensual (pagos)',
          data: paymentsMonthly,
          borderColor: '#13b980',
          backgroundColor: 'rgba(19, 185, 128, 0.14)',
          pointRadius: 3,
          tension: 0.35,
          fill: true
        },
        {
          label: 'Crecimiento usuarios',
          data: usersCumulative,
          borderColor: '#2056e0',
          backgroundColor: 'rgba(32, 86, 224, 0.08)',
          pointRadius: 3,
          tension: 0.32,
          fill: false
        },
        {
          label: 'Estadísticas actividad (partidos)',
          data: matchesMonthly,
          borderColor: '#0ca6b8',
          backgroundColor: 'rgba(12, 166, 184, 0.08)',
          pointRadius: 3,
          tension: 0.3,
          fill: false
        }
      ];

    const clubInsights: ClubInsightCard[] = isClubAdmin
      ? [
        {
          title: 'Conversión compras/facturas',
          value: purchaseConversionPct,
          icon: 'cart-check',
          color: 'success'
        },
        {
          title: 'Cobertura pagos/cuotas',
          value: paymentsCoveragePct,
          icon: 'cash-coin',
          color: 'warning'
        },
        {
          title: 'Peso categoría líder',
          value: topCategoryPct,
          icon: 'pie-chart',
          color: 'info'
        }
      ]
      : [];

    return {
      title: isClubAdmin ? 'Dashboard de Club' : (isUser ? 'Mi Dashboard' : 'Dashboard'),
      subtitle: isClubAdmin
        ? 'Indicadores y actividad de tu club'
        : (isUser ? 'Resumen de tu actividad deportiva sin permisos de administración' : 'Analytics deportivo en tiempo real de Gesportín'),
      barTitle: isClubAdmin
        ? 'Actividad de Equipos, Jugadores y Partidos'
        : (isUser ? 'Mi Actividad: Equipos, Pagos y Facturas' : 'Actividad de Clubes, Partidos y Pagos'),
      lineTitle: isClubAdmin
        ? 'Evolución Mensual del Club'
        : (isUser ? 'Evolución de tu Actividad' : 'Evolución Mensual y Actividad'),
      showRolesChart: !isClubAdmin && !isUser,
      showClubInsights: isClubAdmin,
      kpiCards,
      clubInsights,
      quickAccessCards: this.buildQuickAccessCards(),
      barChartData: {
        labels: isClubAdmin
          ? ['Equipos', 'Jugadores', 'Partidos']
          : (isUser ? ['Mis Equipos', 'Mis Pagos', 'Mis Facturas'] : ['Actividad Clubes', 'Partidos', 'Pagos']),
        datasets: [
          {
            label: 'Actividad actual',
            data: isClubAdmin
              ? [data.equipos, data.jugadores, data.partidos]
              : (isUser ? [data.equipos, data.pagos, data.facturas] : [data.clubes, data.partidos, data.pagos]),
            backgroundColor: ['#2056e0', '#e8a700', '#13b980'],
            borderRadius: 10,
            maxBarThickness: 54
          }
        ]
      },
      lineChartData: {
        labels: monthLabels,
        datasets: lineDatasets
      },
      rolesDoughnutChartData: {
        labels: roleLabels,
        datasets: [
          {
            data: roleValues,
            backgroundColor: ['#2056e0', '#13b980', '#0ca6b8', '#e8a700', '#dc4f59']
          }
        ]
      },
      paymentStatusDoughnutChartData: {
        labels: ['Pagado', 'Pendiente'],
        datasets: [
          {
            data: [paidCount, unpaidCount],
            backgroundColor: ['#13b980', '#dc4f59']
          }
        ]
      },
      sportCategoriesDoughnutChartData: {
        labels: categoryLabels,
        datasets: [
          {
            data: categoryValues,
            backgroundColor: ['#2056e0', '#0ca6b8', '#13b980', '#e8a700', '#6d76f6', '#f1765b']
          }
        ]
      },
      clubCompositionDoughnutChartData: {
        labels: ['Equipos', 'Jugadores', 'Partidos', 'Pagos', 'Comentarios', 'Puntuaciones'],
        datasets: [
          {
            data: [
              data.equipos,
              data.jugadores,
              data.partidos,
              data.pagos,
              data.comentarios + data.comentarioarts,
              data.puntuaciones
            ],
            backgroundColor: ['#2056e0', '#13b980', '#0ca6b8', '#e8a700', '#dc4f59', '#6d76f6']
          }
        ]
      }
    };
  }

  // buildEmptyViewModel movido a DashboardService
  /*
  private buildEmptyViewModelOld(): DashboardViewModel {
    return {
      kpiCards: [
        { title: 'Clubes Activos', icon: 'building-fill', count: 0, color: 'primary' },
        { title: 'Equipos', icon: 'people-fill', count: 0, color: 'success' },
        { title: 'Jugadores', icon: 'person-bounding-box', count: 0, color: 'info' },
        { title: 'Partidos', icon: 'calendar2-check-fill', count: 0, color: 'warning' },
        { title: 'Noticias', icon: 'newspaper', count: 0, color: 'primary' },
        { title: 'Artículos', icon: 'bag-fill', count: 0, color: 'success' },
        { title: 'Cuotas', icon: 'cash-coin', count: 0, color: 'info' },
        { title: 'Pagos', icon: 'wallet2', count: 0, color: 'warning' },
        { title: 'Facturas', icon: 'receipt', count: 0, color: 'secondary' },
        { title: 'Compras', icon: 'cart-check-fill', count: 0, color: 'danger' },
        { title: 'Comentarios', icon: 'chat-left-text-fill', count: 0, color: 'secondary' },
        { title: 'Puntuaciones', icon: 'star-fill', count: 0, color: 'danger' }
      ],
      quickAccessCards: this.buildQuickAccessCards(),
      barChartData: { labels: [], datasets: [] },
      lineChartData: { labels: [], datasets: [] },
      rolesDoughnutChartData: { labels: [], datasets: [] },
      paymentStatusDoughnutChartData: { labels: [], datasets: [] },
      sportCategoriesDoughnutChartData: { labels: [], datasets: [] }
    };
  }
  */

  private getMonthKeys(length: number): Array<{ key: string; label: string }> {
    const now = new Date();
    const months: Array<{ key: string; label: string }> = [];

    for (let index = length - 1; index >= 0; index--) {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const key = `${date.getFullYear()}-${month}`;
      const label = date.toLocaleDateString('es-ES', { month: 'short' });
      months.push({ key, label: label.charAt(0).toUpperCase() + label.slice(1) });
    }

    return months;
  }

  private countByMonth<T>(
    items: T[],
    monthKeys: Array<{ key: string; label: string }>,
    dateGetter: (item: T) => string | null | undefined
  ): number[] {
    const map = new Map<string, number>(monthKeys.map((month) => [month.key, 0]));

    items.forEach((item) => {
      const rawDate = dateGetter(item);
      const parsed = this.parseApiDate(rawDate);
      if (!parsed) {
        return;
      }
      const month = String(parsed.getMonth() + 1).padStart(2, '0');
      const key = `${parsed.getFullYear()}-${month}`;
      if (map.has(key)) {
        map.set(key, (map.get(key) ?? 0) + 1);
      }
    });

    return monthKeys.map((month) => map.get(month.key) ?? 0);
  }

  private parseApiDate(value: string | null | undefined): Date | null {
    if (!value) {
      return null;
    }
    const normalized = value.includes('T') ? value : value.replace(' ', 'T');
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private isPaymentSettled(value: number | boolean): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    return value === 1;
  }

  private toPercentage(value: number, total: number): number {
    if (total <= 0) {
      return 0;
    }
    const ratio = (value / total) * 100;
    return Math.min(100, Math.round(ratio * 10) / 10);
  }

  private emptyPage<T>(): IPage<T> {
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 0,
      number: 0,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true
      },
      first: true,
      last: true,
      numberOfElements: 0,
      empty: true,
      pageable: {
        pageNumber: 0,
        pageSize: 0,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true
        },
        offset: 0,
        paged: true,
        unpaged: false
      }
    };
  }
}
