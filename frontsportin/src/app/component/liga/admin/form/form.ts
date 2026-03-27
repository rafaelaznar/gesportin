import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LigaService } from '../../../../service/liga';
import { EquipoService } from '../../../../service/equipo';
import { SessionService } from '../../../../service/session';
import { ILiga } from '../../../../model/liga';
import { IEquipo } from '../../../../model/equipo';
import { EquipoAdminPlist } from '../../../equipo/admin/plist/plist';

@Component({
  selector: 'app-liga-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class LigaAdminForm implements OnInit {
  @Input() liga: ILiga | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private ligaService = inject(LigaService);
  private equipoService = inject(EquipoService);
  private sessionService = inject(SessionService);

  ligaForm!: FormGroup;
  loading = signal(false);
  submitting = signal(false);
  error = signal<string | null>(null);
  equipos = signal<IEquipo[]>([]);
  selectedEquipo = signal<IEquipo | null>(null);

  constructor() {
    effect(() => {
      const ligaInput = this.liga;
      if (ligaInput && this.ligaForm) {
        this.loadLigaData(ligaInput);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadEquipos();

    if (this.liga) {
      this.loadLigaData(this.liga);
    }
  }

  private initForm(): void {
    this.ligaForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      id_equipo: [null, Validators.required],
    });

    this.ligaForm.get('id_equipo')?.valueChanges.subscribe((id) => {
      if (id) {
        this.loadEquipo(Number(id));
      } else {
        this.selectedEquipo.set(null);
      }
    });
  }

  private loadEquipos(): void {
    const clubId = this.sessionService.getClubId();
    const pageParams = { page: 0, size: 1000, order: 'nombre', direction: 'asc' };

    if (this.sessionService.isClubAdmin() && clubId !== null) {
      this.equipoService
        .getPage(pageParams.page, pageParams.size, pageParams.order, pageParams.direction, '', clubId)
        .subscribe({
          next: (page) => this.equipos.set(page.content),
          error: (err: HttpErrorResponse) => {
            console.error(err);
            this.snackBar.open('Error cargando equipos del club', 'Cerrar', { duration: 3000 });
          },
        });
      return;
    }

    this.equipoService
      .getPage(pageParams.page, pageParams.size, pageParams.order, pageParams.direction)
      .subscribe({
        next: (page) => this.equipos.set(page.content),
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('Error cargando equipos', 'Cerrar', { duration: 3000 });
        },
      });
  }

  private loadLigaData(liga: ILiga): void {
    this.ligaForm.patchValue({
      id: liga.id ?? 0,
      nombre: liga.nombre ?? '',
      id_equipo: liga.equipo?.id ?? null,
    });
    if (liga.equipo?.id) {
      this.syncEquipo(liga.equipo.id);
    }
  }

  private loadEquipo(idEquipo: number): void {
    this.equipoService.get(idEquipo).subscribe({
      next: (equipo: IEquipo) => {
        this.selectedEquipo.set(equipo);
      },
      error: (err: HttpErrorResponse) => {
        this.selectedEquipo.set(null);
        console.error(err);
      },
    });
  }

  private syncEquipo(idEquipo: number): void {
    this.loadEquipo(idEquipo);
  }

  openEquipoFinderModal(): void {
    const dialogRef = this.dialog.open(EquipoAdminPlist, {
      height: '800px',
      width: '1100px',
      maxWidth: '95vw',
      panelClass: 'equipo-dialog',
      data: { title: 'Elegir equipo', message: 'Selecciona el equipo para la liga' },
    });

    dialogRef.afterClosed().subscribe((equipo: IEquipo | null) => {
      if (equipo && equipo.id != null) {
        this.ligaForm.patchValue({ id_equipo: equipo.id });
        this.syncEquipo(equipo.id);
        this.snackBar.open(`Equipo seleccionado: ${equipo.nombre}`, 'Cerrar', { duration: 3000 });
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
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      this.ligaForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const ligaData: any = {
      nombre: this.ligaForm.value.nombre,
      equipo: { id: Number(this.ligaForm.value.id_equipo) },
    };

    if (this.isEditMode && this.liga?.id) {
      ligaData.id = this.liga.id;
      this.ligaService.update(ligaData).subscribe({
        next: () => {
          this.snackBar.open('Liga actualizada', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.snackBar.open('Error actualizando la liga', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.ligaService.create(ligaData).subscribe({
        next: () => {
          this.snackBar.open('Liga creada', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.snackBar.open('Error creando la liga', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
