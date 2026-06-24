import { Component, Input, inject, effect } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClubLogoStateService } from '../../../service/club-logo-state';

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];

  private clubLogoState = inject(ClubLogoStateService);
  private router = inject(Router);

  constructor() {
    // Limpia el logo al navegar a la página de listado de clubes
    effect(() => {
      if (this.router.url === '/club/teamadmin') {
        this.clubLogoState.clear();
      }
    });
  }

  get displayLogoUrl(): string | null {
    return this.clubLogoState.logoUrl();
  }
}
