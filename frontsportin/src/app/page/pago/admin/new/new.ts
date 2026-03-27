import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagoAdminForm } from '../../../../component/pago/admin/form/form';

@Component({
  selector: 'app-pago-admin-new-page',
  imports: [CommonModule, PagoAdminForm],
  templateUrl: './new.html',
  styleUrl: './new.css',
})
export class PagoAdminNewPage {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/pago']);
  }

  onFormCancel(): void {
    this.router.navigate(['/pago']);
  }
}
