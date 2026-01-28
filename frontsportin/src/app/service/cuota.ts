mport { HttpClient } from '@angular/common/http';
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

  getPage(page: number, rpp: number, order: string = '', direction: string = ''): Observable<IPage<ICuota>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    return this.oHttp.get<IPage<ICuota>>(serverURL + `/cuota?page=${page}&size=${rpp}&sort=${order},${direction}`);
  }

  // pte: filtrado por equipo
  // getPageByEquipo(page: number, rpp: number, order: string = '', direction: string = '', id_equipo: number): Observable<IPage<ICuota>> {
  //   if (order === '') {
  //     order = 'id';
  //   }
  //   if (direction === '') {
  //     direction = 'asc';
  //   }
  //   return this.oHttp.get<IPage<ICuota>>(serverURL + `/cuota?page=${page}&size=${rpp}&sort=${order},${direction}&id_equipo=${id_equipo}`);
  // }

}