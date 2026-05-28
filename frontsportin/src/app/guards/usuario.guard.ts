import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SessionService } from '../service/session';

@Injectable({
  providedIn: 'root',
})
export class UsuarioGuard implements CanActivate {
  constructor(private session: SessionService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> {
    if (!this.session.isSessionActive()) {
      return of(this.router.createUrlTree(['/login']));
    }

    if (this.session.isUser()) {
      // If the JWT doesn't carry userid (stale token), force a fresh login
      if (!this.session.getUserId()) {
        this.session.clearToken();
        return of(this.router.createUrlTree(['/login']));
      }
      return of(true);
    }

    if (this.session.isAdmin()) {
      return of(this.router.createUrlTree(['/']));
    }

    if (this.session.isClubAdmin()) {
      return of(this.router.createUrlTree(['/dashboard/teamadmin']));
    }

    return of(this.router.createUrlTree(['/login']));
  }
}
