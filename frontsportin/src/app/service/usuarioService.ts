import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { serverURL } from '../environment/environment';
import { IPage } from '../model/plist';
import { IUsuario } from '../model/usuario';
import { PayloadSanitizerService } from './payload-sanitizer';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(
    private oHttp: HttpClient,
    private sanitizer: PayloadSanitizerService,
    private security: SecurityService,
  ) { }

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    nombre: string = '',
    id_tipousuario: number = 0,
    id_rol: number = 0,
    id_club: number = 0
  ): Observable<IPage<IUsuario>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }

    let strUrl = `${serverURL}/usuario?page=${page}&size=${rpp}&sort=${order},${direction}`;

    if (id_tipousuario > 0) {
      strUrl += `&id_tipousuario=${id_tipousuario}`;
      return this.oHttp.get<IPage<IUsuario>>(strUrl);
    }

    if (id_rol > 0) {
      strUrl += `&id_rol=${id_rol}`;
      return this.oHttp.get<IPage<IUsuario>>(strUrl);
    }

    if (id_club > 0) {
      strUrl += `&id_club=${id_club}`;
      return this.oHttp.get<IPage<IUsuario>>(strUrl);
    }

    if (nombre && nombre.length > 0) {
      strUrl += `&nombre=${encodeURIComponent(nombre)}`;
      return this.oHttp.get<IPage<IUsuario>>(strUrl);
    }

    const request$ = this.oHttp.get<IPage<IUsuario>>(strUrl);
    if (this.security.isClubAdmin()) {
      // filter on client side in case backend doesn't support
      const clubId = this.security.getClubId();
      if (clubId != null) {
        return request$.pipe(
          map((pageData) => {
            const filtered = pageData.content.filter((u) => u.club?.id === clubId);
            return { ...pageData, content: filtered, totalElements: filtered.length } as IPage<IUsuario>;
          }),
        );
      }
    }
    return request$;
  }

  fill(amount: number): Observable<number> {
    return this.oHttp.post<number>(`${serverURL}/usuario/fill/${amount}`, null);
  }

  get(id: number): Observable<IUsuario> {
    return this.oHttp.get<IUsuario>(`${serverURL}/usuario/${id}`);
  }

  create(usuario: Partial<IUsuario>): Observable<number> {
    if (this.security.isClubAdmin()) {
      const clubId = usuario.club?.id;
      this.security.ensureClubOwnership(clubId ?? null);
    }
    const body = this.sanitizer.sanitize(usuario, {
      nestedIdFields: ['tipousuario', 'rolusuario', 'club'],
      removeFields: ['comentarios', 'puntuaciones', 'comentarioarts', 'carritos', 'facturas', 'equiposentrenados', 'jugadores'],
    });
    return this.oHttp.post<number>(`${serverURL}/usuario`, body);
  }

  update(usuario: Partial<IUsuario>): Observable<IUsuario> {
    if (this.security.isClubAdmin()) {
      const clubId = usuario.club?.id;
      this.security.ensureClubOwnership(clubId ?? null);
    }
    const body = this.sanitizer.sanitize(usuario, {
      nestedIdFields: ['tipousuario', 'rolusuario', 'club'],
      removeFields: ['comentarios', 'puntuaciones', 'comentarioarts', 'carritos', 'facturas', 'equiposentrenados', 'jugadores'],
    });
    return this.oHttp.put<IUsuario>(`${serverURL}/usuario`, body);
  }

  count(): Observable<number> {
    return this.oHttp.get<number>(`${serverURL}/usuario/count`);
  }
}
