import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LigaAdminForm } from '../../../../component/liga/admin/form/form';

@Component({
  selector: 'app-liga-admin-new-page',
  imports: [CommonModule, LigaAdminForm],
  templateUrl: './new.html',
  styleUrl: './new.css',
})
export class LigaAdminNewPage {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/liga']);
  }

  onFormCancel(): void {
    this.router.navigate(['/liga']);
  }
}
