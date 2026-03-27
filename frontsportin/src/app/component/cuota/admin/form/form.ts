import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CuotaService } from '../../../../service/cuota';
import { EquipoService } from '../../../../service/equipo';
import { ICuota } from '../../../../model/cuota';
import { IEquipo } from '../../../../model/equipo';
import { SessionService } from '../../../../service/session';

@Component({
  selector: 'app-cuota-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class CuotaAdminForm implements OnInit {
  @Input() cuota: ICuota | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oCuotaService = inject(CuotaService);
  private oEquipoService = inject(EquipoService);
  private dialog = inject(MatDialog);
  private sessionService = inject(SessionService);

  cuotaForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  equipos = signal<IEquipo[]>([]);
  selectedEquipo = signal<IEquipo | null>(null);
  displayIdEquipo = signal<number | null>(null);

  constructor() {
    effect(() => {
      const c = this.cuota;
      if (c && this.cuotaForm) {
        this.loadCuotaData(c);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadEquipos();

    if (this.cuota) {
      this.loadCuotaData(this.cuota);
    }
  }

  private initForm(): void {
    this.cuotaForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      fecha: ['', Validators.required],
      id_equipo: [null, Validators.required],
    });

    this.cuotaForm.get('id_equipo')?.valueChanges.subscribe((id) => {
      if (id) {
        this.loadEquipo(Number(id));
      } else {
        this.selectedEquipo.set(null);
        this.displayIdEquipo.set(null);
      }
    });
  }

  private loadCuotaData(cuota: ICuota): void {
    this.cuotaForm.patchValue({
      id: cuota.id,
      descripcion: cuota.descripcion,
      cantidad: cuota.cantidad,
      fecha: cuota.fecha,
      id_equipo: cuota.equipo?.id,
    });
    if (cuota.equipo?.id) {
      this.syncEquipo(cuota.equipo.id);
    }
  }

  private loadEquipo(idEquipo: number): void {
    this.oEquipoService.get(idEquipo).subscribe({
      next: (equipo) => {
        this.selectedEquipo.set(equipo);
        this.displayIdEquipo.set(equipo.id ?? null);
      },
      error: (err: HttpErrorResponse) => {
        this.selectedEquipo.set(null);
        this.displayIdEquipo.set(null);
        console.error(err);
        this.snackBar.open('Error cargando el equipo', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private loadEquipos(): void {
    const clubId = this.sessionService.isClubAdmin() ? this.sessionService.getClubId() ?? 0 : 0;
    const equipos$ = clubId > 0 ? this.oEquipoService.getPage(0, 1000, 'nombre', 'asc', '', clubId) : this.oEquipoService.getPage(0, 1000, 'nombre', 'asc', '');

    equipos$.subscribe({
      next: (page) => {
        this.equipos.set(page.content);
        const currentId = this.cuotaForm.get('id_equipo')?.value;
        if (currentId) {
          this.syncEquipo(Number(currentId));
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackBar.open('Error cargando equipos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private syncEquipo(idEquipo: number): void {
    const selected = this.equipos().find((e) => e.id === idEquipo) || null;
    this.selectedEquipo.set(selected);
    this.displayIdEquipo.set(selected?.id ?? null);
  }

  get descripcion() {
    return this.cuotaForm.get('descripcion');
  }

  get cantidad() {
    return this.cuotaForm.get('cantidad');
  }

  get fecha() {
    return this.cuotaForm.get('fecha');
  }

  get id_equipo() {
    return this.cuotaForm.get('id_equipo');
  }

  onSubmit(): void {
    if (this.cuotaForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const cuotaData: any = {
      descripcion: this.cuotaForm.value.descripcion,
      cantidad: Number(this.cuotaForm.value.cantidad),
      fecha: this.cuotaForm.value.fecha,
      equipo: { id: Number(this.cuotaForm.value.id_equipo) },
    };

    if (this.isEditMode && this.cuota?.id) {
      cuotaData.id = this.cuota.id;
      this.oCuotaService.update(cuotaData).subscribe({
        next: () => {
          this.snackBar.open('Cuota actualizada exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando la cuota');
          this.snackBar.open('Error actualizando la cuota', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oCuotaService.create(cuotaData).subscribe({
        next: () => {
          this.snackBar.open('Cuota creada exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando la cuota');
          this.snackBar.open('Error creando la cuota', 'Cerrar', { duration: 4000 });
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
