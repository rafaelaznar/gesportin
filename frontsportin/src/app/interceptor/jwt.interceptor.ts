import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { NotificacionService } from "../service/notificacion";
import { SessionService } from "../service/session";

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

    /** Prevents showing the "session expired" notification more than once
     *  when multiple concurrent requests all return 401. */
    private sessionExpiredHandled = false;

    /** Prevents showing the "backend not alive" notification more than once
     *  when multiple concurrent requests all fail with status 0. */
    private backendDownHandled = false;

    /** Prevents showing the "database unavailable" notification more than once
     *  when multiple concurrent requests all return 503. */
    private dbDownHandled = false;

    constructor(
        private oSessionService: SessionService,
        private oNotificacionService: NotificacionService,
        private oRouter: Router,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.oSessionService.isSessionActive()) {
            const token = this.oSessionService.getToken();
            if (token) {
                req = req.clone({
                    setHeaders: { Authorization: `Bearer ${token}` }
                });
            }
        }

        return next.handle(req).pipe(
            catchError(err => {
                // status 0 → backend is not reachable (server down / ERR_CONNECTION_REFUSED)
                if (err.status === 0 && !this.backendDownHandled) {
                    this.backendDownHandled = true;
                    this.oNotificacionService.error(
                        'No se puede conectar con el servidor. Comprueba que el backend está en marcha.',
                        'Backend not alive'
                    );
                    // reset so a later retry can show the notification again
                    setTimeout(() => { this.backendDownHandled = false; }, 10000);
                }
                // 503 → backend is up but cannot reach the database
                if (err.status === 503 && !this.dbDownHandled) {
                    this.dbDownHandled = true;
                    this.oNotificacionService.error(
                        'El servidor no puede acceder a la base de datos.',
                        "Backend can't access to database"
                    );
                    setTimeout(() => { this.dbDownHandled = false; }, 10000);
                }
                // 401 while a token was present → the token has expired server-side
                if (err.status === 401 && this.oSessionService.getToken() !== null) {
                    this.oSessionService.clearToken();
                    if (!this.sessionExpiredHandled) {
                        this.sessionExpiredHandled = true;
                        this.oNotificacionService.warning(
                            'Lo siento, la sesión ha expirado.',
                            'Sesión expirada',
                            { autoCierre: 4000 }
                        );
                        this.oRouter.navigate(['/login']).then(() => {
                            // reset the flag so a future login + expiry cycle works again
                            this.sessionExpiredHandled = false;
                        });
                    }
                }
                // 403 → authenticated but not allowed (different club, etc.), do NOT log out
                if (err.status === 403) {
                    this.oNotificacionService.warning(
                        'No tienes permiso para acceder a este recurso.',
                        'Acceso denegado',
                        { autoCierre: 4000 }
                    );
                    this.oRouter.navigate(['/']);
                }
                return throwError(() => err);
            })
        );
    }
}