import { Component, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './component/shared/menu/menu';
import { SidebarComponent } from './component/shared/sidebar/sidebar';
import { SessionService } from './service/session';
import { PwaService } from './service/pwa';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontsportin');
  private session = inject(SessionService);
  private destroyRef = inject(DestroyRef);
  isUser = signal(this.session.isUser());
  isClubAdmin = signal(this.session.isClubAdmin());
  isAdmin = signal(this.session.isAdmin());
  isOffline = signal(!navigator.onLine);
  private pwaService = inject(PwaService);

  @HostListener('window:offline')
  onOffline(): void { this.isOffline.set(true); }

  @HostListener('window:online')
  onOnline(): void { this.isOffline.set(false); }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event): void {
    event.preventDefault();
    this.pwaService.captureInstallPrompt(event);
  }

  @HostListener('window:appinstalled')
  onAppInstalled(): void {
    this.pwaService.onAppInstalled();
  }

  constructor() {
    this.session.subjectLogin.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      setTimeout(() => {
        this.isUser.set(this.session.isUser());
        this.isClubAdmin.set(this.session.isClubAdmin());
        this.isAdmin.set(this.session.isAdmin());
      });
    });
    this.session.subjectLogout.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      setTimeout(() => {
        this.isUser.set(false);
        this.isClubAdmin.set(false);
        this.isAdmin.set(false);
      });
    });
  }
}
