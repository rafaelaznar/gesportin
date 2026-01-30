import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverURL } from '../environment/environment';
import { IPage } from '../model/plist';
import { ICuota } from '../model/cuota';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CuotaService {
  constructor(private oHttp: HttpClient) { }

  getPage(
    page: number, 
    rpp: number, 
    order: string = '', 
    direction: string = '',
    descripcion: string = '',
    equipo: number = 0,
  ): Observable<IPage<ICuota>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    if (equipo > 0) {
      return this.oHttp.get<IPage<ICuota>>(
        serverURL +
        `/cuota?page=${page}&size=${rpp}&sort=${order},${direction}&equipo=${equipo}`,
      );
    }
    if (descripcion && descripcion.length > 0) {
      return this.oHttp.get<IPage<ICuota>>(
        serverURL + `/cuota?page=${page}&size=${rpp}&sort=${order},${direction}&descripcion=${descripcion}`,
      );
    }
    return this.oHttp.get<IPage<ICuota>>(
      serverURL + `/cuota?page=${page}&size=${rpp}&sort=${order},${direction}`,
    );
  }
}