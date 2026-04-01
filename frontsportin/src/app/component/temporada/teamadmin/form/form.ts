import { Component, OnInit, inject, signal, input } from '@angular/core';
import { SessionService } from '../../../../service/session';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TemporadaService } from '../../../../service/temporada';
import { ITemporada } from '../../../../model/temporada';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificacionService } from '../../../../service/notificacion';
import { IClub } from '../../../../model/club';
import { ModalService } from '../../../shared/modal/modal.service';
import { ClubService } from '../../../../service/club';
import { ClubAdminPlist } from '../../../club/admin/plist/plist';

@Component({
  selector: 'app-temporada-teamadmin-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class TemporadaTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/temporada/teamadmin');

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private oTemporadaService = inject(TemporadaService);
  private oClubService = inject(ClubService);
  private notificacion = inject(NotificacionService);
  private modalService = inject(ModalService);
  session: SessionService = inject(SessionService);

  temporadaForm!: FormGroup;
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  submitting = signal<boolean>(false);
  temporada = signal<ITemporada | null>(null);
  selectedClub = signal<IClub | null>(null);

  ngOnInit(): void {
    this.initForm();
    if (this.id() > 0) {
      this.getTemporada(this.id());
    } else {
      this.loading.set(false);
    }
  }

  initForm(): void {
    this.temporadaForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      id_club: [null, [Validators.required]],
    });

    if (this.session.isClubAdmin()) {
      const cid = this.session.getClubId();
      if (cid != null) {
        this.temporadaForm.patchValue({ id_club: cid });
      }
    }
  }

  getTemporada(id: number): void {
    this.oTemporadaService.get(id).subscribe({
      next: (data: ITemporada) => {
        this.temporada.set(data);
        this.syncClub(data.club.id);
        this.temporadaForm.patchValue({
          descripcion: data.descripcion,
          id_club: data.club.id,
        });
        this.loading.set(false);
        const club = data.club;
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error al cargar el registro');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  onSubmit(): void {
    if (!this.temporadaForm.valid) {
      this.temporadaForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const payload = {
      descripcion: this.temporadaForm.value.descripcion,
      club: { id: Number(this.temporadaForm.value.id_club) },
    } as unknown as Partial<ITemporada> & { club?: Partial<IClub> };

    if (this.id() > 0) {
      payload.id = this.id();
      this.oTemporadaService.update(payload).subscribe({
        next: () => {
          this.submitting.set(false);
          if (this.temporadaForm) this.temporadaForm.markAsPristine();
          this.notificacion.success('Se ha guardado correctamente');
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.error.set('Error al guardar el registro');
          this.notificacion.error('Error al guardar el registro');
          console.error(err);
        },
      });
    } else {
      this.oTemporadaService.create(payload).subscribe({
        next: () => {
          this.submitting.set(false);
          if (this.temporadaForm) this.temporadaForm.markAsPristine();
          this.notificacion.success('Se ha creado correctamente');
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.error.set('Error al crear el registro');
          this.notificacion.error('Error al crear el registro');
          console.error(err);
        },
      });
    }
  }

  private syncClub(idClub: number): void {
    this.oClubService.get(idClub).subscribe({
      next: (club: IClub) => {
        this.selectedClub.set(club);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al sincronizar club:', err);
        this.notificacion.error('Error al cargar el club seleccionado');
      },
    });
  }

  openClubFinderModal(): void {
    const ref = this.modalService.open<unknown, IClub | null>(ClubAdminPlist);

    ref.afterClosed$.subscribe((club: IClub | null) => {
      if (club) {
        this.temporadaForm.patchValue({ id_club: club.id });
        this.syncClub(club.id);
        this.notificacion.info(`Club seleccionado: ${club.nombre}`);
      }
    });
  }

  get descripcion() {
    return this.temporadaForm.get('descripcion');
  }

  get id_club() {
    return this.temporadaForm.get('id_club');
  }
}
