import { Component, OnInit, inject, signal, effect, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { JugadorService } from '../../../../service/jugador-service';
import { EquipoService } from '../../../../service/equipo';
import { UsuarioService } from '../../../../service/usuarioService';
import { IJugador } from '../../../../model/jugador';
import { IEquipo } from '../../../../model/equipo';
import { IUsuario } from '../../../../model/usuario';
import { SessionService } from '../../../../service/session';
import { EquipoAdminPlist } from '../../../equipo/admin/plist/plist';
import { UsuarioDisponiblePlist } from '../../../usuario/teamadmin/usuario-disponible-plist/plist';

@Component({
  selector: 'app-jugador-teamadmin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class JugadorTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/jugador/teamadmin');
  idEquipo = input<number>(0);

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private oJugadorService = inject(JugadorService);
  private oEquipoService = inject(EquipoService);
  private oUsuarioService = inject(UsuarioService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  jugadorForm!: FormGroup;
  error = signal<string | null>(null);
  loading = signal<boolean>(false);
  submitting = signal(false);
  selectedEquipo = signal<IEquipo | null>(null);
  selectedUsuario = signal<IUsuario | null>(null);

  ngOnInit(): void {
    this.initForm();

    if (this.id() > 0) {
      this.loadById(this.id());
    } else {
      if (this.idEquipo() > 0) {
        this.jugadorForm.patchValue({ id_equipo: this.idEquipo() });
        this.loadEquipo(this.idEquipo());
      }
      this.loading?.set(false);
    }
  }

  private initForm(): void {
    this.jugadorForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      dorsal: [0, [Validators.required, Validators.min(1)]],
      posicion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      capitan: [false, Validators.required],
      id_equipo: [null, Validators.required],
      id_usuario: [null, Validators.required],
    });
  }

  private loadById(id: number): void {
    this.loading.set(true);
    this.oJugadorService.getById(id).subscribe({
      next: (data: IJugador) => {
        this.loadJugadorData(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el registro');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  private loadJugadorData(jugador: IJugador): void {
    this.jugadorForm.patchValue({
      id: jugador.id,
      dorsal: jugador.dorsal,
      posicion: jugador.posicion,
      capitan: jugador.capitan,
      id_equipo: jugador.equipo?.id,
      id_usuario: jugador.usuario?.id,
    });
    if (jugador.equipo?.id) this.loadEquipo(jugador.equipo.id);
    if (jugador.usuario?.id) this.loadUsuario(jugador.usuario.id);
  }

  private loadEquipo(idEquipo: number): void {
    this.oEquipoService.get(idEquipo).subscribe({
      next: (equipo) => {
        this.selectedEquipo.set(equipo);
        const cat = equipo.categoria;
        const temp = cat?.temporada;
        const isEdit = this.id() > 0;
      },
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
    const idEquipo = this.selectedEquipo()?.id ?? (Number(this.jugadorForm.get('id_equipo')?.value) || 0);
    const ref = this.modalService.open<{ idEquipo: number }, IUsuario | null>(
      UsuarioDisponiblePlist,
      { data: { idEquipo } },
    );
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
      this.notificacion.success('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const jugadorData: any = {
      dorsal: Number(this.jugadorForm.value.dorsal),
      posicion: this.jugadorForm.value.posicion,
      capitan: Boolean(this.jugadorForm.value.capitan),
      equipo: { id: Number(this.jugadorForm.value.id_equipo) },
      usuario: { id: Number(this.jugadorForm.value.id_usuario) },
    };

    if (this.id() > 0) {
      jugadorData.id = this.id();
      this.oJugadorService.update(jugadorData).subscribe({
        next: () => {
          this.notificacion.success('Jugador actualizado exitosamente');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el jugador');
          this.notificacion.success('Error actualizando el jugador');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oJugadorService.create(jugadorData).subscribe({
        next: () => {
          this.notificacion.success('Jugador creado exitosamente');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el jugador');
          this.notificacion.success('Error creando el jugador');
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
