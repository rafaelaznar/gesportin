import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ClubService } from '../club';
import { ComentarioService } from '../comentario';
import { CategoriaService } from '../categoria';
import { EquipoService } from '../equipo';
import { LigaService } from '../liga';
import { PartidoService } from '../partido';
import { JugadorService } from '../jugador-service';
import { PagoService } from '../pago';
import { UsuarioService } from '../usuarioService';
import { SecurityService } from '../security.service';
import { NoticiaService } from '../noticia';
import { ArticuloService } from '../articulo';
import { CuotaService } from '../cuota';
import { FacturaService } from '../factura-service';
import { CompraService } from '../compra';
import { PuntuacionService } from '../puntuacion';
import { ComentarioartService } from '../comentarioart';
import { IPage } from '../../model/plist';
import { ICategoria } from '../../model/categoria';
import { IPago } from '../../model/pago';
import { IPartido } from '../../model/partido';
import { IUsuario } from '../../model/usuario';

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
  usuariosPage: IPage<IUsuario>;
  pagosPage: IPage<IPago>;
  partidosPage: IPage<IPartido>;
  categoriasPage: IPage<ICategoria>;
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

  fetchDashboardData(): Observable<DashboardRawData> {
    const isAdmin = this.security.isAdmin();
    const clubs$ = isAdmin
      ? this.clubService.count().pipe(catchError(() => of(0)))
      : this.countFromPage(this.clubService.getPage(0, 1));
    const teams$ = isAdmin
      ? this.equipoService.count().pipe(catchError(() => of(0)))
      : this.countFromPage(this.equipoService.getPage(0, 1));
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

    const usuariosPage$ = this.usuarioService
      .getPage(0, DashboardService.DASHBOARD_PAGE_SIZE, 'fechaAlta', 'desc')
      .pipe(catchError(() => of(this.emptyPage<IUsuario>())));
    const pagosPage$ = this.pagoService
      .getPage(0, DashboardService.DASHBOARD_PAGE_SIZE, 'fecha', 'desc')
      .pipe(catchError(() => of(this.emptyPage<IPago>())));
    const partidosPage$ = this.partidoService
      .getPage(0, DashboardService.DASHBOARD_PAGE_SIZE, 'fecha', 'desc')
      .pipe(catchError(() => of(this.emptyPage<IPartido>())));
    const categoriasPage$ = this.categoriaService
      .getPage(0, DashboardService.DASHBOARD_PAGE_SIZE, 'nombre', 'asc')
      .pipe(catchError(() => of(this.emptyPage<ICategoria>())));

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
      usuariosPage: usuariosPage$,
      pagosPage: pagosPage$,
      partidosPage: partidosPage$,
      categoriasPage: categoriasPage$
    });
  }
}
