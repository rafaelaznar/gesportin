import { Component, OnInit, inject, signal, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { CategoriaService } from '../../../../service/categoria';
import { TemporadaService } from '../../../../service/temporada';
import { SessionService } from '../../../../service/session';
import { ICategoria } from '../../../../model/categoria';
import { ITemporada } from '../../../../model/temporada';
import { TemporadaAdminPlist } from '../../../temporada/admin/plist/plist';

@Component({
  selector: 'app-categoria-teamadmin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class CategoriaTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/categoria/teamadmin');
  idTemporada = input<number>(0);

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private notificacion = inject(NotificacionService);
  private oCategoriaService = inject(CategoriaService);
  private oTemporadaService = inject(TemporadaService);
  private modalService = inject(ModalService);
  private session = inject(SessionService);

  categoriaForm!: FormGroup;
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  submitting = signal(false);
  temporadas = signal<ITemporada[]>([]);
  selectedTemporada = signal<ITemporada | null>(null);

  get mode(): 'create' | 'edit' {
    return this.id() > 0 ? 'edit' : 'create';
  }

  ngOnInit(): void {
    this.initForm();
    this.loadTemporadas();
    if (this.id() > 0) {
      this.loadCategoria(this.id());
    } else {
      if (this.idTemporada() > 0) {
        this.categoriaForm.patchValue({ id_temporada: this.idTemporada() });
        this.syncTemporada(this.idTemporada());
      }
      this.loading.set(false);
    }
  }

  private initForm(): void {
    this.categoriaForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]],
      id_temporada: [null, Validators.required]
    });
  }

  private loadCategoria(id: number): void {
    this.oCategoriaService.get(id).subscribe({
      next: (categoria: ICategoria) => {
        this.categoriaForm.patchValue({
          id: categoria.id,
          nombre: categoria.nombre,
          id_temporada: categoria.temporada?.id
        });
        if (categoria.temporada) {
          this.syncTemporada(categoria.temporada.id);
        }
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la categoría');
        this.notificacion.success('Error cargando la categoría');
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  private syncTemporada(id: number | null): void {
    if (!id) {
      this.selectedTemporada.set(null);
      return;
    }
    this.oTemporadaService.get(id).subscribe({
      next: (temporada) => {
        this.selectedTemporada.set(temporada);
        if (this.id() === 0) {
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al sincronizar temporada:', err);
        this.notificacion.success('Error al cargar la temporada seleccionada');
        this.selectedTemporada.set(null);
      }
    });
  }

  openTemporadaFinderModal(): void {
    const ref = this.modalService.open<unknown, ITemporada | null>(TemporadaAdminPlist);

    ref.afterClosed$.subscribe((temporada: ITemporada | null) => {
      if (temporada) {
        this.categoriaForm.patchValue({ id_temporada: temporada.id });
        this.syncTemporada(temporada.id);
        this.notificacion.success(`Temporada seleccionada: ${temporada.descripcion}`);
      }
    });
  }

  private loadTemporadas(): void {
    const clubId = this.session?.isClubAdmin() ? this.session.getClubId() ?? 0 : 0;
    this.oTemporadaService
      .getPage(0, 1000, 'descripcion', 'asc', '', clubId)
      .subscribe({
        next: (page) => this.temporadas.set(page.content),
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.notificacion.success('Error cargando temporadas');
        }
      });
  }

  get nombre() { return this.categoriaForm.get('nombre'); }
  get id_temporada() { return this.categoriaForm.get('id_temporada'); }

  onSubmit(): void {
    if (this.categoriaForm.invalid) {
      this.notificacion.success('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const categoriaData: any = {
      nombre: this.categoriaForm.value.nombre,
      temporada: { id: this.categoriaForm.value.id_temporada }
    };

    if (this.mode === 'edit') {
      categoriaData.id = this.id();
      this.oCategoriaService.update(categoriaData).subscribe({
        next: () => {
          this.notificacion.success('Categoría actualizada exitosamente');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando la categoría');
          this.notificacion.success('Error actualizando la categoría');
          console.error(err);
          this.submitting.set(false);
        }
      });
    } else {
      this.oCategoriaService.create(categoriaData).subscribe({
        next: () => {
          this.notificacion.success('Categoría creada exitosamente');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando la categoría');
          this.notificacion.success('Error creando la categoría');
          console.error(err);
          this.submitting.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.returnUrl()]);
  }
}
