import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FacturaAdminForm } from '../../../../component/factura/admin/form/form';

@Component({
  selector: 'app-factura-admin-new-page',
  imports: [CommonModule, FacturaAdminForm],
  templateUrl: './new.html',
  styleUrl: './new.css',
})
export class FacturaAdminNewPage {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/factura']);
  }

  onFormCancel(): void {
    this.router.navigate(['/factura']);
  }
}
