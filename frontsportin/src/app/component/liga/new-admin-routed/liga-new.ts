import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LigaFormAdminUnrouted } from '../form-admin-unrouted/liga-form';

@Component({
  selector: 'app-liga-new-routed',
  standalone: true,
  imports: [CommonModule, LigaFormAdminUnrouted],
  templateUrl: './liga-new.html',
  styleUrl: './liga-new.css',
})
export class LigaNewAdminRouted {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/liga']);
  }

  onFormCancel(): void {
    this.router.navigate(['/liga']);
  }
}
