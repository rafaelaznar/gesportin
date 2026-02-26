import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  effect,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LigaService } from '../../../service/liga';
import { EquipoService } from '../../../service/equipo';
import { ILiga } from '../../../model/liga';
import { IEquipo } from '../../../model/equipo';
import { EquipoPlistAdminUnrouted } from '../../equipo/plist-admin-unrouted/equipo-plist-admin-unrouted';

@Component({
  selector: 'app-liga-form-unrouted',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './liga-form.html',
  styleUrls: ['./liga-form.css'],
})
export class LigaFormAdminUnrouted implements OnInit {
  @Input() liga: ILiga | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oLigaService = inject(LigaService);
  private oEquipoService = inject(EquipoService);
  private dialog = inject(MatDialog);

  ligaForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedEquipo = signal<IEquipo | null>(null);

  constructor() {
    // Efecto para cargar datos cuando cambia la liga de entrada
    effect(() => {
      const ligaData = this.liga;
      if (ligaData && this.ligaForm) {
        this.loadLigaData(ligaData);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (this.liga) {
      this.loadLigaData(this.liga);
    }
  }

  private initForm(): void {
    this.ligaForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      id_equipo: [null, Validators.required],
    });
  }

  private loadLigaData(liga: ILiga): void {
    const equipoId = liga.equipo?.id ?? null;

    this.ligaForm.patchValue({
      id: liga.id ?? 0,
      nombre: liga.nombre ?? '',
      id_equipo: equipoId,
    });

    if (equipoId) {
      this.syncEquipo(equipoId);
    }
  }

  private syncEquipo(idEquipo: number | null): void {
    if (!idEquipo) {
      this.selectedEquipo.set(null);
      return;
    }

    this.oEquipoService.get(idEquipo).subscribe({
      next: (equipo: IEquipo) => {
        this.selectedEquipo.set(equipo);
      },
      error: (err: HttpErrorResponse) => {
        this.selectedEquipo.set(null);
        console.error('Error al sincronizar equipo:', err);
        this.snackBar.open('Error al cargar el equipo seleccionado', 'Cerrar', { duration: 3000 });
      },
    });
  }

  openEquipoFinderModal(): void {
    const dialogRef = this.dialog.open(EquipoPlistAdminUnrouted, {
      height: '800px',
      width: '1000px',
      maxWidth: '95vw',
      panelClass: 'equipo-dialog',
      data: {
        title: 'Elegir equipo',
        message: 'Selecciona el equipo para la liga',
      },
    });

    dialogRef.afterClosed().subscribe((equipo: IEquipo | null) => {
      if (equipo && equipo.id) {
        this.ligaForm.patchValue({
          id_equipo: equipo.id,
        });
        this.syncEquipo(equipo.id);
        this.snackBar.open(`Equipo seleccionado: ${equipo.nombre}`, 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }

  get nombre() {
    return this.ligaForm.get('nombre');
  }

  get id_equipo() {
    return this.ligaForm.get('id_equipo');
  }

  onSubmit(): void {
    if (this.ligaForm.invalid) {
      Object.keys(this.ligaForm.controls).forEach((key) => {
        this.ligaForm.get(key)?.markAsTouched();
      });
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    const selectedEquipoId = this.ligaForm.value.id_equipo;

    if (!selectedEquipoId) {
      this.snackBar.open('Debe seleccionar un equipo', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    this.submitting.set(true);

    const ligaData: any = {
      nombre: this.ligaForm.value.nombre.trim(),
      equipo: {
        id: Number(selectedEquipoId),
        jugadores: [],
        cuotas: [],
        ligas: [],
      },
      partidos: [],
    };

    // Solo agregar el ID si estamos en modo edición
    if (this.mode === 'edit' && this.liga?.id) {
      ligaData.id = this.liga.id;
    }

    if (this.mode === 'edit') {
      this.saveUpdate(ligaData);
    } else {
      this.saveCreate(ligaData);
    }
  }

  private saveCreate(ligaData: any): void {
    this.oLigaService.create(ligaData).subscribe({
      next: (id: number) => {
        this.snackBar.open('Liga creada exitosamente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
        this.formSuccess.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error creando la liga');
        this.snackBar.open('Error creando la liga', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.submitting.set(false);
      },
    });
  }

  private saveUpdate(ligaData: any): void {
    this.oLigaService.update(ligaData).subscribe({
      next: (id: number) => {
        this.snackBar.open('Liga actualizada exitosamente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
        this.formSuccess.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error actualizando la liga');
        this.snackBar.open('Error actualizando la liga', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.submitting.set(false);
      },
    });
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
