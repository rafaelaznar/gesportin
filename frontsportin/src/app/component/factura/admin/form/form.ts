import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { FacturaService } from '../../../../service/factura-service';
import { UsuarioService } from '../../../../service/usuarioService';
import { UsuarioPlistFinder } from '../../../usuario/finder/plist';
import { IFactura } from '../../../../model/factura';
import { IUsuario } from '../../../../model/usuario';
import { SessionService } from '../../../../service/session';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-factura-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class FacturaAdminForm implements OnInit {
  @Input() factura: IFactura | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private oFacturaService = inject(FacturaService);
  private oUsuarioService = inject(UsuarioService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  facturaForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedUsuario = signal<IUsuario | null>(null);
  usuarioError = signal(false);

  constructor() {
    effect(() => {
      const f = this.factura;
      if (f && this.facturaForm) {
        this.loadFacturaData(f);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (this.factura) {
      this.loadFacturaData(this.factura);
    }
  }

  private initForm(): void {
    this.facturaForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      fecha: ['', Validators.required],
      id_usuario: [null, Validators.required],
    });

    this.facturaForm.get('id_usuario')?.valueChanges.pipe(debounceTime(800), distinctUntilChanged()).subscribe((id) => {
      if (id) { const n = typeof id === 'string' ? parseInt(id, 10) : id; if (!isNaN(n)) this.loadUsuario(n); }
      else { this.selectedUsuario.set(null); this.usuarioError.set(false); }
    });
  }

  private loadFacturaData(factura: IFactura): void {
    this.facturaForm.patchValue({
      id: factura.id,
      fecha: factura.fecha,
      id_usuario: factura.usuario?.id,
    });
    if (factura.usuario?.id) {
      this.loadUsuario(factura.usuario.id);
    }
  }

  private loadUsuario(idUsuario: number): void {
    this.usuarioError.set(false);
    this.oUsuarioService.get(idUsuario).subscribe({
      next: (usuario) => { this.selectedUsuario.set(usuario); this.usuarioError.set(false); if (this.id_usuario?.hasError('notFound')) { const e={...this.id_usuario.errors}; delete (e as any)['notFound']; this.id_usuario?.setErrors(Object.keys(e).length>0?e:null); } },
      error: () => { this.selectedUsuario.set(null); this.usuarioError.set(true); this.id_usuario?.setErrors({ notFound: true }); },
    });
  }

  openUsuarioFinderModal(): void {
    const ref = this.modalService.open<unknown, IUsuario | null>(UsuarioPlistFinder);
    ref.afterClosed$.subscribe((usuario: IUsuario | null) => {
      if (usuario?.id != null) {
        this.facturaForm.patchValue({ id_usuario: usuario.id });
        this.selectedUsuario.set(usuario);
        this.notificacion.success(`Usuario seleccionado: ${usuario.nombre} ${usuario.apellido1}`);
      }
    });
  }

  get fecha() {
    return this.facturaForm.get('fecha');
  }

  get id_usuario() {
    return this.facturaForm.get('id_usuario');
  }

  onSubmit(): void {
    if (this.facturaForm.invalid) {
      this.notificacion.info('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const rawFecha = this.facturaForm.value.fecha;
    const facturaData: any = {
      fecha: rawFecha && !rawFecha.includes('T') ? rawFecha + 'T00:00:00' : rawFecha,
      usuario: { id: Number(this.facturaForm.value.id_usuario) },
    };

    if (this.isEditMode && this.factura?.id) {
      facturaData.id = this.factura.id;
      this.oFacturaService.update(facturaData).subscribe({
        next: () => {
          this.notificacion.info('Factura actualizada exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando la factura');
          this.notificacion.error('Error actualizando la factura');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oFacturaService.create(facturaData).subscribe({
        next: () => {
          this.notificacion.info('Factura creada exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando la factura');
          this.notificacion.error('Error creando la factura');
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
