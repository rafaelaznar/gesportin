import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'gesportin_club_logo';

/**
 * Servicio centralizado que gestiona la URL del logo del club
 * para los breadcrumbs del perfil teamadmin.
 *
 * - Persiste en localStorage para que el logo se mantenga al recargar la página.
 * - Es la única fuente de verdad para el BreadcrumbComponent.
 * - Cualquier página que cargue datos de un club debe llamar a setClub() o
 *   a ClubService.setClubFromEntity() para actualizar el estado.
 */
@Injectable({
  providedIn: 'root',
})
export class ClubLogoStateService {
  private _logoUrl = signal<string | null>(this.loadFromStorage());

  /** Señal de solo lectura para que el breadcrumb la use */
  readonly logoUrl = this._logoUrl.asReadonly();

  /**
   * Establece la URL del logo a partir de un objeto club (o null para limpiar).
   * Si el club tiene imagen, la transforma a data URI y persiste en localStorage.
   */
  setClub(club: { imagen?: string | null } | null | undefined): void {
    if (club?.imagen) {
      const url = club.imagen.startsWith('data:image/')
        ? club.imagen
        : `data:image/jpeg;base64,${club.imagen}`;
      this._logoUrl.set(url);
      this.saveToStorage(url);
    } else {
      this.clear();
    }
  }

  /** Limpia el estado y elimina del localStorage */
  clear(): void {
    this._logoUrl.set(null);
    this.removeFromStorage();
  }

  /* === Persistencia === */

  private loadFromStorage(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private saveToStorage(url: string): void {
    try {
      localStorage.setItem(STORAGE_KEY, url);
    } catch {
      // localStorage no disponible
    }
  }

  private removeFromStorage(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage no disponible
    }
  }
}
