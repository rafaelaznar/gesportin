import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../../component/shared/dashboard/dashboard';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardComponent],
  template: `
    <div class="admin-dashboard-wrapper">
      <app-dashboard></app-dashboard>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .admin-dashboard-wrapper {
      width: 100%;
      height: 100%;
    }
  `]
})
export class AdminDashboardPage {}
