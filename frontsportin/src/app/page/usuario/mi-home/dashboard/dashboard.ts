import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from '../../../../component/shared/user-dashboard/user-dashboard';

@Component({
  selector: 'app-user-dashboard-page',
  standalone: true,
  imports: [CommonModule, UserDashboardComponent],
  template: `
    <div class="user-dashboard-wrapper">
      <app-user-dashboard></app-user-dashboard>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .user-dashboard-wrapper {
      width: 100%;
      height: 100%;
    }
  `]
})
export class UsuarioDashboardPage {}
