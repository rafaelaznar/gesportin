import { Component, OnInit, inject, signal, effect, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { UsuarioService } from '../../../../service/usuarioService';
import { ClubService } from '../../../../service/club';
import { TipousuarioService } from '../../../../service/tipousuario';
import { RolusuarioService } from '../../../../service/rolusuario';
import { IUsuario } from '../../../../model/usuario';
import { IClub } from '../../../../model/club';
import { ITipousuario } from '../../../../model/tipousuario';
import { IRolusuario } from '../../../../model/rolusuario';
import { SessionService } from '../../../../service/session';
import { ClubAdminPlist } from '../../../club/admin/plist/plist';
import { TipousuarioAdminPlist } from '../../../tipousuario/admin/plist/plist';
import { RolusuarioAdminPlist } from '../../../rolusuario/admin/plist/plist';

@Component({
  selector: 'app-usuario-teamadmin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class UsuarioTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/usuario/teamadmin');

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private oUsuarioService = inject(UsuarioService);
  private oClubService = inject(ClubService);
  private oTipousuarioService = inject(TipousuarioService);
  private oRolusuarioService = inject(RolusuarioService);
  private modalService = inject(ModalService);
  sessionService = inject(SessionService);

  usuarioForm!: FormGroup;
  error = signal<string | null>(null);
  loading = signal<boolean>(false);
  submitting = signal(false);
  selectedClub = signal<IClub | null>(null);
  selectedTipousuario = signal<ITipousuario | null>(null);
  selectedRolusuario = signal<IRolusuario | null>(null);

  ngOnInit(): void {
    this.initForm();

    if (this.id() > 0) {
      this.loadById(this.id());
    } else {
      // Auto-fill club and tipousuario for club admin
      if (this.sessionService.isClubAdmin()) {
        const clubId = this.sessionService.getClubId();
        if (clubId) {
          this.usuarioForm.patchValue({ id_club: clubId });
          this.loadClub(clubId);
        }
        // Auto-set tipousuario to 3 (Usuario) - club admin can only create regular users
        this.usuarioForm.patchValue({ id_tipousuario: 3 });
        this.loadTipousuario(3);
      }
      this.loading?.set(false);
    }
  }

  private initForm(): void {
    this.usuarioForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      apellido1: ['', [Validators.maxLength(100)]],
      apellido2: ['', [Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      id_tipousuario: [null, Validators.required],
      id_rolusuario: [null, Validators.required],
      id_club: [null, Validators.required],
    });

    // On edit mode, password is optional
    if (this.id() > 0) {
      this.usuarioForm.patchValue({ password: { value: '', disabled: true } });
      this.usuarioForm.get('password')?.clearValidators();
      this.usuarioForm.get('password')?.updateValueAndValidity();
    }
  }

  private loadById(id: number): void {
    this.loading.set(true);
    this.oUsuarioService.get(id).subscribe({
      next: (data: IUsuario) => {
        this.loadUsuarioData(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el registro');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  private loadUsuarioData(usuario: IUsuario): void {
    this.usuarioForm.patchValue({
      id: usuario.id,
      nombre: usuario.nombre,
      apellido1: usuario.apellido1,
      apellido2: usuario.apellido2,
      username: usuario.username,
      id_tipousuario: usuario.tipousuario?.id,
      id_rolusuario: usuario.rolusuario?.id,
      id_club: usuario.club?.id,
    });
    if (usuario.tipousuario?.id) this.loadTipousuario(usuario.tipousuario.id);
    if (usuario.rolusuario?.id) this.loadRolusuario(usuario.rolusuario.id);
    if (usuario.club?.id) this.loadClub(usuario.club.id);
  }

  private loadClub(idClub: number): void {
    this.oClubService.get(idClub).subscribe({
      next: (club) => this.selectedClub.set(club),
      error: () => this.selectedClub.set(null),
    });
  }

  private loadTipousuario(idTipousuario: number): void {
    this.oTipousuarioService.get(idTipousuario).subscribe({
      next: (tipo) => this.selectedTipousuario.set(tipo),
      error: () => this.selectedTipousuario.set(null),
    });
  }

  private loadRolusuario(idRolusuario: number): void {
    this.oRolusuarioService.get(idRolusuario).subscribe({
      next: (rol) => this.selectedRolusuario.set(rol),
      error: () => this.selectedRolusuario.set(null),
    });
  }

  get nombre() {
    return this.usuarioForm.get('nombre');
  }

  get apellido1() {
    return this.usuarioForm.get('apellido1');
  }

  get apellido2() {
    return this.usuarioForm.get('apellido2');
  }

  get username() {
    return this.usuarioForm.get('username');
  }

  get password() {
    return this.usuarioForm.get('password');
  }

  get id_tipousuario() {
    return this.usuarioForm.get('id_tipousuario');
  }

  get id_rolusuario() {
    return this.usuarioForm.get('id_rolusuario');
  }

  get id_club() {
    return this.usuarioForm.get('id_club');
  }

  openTipousuarioFinderModal(): void {
    const ref = this.modalService.open<unknown, ITipousuario | null>(TipousuarioAdminPlist);
    ref.afterClosed$.subscribe((tipo: ITipousuario | null) => {
      if (tipo?.id != null) {
        this.usuarioForm.patchValue({ id_tipousuario: tipo.id });
        this.selectedTipousuario.set(tipo);
        this.notificacion.success(`Tipo seleccionado: ${tipo.descripcion}`);
      }
    });
  }

  openRolusuarioFinderModal(): void {
    const ref = this.modalService.open<unknown, IRolusuario | null>(RolusuarioAdminPlist);
    ref.afterClosed$.subscribe((rol: IRolusuario | null) => {
      if (rol?.id != null) {
        this.usuarioForm.patchValue({ id_rolusuario: rol.id });
        this.selectedRolusuario.set(rol);
        this.notificacion.success(`Rol seleccionado: ${rol.descripcion}`);
      }
    });
  }

  openClubFinderModal(): void {
    const ref = this.modalService.open<unknown, IClub | null>(ClubAdminPlist);
    ref.afterClosed$.subscribe((club: IClub | null) => {
      if (club?.id != null) {
        this.usuarioForm.patchValue({ id_club: club.id });
        this.selectedClub.set(club);
        this.notificacion.success(`Club seleccionado: ${club.nombre}`);
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.notificacion.success('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const usuarioData: any = {
      nombre: this.usuarioForm.value.nombre,
      apellido1: this.usuarioForm.value.apellido1,
      apellido2: this.usuarioForm.value.apellido2,
      username: this.usuarioForm.value.username,
      tipousuario: { id: Number(this.usuarioForm.value.id_tipousuario) },
      rolusuario: { id: Number(this.usuarioForm.value.id_rolusuario) },
      club: { id: Number(this.usuarioForm.value.id_club) },
    };

    if (this.id() <= 0) {
      usuarioData.password = this.usuarioForm.value.password;
    }

    if (this.id() > 0) {
      usuarioData.id = this.id();
      this.oUsuarioService.update(usuarioData).subscribe({
        next: () => {
          this.notificacion.success('Usuario actualizado exitosamente');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el usuario');
          this.notificacion.success('Error actualizando el usuario');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oUsuarioService.create(usuarioData).subscribe({
        next: () => {
          this.notificacion.success('Usuario creado exitosamente');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el usuario');
          this.notificacion.success('Error creando el usuario');
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
