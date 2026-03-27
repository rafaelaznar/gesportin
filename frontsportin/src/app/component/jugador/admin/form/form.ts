import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { JugadorService } from '../../../../service/jugador-service';
import { EquipoService } from '../../../../service/equipo';
import { UsuarioService } from '../../../../service/usuarioService';
import { IJugador } from '../../../../model/jugador';
import { IEquipo } from '../../../../model/equipo';
import { IUsuario } from '../../../../model/usuario';
import { SessionService } from '../../../../service/session';

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
  private snackBar = inject(MatSnackBar);
  private oJugadorService = inject(JugadorService);
  private oEquipoService = inject(EquipoService);
  private oUsuarioService = inject(UsuarioService);
  private dialog = inject(MatDialog);
  private sessionService = inject(SessionService);

  jugadorForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  equipos = signal<IEquipo[]>([]);
  usuarios = signal<IUsuario[]>([]);
  selectedEquipo = signal<IEquipo | null>(null);
  displayIdEquipo = signal<number | null>(null);

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
    this.loadEquipos();
    this.loadUsuarios();

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
      id_equipo: [null, Validators.required],
      id_usuario: [null, Validators.required],
    });

    this.jugadorForm.get('id_equipo')?.valueChanges.subscribe((id) => {
      if (id) {
        this.loadEquipo(Number(id));
      } else {
        this.selectedEquipo.set(null);
        this.displayIdEquipo.set(null);
      }
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
    if (jugador.equipo?.id) {
      this.syncEquipo(jugador.equipo.id);
    }
  }

  private loadEquipo(idEquipo: number): void {
    this.oEquipoService.get(idEquipo).subscribe({
      next: (equipo) => {
        this.selectedEquipo.set(equipo);
        this.displayIdEquipo.set(equipo.id ?? null);
      },
      error: (err: HttpErrorResponse) => {
        this.selectedEquipo.set(null);
        this.displayIdEquipo.set(null);
        console.error(err);
        this.snackBar.open('Error cargando el equipo', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private loadEquipos(): void {
    const clubId = this.sessionService.isClubAdmin() ? this.sessionService.getClubId() ?? 0 : 0;
    const equipos$ = clubId > 0 ? this.oEquipoService.getPage(0, 1000, 'nombre', 'asc', '', clubId) : this.oEquipoService.getPage(0, 1000, 'nombre', 'asc', '');

    equipos$.subscribe({
      next: (page) => {
        this.equipos.set(page.content);
        const currentId = this.jugadorForm.get('id_equipo')?.value;
        if (currentId) {
          this.syncEquipo(Number(currentId));
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackBar.open('Error cargando equipos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private loadUsuarios(): void {
    this.oUsuarioService.getPage(0, 1000, 'nombre', 'asc', '').subscribe({
      next: (page) => {
        this.usuarios.set(page.content);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackBar.open('Error cargando usuarios', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private syncEquipo(idEquipo: number): void {
    const selected = this.equipos().find((e) => e.id === idEquipo) || null;
    this.selectedEquipo.set(selected);
    this.displayIdEquipo.set(selected?.id ?? null);
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

  onSubmit(): void {
    if (this.jugadorForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
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

    if (this.isEditMode && this.jugador?.id) {
      jugadorData.id = this.jugador.id;
      this.oJugadorService.update(jugadorData).subscribe({
        next: () => {
          this.snackBar.open('Jugador actualizado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el jugador');
          this.snackBar.open('Error actualizando el jugador', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oJugadorService.create(jugadorData).subscribe({
        next: () => {
          this.snackBar.open('Jugador creado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el jugador');
          this.snackBar.open('Error creando el jugador', 'Cerrar', { duration: 4000 });
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
