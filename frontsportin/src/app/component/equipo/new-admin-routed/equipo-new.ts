import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquipoService } from '../../../service/equipo';
import { IEquipo } from '../../../model/equipo';
import { EquipoFormAdminUnrouted } from '../form-admin-unrouted/equipo-form';

@Component({
  selector: 'app-equipo-new-routed',
  standalone: true,
  imports: [CommonModule, EquipoFormAdminUnrouted],
  templateUrl: './equipo-new.html',
  styleUrl: './equipo-new.css',
})
export class EquipoNewAdminRouted {
  private router = inject(Router);
  private oEquipoService = inject(EquipoService);
  private snackBar = inject(MatSnackBar);

  submitting = signal(false);

  onFormSubmit(equipoData: IEquipo): void {
    this.submitting.set(true);

    this.oEquipoService.create(equipoData).subscribe({
      next: () => {
        this.snackBar.open('Equipo creado exitosamente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
        this.router.navigate(['/equipo']);
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error creando el equipo', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.submitting.set(false);
      },
    });
  }

  onFormCancel(): void {
    this.router.navigate(['/equipo']);
  }
}
