import { Component, OnInit, inject, signal, effect, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { toIsoDateTime } from '../../../../utils/date-utils';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { PartidoService } from '../../../../service/partido';
import { LigaService } from '../../../../service/liga';
import { EstadopartidoService } from '../../../../service/estadopartido';
import { IPartido } from '../../../../model/partido';
import { ILiga } from '../../../../model/liga';
import { IEstadopartido } from '../../../../model/estadopartido';
import { SessionService } from '../../../../service/session';
import { LigaAdminPlist } from '../../../liga/admin/plist/plist';

@Component({
  selector: 'app-partido-teamadmin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class PartidoTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/partido/teamadmin');
  idLiga = input<number>(0);

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private oPartidoService = inject(PartidoService);
  private oLigaService = inject(LigaService);
  private oEstadopartidoService = inject(EstadopartidoService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  partidoForm!: FormGroup;
  error = signal<string | null>(null);
  loading = signal<boolean>(false);
  submitting = signal(false);
  selectedLiga = signal<ILiga | null>(null);
  estadopartidoList = signal<IEstadopartido[]>([]);

  ngOnInit(): void {
    this.initForm();
    this.oEstadopartidoService.getAll().subscribe({ next: (list) => this.estadopartidoList.set(list) });

    if (this.id() > 0) {
      this.loadById(this.id());
    } else {
      if (this.idLiga() > 0) {
        this.partidoForm.patchValue({ id_liga: this.idLiga() });
        this.loadLiga(this.idLiga());
      }
      this.loading?.set(false);
    }
  }

  private initForm(): void {
    this.partidoForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      rival: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      id_liga: [null, Validators.required],
      local: [null, Validators.required],
      resultado: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      fecha: [null],
      lugar: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      id_estadopartido: [null],
      comentario: [''],
    });
  }

  private loadById(id: number): void {
    this.loading.set(true);
    this.oPartidoService.get(id).subscribe({
      next: (data: IPartido) => {
        this.loadPartidoData(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el registro');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  private loadPartidoData(partido: IPartido): void {
    this.partidoForm.patchValue({
      id: partido.id,
      rival: partido.rival,
      id_liga: partido.liga?.id,
      local: partido.local ? 1 : 0,
      resultado: partido.resultado,
      fecha: partido.fecha ? partido.fecha.substring(0, 16) : null,
      lugar: partido.lugar,
      id_estadopartido: partido.estadopartido?.id ?? null,
      comentario: partido.comentario ?? '',
    });
    if (partido.liga?.id) this.loadLiga(partido.liga.id);
  }

  private loadLiga(idLiga: number): void {
    this.oLigaService.get(idLiga).subscribe({
      next: (liga) => {
        this.selectedLiga.set(liga);
        const equipo = liga.equipo;
        const cat = equipo?.categoria;
        const temp = cat?.temporada;
        const isEdit = this.id() > 0;
      },
      error: () => this.selectedLiga.set(null),
    });
  }

  get rival() {
    return this.partidoForm.get('rival');
  }

  get id_liga() {
    return this.partidoForm.get('id_liga');
  }

  get local() {
    return this.partidoForm.get('local');
  }

  get resultado() {
    return this.partidoForm.get('resultado');
  }

  get fecha() {
    return this.partidoForm.get('fecha');
  }

  get lugar() {
    return this.partidoForm.get('lugar');
  }

  get comentario() {
    return this.partidoForm.get('comentario');
  }

  get id_estadopartido() {
    return this.partidoForm.get('id_estadopartido');
  }

  openLigaFinderModal(): void {
    const ref = this.modalService.open<unknown, ILiga | null>(LigaAdminPlist);
    ref.afterClosed$.subscribe((liga: ILiga | null) => {
      if (liga?.id != null) {
        this.partidoForm.patchValue({ id_liga: liga.id });
        this.selectedLiga.set(liga);
        this.notificacion.success(`Liga seleccionada: ${liga.nombre}`);
      }
    });
  }

  onSubmit(): void {
    if (this.partidoForm.invalid) {
      this.notificacion.success('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const partidoData: any = {
      rival: this.partidoForm.value.rival,
      liga: { id: Number(this.partidoForm.value.id_liga) },
      local: Number(this.partidoForm.value.local) === 1,
      resultado: this.partidoForm.value.resultado,
      fecha: this.partidoForm.value.fecha ? toIsoDateTime(this.partidoForm.value.fecha) : null,
      lugar: this.partidoForm.value.lugar,
      comentario: this.partidoForm.value.comentario,
      estadopartido: this.partidoForm.value.id_estadopartido
        ? { id: Number(this.partidoForm.value.id_estadopartido) }
        : null,
    };

    if (this.id() > 0) {
      partidoData.id = this.id();
      this.oPartidoService.update(partidoData).subscribe({
        next: () => {
          this.notificacion.success('Partido actualizado exitosamente');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el partido');
          this.notificacion.success('Error actualizando el partido');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oPartidoService.create(partidoData).subscribe({
        next: () => {
          this.notificacion.success('Partido creado exitosamente');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el partido');
          this.notificacion.success('Error creando el partido');
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
