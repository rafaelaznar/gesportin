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
import { ClubPlistFinder } from '../../../club/finder/plist';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-temporada-admin-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class TemporadaAdminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/temporada');

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
  clubError = signal(false);

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

    this.temporadaForm.get('id_club')?.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe((id) => {
      if (id) {
        const idNumero = typeof id === 'string' ? parseInt(id, 10) : id;
        if (!isNaN(idNumero)) {
          this.syncClub(idNumero);
        }
      } else {
        this.selectedClub.set(null);
        this.clubError.set(false);
      }
    });
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
          this.notificacion.info('Se ha guardado correctamente');
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
          this.notificacion.info('Se ha creado correctamente');
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
    this.clubError.set(false);
    this.oClubService.get(idClub).subscribe({
      next: (club: IClub) => {
        this.selectedClub.set(club);
        this.clubError.set(false);
        if (this.id_club?.hasError('clubNotFound')) {
          const errors = { ...this.id_club.errors };
          delete (errors as any)['clubNotFound'];
          this.id_club?.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      },
      error: () => {
        this.selectedClub.set(null);
        this.clubError.set(true);
        this.id_club?.setErrors({ clubNotFound: true });
      },
    });
  }

  openClubFinderModal(): void {
    const ref = this.modalService.open<unknown, IClub | null>(ClubPlistFinder);

    ref.afterClosed$.subscribe((club: IClub | null) => {
      if (club) {
        this.temporadaForm.patchValue({ id_club: club.id });
        this.syncClub(club.id);
        this.notificacion.success(`Club seleccionado: ${club.nombre}`);
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
