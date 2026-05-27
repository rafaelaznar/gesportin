import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private oHttp = inject(HttpClient);
  private baseUrl = `${serverURL}/api/stats/club`;

  obtenerResumen(idClub: number, idTemporada: number): Observable<IClubResumen> {
    return this.oHttp.get<IClubResumen>(
      `${this.baseUrl}/${idClub}/resumen?temporada=${idTemporada}`,
    );
  }

  obtenerEstadoPagos(idClub: number, idTemporada: number): Observable<IEstadoPagos> {
    return this.oHttp.get<IEstadoPagos>(
      `${this.baseUrl}/${idClub}/pagos-estado?temporada=${idTemporada}`,
    );
  }

  obtenerEquiposPorCategoria(
    idClub: number,
    idTemporada: number,
  ): Observable<IEquiposPorCategoria[]> {
    return this.oHttp.get<IEquiposPorCategoria[]>(
      `${this.baseUrl}/${idClub}/equipos-por-categoria?temporada=${idTemporada}`,
    );
  }

  obtenerPartidosMensuales(idClub: number, idTemporada: number): Observable<IPartidoMensual[]> {
    return this.oHttp.get<IPartidoMensual[]>(
      `${this.baseUrl}/${idClub}/partidos-mensuales?temporada=${idTemporada}`,
    );
  }

  obtenerIngresosMensuales(idClub: number, idTemporada: number): Observable<IIngresoMensual[]> {
    return this.oHttp.get<IIngresoMensual[]>(
      `${this.baseUrl}/${idClub}/ingresos-mensuales?temporada=${idTemporada}`,
    );
  }

  obtenerDeudaPorEquipo(idClub: number, idTemporada: number): Observable<IDeudaPorEquipo[]> {
    return this.oHttp.get<IDeudaPorEquipo[]>(
      `${this.baseUrl}/${idClub}/deuda-por-equipo?temporada=${idTemporada}`,
    );
  }

  obtenerDeudaMensual(idClub: number, idTemporada: number): Observable<IDeudaMensual[]> {
    return this.oHttp.get<IDeudaMensual[]>(
      `${this.baseUrl}/${idClub}/deuda-mensual?temporada=${idTemporada}`,
    );
  }

  obtenerEquiposDetalle(idClub: number, idTemporada: number): Observable<IEquipoDetalle[]> {
    return this.oHttp.get<IEquipoDetalle[]>(
      `${this.baseUrl}/${idClub}/equipos-detalle?temporada=${idTemporada}`,
    );
  }
}
