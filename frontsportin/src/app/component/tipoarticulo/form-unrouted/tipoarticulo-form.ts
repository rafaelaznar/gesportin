import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { SessionService } from '../../../service/session';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TipoarticuloService } from '../../../service/tipoarticulo';
import { ClubService } from '../../../service/club';
import { ITipoarticulo } from '../../../model/tipoarticulo';
import { IClub } from '../../../model/club';
import { ClubPlistAdminUnrouted } from '../../club/plist-admin-unrouted/club-plist-admin-unrouted';

@Component({
  selector: 'app-tipoarticulo-form-unrouted',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tipoarticulo-form.html',
  styleUrls: ['./tipoarticulo-form.css'],
})
export class TipoarticuloFormAdminUnrouted implements OnInit {
  @Input() tipoarticulo: ITipoarticulo | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private oTipoarticuloService = inject(TipoarticuloService);
  private oClubService = inject(ClubService);
  session: SessionService = inject(SessionService);

  tipoarticuloForm!: FormGroup;
  submitting = signal(false);
  selectedClub = signal<IClub | null>(null);

  ngOnInit(): void {
    this.initForm();
    if (this.tipoarticulo) {
      this.loadData(this.tipoarticulo);
    }
  }

  private initForm(): void {
    this.tipoarticuloForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      id_club: [null, Validators.required],
    });

    if (this.session.isClubAdmin()) {
      const cid = this.session.getClubId();
      if (cid != null) {
        this.tipoarticuloForm.patchValue({ id_club: cid });
        this.syncClub(cid);
        // no need to change required because value present
      }
    }

    this.tipoarticuloForm.get('id_club')?.valueChanges.subscribe((id) => {
      if (id) {
        this.syncClub(Number(id));
      } else {
        this.selectedClub.set(null);
      }
    });
  }

  private loadData(t: ITipoarticulo): void {
    this.tipoarticuloForm.patchValue({
      id: t.id ?? 0,
      descripcion: t.descripcion ?? '',
      id_club: t.club?.id ?? null,
    });
    if (t.club?.id) {
      this.syncClub(t.club.id);
    }
  }

  private syncClub(idClub: number | null | undefined): void {
    if (!idClub) {
      this.selectedClub.set(null);
      return;
    }
    this.oClubService.get(idClub).subscribe({
      next: (club: IClub) => this.selectedClub.set(club),
      error: (err) => {
        console.error(err);
        this.selectedClub.set(null);
        this.snackBar.open('Error al cargar el club seleccionado', 'Cerrar', { duration: 3000 });
      },
    });
  }

  openClubFinderModal(): void {
    if (this.session.isClubAdmin()) {
      return; // club is fixed
    }
    const dialogRef = this.dialog.open(ClubPlistAdminUnrouted, {
      height: '800px',
      width: '1100px',
      maxWidth: '95vw',
      panelClass: 'club-dialog',
      data: { title: 'Elegir club', message: 'Plist finder' },
    });

    dialogRef.afterClosed().subscribe((club: IClub | null) => {
      if (club) {
        this.tipoarticuloForm.patchValue({ id_club: club.id });
        this.syncClub(club.id);
        this.snackBar.open(`Club seleccionado: ${club.nombre}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.tipoarticuloForm.invalid) {
      this.tipoarticuloForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const payload: any = {
      descripcion: this.tipoarticuloForm.value.descripcion,
      club: { id: this.session.isClubAdmin() ? this.session.getClubId() : this.tipoarticuloForm.value.id_club },
    };

    if (this.mode === 'edit' && this.tipoarticulo?.id) {
      payload.id = this.tipoarticulo.id;
      this.oTipoarticuloService.update(payload).subscribe({
        next: () => {
          this.submitting.set(false);
          this.snackBar.open('Tipo de artículo actualizado', 'Cerrar', { duration: 3000 });
          this.formSuccess.emit();
        },
        error: (err) => {
          console.error(err);
          this.submitting.set(false);
          this.snackBar.open('Error actualizando', 'Cerrar', { duration: 4000 });
        },
      });
    } else {
      this.oTipoarticuloService.create(payload).subscribe({
        next: () => {
          this.submitting.set(false);
          this.snackBar.open('Tipo de artículo creado', 'Cerrar', { duration: 3000 });
          this.formSuccess.emit();
        },
        error: (err) => {
          console.error(err);
          this.submitting.set(false);
          this.snackBar.open('Error creando', 'Cerrar', { duration: 4000 });
        },
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
