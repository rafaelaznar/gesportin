import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquipoService } from '../../../service/equipo';
import { CategoriaService } from '../../../service/categoria';
import { UsuarioService } from '../../../service/usuarioService';
import { ICategoria } from '../../../model/categoria';
import { IUsuario } from '../../../model/usuario';
import { IEquipo } from '../../../model/equipo';

@Component({
  selector: 'app-equipo-edit-routed',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './equipo-edit.html',
  styleUrl: './equipo-edit.css',
})
export class EquipoEditAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private oEquipoService = inject(EquipoService);
  private snackBar = inject(MatSnackBar);
  private oCategoriaService = inject(CategoriaService);
  private oUsuarioService = inject(UsuarioService);

  equipoForm!: FormGroup;
  id_equipo = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);
  // Guardar ids de claves ajenas para reenviarlos en el update
  currentCategoriaId = signal<number | null>(null);
  currentEntrenadorId = signal<number | null>(null);
  // Guardar nombres para mostrarlos en el formulario (solo lectura)
  currentCategoriaName = signal<string | null>(null);
  currentEntrenadorName = signal<string | null>(null);

  // Listas para selects
  categorias = signal<ICategoria[]>([]);
  entrenadores = signal<IUsuario[]>([]);

  constructor() {}

  ngOnInit(): void {
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de equipo no válido');
      this.loading.set(false);
      return;
    }

    this.id_equipo.set(Number(idParam));

    if (isNaN(this.id_equipo())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.loadEquipo();
    this.loadCategorias();
    this.loadEntrenadores();
  }

  private initForm(): void {
    this.equipoForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      id_categoria: [null],
      id_entrenador: [null],
    });
  }

  private loadEquipo(): void {
    this.oEquipoService.get(this.id_equipo()).subscribe({
      next: (equipo: IEquipo) => {
        this.equipoForm.patchValue({
          id: equipo.id,
          nombre: equipo.nombre,
          id_categoria: equipo.categoria?.id ?? null,
          id_entrenador: equipo.entrenador?.id ?? null,
        });
        // Guardar ids de categoria y entrenador para incluirlos en el update
        this.currentCategoriaId.set(equipo.categoria?.id ?? null);
        this.currentEntrenadorId.set(equipo.entrenador?.id ?? null);
        // Guardar también los nombres para mostrarlos en campos de solo lectura
        this.currentCategoriaName.set(equipo.categoria?.nombre ?? null);
        this.currentEntrenadorName.set(
          equipo.entrenador ? `${equipo.entrenador.nombre} ${equipo.entrenador.apellido1 ?? ''}`.trim() : null
        );
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el equipo');
        this.snackBar.open('Error cargando el equipo', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  private loadCategorias(): void {
    // Cargar primeras 100 categorías para el select
    const page = 0;
    const rpp = 100;
    this.oCategoriaService.getPage(page, rpp).subscribe({
      next: (pageData: any) => {
        this.categorias.set(pageData.content || []);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando categorías', err);
      },
    });
  }

  private loadEntrenadores(): void {
    // Cargar primeras 200 usuarios para el select (filtrado no aplicado para mantener simple)
    const page = 0;
    const rpp = 200;
    this.oUsuarioService.getPage(page, rpp).subscribe({
      next: (pageData: any) => {
        this.entrenadores.set(pageData.content || []);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando usuarios', err);
      },
    });
  }

  onCategoriaChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.currentCategoriaId.set(value && value !== 'null' ? Number(value) : null);
  }

  onEntrenadorChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.currentEntrenadorId.set(value && value !== 'null' ? Number(value) : null);
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

    this.submitting.set(true);

    const equipoData: any = {
      id: this.id_equipo(),
      nombre: this.equipoForm.value.nombre,
    } as Partial<IEquipo>;

    // Incluir referencias a claves ajenas si existen para evitar errores en el backend
    const selectedCategoriaId = this.equipoForm.value.id_categoria ?? this.currentCategoriaId();
    const selectedEntrenadorId = this.equipoForm.value.id_entrenador ?? this.currentEntrenadorId();

    if (selectedCategoriaId) {
      equipoData.categoria = { id: Number(selectedCategoriaId) };
    }
    if (selectedEntrenadorId) {
      equipoData.entrenador = { id: Number(selectedEntrenadorId) };
    }

    this.oEquipoService.update(equipoData).subscribe({
      next: (id: number) => {
        this.snackBar.open('Equipo actualizado exitosamente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
        this.router.navigate(['/equipo']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error actualizando el equipo');
        this.snackBar.open('Error actualizando el equipo', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.submitting.set(false);
      },
    });
  }
}
