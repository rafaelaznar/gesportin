import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompraAdminForm } from '../../../../component/compra/admin/form/form';

@Component({
  selector: 'app-compra-admin-new-page',
  imports: [CommonModule, CompraAdminForm],
  templateUrl: './new.html',
  styleUrl: './new.css',
})
export class CompraAdminNewPage {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/compra']);
  }

  onFormCancel(): void {
    this.router.navigate(['/compra']);
  }
}
