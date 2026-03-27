import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PuntuacionAdminForm } from '../../../../component/puntuacion/admin/form/form';

@Component({
  selector: 'app-puntuacion-admin-new-page',
  imports: [CommonModule, PuntuacionAdminForm],
  templateUrl: './new.html',
  styleUrl: './new.css',
})
export class PuntuacionAdminNewPage {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/puntuacion']);
  }

  onFormCancel(): void {
    this.router.navigate(['/puntuacion']);
  }
}
