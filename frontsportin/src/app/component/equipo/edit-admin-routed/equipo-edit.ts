import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquipoService } from '../../../service/equipo';
import { IEquipo } from '../../../model/equipo';

@Component({
  selector: 'app-equipo-edit-routed',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './equipo-edit.html',
  styleUrl: './equipo-edit.css',
})
export class EquipoEditAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private oEquipoService = inject(EquipoService);
  private snackBar = inject(MatSnackBar);

  equipoForm!: FormGroup;
  id_equipo = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);
  // Guardar ids de claves ajenas para reenviarlos en el update
  currentCategoriaId = signal<number | null>(null);
  currentEntrenadorId = signal<number | null>(null);

  constructor() {}

  ngOnInit(): void {
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de equipo no válido');
      this.loading.set(false);
      return;
    }

    this.id_equipo.set(Number(idParam));

    if (isNaN(this.id_equipo())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.loadEquipo();
  }

  private initForm(): void {
    this.equipoForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
    });
  }

  private loadEquipo(): void {
    this.oEquipoService.get(this.id_equipo()).subscribe({
      next: (equipo: IEquipo) => {
        this.equipoForm.patchValue({
          id: equipo.id,
          nombre: equipo.nombre,
        });
        // Guardar ids de categoria y entrenador para incluirlos en el update
        this.currentCategoriaId.set(equipo.categoria?.id ?? null);
        this.currentEntrenadorId.set(equipo.entrenador?.id ?? null);
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

  get nombre() {
    return this.equipoForm.get('nombre');
  }

  onSubmit(): void {
    if (this.equipoForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    this.submitting.set(true);

    const equipoData: any = {
      id: this.id_equipo(),
      nombre: this.equipoForm.value.nombre,
    } as Partial<IEquipo>;

    // Incluir referencias a claves ajenas si existen para evitar errores en el backend
    if (this.currentCategoriaId()) {
      equipoData.categoria = { id: this.currentCategoriaId() };
    }
    if (this.currentEntrenadorId()) {
      equipoData.entrenador = { id: this.currentEntrenadorId() };
    }

    this.oEquipoService.update(equipoData).subscribe({
      next: (id: number) => {
        this.snackBar.open('Equipo actualizado exitosamente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
        this.router.navigate(['/equipo']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error actualizando el equipo');
        this.snackBar.open('Error actualizando el equipo', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.submitting.set(false);
      },
    });
  }
}
