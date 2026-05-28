import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';

import { SecurityService } from '../../../service/security.service';
import { DashboardService, DashboardRawData, DashboardStatsData } from '../../../service/dashboard.service';
import { IDeudaMensual, IEquipoDetalle, IIngresoMensual, IPartidoMensual } from '../../../model/dashboard-stats';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

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

interface DashboardFilterOption {
  id: number;
  label: string;
}

type DashboardPeriodPreset = 'all' | 'last7' | 'last30' | 'custom';

type DetailCardColor = 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'secondary';
type ActionSeverity = 'high' | 'medium' | 'low';

interface DashboardDetailCard {
  title: string;
  value: string;
  helper: string;
  icon: string;
  color: DetailCardColor;
}

interface DashboardActionItem {
  title: string;
  description: string;
  value: number;
  icon: string;
  route: string;
  cta: string;
  severity: ActionSeverity;
}

interface DashboardActionLegendItem {
  title: string;
  route: string;
  value: number;
  color: string;
}

interface DoughnutLegendItem {
  label: string;
  value: number;
  color: string;
}

interface DashboardViewModel {
  title: string;
  subtitle: string;
  filterSummary: string;
  barTitle: string;
  lineTitle: string;
  radarTitle: string;
  polarTitle: string;
  clubOptions: DashboardFilterOption[];
  temporadaOptions: DashboardFilterOption[];
  periodOptions: Array<{ value: DashboardPeriodPreset; label: string }>;
  hasScopedData: boolean;
  scopedDataMessage: string;
  showQuickAccess: boolean;
  showRolesChart: boolean;
  showClubInsights: boolean;
  showPendingDebtByTeamChart: boolean;
  showAdminAlertsChart: boolean;
  showAdminDeepDive: boolean;
  kpiCards: DashboardKpiCard[];
  clubInsights: ClubInsightCard[];
  detailCards: DashboardDetailCard[];
  actionItems: DashboardActionItem[];
  quickAccessCards: QuickAccessCard[];
  barChartData: ChartData<'bar'>;
  lineChartData: ChartData<'line'>;
  rolesDoughnutChartData: ChartData<'doughnut'>;
  paymentStatusDoughnutChartData: ChartData<'doughnut'>;
  pendingDebtByTeamDoughnutChartData: ChartData<'doughnut'>;
  adminAlertsBarChartData: ChartData<'bar'>;
  adminAlertsLegend: DashboardActionLegendItem[];
  sportCategoriesDoughnutChartData: ChartData<'doughnut'>;
  clubCompositionDoughnutChartData: ChartData<'doughnut'>;
  radarPerformanceChartData: ChartData<'radar'>;
  polarPriorityChartData: ChartData<'polarArea'>;
  showStatsCharts: boolean;
  ingresosDeudaChartData: ChartData<'bar'>;
  deudaEquipoBarChartData: ChartData<'bar'>;
  equiposDetalleRows: IEquipoDetalle[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  private readonly filterRefresh$ = new Subject<void>();

  loading = signal(true);
  today = new Date();
  readonly selectedClubId = signal(0);
  readonly selectedTemporadaId = signal(0);
  readonly selectedPeriod = signal<DashboardPeriodPreset>('all');
  readonly fromDate = signal('');
  readonly toDate = signal('');
  readonly vm$: Observable<DashboardViewModel>;
  private lastVm: DashboardViewModel | null = null;

  private readonly dashboardService = inject(DashboardService);
  private readonly security = inject(SecurityService);
  readonly isAdmin = this.security.isAdmin();
  readonly isClubAdmin = this.security.isClubAdmin();
  readonly isUser = this.security.isUser();
  readonly lockedClubId = this.security.getClubId() ?? 0;

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

  public readonly pendingDebtDoughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14, weight: 'bold' }
      }
    }
  };

  public readonly lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
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

  public readonly radarChartOptions: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#1a2540',
          font: { size: 14, weight: 'bold' }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: { precision: 0 },
        angleLines: { color: '#dce3f2' },
        grid: { color: '#e7edf9' },
        pointLabels: {
          color: '#3f4f7d',
          font: { size: 12, weight: 'bold' }
        }
      }
    }
  };

  public readonly polarChartOptions: ChartOptions<'polarArea'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#1a2540',
          font: { size: 13, weight: 'bold' }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    }
  };

  public readonly horizontalBarChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: { display: false },
      tooltip: {
        bodyFont: { size: 13, weight: 'bold' }
      }
    },
    scales: {
      x: { beginAtZero: true, ticks: { precision: 0 } }
    }
  };

  constructor() {
    if (this.isClubAdmin && this.lockedClubId > 0) {
      this.selectedClubId.set(this.lockedClubId);
    }

    this.vm$ = this.filterRefresh$.pipe(
      startWith(undefined),
      tap(() => this.loading.set(true)),
      switchMap(() => this.dashboardService.fetchDashboardData(this.selectedClubId(), this.selectedTemporadaId())),
      map((raw) => this.buildViewModel(
        raw,
        this.selectedClubId(),
        this.selectedTemporadaId(),
        this.selectedPeriod(),
        this.fromDate(),
        this.toDate()
      )),
      tap((vm) => {
        this.lastVm = vm;
        this.loading.set(false);
      }),
      catchError(() => {
        this.loading.set(false);
        return this.lastVm ? of(this.lastVm) : of(this.buildEmptyViewModel());
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  ngOnInit() {
    // El flujo reactivo de vm$ se activa con async pipe en plantilla.
  }

  onFromDateChange(value: string): void {
    this.fromDate.set(value);
    this.selectedPeriod.set('custom');
  }

  onToDateChange(value: string): void {
    this.toDate.set(value);
    this.selectedPeriod.set('custom');
  }

  onClubChange(value: string): void {
    const clubId = Number(value) || 0;
    this.selectedClubId.set(clubId);
    this.selectedTemporadaId.set(0);
  }

  onTemporadaChange(value: string): void {
    this.selectedTemporadaId.set(Number(value) || 0);
  }

  onPeriodChange(value: string): void {
    const period = value as DashboardPeriodPreset;
    this.selectedPeriod.set(period);

    if (period === 'all') {
      this.fromDate.set('');
      this.toDate.set('');
      return;
    }

    if (period === 'last7') {
      this.applyRelativeRange(7);
      return;
    }

    if (period === 'last30') {
      this.applyRelativeRange(30);
    }
  }

  buscar(): void {
    this.filterRefresh$.next();
  }

  clearDateFilters(): void {
    this.fromDate.set('');
    this.toDate.set('');
    this.selectedClubId.set(this.isClubAdmin ? this.lockedClubId : 0);
    this.selectedTemporadaId.set(0);
    this.selectedPeriod.set('all');
    this.filterRefresh$.next();
  }

  private applyRelativeRange(days: number): void {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (days - 1));
    this.fromDate.set(this.formatDateInput(start));
    this.toDate.set(this.formatDateInput(end));
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

  private filterTemporalData(
    data: DashboardRawData,
    selectedClubId: number,
    selectedTemporadaId: number,
    fromDate: string,
    toDate: string,
  ): DashboardRawData {
    const filterByScope = <T>(items: T[], clubGetter: (item: T) => number | null, temporadaGetter: (item: T) => number | null): T[] => {
      return items.filter((item) => {
        const clubMatches = selectedClubId <= 0 || clubGetter(item) === selectedClubId;
        const linkedTemporadaId = temporadaGetter(item);
        const temporadaMatches = selectedTemporadaId <= 0
          || linkedTemporadaId === selectedTemporadaId
          || linkedTemporadaId == null;
        return clubMatches && temporadaMatches;
      });
    };

    const from = this.parseInputDate(fromDate, false);
    const to = this.parseInputDate(toDate, true);
    const hasScopeFilter = selectedClubId > 0 || selectedTemporadaId > 0;

    if (!from && !to && !hasScopeFilter) {
      return data;
    }

    const fromTime = from?.getTime() ?? Number.NEGATIVE_INFINITY;
    const toTime = to?.getTime() ?? Number.POSITIVE_INFINITY;

    const filterByDate = <T>(items: T[], dateGetter: (item: T) => string | null | undefined): T[] => {
      return items.filter((item) => {
        const parsed = this.parseApiDate(dateGetter(item));
        if (!parsed) {
          return false;
        }
        const time = parsed.getTime();
        return time >= fromTime && time <= toTime;
      });
    };

    return {
      ...data,
      usuariosPage: {
        ...data.usuariosPage,
        content: filterByDate(
          filterByScope(
            data.usuariosPage.content,
            (item) => item.club?.id ?? null,
            () => null
          ),
          (item) => item.fechaAlta
        )
      },
      pagosPage: {
        ...data.pagosPage,
        content: filterByDate(
          filterByScope(
            data.pagosPage.content,
            (item) => item.cuota?.equipo?.categoria?.temporada?.club?.id ?? item.jugador?.usuario?.club?.id ?? null,
            (item) => item.cuota?.equipo?.categoria?.temporada?.id ?? null
          ),
          (item) => item.fecha
        )
      },
      partidosPage: {
        ...data.partidosPage,
        content: filterByDate(
          filterByScope(
            data.partidosPage.content,
            (item) => item.liga?.equipo?.categoria?.temporada?.club?.id ?? null,
            (item) => item.liga?.equipo?.categoria?.temporada?.id ?? null
          ),
          (item) => item.fecha ?? null
        )
      },
      categoriasPage: {
        ...data.categoriasPage,
        content: filterByScope(
          data.categoriasPage.content,
          (item) => item.temporada?.club?.id ?? null,
          (item) => item.temporada?.id ?? null
        )
      },
      noticiasPage: {
        ...data.noticiasPage,
        content: filterByScope(
          data.noticiasPage.content,
          (item) => item.club?.id ?? null,
          () => null
        )
      }
    };
  }

  private parseInputDate(value: string, endOfDay = false): Date | null {
    if (!value) {
      return null;
    }

    const normalized = endOfDay ? `${value}T23:59:59.999` : `${value}T00:00:00.000`;
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private getDateRangeLabel(fromDate: string, toDate: string): string {
    if (!fromDate && !toDate) {
      return '';
    }

    if (fromDate && toDate) {
      return `${fromDate} - ${toDate}`;
    }

    if (fromDate) {
      return `desde ${fromDate}`;
    }

    return `hasta ${toDate}`;
  }

  private resolveOptionLabel(options: DashboardFilterOption[], id: number): string {
    if (id <= 0) {
      return '';
    }

    return options.find((option) => option.id === id)?.label ?? '';
  }

  private resolvePeriodLabel(period: DashboardPeriodPreset): string {
    switch (period) {
      case 'last7':
        return 'Últimos 7 días';
      case 'last30':
        return 'Últimos 30 días';
      case 'custom':
        return 'Rango personalizado';
      default:
        return '';
    }
  }

  private buildFilterSummary(
    clubLabel: string,
    temporadaLabel: string,
    periodLabel: string,
    fromDate: string,
    toDate: string,
  ): string {
    const items: string[] = [];
    if (clubLabel) {
      items.push(`Club: ${clubLabel}`);
    }
    if (temporadaLabel) {
      items.push(`Temporada: ${temporadaLabel}`);
    }
    if (periodLabel) {
      items.push(`Periodo: ${periodLabel}`);
    }

    const dateRange = this.getDateRangeLabel(fromDate, toDate);
    if (dateRange) {
      items.push(`Fechas: ${dateRange}`);
    }

    return items.length > 0 ? items.join(' · ') : 'Sin filtros activos';
  }

  private formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Métodos de carga y utilidad movidos a DashboardService

  private buildViewModel(
    data: DashboardRawData,
    selectedClubId = 0,
    selectedTemporadaId = 0,
    selectedPeriod: DashboardPeriodPreset = 'all',
    fromDate = '',
    toDate = '',
  ): DashboardViewModel {
    const filteredData = this.filterTemporalData(data, selectedClubId, selectedTemporadaId, fromDate, toDate);
    const statsData: DashboardStatsData | null = data.statsData ?? null;
    const monthKeys = this.getMonthKeys(6);
    const monthLabels = monthKeys.map((item) => item.label);
    const isAdmin = this.security.isAdmin();
    const isClubAdmin = this.security.isClubAdmin();
    const isUser = this.security.isUser();
    const clubOptions = [
      { id: 0, label: 'Todos los clubes' },
      ...data.clubesPage.content.map((club) => ({
        id: club.id,
        label: club.nombre?.trim() || `Club ${club.id}`
      }))
    ];
    const temporadaOptions = [
      { id: 0, label: selectedClubId > 0 ? 'Todas las temporadas del club' : 'Todas las temporadas' },
      ...data.temporadasPage.content.map((temporada) => ({
        id: temporada.id,
        label: temporada.descripcion?.trim() || `Temporada ${temporada.id}`
      }))
    ];
    const clubLabel = this.resolveOptionLabel(clubOptions, selectedClubId);
    const temporadaLabel = this.resolveOptionLabel(temporadaOptions, selectedTemporadaId);
    const periodLabel = this.resolvePeriodLabel(selectedPeriod);

    const hasDateFilter = fromDate.length > 0 || toDate.length > 0;
    const canUseStatsScope = !!statsData && !hasDateFilter;
    const paymentsMonthly = this.countByMonth(filteredData.pagosPage.content, monthKeys, (item) => item.fecha);
    const matchesMonthly = canUseStatsScope
      ? this.countStatsPartidosByMonth(statsData!.partidosMes, monthKeys)
      : this.countByMonth(filteredData.partidosPage.content, monthKeys, (item) => item.fecha ?? null);
    const usersMonthly = this.countByMonth(filteredData.usuariosPage.content, monthKeys, (item) => item.fechaAlta);
    const usersCumulative = usersMonthly.reduce<number[]>((acc, value, index) => {
      const prev = index === 0 ? 0 : acc[index - 1];
      acc.push(prev + value);
      return acc;
    }, []);

    const paidCount = filteredData.pagosPage.content.filter((item) => this.isPaymentSettled(item.abonado)).length;
    const unpaidCount = Math.max(filteredData.pagosPage.content.length - paidCount, 0);
    const settledRate = this.toPercentage(paidCount, filteredData.pagosPage.content.length);

    const pendingPayments = filteredData.pagosPage.content.filter((item) => !this.isPaymentSettled(item.abonado));
    const pendingDebtByTeamMap = pendingPayments.reduce<Map<string, number>>((acc, item) => {
      const teamName = item.cuota?.equipo?.nombre?.trim() || 'Sin equipo';
      const debtAmount = item.cuota?.cantidad ?? 0;
      acc.set(teamName, (acc.get(teamName) ?? 0) + debtAmount);
      return acc;
    }, new Map<string, number>());

    const pendingDebtByTeamPairs = Array.from(pendingDebtByTeamMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    const pendingDebtByTeamLabels = pendingDebtByTeamPairs.map(([team]) => team);
    const pendingDebtByTeamValues = pendingDebtByTeamPairs.map(([, amount]) => amount);

    const overduePayments = pendingPayments.filter((item) => {
      const dueDate = this.parseApiDate(item.cuota?.fecha);
      if (!dueDate) {
        return false;
      }
      return dueDate.getTime() < new Date().getTime();
    }).length;

    const matchesWithoutResult = filteredData.partidosPage.content.filter((item) => !this.hasText(item.resultado)).length;
    const matchesWithResult = Math.max(filteredData.partidosPage.content.length - matchesWithoutResult, 0);
    const matchCompletionRate = this.toPercentage(matchesWithResult, filteredData.partidosPage.content.length);

    const recentUsers = filteredData.usuariosPage.content.filter((item) => {
      const createdAt = this.parseApiDate(item.fechaAlta);
      if (!createdAt) {
        return false;
      }
      const diffMs = new Date().getTime() - createdAt.getTime();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      return diffMs >= 0 && diffMs <= sevenDaysMs;
    }).length;

    const filteredTeamTotal = canUseStatsScope
      ? statsData!.resumen.totalEquipos
      : filteredData.categoriasPage.content.reduce<number>((acc, item) => acc + (item.equipos || 0), 0);
    const filteredPlayerTotal = canUseStatsScope
      ? statsData!.resumen.totalJugadores
      : filteredData.usuariosPage.content.filter((item) => item.tipousuario?.id === 3).length;
    const filteredNewsTotal = filteredData.noticiasPage.content.length;
    const filteredMatchTotal = canUseStatsScope ? statsData!.resumen.totalPartidos : filteredData.partidosPage.content.length;
    const filteredPaymentTotal = canUseStatsScope ? statsData!.resumen.totalPagos : filteredData.pagosPage.content.length;
    const hasActiveFilters = selectedClubId > 0 || selectedTemporadaId > 0 || selectedPeriod !== 'all' || fromDate.length > 0 || toDate.length > 0;
    const useScopedTotals = selectedClubId > 0 || selectedTemporadaId > 0 || hasDateFilter;
    const displayMatchTotal = useScopedTotals ? filteredMatchTotal : data.partidos;
    const displayPaymentTotal = useScopedTotals ? filteredPaymentTotal : data.pagos;
    const scopedDataTotal = filteredData.usuariosPage.content.length
      + filteredData.pagosPage.content.length
      + filteredData.partidosPage.content.length
      + filteredData.categoriasPage.content.length
      + filteredData.noticiasPage.content.length;
    const hasScopedData = scopedDataTotal > 0;

    const avgPlayersPerTeam = filteredTeamTotal > 0
      ? Math.round((filteredPlayerTotal / filteredTeamTotal) * 10) / 10
      : 0;

    const roleMap = filteredData.usuariosPage.content.reduce<Map<string, number>>((acc, user) => {
      const role = user.tipousuario?.descripcion?.trim() || 'Sin rol';
      acc.set(role, (acc.get(role) ?? 0) + 1);
      return acc;
    }, new Map<string, number>());
    const roleLabels = Array.from(roleMap.keys());
    const roleValues = Array.from(roleMap.values());

    const categoryMap = filteredData.categoriasPage.content.reduce<Map<string, number>>((acc, item) => {
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

    const purchaseConversionPct = this.toPercentage(filteredData.compras, filteredData.facturas);
    const paymentsCoveragePct = this.toPercentage(filteredData.pagos, filteredData.cuotas);
    const topCategoryPct = this.toPercentage(topCategoryValue, categoryTotal);
    const paymentsTrendPct = this.calculateTrendPercentage(paymentsMonthly);
    const matchesTrendPct = this.calculateTrendPercentage(matchesMonthly);
    const usersTrendPct = this.calculateTrendPercentage(usersMonthly);

    const kpiCards: DashboardKpiCard[] = [
      { title: isClubAdmin ? 'Mi Club' : 'Clubes Activos', icon: 'building-fill', count: selectedClubId > 0 ? 1 : data.clubes, color: 'primary' },
      { title: 'Equipos', icon: 'people-fill', count: (selectedClubId > 0 || selectedTemporadaId > 0) ? Math.max(filteredTeamTotal, 0) : data.equipos, color: 'success' },
      { title: 'Jugadores', icon: 'person-bounding-box', count: (selectedClubId > 0 || selectedTemporadaId > 0) ? Math.max(filteredPlayerTotal, 0) : data.jugadores, color: 'info' },
      { title: 'Partidos', icon: 'calendar2-check-fill', count: displayMatchTotal, color: 'warning' },
      ...((isAdmin || isClubAdmin) ? [
        { title: 'Noticias', icon: 'newspaper', count: (selectedClubId > 0 || selectedTemporadaId > 0) ? filteredNewsTotal : data.noticias, color: 'primary' },
        { title: 'Artículos', icon: 'bag-fill', count: data.articulos, color: 'success' },
        { title: 'Cuotas', icon: 'cash-coin', count: data.cuotas, color: 'info' },
        { title: 'Facturas', icon: 'receipt', count: data.facturas, color: 'secondary' },
        { title: 'Compras', icon: 'cart-check-fill', count: data.compras, color: 'danger' },
      ] : []),
      { title: 'Pagos', icon: 'wallet2', count: displayPaymentTotal, color: 'warning' },
        { title: 'Comentarios', icon: 'chat-left-text-fill', count: filteredData.comentarios + filteredData.comentarioarts, color: 'secondary' },
      { title: 'Puntuaciones', icon: 'star-fill', count: data.puntuaciones, color: 'danger' },
      ...((isAdmin || isClubAdmin) && data.statsData ? [
        { title: 'Ingresos recibidos', icon: 'cash-stack', count: data.statsData.resumen.totalPagosRecibidos, color: 'success' },
        { title: 'Deuda total', icon: 'exclamation-triangle-fill', count: data.statsData.resumen.totalDeudas, color: 'danger' }
      ] : [])
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

    const statsPagadosCount = statsData?.estadoPagos.pagados ?? paidCount;
    const statsTotalPagos = statsData
      ? statsData.estadoPagos.pagados + statsData.estadoPagos.pendientes
      : filteredData.pagosPage.content.length;
    const statsSettledRate = this.toPercentage(statsPagadosCount, statsTotalPagos);
    const statsAvgPlayersPerTeam = statsData && statsData.resumen.totalEquipos > 0
      ? Math.round((statsData.resumen.totalJugadores / statsData.resumen.totalEquipos) * 10) / 10
      : avgPlayersPerTeam;

    const detailCards: DashboardDetailCard[] = isAdmin
      ? [
        {
          title: 'Tasa de cobro',
          value: `${statsSettledRate.toFixed(1)}%`,
          helper: `${statsPagadosCount} pagados de ${statsTotalPagos} pagos`,
          icon: 'cash-coin',
          color: 'success'
        },
        {
          title: 'Evolución mensual de pagos',
          value: `${paymentsTrendPct >= 0 ? '+' : ''}${paymentsTrendPct.toFixed(1)}%`,
          helper: 'Comparativa del último mes frente al anterior',
          icon: 'graph-up-arrow',
          color: paymentsTrendPct >= 0 ? 'primary' : 'warning'
        },
        {
          title: 'Partidos con resultado',
          value: `${matchCompletionRate.toFixed(1)}%`,
          helper: `${matchesWithResult} de ${filteredData.partidosPage.content.length} partidos registrados`,
          icon: 'clipboard2-check',
          color: 'info'
        },
        {
          title: 'Crecimiento de usuarios',
          value: `${usersTrendPct >= 0 ? '+' : ''}${usersTrendPct.toFixed(1)}%`,
          helper: `${recentUsers} altas en los últimos 7 días`,
          icon: 'person-plus',
          color: usersTrendPct >= 0 ? 'primary' : 'secondary'
        },
        {
          title: 'Jugadores por equipo',
          value: `${statsAvgPlayersPerTeam.toFixed(1)}`,
          helper: 'Media actual para balance deportivo',
          icon: 'people',
          color: 'secondary'
        },
        {
          title: 'Actividad de partidos',
          value: `${matchesTrendPct >= 0 ? '+' : ''}${matchesTrendPct.toFixed(1)}%`,
          helper: 'Tendencia mensual de agenda deportiva',
          icon: 'calendar2-week',
          color: matchesTrendPct >= 0 ? 'success' : 'danger'
        }
      ]
      : [];

    const actionItems: DashboardActionItem[] = isAdmin
      ? this.buildAdminActionItems(overduePayments, matchesWithoutResult, unpaidCount, recentUsers)
      : (isClubAdmin
        ? this.buildClubAdminActionItems(overduePayments, matchesWithoutResult, pendingPayments.length, recentUsers)
        : this.buildUserActionItems(recentUsers, matchesWithResult, paidCount, pendingPayments.length));

    const severityColorMap: Record<ActionSeverity, string> = {
      high: '#dc4f59',
      medium: '#e8a700',
      low: '#13b980'
    };

    const adminAlertItems = isAdmin
      ? actionItems.slice(0, 5)
      : [];

    const adminAlertsLegend: DashboardActionLegendItem[] = adminAlertItems.map((item) => ({
      title: item.title,
      route: item.route,
      value: item.value,
      color: severityColorMap[item.severity]
    }));

    const avgPlayersScore = Math.max(Math.min((avgPlayersPerTeam / 15) * 100, 100), 0);
    const matchTrendScore = Math.max(Math.min(matchesTrendPct + 50, 100), 0);
    const socialInteractionPct = this.toPercentage(filteredData.comentarios + filteredData.comentarioarts, filteredData.jugadores);
    const ratingActivityPct = this.toPercentage(filteredData.puntuaciones, filteredData.partidos);

    const radarTitle = isAdmin
      ? 'Radar de Rendimiento'
      : (isClubAdmin ? 'Radar Operativo del Club' : 'Radar de Actividad Personal');

    const polarTitle = isAdmin
      ? 'Polar de Prioridades'
      : (isClubAdmin ? 'Polar de Gestión del Club' : 'Polar de Participación');

    const radarLabels = isAdmin
      ? ['Cobro', 'Partidos cerrados', 'Compras/Facturas', 'Pagos/Cuotas', 'Actividad mensual']
      : (isClubAdmin
        ? ['Cobro', 'Partidos cerrados', 'Jugadores por equipo', 'Pagos/Cuotas', 'Actividad mensual']
        : ['Cobro', 'Interacción social', 'Valoraciones', 'Actividad partidos', 'Compras/Facturas']);

    const radarValues = isAdmin
      ? [
        settledRate,
        matchCompletionRate,
        purchaseConversionPct,
        paymentsCoveragePct,
        matchTrendScore
      ]
      : (isClubAdmin
        ? [
          settledRate,
          matchCompletionRate,
          avgPlayersScore,
          paymentsCoveragePct,
          matchTrendScore
        ]
        : [
          settledRate,
          socialInteractionPct,
          ratingActivityPct,
          matchTrendScore,
          purchaseConversionPct
        ]);

    const fallbackRadarValues = isAdmin
      ? [
        this.toPercentage(data.pagos, data.cuotas),
        this.toPercentage(data.partidos, data.partidos),
        this.toPercentage(data.compras, data.facturas),
        this.toPercentage(data.pagos, data.cuotas),
        this.calculateTrendPercentage(this.countByMonth(data.pagosPage.content, monthKeys, (item) => item.fecha))
      ]
      : (isClubAdmin
        ? [
          this.toPercentage(data.pagos, data.cuotas),
          this.toPercentage(data.partidos, data.partidos),
          Math.max(Math.min((data.jugadores / Math.max(data.equipos, 1)) / 15 * 100, 100), 0),
          this.toPercentage(data.pagos, data.cuotas),
          this.calculateTrendPercentage(this.countByMonth(data.pagosPage.content, monthKeys, (item) => item.fecha))
        ]
        : [
          this.toPercentage(data.pagos, data.cuotas),
          this.toPercentage(data.comentarios + data.comentarioarts, data.jugadores),
          this.toPercentage(data.puntuaciones, data.partidos),
          this.calculateTrendPercentage(this.countByMonth(data.partidosPage.content, monthKeys, (item) => item.fecha ?? null)),
          this.toPercentage(data.compras, data.facturas)
        ]);

    const safeRadarValues = this.hasPositiveNumericData(radarValues)
      ? this.sanitizeNumericArray(radarValues)
      : this.sanitizeNumericArray(fallbackRadarValues);

    const polarLabels = isAdmin
      ? ['Pagos vencidos', 'Pagos pendientes', 'Partidos sin resultado', 'Altas semanales']
      : (isClubAdmin
        ? ['Cobros vencidos', 'Cobros pendientes', 'Partidos sin cerrar', 'Nuevas altas']
        : ['Facturas', 'Compras', 'Comentarios', 'Puntuaciones']);

    const polarValues = isAdmin || isClubAdmin
      ? [overduePayments, pendingPayments.length, matchesWithoutResult, recentUsers]
      : [data.facturas, data.compras, data.comentarios + data.comentarioarts, data.puntuaciones];

    const fallbackPolarValues = isAdmin || isClubAdmin
      ? [
        Math.max(data.pagos - paidCount, 0),
        paidCount,
        Math.max(data.partidos - matchesWithResult, 0),
        recentUsers || 1
      ]
      : [data.facturas, data.compras, data.comentarios + data.comentarioarts, data.puntuaciones];

    const safePolarValues = this.hasPositiveNumericData(polarValues)
      ? this.sanitizeNumericArray(polarValues)
      : this.sanitizeNumericArray(fallbackPolarValues);

    const showStatsCharts = !!(statsData && (isAdmin || isClubAdmin));

    const monthlyMoneyRows = this.buildMonthlyMoneyRows(
      statsData?.ingresosMes ?? [],
      statsData?.deudaMes ?? []
    );
    const hasMonthlyMoneyData = monthlyMoneyRows.some((row) => row.ingresos > 0 || row.deuda > 0);

    const ingresosDeudaChartData: ChartData<'bar'> = hasMonthlyMoneyData
      ? {
          labels: monthlyMoneyRows.map((row) => row.label),
          datasets: [
            {
              label: 'Ingresos',
              data: monthlyMoneyRows.map((row) => row.ingresos),
              backgroundColor: 'rgba(19,185,128,0.8)',
              borderRadius: 6,
              maxBarThickness: 36
            },
            {
              label: 'Deuda',
              data: monthlyMoneyRows.map((row) => row.deuda),
              backgroundColor: 'rgba(220,79,89,0.75)',
              borderRadius: 6,
              maxBarThickness: 36
            }
          ]
        }
      : {
          labels: ['Ingresos recibidos', 'Deuda pendiente'],
          datasets: [
            {
              label: 'Importe (€)',
              data: [
                statsData?.resumen?.totalPagosRecibidos ?? 0,
                statsData?.resumen?.totalDeudas ?? 0
              ],
              backgroundColor: ['rgba(19,185,128,0.8)', 'rgba(220,79,89,0.75)'],
              borderRadius: 8,
              maxBarThickness: 80
            }
          ]
        };

    const deudaEquipoBarChartData: ChartData<'bar'> = {
      labels: statsData?.deudaEquipo.map((d) => d.equipo) ?? [],
      datasets: [
        {
          label: 'Deuda (€)',
          data: statsData?.deudaEquipo.map((d) => d.deuda) ?? [],
          backgroundColor: statsData?.deudaEquipo.map((_, i) =>
            ['#dc4f59','#e87b86','#e8a700','#f6c34b','#2056e0','#6d76f6','#0ca6b8','#13b980'][i % 8]
          ) ?? [],
          borderRadius: 4,
          maxBarThickness: 28
        }
      ]
    };

    const equiposDetalleRows: IEquipoDetalle[] = statsData?.equiposDetalle ?? [];

    const radarPerformanceChartData: ChartData<'radar'> = {
      labels: radarLabels,
      datasets: [
        {
          label: 'Rendimiento (%)',
          data: safeRadarValues,
          backgroundColor: 'rgba(32, 86, 224, 0.16)',
          borderColor: '#2056e0',
          borderWidth: 2,
          pointBackgroundColor: '#2056e0',
          pointBorderColor: '#ffffff',
          pointRadius: 3
        }
      ]
    };

    const polarPriorityChartData: ChartData<'polarArea'> = {
      labels: polarLabels,
      datasets: [
        {
          data: safePolarValues,
          backgroundColor: ['#dc4f59b3', '#e8a700b3', '#0ca6b8b3', '#2056e0b3'],
          borderColor: ['#dc4f59', '#e8a700', '#0ca6b8', '#2056e0'],
          borderWidth: 1
        }
      ]
    };

    return {
      title: isClubAdmin ? 'Dashboard de Club' : (isUser ? 'Mi Dashboard' : 'Dashboard de Administración'),
      subtitle: this.buildSubtitle(isClubAdmin, isUser, fromDate, toDate, clubLabel, temporadaLabel, periodLabel),
      filterSummary: this.buildFilterSummary(clubLabel, temporadaLabel, periodLabel, fromDate, toDate),
      barTitle: isClubAdmin
        ? 'Actividad de Equipos, Jugadores y Partidos'
        : (isUser ? 'Mi Actividad: Equipos, Pagos y Facturas' : 'Actividad Global de Clubes, Partidos y Pagos'),
      lineTitle: isClubAdmin
        ? 'Evolución Mensual del Club'
        : (isUser ? 'Evolución de tu Actividad' : 'Evolución Global Mensual'),
      radarTitle,
      polarTitle,
      clubOptions,
      temporadaOptions,
      periodOptions: [
        { value: 'all', label: 'Todo' },
        { value: 'last7', label: 'Últimos 7 días' },
        { value: 'last30', label: 'Últimos 30 días' },
        { value: 'custom', label: 'Personalizado' }
      ],
      hasScopedData,
      scopedDataMessage: hasActiveFilters && !hasScopedData
        ? 'No hay datos disponibles para los filtros seleccionados.'
        : '',
      showQuickAccess: true,
      showRolesChart: !isClubAdmin && !isUser,
      showClubInsights: isClubAdmin,
      showPendingDebtByTeamChart: !isUser,
      showAdminAlertsChart: isAdmin,
      showAdminDeepDive: isAdmin,
      kpiCards,
      clubInsights,
      detailCards,
      actionItems,
      quickAccessCards: this.buildQuickAccessCards(),
      barChartData: {
        labels: isClubAdmin
          ? ['Equipos', 'Jugadores', 'Partidos']
          : (isUser ? ['Mis Equipos', 'Mis Pagos', 'Mis Facturas'] : ['Actividad Clubes', 'Partidos', 'Pagos']),
        datasets: [
          {
            label: 'Actividad actual',
            data: isClubAdmin
              ? [filteredTeamTotal, filteredPlayerTotal, filteredMatchTotal]
              : (isUser ? [filteredData.equipos, displayPaymentTotal, filteredData.facturas] : [filteredData.clubes, displayMatchTotal, displayPaymentTotal]),
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
      adminAlertsBarChartData: {
        labels: adminAlertsLegend.map((item) => item.title),
        datasets: [
          {
            label: 'Alertas abiertas',
            data: adminAlertsLegend.map((item) => item.value),
            backgroundColor: adminAlertsLegend.map((item) => item.color),
            borderRadius: 8,
            maxBarThickness: 46
          }
        ]
      },
      adminAlertsLegend,
      pendingDebtByTeamDoughnutChartData: {
        labels: pendingDebtByTeamLabels,
        datasets: [
          {
            data: pendingDebtByTeamValues,
            backgroundColor: ['#dc4f59', '#e87b86', '#e8a700', '#13b980', '#0ca6b8', '#2056e0', '#6d76f6', '#9f86ff']
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
      radarPerformanceChartData,
      polarPriorityChartData,
      clubCompositionDoughnutChartData: {
        labels: ['Equipos', 'Jugadores', 'Partidos', 'Pagos', 'Comentarios', 'Puntuaciones'],
        datasets: [
          {
            data: this.sanitizeNumericArray([
              filteredData.equipos || data.equipos,
              filteredData.jugadores || data.jugadores,
              filteredData.partidos || data.partidos,
              filteredData.pagos || data.pagos,
              filteredData.comentarios + filteredData.comentarioarts || data.comentarios + data.comentarioarts,
              filteredData.puntuaciones || data.puntuaciones
            ]),
            backgroundColor: ['#2056e0', '#13b980', '#0ca6b8', '#e8a700', '#dc4f59', '#6d76f6']
          }
        ]
      },
      showStatsCharts,

      ingresosDeudaChartData,
      deudaEquipoBarChartData,
      equiposDetalleRows
    };
  }

  private buildSubtitle(
    isClubAdmin: boolean,
    isUser: boolean,
    fromDate: string,
    toDate: string,
    clubLabel: string,
    temporadaLabel: string,
    periodLabel: string,
  ): string {
    const base = isClubAdmin
      ? 'Indicadores y actividad de tu club'
      : (isUser ? 'Resumen de tu actividad deportiva sin permisos de administración' : 'Visión global, detalle ejecutivo y acciones prioritarias');
    const rangeLabel = this.getDateRangeLabel(fromDate, toDate);
    const filterBits = [clubLabel, temporadaLabel, periodLabel].filter((item) => item.length > 0);
    const filterLabel = filterBits.length > 0 ? `Filtros activos: ${filterBits.join(' · ')}` : '';

    const pieces = [base];
    if (rangeLabel) {
      pieces.push(`Filtro temporal activo: ${rangeLabel}`);
    }
    if (filterLabel) {
      pieces.push(filterLabel);
    }

    return pieces.join('. ');
  }

  private buildAdminActionItems(
    overduePayments: number,
    matchesWithoutResult: number,
    pendingPayments: number,
    recentUsers: number
  ): DashboardActionItem[] {
    const items: DashboardActionItem[] = [
      {
        title: 'Pagos vencidos por revisar',
        description: 'Cuotas con fecha vencida y sin abono confirmado.',
        value: overduePayments,
        icon: 'exclamation-triangle',
        route: '/pago',
        cta: 'Revisar pagos',
        severity: 'high'
      },
      {
        title: 'Partidos sin resultado',
        description: 'Encuentros registrados que aún no tienen acta final.',
        value: matchesWithoutResult,
        icon: 'clipboard2-x',
        route: '/partido',
        cta: 'Completar partidos',
        severity: 'medium'
      },
      {
        title: 'Pagos pendientes',
        description: 'Pagos creados sin marcar como abonados.',
        value: pendingPayments,
        icon: 'wallet2',
        route: '/pago',
        cta: 'Ver pendientes',
        severity: 'medium'
      },
      {
        title: 'Nuevas altas semanales',
        description: 'Usuarios dados de alta en la última semana.',
        value: recentUsers,
        icon: 'person-check',
        route: '/usuario',
        cta: 'Revisar usuarios',
        severity: 'low'
      }
    ];

    return items
      .sort((a, b) => b.value - a.value);
  }

  private buildClubAdminActionItems(
    overduePayments: number,
    matchesWithoutResult: number,
    pendingPayments: number,
    recentUsers: number
  ): DashboardActionItem[] {
    const items: DashboardActionItem[] = [
      {
        title: 'Cobros por revisar',
        description: 'Pagos del club pendientes de confirmar o vencidos.',
        value: overduePayments + pendingPayments,
        icon: 'cash-coin',
        route: '/pago/teamadmin',
        cta: 'Revisar cobros',
        severity: 'high'
      },
      {
        title: 'Partidos sin cerrar',
        description: 'Encuentros con resultado pendiente o sin acta final.',
        value: matchesWithoutResult,
        icon: 'calendar2-x',
        route: '/partido/teamadmin',
        cta: 'Completar partidos',
        severity: 'medium'
      },
      {
        title: 'Nuevas altas',
        description: 'Usuarios del club dados de alta recientemente.',
        value: recentUsers,
        icon: 'person-plus',
        route: '/usuario/teamadmin',
        cta: 'Ver usuarios',
        severity: 'low'
      }
    ];

    return items.sort((a, b) => b.value - a.value);
  }

  private buildUserActionItems(
    recentUsers: number,
    matchesWithResult: number,
    paidCount: number,
    pendingPayments: number
  ): DashboardActionItem[] {
    const items: DashboardActionItem[] = [
      {
        title: 'Actividad reciente',
        description: 'Seguimiento de tu actividad y altas recientes visibles en el panel.',
        value: recentUsers,
        icon: 'activity',
        route: '/mi/perfil',
        cta: 'Ver perfil',
        severity: 'low'
      },
      {
        title: 'Pagos visibles',
        description: 'Pagos registrados frente a pendientes en tu contexto de usuario.',
        value: paidCount + pendingPayments,
        icon: 'credit-card',
        route: '/mi/facturas',
        cta: 'Ver facturas',
        severity: 'medium'
      },
      {
        title: 'Partidos registrados',
        description: 'Partidos con resultado ya cerrados en el rango mostrado.',
        value: matchesWithResult,
        icon: 'calendar2-check',
        route: '/mi/equipos',
        cta: 'Ver equipos',
        severity: 'high'
      }
    ];

    return items.sort((a, b) => b.value - a.value);
  }

  hasRadarData(data: ChartData<'radar'>): boolean {
    const values = data.datasets[0]?.data;
    return this.hasPositiveNumericData(values);
  }

  hasPolarData(data: ChartData<'polarArea'>): boolean {
    const values = data.datasets[0]?.data;
    return this.hasPositiveNumericData(values);
  }

  hasBarData(data: ChartData<'bar'>): boolean {
    return this.hasChartData(data.datasets);
  }

  hasLineData(data: ChartData<'line'>): boolean {
    return this.hasChartData(data.datasets);
  }

  hasDoughnutData(data: ChartData<'doughnut'>): boolean {
    return this.hasChartData(data.datasets);
  }

  getDoughnutLegendItems(data: ChartData<'doughnut'>): DoughnutLegendItem[] {
    const labels = Array.isArray(data.labels) ? data.labels.map((label) => String(label ?? '')) : [];
    const values = Array.isArray(data.datasets?.[0]?.data)
      ? data.datasets[0].data.map((value) => (typeof value === 'number' && Number.isFinite(value) ? value : 0))
      : [];
    const background = data.datasets?.[0]?.backgroundColor;
    const colors = Array.isArray(background) ? background.map((color) => String(color)) : [];

    return labels
      .map((label, index) => ({
        label,
        value: values[index] ?? 0,
        color: colors[index] ?? '#7f9de8'
      }))
      .filter((item) => item.value > 0);
  }

  private hasChartData(
    datasets: Array<{ data?: unknown }> | undefined
  ): boolean {
    if (!datasets || datasets.length === 0) {
      return false;
    }

    return datasets.some((dataset) => this.hasPositiveNumericData(dataset.data));
  }

  private hasPositiveNumericData(values: unknown): boolean {
    if (!Array.isArray(values)) {
      return false;
    }

    return values.some((value) => typeof value === 'number' && Number.isFinite(value) && value > 0);
  }

  private sanitizeNumericArray(values: Array<number | null | undefined>): number[] {
    return values.map((value) => {
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        return 0;
      }
      return value;
    });
  }

  private buildMonthlyMoneyRows(
    ingresosMes: IIngresoMensual[],
    deudaMes: IDeudaMensual[]
  ): Array<{ label: string; ingresos: number; deuda: number }> {
    const ingresosMap = this.toMoneyMonthMap(ingresosMes);
    const deudaMap = this.toMoneyMonthMap(deudaMes);
    const monthKeys = Array.from(new Set([...ingresosMap.keys(), ...deudaMap.keys()])).sort();

    return monthKeys.map((monthKey) => ({
      label: monthKey,
      ingresos: ingresosMap.get(monthKey) ?? 0,
      deuda: deudaMap.get(monthKey) ?? 0
    }));
  }

  private toMoneyMonthMap(items: Array<IIngresoMensual | IDeudaMensual>): Map<string, number> {
    return items.reduce<Map<string, number>>((acc, item) => {
      const monthKey = (item.mes ?? item.fecha ?? '').trim();
      if (!monthKey) {
        return acc;
      }

      acc.set(monthKey, (acc.get(monthKey) ?? 0) + this.toChartNumber(item.total));
      return acc;
    }, new Map<string, number>());
  }

  private countStatsPartidosByMonth(
    items: IPartidoMensual[],
    monthKeys: Array<{ key: string; label: string }>
  ): number[] {
    const map = new Map<string, number>(monthKeys.map((month) => [month.key, 0]));

    items.forEach((item) => {
      const monthKey = (item.mes ?? item.fecha ?? '').trim();
      if (map.has(monthKey)) {
        map.set(monthKey, (map.get(monthKey) ?? 0) + this.toChartNumber(item.jugados));
      }
    });

    return monthKeys.map((month) => map.get(month.key) ?? 0);
  }

  private toChartNumber(value: unknown): number {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
  }

  private buildEmptyViewModel(): DashboardViewModel {
    return {
      title: this.security.isClubAdmin() ? 'Dashboard de Club' : (this.security.isUser() ? 'Mi Dashboard' : 'Dashboard de Administración'),
      subtitle: 'Sin datos disponibles temporalmente. Reintentando actualización.',
      filterSummary: 'Sin filtros activos',
      barTitle: 'Actividad',
      lineTitle: 'Evolución',
      radarTitle: 'Radar',
      polarTitle: 'Polar',
      clubOptions: [{ id: 0, label: 'Todos los clubes' }],
      temporadaOptions: [{ id: 0, label: 'Todas las temporadas' }],
      periodOptions: [
        { value: 'all', label: 'Todo' },
        { value: 'last7', label: 'Últimos 7 días' },
        { value: 'last30', label: 'Últimos 30 días' },
        { value: 'custom', label: 'Personalizado' }
      ],
      hasScopedData: false,
      scopedDataMessage: 'Sin datos disponibles temporalmente.',
      showQuickAccess: true,
      showRolesChart: !this.security.isClubAdmin() && !this.security.isUser(),
      showClubInsights: this.security.isClubAdmin(),
      showPendingDebtByTeamChart: !this.security.isUser(),
      showAdminAlertsChart: this.security.isAdmin(),
      showAdminDeepDive: this.security.isAdmin(),
      kpiCards: [],
      clubInsights: [],
      detailCards: [],
      actionItems: [],
      quickAccessCards: this.buildQuickAccessCards(),
      barChartData: { labels: [], datasets: [] },
      lineChartData: { labels: [], datasets: [] },
      rolesDoughnutChartData: { labels: [], datasets: [] },
      paymentStatusDoughnutChartData: { labels: [], datasets: [] },
      pendingDebtByTeamDoughnutChartData: { labels: [], datasets: [] },
      adminAlertsBarChartData: { labels: [], datasets: [] },
      adminAlertsLegend: [],
      sportCategoriesDoughnutChartData: { labels: [], datasets: [] },
      clubCompositionDoughnutChartData: { labels: [], datasets: [] },
      radarPerformanceChartData: { labels: [], datasets: [{ data: [] }] },
      polarPriorityChartData: { labels: [], datasets: [{ data: [] }] },
      showStatsCharts: false,
      ingresosDeudaChartData: { labels: [], datasets: [] },
      deudaEquipoBarChartData: { labels: [], datasets: [] },
      equiposDetalleRows: []
    };
  }

  private calculateTrendPercentage(values: number[]): number {
    if (values.length < 2) {
      return 0;
    }
    const last = values[values.length - 1] ?? 0;
    const previous = values[values.length - 2] ?? 0;

    if (previous <= 0) {
      return last > 0 ? 100 : 0;
    }

    return Math.round((((last - previous) / previous) * 100) * 10) / 10;
  }

  private hasText(value: string | null | undefined): boolean {
    return typeof value === 'string' && value.trim().length > 0;
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

}
