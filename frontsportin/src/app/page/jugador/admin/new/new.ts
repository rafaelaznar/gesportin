import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JugadorAdminForm } from '../../../../component/jugador/admin/form/form';

@Component({
  selector: 'app-jugador-admin-new-page',
  imports: [CommonModule, JugadorAdminForm],
  templateUrl: './new.html',
  styleUrl: './new.css',
})
export class JugadorAdminNewPage {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/jugador']);
  }

  onFormCancel(): void {
    this.router.navigate(['/jugador']);
  }
}
