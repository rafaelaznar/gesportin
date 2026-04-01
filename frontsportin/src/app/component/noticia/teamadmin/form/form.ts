import { Component, OnInit, inject, signal, input } from '@angular/core';
import { toIsoDateTime } from '../../../../utils/date-utils';
import { SessionService } from '../../../../service/session';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { INoticia } from '../../../../model/noticia';
import { IClub } from '../../../../model/club';
import { ClubService } from '../../../../service/club';
import { NoticiaService } from '../../../../service/noticia';
import { ClubAdminPlist } from '../../../club/admin/plist/plist';

@Component({
  selector: 'app-noticia-teamadmin-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class NoticiaTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/noticia/teamadmin');

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private oClubService = inject(ClubService);
  private oNoticiaService = inject(NoticiaService);
  private notificacion = inject(NotificacionService);
  session: SessionService = inject(SessionService);

  noticiaForm!: FormGroup;
  loading = signal(false);
  submitting = signal(false);
  error = signal<string | null>(null);
  selectedClub = signal<IClub | null>(null);
  displayIdClub = signal<number | null>(null);

  private modalService = inject(ModalService);

  ngOnInit(): void {
    this.initForm();

    if (this.id() > 0) {
      this.loadById(this.id());
    }
  }

  private initForm(): void {
    this.noticiaForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      contenido: ['', [Validators.required, Validators.minLength(3)]],
      fecha: [new Date().toISOString().split('T')[0], Validators.required],
      imagen: [null],
      id_club: [null, Validators.required],
    });

    if (this.session.isClubAdmin()) {
      const clubId = this.session.getClubId();
      if (clubId != null) {
        this.noticiaForm.patchValue({ id_club: clubId });
        this.noticiaForm.get('id_club')?.disable();
        this.loadClub(clubId);
      }
    }

    this.noticiaForm.get('id_club')?.valueChanges.subscribe((id) => {
      if (id) {
        const idNumero = typeof id === 'string' ? parseInt(id, 10) : id;
        this.loadClub(idNumero);
      } else {
        this.selectedClub.set(null);
        this.displayIdClub.set(null);
      }
    });
  }

  private loadById(id: number): void {
    this.loading.set(true);
    this.oNoticiaService.getById(id).subscribe({
      next: (data: INoticia) => {
        this.loadNoticiaData(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el registro');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  private loadNoticiaData(noticia: INoticia): void {
    const fechaIso = toIsoDateTime(noticia.fecha);
    const fechaInput = fechaIso ? fechaIso.split('T')[0] : '';

    this.noticiaForm.patchValue({
      id: noticia.id,
      titulo: noticia.titulo,
      contenido: noticia.contenido,
      fecha: fechaInput,
      imagen: noticia.imagen || null,
      id_club: noticia.club?.id,
    });

    if (noticia.club) {
      this.syncClub(noticia.club.id);
    }
  }

  private loadClub(idClub: number): void {
    this.displayIdClub.set(idClub);
    this.oClubService.get(idClub).subscribe({
      next: (club) => this.selectedClub.set(club),
      error: () => this.selectedClub.set(null),
    });
  }

  private syncClub(idClub: number): void {
    this.displayIdClub.set(idClub);
    this.oClubService.get(idClub).subscribe({
      next: (club) => this.selectedClub.set(club),
      error: () => this.selectedClub.set(null),
    });
  }

  private loadClubs(): void {
    if (this.session.isClubAdmin()) {
      return;
    }
    this.oClubService.getPage(0, 1000, 'nombre', 'asc').subscribe({
      next: (page) => {
        const idActual = this.noticiaForm.get('id_club')?.value;
        if (idActual) {
          this.syncClub(idActual);
        }
      },
      error: () => {},
    });
  }

  get titulo() { return this.noticiaForm.get('titulo'); }
  get contenido() { return this.noticiaForm.get('contenido'); }
  get fecha() { return this.noticiaForm.get('fecha'); }
  get id_club() { return this.noticiaForm.get('id_club'); }

  onSubmit(): void {
    if (this.noticiaForm.invalid) {
      this.notificacion.success('Por favor, complete todos los campos correctamente');
      this.noticiaForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const fechaConHora = toIsoDateTime(this.noticiaForm.value.fecha);

    const noticiaData: any = {
      titulo: this.noticiaForm.value.titulo,
      contenido: this.noticiaForm.value.contenido,
      fecha: fechaConHora,
      imagen: this.noticiaForm.value.imagen || null,
      club: {
        id: this.session.isClubAdmin()
          ? this.session.getClubId()
          : this.noticiaForm.value.id_club,
      },
      comentarios: [],
      puntuaciones: [],
    };

    if (this.id() > 0) {
      noticiaData.id = this.id();
      this.oNoticiaService.update(noticiaData).subscribe({
        next: () => {
          this.notificacion.success('Noticia actualizada');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.notificacion.success('Error actualizando la noticia');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oNoticiaService.create(noticiaData).subscribe({
        next: () => {
          this.notificacion.success('Noticia creada');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.notificacion.success('Error creando la noticia');
          console.error(err);
          this.submitting.set(false);
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.returnUrl()]);
  }

  openClubFinderModal(): void {
    const ref = this.modalService.open<unknown, IClub | null>(ClubAdminPlist);

    ref.afterClosed$.subscribe((club: IClub | null) => {
      if (club) {
        this.noticiaForm.patchValue({ id_club: club.id });
        this.syncClub(club.id);
        this.notificacion.success(`Club seleccionado: ${club.nombre}`);
      }
    });
  }
}
