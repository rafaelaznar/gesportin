import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CuotaAdminForm } from '../../../../component/cuota/admin/form/form';

@Component({
  selector: 'app-cuota-admin-new-page',
  imports: [CommonModule, CuotaAdminForm],
  templateUrl: './new.html',
  styleUrl: './new.css',
})
export class CuotaAdminNewPage {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/cuota']);
  }

  onFormCancel(): void {
    this.router.navigate(['/cuota']);
  }
}
