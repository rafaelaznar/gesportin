import { Component, OnInit, inject, signal, effect, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { EquipoService } from '../../../../service/equipo';
import { CategoriaService } from '../../../../service/categoria';
import { UsuarioService } from '../../../../service/usuarioService';
import { ICategoria } from '../../../../model/categoria';
import { IUsuario } from '../../../../model/usuario';
import { IEquipo } from '../../../../model/equipo';
import { CategoriaPlistFinder } from '../../../categoria/finder/plist';
import { UsuarioPlistFinder } from '../../../usuario/finder/plist';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-equipo-teamadmin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrls: ['./form.css']
})
export class EquipoTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/equipo/teamadmin');
  idCategoria = input<number>(0);

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private oEquipoService = inject(EquipoService);
  private oCategoriaService = inject(CategoriaService);
  private oUsuarioService = inject(UsuarioService);
  private modalService = inject(ModalService);

  equipoForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedCategoria = signal<ICategoria | null>(null);
  selectedEntrenador = signal<IUsuario | null>(null);
  categoriaError = signal(false);
  entrenadorError = signal(false);

  ngOnInit(): void {
    this.initForm();

    if (this.id() > 0) {
      this.loadById(this.id());
    } else {
      if (this.idCategoria() > 0) {
        this.equipoForm.patchValue({ id_categoria: this.idCategoria() });
        this.syncCategoria(this.idCategoria());
      }
      this.loading?.set(false);
    }
  }

  private initForm(): void {
    this.equipoForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      id_categoria: [null, Validators.required],
      id_entrenador: [null, Validators.required],
    });

    this.equipoForm.get('id_categoria')?.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe((id) => {
      if (id) {
        const idNumero = typeof id === 'string' ? parseInt(id, 10) : id;
        if (!isNaN(idNumero)) this.syncCategoria(idNumero);
      } else {
        this.selectedCategoria.set(null);
        this.categoriaError.set(false);
      }
    });

    this.equipoForm.get('id_entrenador')?.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe((id) => {
      if (id) {
        const idNumero = typeof id === 'string' ? parseInt(id, 10) : id;
        if (!isNaN(idNumero)) this.syncEntrenador(idNumero);
      } else {
        this.selectedEntrenador.set(null);
        this.entrenadorError.set(false);
      }
    });
  }

  private loadById(id: number): void {
    this.loading.set(true);
    this.oEquipoService.get(id).subscribe({
      next: (data: IEquipo) => {
        this.loadEquipoData(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el registro');
        this.loading.set(false);
        console.error(err);
      },
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
      this.categoriaError.set(false);
      return;
    }
    this.categoriaError.set(false);
    this.oCategoriaService.get(idCategoria).subscribe({
      next: (categoria: ICategoria) => {
        this.selectedCategoria.set(categoria);
        this.categoriaError.set(false);
        if (this.equipoForm.get('id_categoria')?.hasError('categoriaNotFound')) {
          const errors = { ...this.equipoForm.get('id_categoria')?.errors };
          delete (errors as any)['categoriaNotFound'];
          this.equipoForm.get('id_categoria')?.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      },
      error: () => {
        this.selectedCategoria.set(null);
        this.categoriaError.set(true);
        this.equipoForm.get('id_categoria')?.setErrors({ categoriaNotFound: true });
      },
    });
  }

  private syncEntrenador(idEntrenador: number | null): void {
    if (!idEntrenador) {
      this.selectedEntrenador.set(null);
      this.entrenadorError.set(false);
      return;
    }
    this.entrenadorError.set(false);
    this.oUsuarioService.get(idEntrenador).subscribe({
      next: (entrenador: IUsuario) => {
        this.selectedEntrenador.set(entrenador);
        this.entrenadorError.set(false);
        if (this.equipoForm.get('id_entrenador')?.hasError('entrenadorNotFound')) {
          const errors = { ...this.equipoForm.get('id_entrenador')?.errors };
          delete (errors as any)['entrenadorNotFound'];
          this.equipoForm.get('id_entrenador')?.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      },
      error: () => {
        this.selectedEntrenador.set(null);
        this.entrenadorError.set(true);
        this.equipoForm.get('id_entrenador')?.setErrors({ entrenadorNotFound: true });
      },
    });
  }

  openCategoriaFinderModal(): void {
    const ref = this.modalService.open<unknown, ICategoria | null>(CategoriaPlistFinder);

    ref.afterClosed$.subscribe((categoria: ICategoria | null) => {
      if (categoria) {
        this.equipoForm.patchValue({
          id_categoria: categoria.id,
        });
        this.syncCategoria(categoria.id);
        this.notificacion.success(`Categoría seleccionada: ${categoria.nombre}`);
      }
    });
  }

  openEntrenadorFinderModal(): void {
    // Filtrar entrenadores del mismo club que la categoría seleccionada
    const categoria = this.selectedCategoria();
    const idClub = categoria?.temporada?.club?.id;
    const data: any = {};
    if (idClub) {
      data.id_club = idClub;
    }
    const ref = this.modalService.open<unknown, IUsuario | null>(UsuarioPlistFinder, { data });

    ref.afterClosed$.subscribe((entrenador: IUsuario | null) => {
      if (entrenador) {
        this.equipoForm.patchValue({
          id_entrenador: entrenador.id,
        });
        this.syncEntrenador(entrenador.id);
        const entrenadorNombre = `${entrenador.nombre} ${entrenador.apellido1 ?? ''}`.trim();
        this.notificacion.success(`Entrenador seleccionado: ${entrenadorNombre}`);
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
      this.notificacion.info('Por favor, complete todos los campos correctamente');
      return;
    }

    const selectedCategoriaId = this.equipoForm.value.id_categoria;
    const selectedEntrenadorId = this.equipoForm.value.id_entrenador;

    if (!selectedCategoriaId) {
      this.notificacion.info('Debe seleccionar una categoría');
      return;
    }

    if (!selectedEntrenadorId) {
      this.notificacion.info('Debe seleccionar un entrenador');
      return;
    }

    this.submitting.set(true);

    const equipoData: any = {
      nombre: this.equipoForm.value.nombre,
      categoria: { id: Number(selectedCategoriaId) },
      entrenador: { id: Number(selectedEntrenadorId) },
      jugadores: [],
      cuotas: [],
      ligas: []
    };

    if (this.id() > 0) {
      equipoData.id = this.id();
    }

    if (this.id() > 0) {
      this.saveUpdate(equipoData);
    } else {
      this.saveCreate(equipoData);
    }
  }

  private saveCreate(equipoData: any): void {
    this.oEquipoService.create(equipoData).subscribe({
      next: (id: number) => {
        this.notificacion.info('Equipo creado exitosamente');
        this.submitting.set(false);
        this.router.navigate([this.returnUrl()]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error creando el equipo');
        this.notificacion.error('Error creando el equipo');
        console.error(err);
        this.submitting.set(false);
      },
    });
  }

  private saveUpdate(equipoData: any): void {
    this.oEquipoService.update(equipoData).subscribe({
      next: (id: number) => {
        this.notificacion.info('Equipo actualizado exitosamente');
        this.submitting.set(false);
        this.router.navigate([this.returnUrl()]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error actualizando el equipo');
        this.notificacion.error('Error actualizando el equipo');
        console.error(err);
        this.submitting.set(false);
      },
    });
  }

  onCancel(): void {
    this.router.navigate([this.returnUrl()]);
  }
}
