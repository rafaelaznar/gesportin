import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPage } from '../model/plist';
import { serverURL } from '../environment/environment';
import { IFactura } from '../model/factura';
import { PayloadSanitizerService } from './payload-sanitizer';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  constructor(
    private oHttp: HttpClient,
    private sanitizer: PayloadSanitizerService,
  ) {}

  getPage(page: number, rpp: number, order: string = '', direction: string = '', id_usuario: number = 0, id_club: number = 0): Observable<IPage<IFactura>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    let strUrl = serverURL + `/factura?page=${page}&size=${rpp}&sort=${order},${direction}`;
    if (id_usuario > 0) {
      strUrl += `&id_usuario=${id_usuario}`;
    }
    if (id_club > 0) {
      strUrl += `&id_club=${id_club}`;
    }
    return this.oHttp.get<IPage<IFactura>>(strUrl);
  }

  get(id: number): Observable<IFactura> {
    return this.oHttp.get<IFactura>(`${serverURL}/factura/${id}`);
  }

  delete(id: number): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/factura/' + id);
  }

  count(): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/factura/count');
  }

  update(factura: Partial<IFactura>): Observable<number> {
    // club admin may update invoices (restricted by backend/club filter)
    const body = this.sanitizer.sanitize(factura, { nestedIdFields: ['usuario'], removeFields: ['compras'] });
    return this.oHttp.put<number>(serverURL + '/factura', body);
  } 

  create(factura: Partial<IFactura>): Observable<number> {
    // club admin may create invoices; backend should restrict club
    const body = this.sanitizer.sanitize(factura, { nestedIdFields: ['usuario'], removeFields: ['compras'] });
    return this.oHttp.post<number>(serverURL + '/factura', body);
  }
}