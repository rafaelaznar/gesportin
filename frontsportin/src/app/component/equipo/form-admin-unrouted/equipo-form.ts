import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaService } from '../../../service/categoria';
import { UsuarioService } from '../../../service/usuarioService';
import { ICategoria } from '../../../model/categoria';
import { IUsuario } from '../../../model/usuario';
import { IEquipo } from '../../../model/equipo';
import { CategoriaPlistAdminUnrouted } from '../../categoria/plist-admin-unrouted/categoria-plist-admin-unrouted';
import { UsuarioPlistAdminUnrouted } from '../../usuario/plist-admin-unrouted/usuario-plist-admin-unrouted';

@Component({
  selector: 'app-equipo-form-unrouted',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './equipo-form.html',
  styleUrls: ['./equipo-form.css']
})
export class EquipoFormAdminUnrouted implements OnInit {
  @Input() equipo: IEquipo | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() formSubmit = new EventEmitter<IEquipo>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oCategoriaService = inject(CategoriaService);
  private oUsuarioService = inject(UsuarioService);
  private dialog = inject(MatDialog);

  equipoForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedCategoria = signal<ICategoria | null>(null);
  selectedEntrenador = signal<IUsuario | null>(null);

  constructor() {
    // Efecto para cargar datos cuando cambia el equipo de entrada
    effect(() => {
      const equipoData = this.equipo;
      if (equipoData && this.equipoForm) {
        this.loadEquipoData(equipoData);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (this.equipo) {
      this.loadEquipoData(this.equipo);
    }
  }

  private initForm(): void {
    this.equipoForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      id_categoria: [null, Validators.required],
      id_entrenador: [null, Validators.required],
    });
  }

  private loadEquipoData(equipo: IEquipo): void {
    const categoriaId = equipo.categoria?.id ?? null;
    const entrenadorId = equipo.entrenador?.id ?? null;

    this.equipoForm.patchValue({
      id: equipo.id ?? 0,
      nombre: equipo.nombre ?? '',
      id_categoria: categoriaId,
      id_entrenador: entrenadorId,
    });

    if (categoriaId) {
      this.syncCategoria(categoriaId);
    }
    if (entrenadorId) {
      this.syncEntrenador(entrenadorId);
    }
  }

  private syncCategoria(idCategoria: number | null): void {
    if (!idCategoria) {
      this.selectedCategoria.set(null);
      return;
    }

    this.oCategoriaService.get(idCategoria).subscribe({
      next: (categoria: ICategoria) => {
        this.selectedCategoria.set(categoria);
      },
      error: (err: HttpErrorResponse) => {
        this.selectedCategoria.set(null);
        console.error('Error al sincronizar categoría:', err);
        this.snackBar.open('Error al cargar la categoría seleccionada', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private syncEntrenador(idEntrenador: number | null): void {
    if (!idEntrenador) {
      this.selectedEntrenador.set(null);
      return;
    }

    this.oUsuarioService.get(idEntrenador).subscribe({
      next: (entrenador: IUsuario) => {
        this.selectedEntrenador.set(entrenador);
      },
      error: (err: HttpErrorResponse) => {
        this.selectedEntrenador.set(null);
        console.error('Error al sincronizar entrenador:', err);
        this.snackBar.open('Error al cargar el entrenador seleccionado', 'Cerrar', { duration: 3000 });
      },
    });
  }

  openCategoriaFinderModal(): void {
    const dialogRef = this.dialog.open(CategoriaPlistAdminUnrouted, {
      height: '800px',
      width: '1000px',
      maxWidth: '95vw',
      panelClass: 'categoria-dialog',
      data: {
        title: 'Elegir categoría',
        message: 'Selecciona la categoría para el equipo',
      },
    });

    dialogRef.afterClosed().subscribe((categoria: ICategoria | null) => {
      if (categoria) {
        this.equipoForm.patchValue({
          id_categoria: categoria.id,
        });
        this.syncCategoria(categoria.id);
        this.snackBar.open(`Categoría seleccionada: ${categoria.nombre}`, 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }

  openEntrenadorFinderModal(): void {
    const dialogRef = this.dialog.open(UsuarioPlistAdminUnrouted, {
      height: '800px',
      width: '1300px',
      maxWidth: '95vw',
      panelClass: 'usuario-dialog',
      data: {
        title: 'Elegir entrenador',
        message: 'Selecciona el entrenador para el equipo',
      },
    });

    dialogRef.afterClosed().subscribe((entrenador: IUsuario | null) => {
      if (entrenador) {
        this.equipoForm.patchValue({
          id_entrenador: entrenador.id,
        });
        this.syncEntrenador(entrenador.id);
        const entrenadorNombre = `${entrenador.nombre} ${entrenador.apellido1 ?? ''}`.trim();
        this.snackBar.open(`Entrenador seleccionado: ${entrenadorNombre}`, 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }

  get entrenadorNombreSeleccionado(): string {
    const entrenador = this.selectedEntrenador();
    if (!entrenador) {
      return '';
    }
    return `${entrenador.nombre} ${entrenador.apellido1 ?? ''}`.trim();
  }

  get nombre() {
    return this.equipoForm.get('nombre');
  }

  get id_categoria() {
    return this.equipoForm.get('id_categoria');
  }

  get id_entrenador() {
    return this.equipoForm.get('id_entrenador');
  }

  onSubmit(): void {
    if (this.equipoForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    const selectedCategoriaId = this.equipoForm.value.id_categoria;
    const selectedEntrenadorId = this.equipoForm.value.id_entrenador;

    // Validar que se haya seleccionado categoría y entrenador
    if (!selectedCategoriaId) {
      this.snackBar.open('Debe seleccionar una categoría', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    if (!selectedEntrenadorId) {
      this.snackBar.open('Debe seleccionar un entrenador', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    const equipoData: any = {
      nombre: this.equipoForm.value.nombre,
      categoria: { id: Number(selectedCategoriaId) },
      entrenador: { id: Number(selectedEntrenadorId) },
      jugadores: [],
      cuotas: [],
      ligas: []
    };

    // Solo agregar el ID si estamos en modo edición
    if (this.mode === 'edit' && this.equipo?.id) {
      equipoData.id = this.equipo.id;
    }

    this.formSubmit.emit(equipoData as IEquipo);
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
