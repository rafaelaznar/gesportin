import { Component, OnInit, inject, signal, effect, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { FacturaService } from '../../../../service/factura-service';
import { UsuarioService } from '../../../../service/usuarioService';
import { UsuarioAdminPlist } from '../../../usuario/admin/plist/plist';
import { IFactura } from '../../../../model/factura';
import { IUsuario } from '../../../../model/usuario';
import { SessionService } from '../../../../service/session';

@Component({
  selector: 'app-factura-teamadmin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class FacturaTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/factura/teamadmin');

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private oFacturaService = inject(FacturaService);
  private oUsuarioService = inject(UsuarioService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  facturaForm!: FormGroup;
  error = signal<string | null>(null);
  loading = signal<boolean>(false);
  submitting = signal(false);
  selectedUsuario = signal<IUsuario | null>(null);

  ngOnInit(): void {
    this.initForm();

    if (this.id() > 0) {
      this.loadById(this.id());
    } else {
      this.loading?.set(false);
    }
  }

  private initForm(): void {
    this.facturaForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      fecha: ['', Validators.required],
      id_usuario: [null, Validators.required],
    });
  }

  private loadById(id: number): void {
    this.loading.set(true);
    this.oFacturaService.get(id).subscribe({
      next: (data: IFactura) => {
        this.loadFacturaData(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el registro');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  private loadFacturaData(factura: IFactura): void {
    this.facturaForm.patchValue({
      id: factura.id,
      fecha: factura.fecha,
      id_usuario: factura.usuario?.id,
    });
    const usuario = factura.usuario;
    if (factura.usuario?.id) {
      this.loadUsuario(factura.usuario.id);
    }
  }

  private loadUsuario(idUsuario: number): void {
    this.oUsuarioService.get(idUsuario).subscribe({
      next: (usuario) => this.selectedUsuario.set(usuario),
      error: () => this.selectedUsuario.set(null),
    });
  }

  openUsuarioFinderModal(): void {
    const ref = this.modalService.open<unknown, IUsuario | null>(UsuarioAdminPlist);
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
      this.notificacion.success('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const facturaData: any = {
      fecha: this.facturaForm.value.fecha,
      usuario: { id: Number(this.facturaForm.value.id_usuario) },
    };

    if (this.id() > 0) {
      facturaData.id = this.id();
      this.oFacturaService.update(facturaData).subscribe({
        next: () => {
          this.notificacion.success('Factura actualizada exitosamente');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando la factura');
          this.notificacion.success('Error actualizando la factura');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oFacturaService.create(facturaData).subscribe({
        next: () => {
          this.notificacion.success('Factura creada exitosamente');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando la factura');
          this.notificacion.success('Error creando la factura');
          console.error(err);
          this.submitting.set(false);
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.returnUrl()]);
  }
}
