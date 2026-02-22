import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquipoService } from '../../../service/equipo';
import { IEquipo } from '../../../model/equipo';
import { EquipoFormAdminUnrouted } from '../form-admin-unrouted/equipo-form';

@Component({
  selector: 'app-equipo-edit-routed',
  standalone: true,
  imports: [CommonModule, EquipoFormAdminUnrouted],
  templateUrl: './equipo-edit.html',
  styleUrl: './equipo-edit.css',
})
export class EquipoEditAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private oEquipoService = inject(EquipoService);
  private snackBar = inject(MatSnackBar);

  equipo = signal<IEquipo | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de equipo no válido');
      this.loading.set(false);
      return;
    }

    const id = Number(idParam);

    if (isNaN(id)) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.loadEquipo(id);
  }

  private loadEquipo(id: number): void {
    this.oEquipoService.get(id).subscribe({
      next: (equipo: IEquipo) => {
        this.equipo.set(equipo);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el equipo');
        this.snackBar.open('Error cargando el equipo', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSubmit(equipoData: IEquipo): void {
    this.submitting.set(true);

    this.oEquipoService.update(equipoData).subscribe({
      next: () => {
        this.snackBar.open('Equipo actualizado exitosamente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
        this.router.navigate(['/equipo']);
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error actualizando el equipo', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.submitting.set(false);
      },
    });
  }

  onFormCancel(): void {
    this.router.navigate(['/equipo']);
  }
}
