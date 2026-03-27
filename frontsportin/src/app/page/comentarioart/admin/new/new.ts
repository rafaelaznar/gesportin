import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ComentarioartAdminForm } from '../../../../component/comentarioart/admin/form/form';

@Component({
  selector: 'app-comentarioart-admin-new-page',
  imports: [CommonModule, ComentarioartAdminForm],
  templateUrl: './new.html',
  styleUrl: './new.css',
})
export class ComentarioartAdminNewPage {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/comentarioart']);
  }

  onFormCancel(): void {
    this.router.navigate(['/comentarioart']);
  }
}
