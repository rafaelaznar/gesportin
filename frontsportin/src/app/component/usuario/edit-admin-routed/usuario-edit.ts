import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../../service/usuarioService';
import { IUsuario } from '../../../model/usuario';
import { IClub } from '../../../model/club';
import { ITipousuario } from '../../../model/tipousuario';
import { IRolusuario } from '../../../model/rolusuario';
import { ClubService } from '../../../service/club';
import { TipousuarioService } from '../../../service/tipousuario';
import { RolusuarioService } from '../../../service/rolusuario';

@Component({
  selector: 'app-edit-admin-routed',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './usuario-edit.html',
  styleUrl: './usuario-edit.css',
})
export class UsuarioEditAdminRouted implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private oUsuarioService = inject(UsuarioService);
  private oClubService = inject(ClubService);
  private oTipousuarioService = inject(TipousuarioService);
  private oRolusuarioService = inject(RolusuarioService);
  private snackBar = inject(MatSnackBar);

  usuarioForm!: FormGroup;
  id_usuario = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);
  clubs = signal<IClub[]>([]);
  tipousuarios = signal<ITipousuario[]>([]);
  rolusuarios = signal<IRolusuario[]>([]);
  usuarioActual = signal<IUsuario | null>(null);

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarClubs();
    this.cargarTipousuarios();
    this.cargarRolusuarios();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de usuario no válido');
      this.loading.set(false);
      return;
    }

    this.id_usuario.set(Number(idParam));

    if (isNaN(this.id_usuario())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.cargarUsuario();
  }

  inicializarFormulario(): void {
    this.usuarioForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      apellido1: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      apellido2: ['', [Validators.minLength(2), Validators.maxLength(255)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      genero: [0, [Validators.required]],
      fechaAlta: [{ value: '', disabled: true }],
      id_club: [null, Validators.required],
      id_tipousuario: [null, Validators.required],
      id_rolusuario: [null, Validators.required]
    });
  }

  cargarUsuario(): void {
    this.oUsuarioService.get(this.id_usuario()).subscribe({
      next: (usuario: IUsuario) => {
        this.usuarioActual.set(usuario);
        this.usuarioForm.patchValue({
          id: usuario.id,
          nombre: usuario.nombre,
          apellido1: usuario.apellido1,
          apellido2: usuario.apellido2,
          username: usuario.username,
          password: usuario.password,
          genero: usuario.genero,
          fechaAlta: usuario.fechaAlta,
          id_club: usuario.club?.id || null,
          id_tipousuario: usuario.tipousuario?.id || null,
          id_rolusuario: usuario.rolusuario?.id || null
        });
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error al cargar el usuario');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  cargarClubs(): void {
    this.oClubService.getPage(0, 100, 'nombre', 'asc').subscribe({
      next: (page) => {
        this.clubs.set(page.content);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar clubs', err);
        this.snackBar.open('Error al cargar los clubs', 'Cerrar', { duration: 4000 });
      }
    });
  }

  cargarTipousuarios(): void {
    this.oTipousuarioService.getAll().subscribe({
      next: (tipousuarios) => {
        this.tipousuarios.set(tipousuarios);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar tipos de usuario', err);
        this.snackBar.open('Error al cargar los tipos de usuario', 'Cerrar', { duration: 4000 });
      }
    });
  }

  cargarRolusuarios(): void {
    this.oRolusuarioService.getPage(0, 100).subscribe({
      next: (page) => {
        this.rolusuarios.set(page.content);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar roles de usuario', err);
        this.snackBar.open('Error al cargar los roles de usuario', 'Cerrar', { duration: 4000 });
      }
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

  get genero() {
    return this.usuarioForm.get('genero');
  }

  get fechaAlta() {
    return this.usuarioForm.get('fechaAlta');
  }

  get id_club() {
    return this.usuarioForm.get('id_club');
  }

  get id_tipousuario() {
    return this.usuarioForm.get('id_tipousuario');
  }

  get id_rolusuario() {
    return this.usuarioForm.get('id_rolusuario');
  }

  enviarFormulario(): void {
    if (!this.usuarioForm.valid || !this.id_usuario) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const usuarioActualData = this.usuarioActual();
    
    if (!usuarioActualData) {
      this.submitting.set(false);
      this.snackBar.open('No se pudo cargar los datos del usuario', 'Cerrar', { duration: 4000 });
      return;
    }

    const payload: any = {
      id: this.id_usuario(),
      nombre: this.usuarioForm.value.nombre,
      apellido1: this.usuarioForm.value.apellido1,
      apellido2: this.usuarioForm.value.apellido2,
      username: this.usuarioForm.value.username,
      password: this.usuarioForm.value.password,
      genero: this.usuarioForm.value.genero,
      fechaAlta: usuarioActualData.fechaAlta,
      club: {
        id: this.usuarioForm.value.id_club
      },
      tipousuario: {
        id: this.usuarioForm.value.id_tipousuario
      },
      rolusuario: {
        id: this.usuarioForm.value.id_rolusuario
      }
    };

    console.log('Payload a enviar:', payload);

    this.oUsuarioService.update(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', { duration: 4000 });
        this.router.navigate(['/usuario']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.error.set('Error al actualizar el usuario');
        this.snackBar.open('Error al actualizar el usuario', 'Cerrar', { duration: 4000 });
        console.error(err);
      }
    });
  }

  
  }


