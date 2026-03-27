import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArticuloAdminForm } from '../../../../component/articulo/admin/form/form';

@Component({
  selector: 'app-articulo-admin-new-page',
  imports: [CommonModule, ArticuloAdminForm],
  templateUrl: './new.html',
  styleUrl: './new.css',
})
export class ArticuloAdminNewPage {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/articulo']);
  }

  onFormCancel(): void {
    this.router.navigate(['/articulo']);
  }
}
