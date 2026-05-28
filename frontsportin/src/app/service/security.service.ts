import { Injectable } from '@angular/core';
import { SessionService } from './session';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  constructor(private session: SessionService) {}

  /**
   * Returns the club id that should be used for filtered requests.
   * If the current user is a club (team) admin, the id is forced to the
   * user's own club; otherwise the caller-supplied value is returned.
   */
  clubFilter(id_club: number = 0): number {
    if (this.session.isClubAdmin()) {
      const club = this.session.getClubId();
      return club ?? 0;
    }
    return id_club;
  }

  /**
   * Helper to expose session.isClubAdmin from here, avoiding direct access
   * to the private session field.
   */
  isClubAdmin(): boolean {
    return this.session.isClubAdmin();
  }

  /**
   * Helper para exponer session.isAdmin sin acceder directamente a session.
   */
  isAdmin(): boolean {
    return this.session.isAdmin();
  }

  isUser(): boolean {
    return this.session.isUser();
  }

  /**
   * Expose club id for callers.
   */
  getClubId(): number | null {
    return this.session.getClubId();
  }

  /**
   * Throws an error if the current user is a club admin; used to block
   * create/update/delete operations that are not allowed.
   */
  forbidClubAdminActions(): void {
    if (this.session.isClubAdmin()) {
      throw new Error('Acción no permitida para Administrador de club');
    }
  }

  /**
   * Validates that the provided club id (or entity with club) belongs to the
   * currently logged-in club admin. Throws on mismatch.
   */
  ensureClubOwnership(entityClubId: number | null | undefined): void {
    if (this.session.isClubAdmin()) {
      const myClub = this.session.getClubId();
      if (myClub == null) {
        throw new Error('El usuario no tiene club asociado');
      }
      if (entityClubId != null && entityClubId !== myClub) {
        throw new Error('Acceso denegado: pertenece a otro club');
      }
    }
  }
}
