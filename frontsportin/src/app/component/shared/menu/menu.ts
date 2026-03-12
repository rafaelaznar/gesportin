import { Component, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { IJWT } from '../../../model/token';
import { SessionService } from '../../../service/session';

@Component({
  selector: 'app-menu',
  imports: [RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  activeRoute: string = '';
  // usar señales para evitar cambios tardíos durante CD
  isSessionActive: WritableSignal<boolean> = signal(false);
  oTokenJWT: IJWT | null = null;
  userName: WritableSignal<string> = signal('');

  constructor(
    private oRouter: Router,
    private oSessionService: SessionService,
  ) {
    this.oRouter.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
      }
    });
    this.isSessionActive.set(this.oSessionService.isSessionActive());
    if (this.isSessionActive()) {
      this.oTokenJWT = this.oSessionService.parseJWT(this.oSessionService.getToken()!);
      this.userName.set(this.oTokenJWT.username || '');      
    }
  }

  ngOnInit(): void {
    // cuando se recibe el evento de login actualizamos el estado del menú
    this.oSessionService.subjectLogin.subscribe(() => {
      // postponer la actualización para el siguiente tick y evitar
      // ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.isSessionActive.set(this.oSessionService.isSessionActive());
        this.oTokenJWT = this.oSessionService.parseJWT(this.oSessionService.getToken()!);
        // opcional, guardamos el nombre para usos futuros
        this.userName.set(this.oTokenJWT?.username || '');
      });
    });

    // cuando se cierra sesión, vaciamos los datos (también en siguiente tick)
    this.oSessionService.subjectLogout.subscribe(() => {
      setTimeout(() => {
        this.isSessionActive.set(false);
        this.oTokenJWT = null;
        this.userName.set('');
      });
    });
  }
}
