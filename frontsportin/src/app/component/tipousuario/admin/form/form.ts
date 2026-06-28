import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { TipousuarioService } from '../../../../service/tipousuario';
import { ITipousuario } from '../../../../model/tipousuario';

@Component({
  selector: 'app-tipousuario-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class TipousuarioAdminForm implements OnInit {
  @Input() tipousuario: ITipousuario | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private oTipousuarioService = inject(TipousuarioService);
  private modalService = inject(ModalService);

  tipousuarioForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);

  constructor() {
    effect(() => {
      const t = this.tipousuario;
      if (t && this.tipousuarioForm) {
        this.loadTipousuarioData(t);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (this.tipousuario) {
      this.loadTipousuarioData(this.tipousuario);
    }
  }

  private initForm(): void {
    this.tipousuarioForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
  }

  private loadTipousuarioData(tipousuario: ITipousuario): void {
    this.tipousuarioForm.patchValue({
      id: tipousuario.id,
      descripcion: tipousuario.descripcion,
    });
  }

  get descripcion() {
    return this.tipousuarioForm.get('descripcion');
  }

  onSubmit(): void {
    if (this.tipousuarioForm.invalid) {
      this.notificacion.info('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const tipousuarioData: any = {
      descripcion: this.tipousuarioForm.value.descripcion,
    };

    if (this.isEditMode && this.tipousuario?.id) {
      tipousuarioData.id = this.tipousuario.id;
      this.oTipousuarioService.update(tipousuarioData).subscribe({
        next: () => {
          this.notificacion.info('Tipo de usuario actualizado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el tipo de usuario');
          this.notificacion.error('Error actualizando el tipo de usuario');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oTipousuarioService.create(tipousuarioData).subscribe({
        next: () => {
          this.notificacion.info('Tipo de usuario creado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el tipo de usuario');
          this.notificacion.error('Error creando el tipo de usuario');
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
