import { Component, DestroyRef, HostListener, inject, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { IJWT } from '../../../model/token';
import { SessionService } from '../../../service/session';
import { PwaService } from '../../../service/pwa';
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
  private pwaService = inject(PwaService);
  showInstallBtn: WritableSignal<boolean> = signal(false);
  private deferredPrompt: any = null;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event): void {
    event.preventDefault();
    this.deferredPrompt = event;
    this.showInstallBtn.set(true);
    // Guardar en PwaService para que la página /download pueda usarlo
    this.pwaService.captureInstallPrompt(event);
  }

  @HostListener('window:appinstalled')
  onAppInstalled(): void {
    this.showInstallBtn.set(false);
    this.deferredPrompt = null;
    this.pwaService.installed.set(true);
    this.pwaService.canInstall.set(false);
  }

  async installApp(): Promise<void> {
    if (!this.deferredPrompt) return;
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      this.showInstallBtn.set(false);
    }
    this.deferredPrompt = null;
  }

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
