import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';;
import { ModalService } from '../../../shared/modal/modal.service';
import { JugadorService } from '../../../../service/jugador-service';
import { EquipoService } from '../../../../service/equipo';
import { UsuarioService } from '../../../../service/usuarioService';
import { ImageUploadService } from '../../../../service/image-upload';
import { IJugador } from '../../../../model/jugador';
import { IEquipo } from '../../../../model/equipo';
import { IUsuario } from '../../../../model/usuario';
import { SessionService } from '../../../../service/session';
import { EquipoAdminPlist } from '../../../equipo/admin/plist/plist';
import { UsuarioAdminPlist } from '../../../usuario/admin/plist/plist';

@Component({
  selector: 'app-jugador-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class JugadorAdminForm implements OnInit {
  @Input() jugador: IJugador | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private oJugadorService = inject(JugadorService);
  private oEquipoService = inject(EquipoService);
  private oUsuarioService = inject(UsuarioService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);
  public imageUpload = inject(ImageUploadService);

  jugadorForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedEquipo = signal<IEquipo | null>(null);
  selectedUsuario = signal<IUsuario | null>(null);

  constructor() {
    effect(() => {
      const j = this.jugador;
      if (j && this.jugadorForm) {
        this.loadJugadorData(j);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (this.jugador) {
      this.loadJugadorData(this.jugador);
    }
  }

  private initForm(): void {
    this.jugadorForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      dorsal: [0, [Validators.required, Validators.min(1)]],
      posicion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      capitan: [false, Validators.required],
      imagen: [null],
      id_equipo: [null, Validators.required],
      id_usuario: [null, Validators.required],
    });
  }

  private loadJugadorData(jugador: IJugador): void {
    this.jugadorForm.patchValue({
      id: jugador.id,
      dorsal: jugador.dorsal,
      posicion: jugador.posicion,
      capitan: jugador.capitan,
      imagen: jugador.imagen || null,
      id_equipo: jugador.equipo?.id,
      id_usuario: jugador.usuario?.id,
    });
    if (jugador.equipo?.id) this.loadEquipo(jugador.equipo.id);
    if (jugador.usuario?.id) this.loadUsuario(jugador.usuario.id);
  }

  private loadEquipo(idEquipo: number): void {
    this.oEquipoService.get(idEquipo).subscribe({
      next: (equipo) => this.selectedEquipo.set(equipo),
      error: () => this.selectedEquipo.set(null),
    });
  }

  private loadUsuario(idUsuario: number): void {
    this.oUsuarioService.get(idUsuario).subscribe({
      next: (usuario) => this.selectedUsuario.set(usuario),
      error: () => this.selectedUsuario.set(null),
    });
  }

  get dorsal() {
    return this.jugadorForm.get('dorsal');
  }

  get posicion() {
    return this.jugadorForm.get('posicion');
  }

  get capitan() {
    return this.jugadorForm.get('capitan');
  }

  get id_equipo() {
    return this.jugadorForm.get('id_equipo');
  }

  get id_usuario() {
    return this.jugadorForm.get('id_usuario');
  }

  openEquipoFinderModal(): void {
    const ref = this.modalService.open<unknown, IEquipo | null>(EquipoAdminPlist);
    ref.afterClosed$.subscribe((equipo: IEquipo | null) => {
      if (equipo?.id != null) {
        this.jugadorForm.patchValue({ id_equipo: equipo.id });
        this.selectedEquipo.set(equipo);
        this.notificacion.success(`Equipo seleccionado: ${equipo.nombre}`);
      }
    });
  }

  openUsuarioFinderModal(): void {
    const ref = this.modalService.open<unknown, IUsuario | null>(UsuarioAdminPlist);
    ref.afterClosed$.subscribe((usuario: IUsuario | null) => {
      if (usuario?.id != null) {
        this.jugadorForm.patchValue({ id_usuario: usuario.id });
        this.selectedUsuario.set(usuario);
        this.notificacion.success(`Usuario seleccionado: ${usuario.nombre} ${usuario.apellido1}`);
      }
    });
  }

  onSubmit(): void {
    if (this.jugadorForm.invalid) {
      this.notificacion.info('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const jugadorData: any = {
      dorsal: Number(this.jugadorForm.value.dorsal),
      posicion: this.jugadorForm.value.posicion,
      capitan: Boolean(this.jugadorForm.value.capitan),
      imagen: this.jugadorForm.value.imagen || null,
      equipo: { id: Number(this.jugadorForm.value.id_equipo) },
      usuario: { id: Number(this.jugadorForm.value.id_usuario) },
    };

    if (this.isEditMode && this.jugador?.id) {
      jugadorData.id = this.jugador.id;
      this.oJugadorService.update(jugadorData).subscribe({
        next: () => {
          this.notificacion.info('Jugador actualizado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el jugador');
          this.notificacion.error('Error actualizando el jugador');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oJugadorService.create(jugadorData).subscribe({
        next: () => {
          this.notificacion.info('Jugador creado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el jugador');
          this.notificacion.error('Error creando el jugador');
          console.error(err);
          this.submitting.set(false);
        },
      });
    }
  }

  async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.notificacion.error('Selecciona una imagen válida');
      input.value = '';
      return;
    }

    try {
      const base64 = await this.imageUpload.fileToBase64(file);
      this.jugadorForm.patchValue({ imagen: base64 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo procesar la imagen';
      this.notificacion.error(message);
      input.value = '';
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
