import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Menu } from './component/shared/menu/menu';
import { SidebarComponent } from './component/shared/sidebar/sidebar';
import { SessionService } from './service/session';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontsportin');
  private session = inject(SessionService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  isUser = signal(this.session.isUser());
  isClubAdmin = signal(this.session.isClubAdmin());
  isAdmin = signal(this.session.isAdmin());
  currentUrl = signal(this.router.url);

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

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects || event.url);
      });
  }

  dashboardRoute(): string | null {
    if (this.isAdmin()) {
      return '/admin/dashboard';
    }

    if (this.isClubAdmin()) {
      return '/dashboard/teamadmin';
    }

    if (this.isUser()) {
      return '/mi/dashboard';
    }

    return null;
  }

  dashboardFabRoute(): string | null {
    const route = this.dashboardRoute();
    if (!route) {
      return null;
    }

    const current = this.normalizeUrl(this.currentUrl());
    const target = this.normalizeUrl(route);
    return current === target ? null : route;
  }

  private normalizeUrl(url: string): string {
    const withoutQuery = url.split('?')[0].split('#')[0];
    if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
      return withoutQuery.slice(0, -1);
    }
    return withoutQuery;
  }

  navigateToDashboard(event: Event, route: string): void {
    event.preventDefault();
    this.router.navigateByUrl(route);
  }
}
