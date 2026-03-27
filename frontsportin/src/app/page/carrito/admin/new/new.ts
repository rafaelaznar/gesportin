import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoAdminForm } from '../../../../component/carrito/admin/form/form';

@Component({
  selector: 'app-carrito-admin-new-page',
  imports: [CommonModule, CarritoAdminForm],
  templateUrl: './new.html',
  styleUrl: './new.css',
})
export class CarritoAdminNewPage {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/carrito']);
  }

  onFormCancel(): void {
    this.router.navigate(['/carrito']);
  }
}
