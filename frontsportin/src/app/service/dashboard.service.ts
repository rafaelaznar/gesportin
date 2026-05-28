import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { serverURL } from '../environment/environment';
import {
  IClubResumen,
  IDeudaMensual,
  IDeudaPorEquipo,
  IEquipoDetalle,
  IEquiposPorCategoria,
  IEstadoPagos,
  IIngresoMensual,
  IPartidoMensual,
} from '../model/dashboard-stats';
import { ClubService } from './club';
import { ComentarioService } from './comentario';
import { CategoriaService } from './categoria';
import { EquipoService } from './equipo';
import { LigaService } from './liga';
import { PartidoService } from './partido';
import { JugadorService } from './jugador-service';
import { PagoService } from './pago';
import { UsuarioService } from './usuarioService';
import { SecurityService } from './security.service';
import { NoticiaService } from './noticia';
import { ArticuloService } from './articulo';
import { CuotaService } from './cuota';
import { FacturaService } from './factura-service';
import { CompraService } from './compra';
import { PuntuacionService } from './puntuacion';
import { ComentarioartService } from './comentarioart';
import { TemporadaService } from './temporada';
import { IPage } from '../model/plist';
import { IClub } from '../model/club';
import { ICategoria } from '../model/categoria';
import { IPago } from '../model/pago';
import { IPartido } from '../model/partido';
import { ITemporada } from '../model/temporada';
import { INoticia } from '../model/noticia';
import { IUsuario } from '../model/usuario';

export interface DashboardStatsData {
  resumen: IClubResumen;
  estadoPagos: IEstadoPagos;
  equiposCat: IEquiposPorCategoria[];
  partidosMes: IPartidoMensual[];
  ingresosMes: IIngresoMensual[];
  deudaEquipo: IDeudaPorEquipo[];
  deudaMes: IDeudaMensual[];
  equiposDetalle: IEquipoDetalle[];
}

export interface DashboardRawData {
  clubes: number;
  equipos: number;
  jugadores: number;
  ligas: number;
  partidos: number;
  pagos: number;
  cuotas: number;
  noticias: number;
  articulos: number;
  facturas: number;
  compras: number;
  puntuaciones: number;
  comentarios: number;
  comentarioarts: number;
  clubesPage: IPage<IClub>;
  temporadasPage: IPage<ITemporada>;
  noticiasPage: IPage<INoticia>;
  usuariosPage: IPage<IUsuario>;
  pagosPage: IPage<IPago>;
  partidosPage: IPage<IPartido>;
  categoriasPage: IPage<ICategoria>;
  statsData: DashboardStatsData | null;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private static readonly DASHBOARD_PAGE_SIZE = 250;

  private readonly clubService = inject(ClubService);
  private readonly comentarioService = inject(ComentarioService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly equipoService = inject(EquipoService);
  private readonly ligaService = inject(LigaService);
  private readonly partidoService = inject(PartidoService);
  private readonly jugadorService = inject(JugadorService);
  private readonly pagoService = inject(PagoService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly security = inject(SecurityService);
  private readonly noticiaService = inject(NoticiaService);
  private readonly articuloService = inject(ArticuloService);
  private readonly cuotaService = inject(CuotaService);
  private readonly facturaService = inject(FacturaService);
  private readonly compraService = inject(CompraService);
  private readonly puntuacionService = inject(PuntuacionService);
  private readonly comentarioartService = inject(ComentarioartService);
  private readonly temporadaService = inject(TemporadaService);
  private readonly oHttp = inject(HttpClient);
  private readonly statsBaseUrl = `${serverURL}/api/stats/club`;

  obtenerResumen(idClub: number, idTemporada: number): Observable<IClubResumen> {
    return this.oHttp.get<IClubResumen>(`${this.statsBaseUrl}/${idClub}/resumen?temporada=${idTemporada}`);
  }

  obtenerEstadoPagos(idClub: number, idTemporada: number): Observable<IEstadoPagos> {
    return this.oHttp.get<IEstadoPagos>(`${this.statsBaseUrl}/${idClub}/pagos-estado?temporada=${idTemporada}`);
  }

  obtenerEquiposPorCategoria(idClub: number, idTemporada: number): Observable<IEquiposPorCategoria[]> {
    return this.oHttp.get<IEquiposPorCategoria[]>(`${this.statsBaseUrl}/${idClub}/equipos-por-categoria?temporada=${idTemporada}`);
  }

  obtenerPartidosMensuales(idClub: number, idTemporada: number): Observable<IPartidoMensual[]> {
    return this.oHttp.get<IPartidoMensual[]>(`${this.statsBaseUrl}/${idClub}/partidos-mensuales?temporada=${idTemporada}`);
  }

  obtenerIngresosMensuales(idClub: number, idTemporada: number): Observable<IIngresoMensual[]> {
    return this.oHttp.get<IIngresoMensual[]>(`${this.statsBaseUrl}/${idClub}/ingresos-mensuales?temporada=${idTemporada}`);
  }

  obtenerDeudaPorEquipo(idClub: number, idTemporada: number): Observable<IDeudaPorEquipo[]> {
    return this.oHttp.get<IDeudaPorEquipo[]>(`${this.statsBaseUrl}/${idClub}/deuda-por-equipo?temporada=${idTemporada}`);
  }

  obtenerDeudaMensual(idClub: number, idTemporada: number): Observable<IDeudaMensual[]> {
    return this.oHttp.get<IDeudaMensual[]>(`${this.statsBaseUrl}/${idClub}/deuda-mensual?temporada=${idTemporada}`);
  }

  obtenerEquiposDetalle(idClub: number, idTemporada: number): Observable<IEquipoDetalle[]> {
    return this.oHttp.get<IEquipoDetalle[]>(`${this.statsBaseUrl}/${idClub}/equipos-detalle?temporada=${idTemporada}`);
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

  private countFromPage<T>(request$: Observable<IPage<T>>): Observable<number> {
    return request$.pipe(
      map((page) => page?.totalElements ?? page?.content?.length ?? 0),
      catchError(() => of(0))
    );
  }

  fetchDashboardData(selectedClubId = 0, selectedTemporadaId = 0): Observable<DashboardRawData> {
    const isAdmin = this.security.isAdmin();
    const clubId = this.security.clubFilter(selectedClubId);
    const clubs$ = isAdmin
      ? this.clubService.count().pipe(catchError(() => of(0)))
      : this.countFromPage(this.clubService.getPage(0, 1));
    const teams$ = selectedTemporadaId > 0
      ? this.equipoService.countByTemporada(selectedTemporadaId).pipe(catchError(() => of(0)))
      : (isAdmin
        ? this.equipoService.count().pipe(catchError(() => of(0)))
        : this.countFromPage(this.equipoService.getPage(0, 1)));
    const players$ = isAdmin
      ? this.jugadorService.count().pipe(catchError(() => of(0)))
      : this.countFromPage(this.jugadorService.getPage(0, 1));
    const leagues$ = isAdmin
      ? this.ligaService.count().pipe(catchError(() => of(0)))
      : this.countFromPage(this.ligaService.getPage(0, 1));
    const matches$ = isAdmin
      ? this.partidoService.count().pipe(catchError(() => of(0)))
      : this.countFromPage(this.partidoService.getPage(0, 1));
    const payments$ = isAdmin
      ? this.pagoService.count().pipe(catchError(() => of(0)))
      : this.countFromPage(this.pagoService.getPage(0, 1));
    const cuotas$ = isAdmin
      ? this.cuotaService.count().pipe(catchError(() => of(0)))
      : this.countFromPage(this.cuotaService.getPage(0, 1));
    const noticias$ = isAdmin
      ? this.noticiaService.count().pipe(catchError(() => of(0)))
      : this.countFromPage(this.noticiaService.getPage(0, 1));
    const articulos$ = isAdmin
      ? this.articuloService.count().pipe(catchError(() => of(0)))
      : this.countFromPage(this.articuloService.getPage(0, 1));
    const facturas$ = isAdmin
      ? this.facturaService.count().pipe(catchError(() => of(0)))
      : this.countFromPage(this.facturaService.getPage(0, 1, 'id', 'desc'));
    const compras$ = isAdmin
      ? this.compraService.count().pipe(catchError(() => of(0)))
      : this.countFromPage(this.compraService.getPage(0, 1, 'id', 'desc'));
    const puntuaciones$ = isAdmin
      ? this.puntuacionService.count().pipe(catchError(() => of(0)))
      : this.countFromPage(this.puntuacionService.getPage(0, 1));
    const comments$ = isAdmin
      ? this.comentarioService.count().pipe(catchError(() => of(0)))
      : this.countFromPage(this.comentarioService.getPage(0, 1));
    const comentarioarts$ = isAdmin
      ? this.comentarioartService.count().pipe(catchError(() => of(0)))
      : this.countFromPage(this.comentarioartService.getPage(0, 1));

    const clubesPage$ = this.clubService
      .getPage(0, DashboardService.DASHBOARD_PAGE_SIZE, 'nombre', 'asc')
      .pipe(catchError(() => of(this.emptyPage<IClub>())));
    const temporadasPage$ = this.temporadaService
      .getPage(0, DashboardService.DASHBOARD_PAGE_SIZE, 'descripcion', 'asc', '', clubId)
      .pipe(catchError(() => of(this.emptyPage<ITemporada>())));
    const noticiasPage$ = this.noticiaService
      .getPage(0, DashboardService.DASHBOARD_PAGE_SIZE, 'id', 'desc', '', clubId)
      .pipe(catchError(() => of(this.emptyPage<INoticia>())));
    const categoriasPageRequestTemporada = selectedTemporadaId > 0 ? selectedTemporadaId : 0;

    const usuariosPage$ = this.usuarioService
      .getPage(0, DashboardService.DASHBOARD_PAGE_SIZE, 'fechaAlta', 'desc', '', 0, 0, clubId)
      .pipe(catchError(() => of(this.emptyPage<IUsuario>())));
    const pagosPage$ = this.pagoService
      .getPage(0, DashboardService.DASHBOARD_PAGE_SIZE, 'fecha', 'desc')
      .pipe(catchError(() => of(this.emptyPage<IPago>())));
    const partidosPage$ = this.partidoService
      .getPage(0, DashboardService.DASHBOARD_PAGE_SIZE, 'fecha', 'desc')
      .pipe(catchError(() => of(this.emptyPage<IPartido>())));
    const categoriasPage$ = this.categoriaService
      .getPage(0, DashboardService.DASHBOARD_PAGE_SIZE, 'nombre', 'asc', '', categoriasPageRequestTemporada)
      .pipe(catchError(() => of(this.emptyPage<ICategoria>())));

    const statsClubId$ = clubId > 0
      ? of(clubId)
      : (selectedTemporadaId > 0
        ? this.temporadaService.get(selectedTemporadaId).pipe(
            map((temporada) => temporada.club?.id ?? 0),
            catchError(() => of(0))
          )
        : of(0));

    const statsData$: Observable<DashboardStatsData | null> = statsClubId$.pipe(
      switchMap((statsClubId) => statsClubId > 0
        ? forkJoin({
            resumen: this.obtenerResumen(statsClubId, selectedTemporadaId).pipe(catchError(() => of(null))),
            estadoPagos: this.obtenerEstadoPagos(statsClubId, selectedTemporadaId).pipe(catchError(() => of(null))),
            equiposCat: this.obtenerEquiposPorCategoria(statsClubId, selectedTemporadaId).pipe(catchError(() => of([]))),
            partidosMes: this.obtenerPartidosMensuales(statsClubId, selectedTemporadaId).pipe(catchError(() => of([]))),
            ingresosMes: this.obtenerIngresosMensuales(statsClubId, selectedTemporadaId).pipe(catchError(() => of([]))),
            deudaEquipo: this.obtenerDeudaPorEquipo(statsClubId, selectedTemporadaId).pipe(catchError(() => of([]))),
            deudaMes: this.obtenerDeudaMensual(statsClubId, selectedTemporadaId).pipe(catchError(() => of([]))),
            equiposDetalle: this.obtenerEquiposDetalle(statsClubId, selectedTemporadaId).pipe(catchError(() => of([]))),
          }).pipe(
            map((s) => s.resumen
              ? {
                  resumen: s.resumen,
                  estadoPagos: s.estadoPagos ?? { pagados: 0, pendientes: 0 },
                  equiposCat: s.equiposCat,
                  partidosMes: s.partidosMes,
                  ingresosMes: s.ingresosMes,
                  deudaEquipo: s.deudaEquipo,
                  deudaMes: s.deudaMes,
                  equiposDetalle: s.equiposDetalle,
                }
              : null),
            catchError(() => of(null))
          )
        : of(null)
      )
    );

    return forkJoin({
      clubes: clubs$,
      equipos: teams$,
      jugadores: players$,
      ligas: leagues$,
      partidos: matches$,
      pagos: payments$,
      cuotas: cuotas$,
      noticias: noticias$,
      articulos: articulos$,
      facturas: facturas$,
      compras: compras$,
      puntuaciones: puntuaciones$,
      comentarios: comments$,
      comentarioarts: comentarioarts$,
      clubesPage: clubesPage$,
      temporadasPage: temporadasPage$,
      noticiasPage: noticiasPage$,
      usuariosPage: usuariosPage$,
      pagosPage: pagosPage$,
      partidosPage: partidosPage$,
      categoriasPage: categoriasPage$,
      statsData: statsData$,
    });
  }
}
