import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JugadorService } from '../../../service/jugador-service';
import { UsuarioService } from '../../../service/usuarioService';
import { EquipoService } from '../../../service/equipo';
import { IUsuario } from '../../../model/usuario';
import { IJugador } from '../../../model/jugador';
import { IEquipo } from '../../../model/equipo';

@Component({
  selector: 'app-edit-admin-routed',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './jugador-edit.html',
  styleUrl: './jugador-edit.css',
})
export class JugadorEditAdminRouted implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private oJugadorService = inject(JugadorService);
  private oUsuarioService = inject(UsuarioService);
  private oEquipoService = inject(EquipoService);
  private snackBar = inject(MatSnackBar);

  jugadorForm!: FormGroup;
  id_jugador = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);
  usuarios = signal<IUsuario[]>([]);
  equipos = signal<IEquipo[]>([]);
  jugadorActual = signal<IJugador | null>(null);

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarUsuarios();
    this.cargarEquipos();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de artículo no válido');
      this.loading.set(false);
      return;
    }

    this.id_jugador.set(Number(idParam));

    if (isNaN(this.id_jugador())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.cargarJugador();
  }

  inicializarFormulario(): void {
    this.jugadorForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      posicion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      dorsal: [0, [Validators.required, Validators.min(0)]],
      capitan: [false],
      id_usuario: [null, Validators.required],
      id_equipo: [null, Validators.required]
    });
  }

  cargarJugador(): void {
    this.oJugadorService.getById(this.id_jugador()).subscribe({
      next: (jugador: IJugador) => {
        this.jugadorActual.set(jugador);
        this.jugadorForm.patchValue({
          id: jugador.id,
          posicion: jugador.posicion,
          dorsal: jugador.dorsal,
          capitan: !!jugador.capitan,
          id_usuario: jugador.usuario?.id || null,
          id_equipo: jugador.equipo?.id || null
        });
        this.loading.set (false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set ('Error al cargar el jugador');
        this.loading.set (false);
        console.error(err);
      }
    });
  }
  cargarUsuarios(): void {
      this.oUsuarioService.getPage(0, 100, 'username', 'asc', '', 0).subscribe({
        next: (page) => {
          this.usuarios.set  (page.content)
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al cargar usuarios', err);
          this.snackBar.open('Error al cargar los usuarios', 'Cerrar', { duration: 4000 });
        }
      });
    }

  cargarEquipos(): void {
    this.oEquipoService.getPage(0, 100, 'nombre', 'asc').subscribe({
      next: (page) => {
        this.equipos.set(page.content);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar equipos', err);
        this.snackBar.open('Error al cargar los equipos', 'Cerrar', { duration: 4000 });
      }
    });
  }

  get posicion() {
      return this.jugadorForm.get('posicion');
    }

  get dorsal() {
      return this.jugadorForm.get('dorsal');
    }

  get capitan() {
      return this.jugadorForm.get('capitan');
    }

  get id_usuario() {
    return this.jugadorForm.get('id_usuario');
  }

  get id_equipo() {
    return this.jugadorForm.get('id_equipo');
  }

  enviarFormulario(): void {
    if (!this.jugadorForm.valid || !this.id_jugador) {
      this.jugadorForm.markAllAsTouched();
      return;
    }

    this.submitting.set (true);

    const jugadorActualData = this.jugadorActual();
    
    if (!jugadorActualData) {
      this.submitting.set (false);
      this.snackBar.open('No se pudo cargar los datos del jugador', 'Cerrar', { duration: 4000 });
      return;
    }

    const payload: any = {
      id: this.id_jugador(),
      posicion: this.jugadorForm.value.posicion,
      dorsal: this.jugadorForm.value.dorsal,
      capitan: !!this.jugadorForm.value.capitan,
      usuario: { 
        id: this.jugadorForm.value.id_usuario 
      },
      equipo: {
        id: this.jugadorForm.value.id_equipo
      }
    };

    console.log('Payload a enviar:', payload);

    this.oJugadorService.update(payload).subscribe({
      next: () => {
        this.submitting.set (false);
        this.snackBar.open('Jugador actualizado correctamente', 'Cerrar', { duration: 4000 });
        this.router.navigate(['/jugador']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set (false);
        this.error.set ('Error al actualizar el jugador');
        this.snackBar.open('Error al actualizar el jugador', 'Cerrar', { duration: 4000 });
        console.error(err);
      }
    });
  }

  
  }


