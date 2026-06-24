import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
    // Enforce that club admins always filter by their own club regardless of passed parameters
    const clubId = this.security.clubFilter(id_club);

    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }

    let strUrl = `${serverURL}/usuario?page=${page}&size=${rpp}&sort=${order},${direction}`;

    if (id_tipousuario > 0) {
      strUrl += `&id_tipousuario=${id_tipousuario}`;
    }

    if (id_rol > 0) {
      strUrl += `&id_rol=${id_rol}`;
    }

    if (clubId > 0) {
      strUrl += `&id_club=${clubId}`;
    }

    if (nombre && nombre.length > 0) {
      strUrl += `&nombre=${encodeURIComponent(nombre)}`;
    }

    return this.oHttp.get<IPage<IUsuario>>(strUrl);
  }

  fill(amount: number): Observable<number> {
    return this.oHttp.post<number>(`${serverURL}/usuario/fill/${amount}`, null);
  }

  get(id: number): Observable<IUsuario> {
    return this.oHttp.get<IUsuario>(`${serverURL}/usuario/${id}`).pipe(
      map((usuario) => {
        if (this.security.isClubAdmin()) {
          // Club admins can only access users from their club
          this.security.ensureClubOwnership(usuario.club?.id ?? null);
        }
        return usuario;
      }),
    );
  }

  create(usuario: Partial<IUsuario>): Observable<number> {
    if (this.security.isClubAdmin()) {
      const clubId = usuario.club?.id;
      this.security.ensureClubOwnership(clubId ?? null);

      // Club admins can only create users of type "usuario" (id = 3)
      const tipo = usuario.tipousuario?.id;
      if (tipo !== 3) {
        throw new Error('Acción no permitida: solo se pueden crear usuarios del tipo "usuario"');
      }
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

      // Club admins can only update users of type "usuario" (id = 3)
      const tipo = usuario.tipousuario?.id;
      if (tipo !== 3) {
        throw new Error('Acción no permitida: solo se pueden modificar usuarios del tipo "usuario"');
      }
    }
    const body = this.sanitizer.sanitize(usuario, {
      nestedIdFields: ['tipousuario', 'rolusuario', 'club'],
      removeFields: ['comentarios', 'puntuaciones', 'comentarioarts', 'carritos', 'facturas', 'equiposentrenados', 'jugadores'],
    });
    return this.oHttp.put<IUsuario>(`${serverURL}/usuario`, body);
  }

  delete(id: number): Observable<number> {
    // Ensure club-admins can only delete users from their club and of type "usuario"
    if (this.security.isClubAdmin()) {
      return this.get(id).pipe(
        switchMap((usuario) => {
          const tipo = usuario.tipousuario?.id;
          if (tipo !== 3) {
            throw new Error('Acción no permitida: solo se pueden eliminar usuarios del tipo "usuario"');
          }
          return this.oHttp.delete<number>(`${serverURL}/usuario/${id}`);
        }),
      );
    }
    return this.oHttp.delete<number>(`${serverURL}/usuario/${id}`);
  }

  count(): Observable<number> {
    return this.oHttp.get<number>(`${serverURL}/usuario/count`);
  }
}
