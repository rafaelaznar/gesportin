import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PartidoAdminForm } from '../../../../component/partido/admin/form/form';

@Component({
  selector: 'app-partido-admin-new-page',
  imports: [CommonModule, PartidoAdminForm],
  templateUrl: './new.html',
  styleUrl: './new.css',
})
export class PartidoAdminNewPage {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/partido']);
  }

  onFormCancel(): void {
    this.router.navigate(['/partido']);
  }
}
