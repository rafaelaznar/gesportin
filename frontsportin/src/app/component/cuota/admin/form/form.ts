import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { CuotaService } from '../../../../service/cuota';
import { EquipoService } from '../../../../service/equipo';
import { ICuota } from '../../../../model/cuota';
import { IEquipo } from '../../../../model/equipo';
import { SessionService } from '../../../../service/session';
import { EquipoPlistFinder } from '../../../equipo/finder/plist';

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
  private notificacion = inject(NotificacionService);
  private oCuotaService = inject(CuotaService);
  private oEquipoService = inject(EquipoService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  cuotaForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedEquipo = signal<IEquipo | null>(null);

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
  }

  private loadCuotaData(cuota: ICuota): void {
    this.cuotaForm.patchValue({
      id: cuota.id,
      descripcion: cuota.descripcion,
      cantidad: cuota.cantidad,
      fecha: cuota.fecha,
      id_equipo: cuota.equipo?.id,
    });
    if (cuota.equipo?.id) this.loadEquipo(cuota.equipo.id);
  }

  private loadEquipo(idEquipo: number): void {
    this.oEquipoService.get(idEquipo).subscribe({
      next: (equipo) => this.selectedEquipo.set(equipo),
      error: () => this.selectedEquipo.set(null),
    });
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

  openEquipoFinderModal(): void {
    const ref = this.modalService.open<unknown, IEquipo | null>(EquipoPlistFinder);
    ref.afterClosed$.subscribe((equipo: IEquipo | null) => {
      if (equipo?.id != null) {
        this.cuotaForm.patchValue({ id_equipo: equipo.id });
        this.selectedEquipo.set(equipo);
        this.notificacion.success(`Equipo seleccionado: ${equipo.nombre}`);
      }
    });
  }

  onSubmit(): void {
    if (this.cuotaForm.invalid) {
      this.notificacion.success('Por favor, complete todos los campos correctamente');
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
          this.notificacion.success('Cuota actualizada exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando la cuota');
          this.notificacion.error('Error actualizando la cuota');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oCuotaService.create(cuotaData).subscribe({
        next: () => {
          this.notificacion.success('Cuota creada exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando la cuota');
          this.notificacion.error('Error creando la cuota');
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
