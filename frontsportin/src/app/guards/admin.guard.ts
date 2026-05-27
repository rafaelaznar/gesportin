import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of } from "rxjs";
import { SessionService } from "../service/session";

@Injectable({
    providedIn: 'root'
})

export class AdminGuard implements CanActivate {

    constructor(private oSessionService: SessionService,
        private oRouter: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        if (!this.oSessionService.isSessionActive()) {
            return of(this.oRouter.createUrlTree(['/login']));
        }

        // full administrators always allowed
        if (this.oSessionService.isAdmin()) {
            return of(true);
        }

        // team/club admins are allowed only when the route explicitly opts in
        const allowClub = route.data?.['allowClubAdmin'] === true;
        if (allowClub && this.oSessionService.isClubAdmin()) {
            return of(true);
        }

        // Important: avoid redirecting to '/' because it is also guarded and can loop.
        if (this.oSessionService.isClubAdmin()) {
            return of(this.oRouter.createUrlTree(['/dashboard/teamadmin']));
        }

        return of(this.oRouter.createUrlTree(['/login']));
    }

}