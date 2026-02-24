import { Component, OnInit, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { INoticia } from '../../../model/noticia';
import { IClub } from '../../../model/club';
import { ClubService } from '../../../service/club';
import { ClubPlistAdminUnrouted } from '../../club/plist-admin-unrouted/club-plist-admin-unrouted';

@Component({
  selector: 'app-noticia-form-unrouted',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-unrouted.html',
  styleUrls: ['./form-unrouted.css'],
})
export class NoticiaFormUnrouted implements OnInit {
  @Input() noticia: INoticia | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private oClubService = inject(ClubService);
  private snackBar = inject(MatSnackBar);

  noticiaForm!: FormGroup;
  loading = signal(false);
  clubes = signal<IClub[]>([]);
  selectedClub = signal<IClub | null>(null);
  displayIdClub = signal<number | null>(null);

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClubs();

    if (this.noticia) {
      this.loadNoticiaData();
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

  private loadNoticiaData(): void {
    if (!this.noticia) return;

    this.noticiaForm.patchValue({
      id: this.noticia.id,
      titulo: this.noticia.titulo,
      contenido: this.noticia.contenido,
      fecha: this.noticia.fecha,
      imagen: this.noticia.imagen || null,
      id_club: this.noticia.club?.id,
    });

    if (this.noticia.club) {
      this.syncClub(this.noticia.club.id);
    }
  }

  private loadClub(idClub: number): void {
    this.displayIdClub.set(idClub);
    const c = this.clubes().find((x) => x.id === idClub) || null;
    this.selectedClub.set(c);
  }

  private syncClub(idClub: number): void {
    this.displayIdClub.set(idClub);
    const c = this.clubes().find((x) => x.id === idClub) || null;
    this.selectedClub.set(c);
  }

  private loadClubs(): void {
    this.loading.set(true);
    this.oClubService.getPage(0, 1000, 'nombre', 'asc').subscribe({
      next: (page) => {
        this.clubes.set(page.content);
        const idActual = this.noticiaForm.get('id_club')?.value;
        if (idActual) {
          this.syncClub(idActual);
        }
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error cargando clubs', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  get titulo() {
    return this.noticiaForm.get('titulo');
  }

  get contenido() {
    return this.noticiaForm.get('contenido');
  }

  get fecha() {
    return this.noticiaForm.get('fecha');
  }

  get id_club() {
    return this.noticiaForm.get('id_club');
  }

  onSubmit(): void {
    if (this.noticiaForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', {
        duration: 4000,
      });
      this.noticiaForm.markAllAsTouched();
      return;
    }

    const fechaValue = this.noticiaForm.value.fecha;
    // Formato esperado por el backend: yyyy-MM-dd HH:mm:ss (con espacio, no con T)
    const fechaConHora = fechaValue.includes(' ') ? fechaValue : `${fechaValue.split('T')[0]} 00:00:00`;

    const formData = {
      id: this.isEditMode ? this.noticia?.id : undefined,
      titulo: this.noticiaForm.value.titulo,
      contenido: this.noticiaForm.value.contenido,
      fecha: fechaConHora,
      imagen: this.noticiaForm.value.imagen || null,
      club: { id: this.noticiaForm.value.id_club },
      comentarios: [],
      puntuaciones: [],
    };

    this.formSubmit.emit(formData);
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  openClubFinderModal(): void {
    const dialogRef = this.dialog.open(ClubPlistAdminUnrouted, {
      height: '800px',
      width: '1300px',
      maxWidth: '95vw',
      panelClass: 'club-dialog',
      data: {
        title: 'Aqui elegir club',
        message: 'Plist finder para encontrar el club y asignarlo a la noticia',
      },
    });

    dialogRef.afterClosed().subscribe((club: IClub | null) => {
      if (club) {
        this.noticiaForm.patchValue({
          id_club: club.id,
        });
        this.syncClub(club.id);
        this.snackBar.open(`Club seleccionado: ${club.nombre}`, 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }
}
