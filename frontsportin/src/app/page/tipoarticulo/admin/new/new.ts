import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TipoarticuloAdminForm } from '../../../../component/tipoarticulo/admin/form/form';

@Component({
  selector: 'app-tipoarticulo-admin-new-page',
  imports: [CommonModule, TipoarticuloAdminForm],
  templateUrl: './new.html',
  styleUrl: './new.css',
})
export class TipoarticuloAdminNewPage {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/tipoarticulo']);
  }

  onFormCancel(): void {
    this.router.navigate(['/tipoarticulo']);
  }
}
