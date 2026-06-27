import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { EstadopartidoService } from '../../../../service/estadopartido';
import { IEstadopartido } from '../../../../model/estadopartido';

@Component({
  selector: 'app-estadopartido-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class EstadopartidoAdminForm implements OnInit {
  @Input() estadopartido: IEstadopartido | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private oEstadopartidoService = inject(EstadopartidoService);

  estadopartidoForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);

  constructor() {
    effect(() => {
      const e = this.estadopartido;
      if (e && this.estadopartidoForm) {
        this.loadData(e);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    if (this.estadopartido) {
      this.loadData(this.estadopartido);
    }
  }

  private initForm(): void {
    this.estadopartidoForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
  }

  private loadData(estadopartido: IEstadopartido): void {
    this.estadopartidoForm.patchValue({
      id: estadopartido.id,
      descripcion: estadopartido.descripcion,
    });
  }

  get descripcion() {
    return this.estadopartidoForm.get('descripcion');
  }

  onSubmit(): void {
    if (this.estadopartidoForm.invalid) {
      this.notificacion.success('Por favor, complete todos los campos correctamente');
      return;
    }
    this.submitting.set(true);
    const data: any = { descripcion: this.estadopartidoForm.value.descripcion };

    if (this.isEditMode && this.estadopartido?.id) {
      data.id = this.estadopartido.id;
      this.oEstadopartidoService.update(data).subscribe({
        next: () => {
          this.notificacion.success('Estado de partido actualizado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el estado de partido');
          this.notificacion.error('Error actualizando el estado de partido');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oEstadopartidoService.create(data).subscribe({
        next: () => {
          this.notificacion.success('Estado de partido creado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el estado de partido');
          this.notificacion.error('Error creando el estado de partido');
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
