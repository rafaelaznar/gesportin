import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { SessionService } from "../service/session";

@Injectable({
    providedIn: 'root'
})

export class AdminGuard implements CanActivate {

    constructor(private oSessionService: SessionService,
        private oRouter: Router) { }

    canActivate(): Observable<boolean> {
        if (this.oSessionService.isSessionActive() && this.oSessionService.isAdmin()) {
            return new Observable<boolean>(observer => {
                observer.next(true);
                observer.complete();
            });
        } else {
            // if not logged in or not an admin, redirect to login
            this.oRouter.navigate(['/login']);
            return new Observable<boolean>(observer => {
                observer.next(false);
                observer.complete();
            });
        }
    }

}