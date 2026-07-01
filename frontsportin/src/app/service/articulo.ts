import { Injectable } from '@angular/core';
import { IArticulo } from '../model/articulo';
import { Observable } from 'rxjs';
import { IPage } from '../model/plist';
import { HttpClient } from '@angular/common/http';
import { serverURL } from '../environment/environment';
import { PayloadSanitizerService } from './payload-sanitizer';

@Injectable({
  providedIn: 'root',
})
export class ArticuloService {
  constructor(private oHttp: HttpClient, private sanitizer: PayloadSanitizerService) {}

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    descripcion: string = '',
    id_tipoarticulo: number = 0,
    id_club: number = 0,
  ): Observable<IPage<IArticulo>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    let strUrl = serverURL + `/articulo?page=${page}&size=${rpp}&sort=${order},${direction}`;
    if (id_tipoarticulo > 0) {
      strUrl += `&id_tipoarticulo=${id_tipoarticulo}`;
    }
    if (id_club > 0) {
      strUrl += `&id_club=${id_club}`;
    }
    if (descripcion && descripcion.length > 0) {
      strUrl += `&descripcion=${encodeURIComponent(descripcion)}`;
    }
    return this.oHttp.get<IPage<IArticulo>>(strUrl);
  }

  get(id: number): Observable<IArticulo> {
    return this.oHttp.get<IArticulo>(serverURL + '/articulo/' + id);
   }

  create(articulo: Partial<IArticulo>): Observable<number> {
    const body = this.sanitizer.sanitize(articulo, { nestedIdFields: ['tipoarticulo'], removeFields: ['comentarioarts', 'compras', 'carritos'] });
    return this.oHttp.post<number>(serverURL + '/articulo', body);
  }

  update(articulo: Partial<IArticulo>): Observable<number> {
    const body = this.sanitizer.sanitize(articulo, { nestedIdFields: ['tipoarticulo'], removeFields: ['comentarioarts', 'compras', 'carritos'] });
    return this.oHttp.put<number>(serverURL + '/articulo', body);
  }

  delete(id: number): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/articulo/' + id);
   }

  // empty(): Observable<number> {
  //   return this.oHttp.delete<number>(serverURL + '/articulo/empty');
  // }

  count(): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/articulo/count');
  }
}
