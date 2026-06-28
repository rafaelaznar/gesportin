import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { ImageUploadService } from '../../../../service/image-upload';
import { LoginService } from '../../../../service/login';
import { UsuarioService } from '../../../../service/usuarioService';
import { ClubService } from '../../../../service/club';
import { TipousuarioService } from '../../../../service/tipousuario';
import { RolusuarioService } from '../../../../service/rolusuario';
import { IUsuario } from '../../../../model/usuario';
import { IClub } from '../../../../model/club';
import { ITipousuario } from '../../../../model/tipousuario';
import { IRolusuario } from '../../../../model/rolusuario';
import { SessionService } from '../../../../service/session';
import { ClubPlistFinder } from '../../../club/finder/plist';
import { TipousuarioPlistFinder } from '../../../tipousuario/finder/plist';
import { RolusuarioPlistFinder } from '../../../rolusuario/finder/plist';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-usuario-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class UsuarioAdminForm implements OnInit {
  @Input() usuario: IUsuario | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private oLoginService = inject(LoginService);
  private oUsuarioService = inject(UsuarioService);
  private oClubService = inject(ClubService);
  private oTipousuarioService = inject(TipousuarioService);
  private oRolusuarioService = inject(RolusuarioService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);
  imageUpload: ImageUploadService = inject(ImageUploadService);

  usuarioForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedImage = signal<string | null>(null);
  selectedClub = signal<IClub | null>(null);
  selectedTipousuario = signal<ITipousuario | null>(null);
  selectedRolusuario = signal<IRolusuario | null>(null);
  clubError = signal(false);
  tipousuarioError = signal(false);
  rolusuarioError = signal(false);

  constructor() {
    effect(() => {
      const u = this.usuario;
      if (u && this.usuarioForm) {
        this.loadUsuarioData(u);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (this.usuario) {
      this.loadUsuarioData(this.usuario);
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
      genero: ['', Validators.required],
      id_tipousuario: [null, Validators.required],
      id_rolusuario: [null, Validators.required],
      id_club: [null, Validators.required],
      imagen: [null],
    });

    // On edit mode, password is optional
    if (this.isEditMode) {
      this.usuarioForm.patchValue({ password: { value: '', disabled: true } });
      this.usuarioForm.get('password')?.clearValidators();
      this.usuarioForm.get('password')?.updateValueAndValidity();
    }

    this.usuarioForm.get('id_tipousuario')?.valueChanges.pipe(debounceTime(800), distinctUntilChanged()).subscribe((id) => {
      if (id) { const n = typeof id === 'string' ? parseInt(id, 10) : id; if (!isNaN(n)) this.loadTipousuario(n); }
      else { this.selectedTipousuario.set(null); this.tipousuarioError.set(false); }
    });
    this.usuarioForm.get('id_rolusuario')?.valueChanges.pipe(debounceTime(800), distinctUntilChanged()).subscribe((id) => {
      if (id) { const n = typeof id === 'string' ? parseInt(id, 10) : id; if (!isNaN(n)) this.loadRolusuario(n); }
      else { this.selectedRolusuario.set(null); this.rolusuarioError.set(false); }
    });
    this.usuarioForm.get('id_club')?.valueChanges.pipe(debounceTime(800), distinctUntilChanged()).subscribe((id) => {
      if (id) { const n = typeof id === 'string' ? parseInt(id, 10) : id; if (!isNaN(n)) this.loadClub(n); }
      else { this.selectedClub.set(null); this.clubError.set(false); }
    });
  }

  private loadUsuarioData(usuario: IUsuario): void {
    this.usuarioForm.patchValue({
      id: usuario.id,
      nombre: usuario.nombre,
      apellido1: usuario.apellido1,
      apellido2: usuario.apellido2,
      username: usuario.username,
      genero: usuario.genero,
      id_tipousuario: usuario.tipousuario?.id,
      id_rolusuario: usuario.rolusuario?.id,
      id_club: usuario.club?.id,
      imagen: usuario.imagen || null,
    });
    if (usuario.tipousuario?.id) this.loadTipousuario(usuario.tipousuario.id);
    if (usuario.rolusuario?.id) this.loadRolusuario(usuario.rolusuario.id);
    if (usuario.club?.id) this.loadClub(usuario.club.id);
    if (usuario.imagen) {
      this.selectedImage.set(this.imageUpload.toPreviewSrc(usuario.imagen));
    }
  }

  private loadClub(idClub: number): void {
    this.clubError.set(false);
    this.oClubService.get(idClub).subscribe({
      next: (club) => { this.selectedClub.set(club); this.clubError.set(false); if (this.id_club?.hasError('notFound')) { const e={...this.id_club.errors}; delete (e as any)['notFound']; this.id_club?.setErrors(Object.keys(e).length>0?e:null); } },
      error: () => { this.selectedClub.set(null); this.clubError.set(true); this.id_club?.setErrors({ notFound: true }); },
    });
  }

  private loadTipousuario(idTipousuario: number): void {
    this.tipousuarioError.set(false);
    this.oTipousuarioService.get(idTipousuario).subscribe({
      next: (tipo) => { this.selectedTipousuario.set(tipo); this.tipousuarioError.set(false); if (this.id_tipousuario?.hasError('notFound')) { const e={...this.id_tipousuario.errors}; delete (e as any)['notFound']; this.id_tipousuario?.setErrors(Object.keys(e).length>0?e:null); } },
      error: () => { this.selectedTipousuario.set(null); this.tipousuarioError.set(true); this.id_tipousuario?.setErrors({ notFound: true }); },
    });
  }

  private loadRolusuario(idRolusuario: number): void {
    this.rolusuarioError.set(false);
    this.oRolusuarioService.get(idRolusuario).subscribe({
      next: (rol) => { this.selectedRolusuario.set(rol); this.rolusuarioError.set(false); if (this.id_rolusuario?.hasError('notFound')) { const e={...this.id_rolusuario.errors}; delete (e as any)['notFound']; this.id_rolusuario?.setErrors(Object.keys(e).length>0?e:null); } },
      error: () => { this.selectedRolusuario.set(null); this.rolusuarioError.set(true); this.id_rolusuario?.setErrors({ notFound: true }); },
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

  get genero() {
    return this.usuarioForm.get('genero');
  }

  openTipousuarioFinderModal(): void {
    const ref = this.modalService.open<unknown, ITipousuario | null>(TipousuarioPlistFinder);
    ref.afterClosed$.subscribe((tipo: ITipousuario | null) => {
      if (tipo?.id != null) {
        this.usuarioForm.patchValue({ id_tipousuario: tipo.id });
        this.selectedTipousuario.set(tipo);
        this.notificacion.success(`Tipo seleccionado: ${tipo.descripcion}`);
      }
    });
  }

  openRolusuarioFinderModal(): void {
    const ref = this.modalService.open<unknown, IRolusuario | null>(RolusuarioPlistFinder);
    ref.afterClosed$.subscribe((rol: IRolusuario | null) => {
      if (rol?.id != null) {
        this.usuarioForm.patchValue({ id_rolusuario: rol.id });
        this.selectedRolusuario.set(rol);
        this.notificacion.success(`Rol seleccionado: ${rol.descripcion}`);
      }
    });
  }

  openClubFinderModal(): void {
    const ref = this.modalService.open<unknown, IClub | null>(ClubPlistFinder);
    ref.afterClosed$.subscribe((club: IClub | null) => {
      if (club?.id != null) {
        this.usuarioForm.patchValue({ id_club: club.id });
        this.selectedClub.set(club);
        this.notificacion.success(`Club seleccionado: ${club.nombre}`);
      }
    });
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    try {
      const base64 = await this.imageUpload.fileToBase64(file);
      this.usuarioForm.patchValue({ imagen: base64 });
      this.selectedImage.set(this.imageUpload.toPreviewSrc(base64));
    } catch (err: any) {
      this.notificacion.error(err.message || 'Error al cargar la imagen');
    }
  }

  async onSubmit(): Promise<void> {
    if (this.usuarioForm.invalid) {
      this.notificacion.info('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const usuarioData: any = {
      nombre: this.usuarioForm.value.nombre,
      apellido1: this.usuarioForm.value.apellido1,
      apellido2: this.usuarioForm.value.apellido2,
      username: this.usuarioForm.value.username,
      genero: Number(this.usuarioForm.value.genero),
      tipousuario: { id: Number(this.usuarioForm.value.id_tipousuario) },
      rolusuario: { id: Number(this.usuarioForm.value.id_rolusuario) },
      club: { id: Number(this.usuarioForm.value.id_club) },
      imagen: this.usuarioForm.value.imagen || null,
    };

    if (!this.isEditMode) {
      const rawPassword = this.usuarioForm.value.password;
      if (rawPassword) {
        usuarioData.password = await this.oLoginService.sha256(rawPassword);
      } else {
        this.submitting.set(false);
        this.notificacion.error('La contraseña es obligatoria');
        return;
      }
    }

    if (this.isEditMode && this.usuario?.id) {
      usuarioData.id = this.usuario.id;
      this.oUsuarioService.update(usuarioData).subscribe({
        next: () => {
          this.notificacion.info('Usuario actualizado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el usuario');
          this.notificacion.error('Error actualizando el usuario');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oUsuarioService.create(usuarioData).subscribe({
        next: () => {
          this.notificacion.info('Usuario creado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el usuario');
          this.notificacion.error('Error creando el usuario');
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
