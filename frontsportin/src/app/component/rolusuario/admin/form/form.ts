import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { RolusuarioService } from '../../../../service/rolusuario';
import { IRolusuario } from '../../../../model/rolusuario';

@Component({
  selector: 'app-rolusuario-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class RolusuarioAdminForm implements OnInit {
  @Input() rolusuario: IRolusuario | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private oRolusuarioService = inject(RolusuarioService);
  private modalService = inject(ModalService);

  rolusuarioForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);

  constructor() {
    effect(() => {
      const r = this.rolusuario;
      if (r && this.rolusuarioForm) {
        this.loadRolusuarioData(r);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (this.rolusuario) {
      this.loadRolusuarioData(this.rolusuario);
    }
  }

  private initForm(): void {
    this.rolusuarioForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
  }

  private loadRolusuarioData(rolusuario: IRolusuario): void {
    this.rolusuarioForm.patchValue({
      id: rolusuario.id,
      descripcion: rolusuario.descripcion,
    });
  }

  get descripcion() {
    return this.rolusuarioForm.get('descripcion');
  }

  onSubmit(): void {
    if (this.rolusuarioForm.invalid) {
      this.notificacion.info('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const rolusuarioData: any = {
      descripcion: this.rolusuarioForm.value.descripcion,
    };

    if (this.isEditMode && this.rolusuario?.id) {
      rolusuarioData.id = this.rolusuario.id;
      this.oRolusuarioService.update(rolusuarioData).subscribe({
        next: () => {
          this.notificacion.info('Rol de usuario actualizado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el rol de usuario');
          this.notificacion.error('Error actualizando el rol de usuario');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oRolusuarioService.create(rolusuarioData).subscribe({
        next: () => {
          this.notificacion.info('Rol de usuario creado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el rol de usuario');
          this.notificacion.error('Error creando el rol de usuario');
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
