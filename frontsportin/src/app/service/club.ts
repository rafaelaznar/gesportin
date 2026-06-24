import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { serverURL } from '../environment/environment';
import { IClub } from '../model/club';
import { IPage } from '../model/plist';
import { PayloadSanitizerService } from './payload-sanitizer';
import { ClubLogoStateService } from './club-logo-state';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  private http = inject(HttpClient);
  private sanitizer = inject(PayloadSanitizerService);
  private clubLogoState = inject(ClubLogoStateService);
  private url = `${serverURL}/club`;

  /** Último club cargado vía get() o setClubFromEntity() */
  lastLoadedClub = signal<IClub | null>(null);

  /**
   * Establece lastLoadedClub a partir de cualquier entidad que tenga una
   * propiedad `club` expandida (temporada, noticia, tipoarticulo, usuario, etc.).
   * Actualiza automáticamente el ClubLogoStateService.
   */
  setClubFromEntity(entity: { club?: IClub | null } | null | undefined): void {
    if (entity?.club) {
      this.lastLoadedClub.set(entity.club);
      this.clubLogoState.setClub(entity.club);
    }
  }

  get(id: number): Observable<IClub> {
    return this.http.get<IClub>(`${this.url}/${id}`).pipe(
      tap(club => {
        this.lastLoadedClub.set(club);
        this.clubLogoState.setClub(club);
      })
    );
  }

  getPage(
    page: number,
    size: number,
    sort: string = 'id',
    direction: string = 'asc'
  ): Observable<IPage<IClub>> {
    const url = `${this.url}?page=${page}&size=${size}&sort=${sort},${direction}`;
    return this.http.get<IPage<IClub>>(url);
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.url}/count`);
  }

  delete(id: number): Observable<number> {
    return this.http.delete<number>(`${this.url}/${id}`);
  }
  update(club: Partial<IClub>): Observable<number> {
    const body = this.sanitizer.sanitize(club);
    return this.http.put<number>(serverURL + '/club', body);
  }
  // create
  create(club: IClub): Observable<number> {
    const body = this.sanitizer.sanitize(club);
    return this.http.post<number>(serverURL + '/club', body);
  }
}
