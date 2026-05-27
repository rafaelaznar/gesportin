import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../../service/session';

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
  private readonly session = inject(SessionService);

  @Input() items: BreadcrumbItem[] = [];

  get dashboardRoute(): string | null {
    if (!this.session.isSessionActive()) {
      return null;
    }

    if (this.session.isAdmin()) {
      return '/admin/dashboard';
    }

    if (this.session.isClubAdmin()) {
      return '/dashboard/teamadmin';
    }

    if (this.session.isUser()) {
      return '/mi/dashboard';
    }

    return null;
  }
}
