import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PartidoService } from '../../../../service/partido';
import { LigaService } from '../../../../service/liga';
import { IPartido } from '../../../../model/partido';
import { ILiga } from '../../../../model/liga';
import { SessionService } from '../../../../service/session';

@Component({
  selector: 'app-partido-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class PartidoAdminForm implements OnInit {
  @Input() partido: IPartido | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oPartidoService = inject(PartidoService);
  private oLigaService = inject(LigaService);
  private dialog = inject(MatDialog);
  private sessionService = inject(SessionService);

  partidoForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  ligas = signal<ILiga[]>([]);
  selectedLiga = signal<ILiga | null>(null);
  displayIdLiga = signal<number | null>(null);

  constructor() {
    effect(() => {
      const p = this.partido;
      if (p && this.partidoForm) {
        this.loadPartidoData(p);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadLigas();

    if (this.partido) {
      this.loadPartidoData(this.partido);
    }
  }

  private initForm(): void {
    this.partidoForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      rival: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      id_liga: [null, Validators.required],
      local: [null, Validators.required],
      resultado: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    });

    this.partidoForm.get('id_liga')?.valueChanges.subscribe((id) => {
      if (id) {
        this.loadLiga(Number(id));
      } else {
        this.selectedLiga.set(null);
        this.displayIdLiga.set(null);
      }
    });
  }

  private loadPartidoData(partido: IPartido): void {
    this.partidoForm.patchValue({
      id: partido.id,
      rival: partido.rival,
      id_liga: partido.liga?.id,
      local: partido.local ? 1 : 0,
      resultado: partido.resultado,
    });
    if (partido.liga?.id) {
      this.syncLiga(partido.liga.id);
    }
  }

  private loadLiga(idLiga: number): void {
    this.oLigaService.get(idLiga).subscribe({
      next: (liga) => {
        this.selectedLiga.set(liga);
        this.displayIdLiga.set(liga.id);
      },
      error: (err: HttpErrorResponse) => {
        this.selectedLiga.set(null);
        this.displayIdLiga.set(null);
        console.error(err);
        this.snackBar.open('Error cargando la liga', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private loadLigas(): void {
    const clubId = this.sessionService.isClubAdmin() ? this.sessionService.getClubId() ?? 0 : 0;
    const ligas$ = clubId > 0 ? this.oLigaService.getPage(0, 1000, 'nombre', 'asc', '', clubId) : this.oLigaService.getPage(0, 1000, 'nombre', 'asc', '');

    ligas$.subscribe({
      next: (page) => {
        this.ligas.set(page.content);
        const currentId = this.partidoForm.get('id_liga')?.value;
        if (currentId) {
          this.syncLiga(Number(currentId));
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackBar.open('Error cargando ligas', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private syncLiga(idLiga: number): void {
    const selected = this.ligas().find((l) => l.id === idLiga) || null;
    this.selectedLiga.set(selected);
    this.displayIdLiga.set(selected?.id ?? null);
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

  onSubmit(): void {
    if (this.partidoForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const partidoData: any = {
      rival: this.partidoForm.value.rival,
      liga: { id: Number(this.partidoForm.value.id_liga) },
      local: Number(this.partidoForm.value.local) === 1,
      resultado: this.partidoForm.value.resultado,
    };

    if (this.isEditMode && this.partido?.id) {
      partidoData.id = this.partido.id;
      this.oPartidoService.update(partidoData).subscribe({
        next: () => {
          this.snackBar.open('Partido actualizado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el partido');
          this.snackBar.open('Error actualizando el partido', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oPartidoService.create(partidoData).subscribe({
        next: () => {
          this.snackBar.open('Partido creado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el partido');
          this.snackBar.open('Error creando el partido', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
