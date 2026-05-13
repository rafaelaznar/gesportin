import { Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { IJWT } from '../../../model/token';
import { SessionService } from '../../../service/session';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  isUser: WritableSignal<boolean> = signal(false);
  oTokenJWT: IJWT | null = null;
  userName: WritableSignal<string> = signal('');
  userTypeName: WritableSignal<string> = signal('');
  private destroyRef = inject(DestroyRef);

  constructor(
    private oRouter: Router,
    private oSessionService: SessionService,
  ) {
    this.oRouter.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.activeRoute = event.urlAfterRedirects;
      });
    this.isSessionActive.set(this.oSessionService.isSessionActive());
    if (this.isSessionActive()) {
      this.oTokenJWT = this.oSessionService.parseJWT(this.oSessionService.getToken()!);
      this.userName.set(this.oTokenJWT.username || '');
      this.userTypeName.set(this.resolveTypeName(this.oTokenJWT.usertype));
      this.isUser.set(this.oSessionService.isUser());
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
        this.userTypeName.set(this.resolveTypeName(this.oTokenJWT?.usertype));
        this.isUser.set(this.oSessionService.isUser());
      });
    });

    // cuando se cierra sesión, vaciamos los datos (también en siguiente tick)
    this.oSessionService.subjectLogout.subscribe(() => {
      setTimeout(() => {
        this.isSessionActive.set(false);
        this.oTokenJWT = null;
        this.userName.set('');
        this.userTypeName.set('');
        this.isUser.set(false);
      });
    });
  }

  private resolveTypeName(usertype: number | undefined): string {
    switch (usertype) {
      case 1: return 'Administrador';
      case 2: return 'Admin. de club';
      case 3: return 'Usuario';
      default: return '';
    }
  }
}
