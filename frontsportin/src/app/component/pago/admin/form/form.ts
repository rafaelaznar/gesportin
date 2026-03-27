import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PagoService } from '../../../../service/pago';
import { CuotaService } from '../../../../service/cuota';
import { JugadorService } from '../../../../service/jugador-service';
import { IPago } from '../../../../model/pago';
import { ICuota } from '../../../../model/cuota';
import { IJugador } from '../../../../model/jugador';
import { SessionService } from '../../../../service/session';

@Component({
  selector: 'app-pago-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class PagoAdminForm implements OnInit {
  @Input() pago: IPago | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oPagoService = inject(PagoService);
  private oCuotaService = inject(CuotaService);
  private oJugadorService = inject(JugadorService);
  private dialog = inject(MatDialog);
  private sessionService = inject(SessionService);

  pagoForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  cuotas = signal<ICuota[]>([]);
  jugadores = signal<IJugador[]>([]);
  selectedCuota = signal<ICuota | null>(null);
  displayIdCuota = signal<number | null>(null);

  constructor() {
    effect(() => {
      const p = this.pago;
      if (p && this.pagoForm) {
        this.loadPagoData(p);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadCuotas();
    this.loadJugadores();

    if (this.pago) {
      this.loadPagoData(this.pago);
    }
  }

  private initForm(): void {
    this.pagoForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      id_cuota: [null, Validators.required],
      id_jugador: [null, Validators.required],
      abonado: [0, [Validators.required, Validators.min(0)]],
      fecha: ['', Validators.required],
    });

    this.pagoForm.get('id_cuota')?.valueChanges.subscribe((id) => {
      if (id) {
        this.loadCuota(Number(id));
      } else {
        this.selectedCuota.set(null);
        this.displayIdCuota.set(null);
      }
    });
  }

  private loadPagoData(pago: IPago): void {
    this.pagoForm.patchValue({
      id: pago.id,
      id_cuota: pago.cuota?.id,
      id_jugador: pago.jugador?.id,
      abonado: pago.abonado,
      fecha: pago.fecha,
    });
    if (pago.cuota?.id) {
      this.syncCuota(pago.cuota.id);
    }
  }

  private loadCuota(idCuota: number): void {
    this.oCuotaService.get(idCuota).subscribe({
      next: (cuota) => {
        this.selectedCuota.set(cuota);
        this.displayIdCuota.set(cuota.id);
      },
      error: (err: HttpErrorResponse) => {
        this.selectedCuota.set(null);
        this.displayIdCuota.set(null);
        console.error(err);
        this.snackBar.open('Error cargando la cuota', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private loadCuotas(): void {
    this.oCuotaService.getPage(0, 1000, 'descripcion', 'asc', '').subscribe({
      next: (page) => {
        this.cuotas.set(page.content);
        const currentId = this.pagoForm.get('id_cuota')?.value;
        if (currentId) {
          this.syncCuota(Number(currentId));
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackBar.open('Error cargando cuotas', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private loadJugadores(): void {
    this.oJugadorService.getPage(0, 1000, 'dorsal', 'asc', '').subscribe({
      next: (page) => {
        this.jugadores.set(page.content);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackBar.open('Error cargando jugadores', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private syncCuota(idCuota: number): void {
    const selected = this.cuotas().find((c) => c.id === idCuota) || null;
    this.selectedCuota.set(selected);
    this.displayIdCuota.set(selected?.id ?? null);
  }

  get id_cuota() {
    return this.pagoForm.get('id_cuota');
  }

  get id_jugador() {
    return this.pagoForm.get('id_jugador');
  }

  get abonado() {
    return this.pagoForm.get('abonado');
  }

  get fecha() {
    return this.pagoForm.get('fecha');
  }

  onSubmit(): void {
    if (this.pagoForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const pagoData: any = {
      cuota: { id: Number(this.pagoForm.value.id_cuota) },
      jugador: { id: Number(this.pagoForm.value.id_jugador) },
      abonado: Number(this.pagoForm.value.abonado),
      fecha: this.pagoForm.value.fecha,
    };

    if (this.isEditMode && this.pago?.id) {
      pagoData.id = this.pago.id;
      this.oPagoService.update(pagoData).subscribe({
        next: () => {
          this.snackBar.open('Pago actualizado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el pago');
          this.snackBar.open('Error actualizando el pago', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oPagoService.create(pagoData).subscribe({
        next: () => {
          this.snackBar.open('Pago creado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el pago');
          this.snackBar.open('Error creando el pago', 'Cerrar', { duration: 4000 });
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
