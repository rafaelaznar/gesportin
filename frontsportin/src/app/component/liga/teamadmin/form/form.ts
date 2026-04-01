import { Component, OnInit, inject, signal, effect, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { LigaService } from '../../../../service/liga';
import { EquipoService } from '../../../../service/equipo';
import { SessionService } from '../../../../service/session';
import { ILiga } from '../../../../model/liga';
import { IEquipo } from '../../../../model/equipo';
import { EquipoAdminPlist } from '../../../equipo/admin/plist/plist';

@Component({
  selector: 'app-liga-teamadmin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class LigaTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/liga/teamadmin');
  idEquipo = input<number>(0);

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private modalService = inject(ModalService);
  private ligaService = inject(LigaService);
  private equipoService = inject(EquipoService);
  private sessionService = inject(SessionService);

  ligaForm!: FormGroup;
  loading = signal(false);
  submitting = signal(false);
  error = signal<string | null>(null);
  equipos = signal<IEquipo[]>([]);
  selectedEquipo = signal<IEquipo | null>(null);

  ngOnInit(): void {
    this.initForm();
    this.loadEquipos();

    if (this.id() > 0) {
      this.loadById(this.id());
    } else {
      if (this.idEquipo() > 0) {
        this.ligaForm.patchValue({ id_equipo: this.idEquipo() });
        this.loadEquipo(this.idEquipo());
      }
      this.loading?.set(false);
    }
  }

  private initForm(): void {
    this.ligaForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      id_equipo: [null, Validators.required],
    });

    this.ligaForm.get('id_equipo')?.valueChanges.subscribe((id) => {
      if (id) {
        this.loadEquipo(Number(id));
      } else {
        this.selectedEquipo.set(null);
      }
    });
  }

  private loadEquipos(): void {
    const clubId = this.sessionService.getClubId();
    const pageParams = { page: 0, size: 1000, order: 'nombre', direction: 'asc' };

    if (this.sessionService.isClubAdmin() && clubId !== null) {
      this.equipoService
        .getPage(pageParams.page, pageParams.size, pageParams.order, pageParams.direction, '', clubId)
        .subscribe({
          next: (page) => this.equipos.set(page.content),
          error: (err: HttpErrorResponse) => {
            console.error(err);
            this.notificacion.success('Error cargando equipos del club');
          },
        });
      return;
    }

    this.equipoService
      .getPage(pageParams.page, pageParams.size, pageParams.order, pageParams.direction)
      .subscribe({
        next: (page) => this.equipos.set(page.content),
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.notificacion.success('Error cargando equipos');
        },
      });
  }

  private loadById(id: number): void {
    this.loading.set(true);
    this.ligaService.get(id).subscribe({
      next: (data: ILiga) => {
        this.loadLigaData(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el registro');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  private loadLigaData(liga: ILiga): void {
    this.ligaForm.patchValue({
      id: liga.id ?? 0,
      nombre: liga.nombre ?? '',
      id_equipo: liga.equipo?.id ?? null,
    });
    if (liga.equipo?.id) {
      this.syncEquipo(liga.equipo.id);
    }
  }

  private loadEquipo(idEquipo: number): void {
    this.equipoService.get(idEquipo).subscribe({
      next: (equipo: IEquipo) => {
        this.selectedEquipo.set(equipo);
        const cat = equipo.categoria;
        const temp = cat?.temporada;
        const isEdit = this.id() > 0;
        const nombre = this.ligaForm.get('nombre')?.value ?? '';
      },
      error: (err: HttpErrorResponse) => {
        this.selectedEquipo.set(null);
        console.error(err);
      },
    });
  }

  private syncEquipo(idEquipo: number): void {
    this.loadEquipo(idEquipo);
  }

  openEquipoFinderModal(): void {
    const ref = this.modalService.open<unknown, IEquipo | null>(EquipoAdminPlist);

    ref.afterClosed$.subscribe((equipo: IEquipo | null) => {
      if (equipo && equipo.id != null) {
        this.ligaForm.patchValue({ id_equipo: equipo.id });
        this.syncEquipo(equipo.id);
        this.notificacion.success(`Equipo seleccionado: ${equipo.nombre}`);
      }
    });
  }

  get nombre() {
    return this.ligaForm.get('nombre');
  }

  get id_equipo() {
    return this.ligaForm.get('id_equipo');
  }

  onSubmit(): void {
    if (this.ligaForm.invalid) {
      this.notificacion.success('Por favor, complete todos los campos correctamente');
      this.ligaForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const ligaData: any = {
      nombre: this.ligaForm.value.nombre,
      equipo: { id: Number(this.ligaForm.value.id_equipo) },
    };

    if (this.id() > 0) {
      ligaData.id = this.id();
      this.ligaService.update(ligaData).subscribe({
        next: () => {
          this.notificacion.success('Liga actualizada');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.notificacion.success('Error actualizando la liga');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.ligaService.create(ligaData).subscribe({
        next: () => {
          this.notificacion.success('Liga creada');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.notificacion.success('Error creando la liga');
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
