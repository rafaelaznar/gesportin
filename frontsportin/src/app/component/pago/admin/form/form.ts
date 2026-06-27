import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { PagoService } from '../../../../service/pago';
import { CuotaService } from '../../../../service/cuota';
import { JugadorService } from '../../../../service/jugador-service';
import { IPago } from '../../../../model/pago';
import { ICuota } from '../../../../model/cuota';
import { IJugador } from '../../../../model/jugador';
import { SessionService } from '../../../../service/session';
import { CuotaAdminPlist } from '../../../cuota/admin/plist/plist';
import { JugadorAdminPlist } from '../../../jugador/admin/plist/plist';

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
  private notificacion = inject(NotificacionService);
  private oPagoService = inject(PagoService);
  private oCuotaService = inject(CuotaService);
  private oJugadorService = inject(JugadorService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  pagoForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedCuota = signal<ICuota | null>(null);
  selectedJugador = signal<IJugador | null>(null);

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
  }

  private loadPagoData(pago: IPago): void {
    this.pagoForm.patchValue({
      id: pago.id,
      id_cuota: pago.cuota?.id,
      id_jugador: pago.jugador?.id,
      abonado: pago.abonado,
      fecha: pago.fecha,
    });
    if (pago.cuota?.id) this.loadCuota(pago.cuota.id);
    if (pago.jugador?.id) this.loadJugador(pago.jugador.id);
  }

  private loadCuota(idCuota: number): void {
    this.oCuotaService.get(idCuota).subscribe({
      next: (cuota) => this.selectedCuota.set(cuota),
      error: () => this.selectedCuota.set(null),
    });
  }

  private loadJugador(idJugador: number): void {
    this.oJugadorService.getById(idJugador).subscribe({
      next: (jugador) => this.selectedJugador.set(jugador),
      error: () => this.selectedJugador.set(null),
    });
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

  openCuotaFinderModal(): void {
    const ref = this.modalService.open<unknown, ICuota | null>(CuotaAdminPlist);
    ref.afterClosed$.subscribe((cuota: ICuota | null) => {
      if (cuota?.id != null) {
        this.pagoForm.patchValue({ id_cuota: cuota.id });
        this.selectedCuota.set(cuota);
        this.notificacion.success(`Cuota seleccionada: ${cuota.descripcion}`);
      }
    });
  }

  openJugadorFinderModal(): void {
    const ref = this.modalService.open<unknown, IJugador | null>(JugadorAdminPlist);
    ref.afterClosed$.subscribe((jugador: IJugador | null) => {
      if (jugador?.id != null) {
        this.pagoForm.patchValue({ id_jugador: jugador.id });
        this.selectedJugador.set(jugador);
        this.notificacion.success(`Jugador seleccionado: ${jugador.usuario?.nombre} ${jugador.usuario?.apellido1}`);
      }
    });
  }

  onSubmit(): void {
    if (this.pagoForm.invalid) {
      this.notificacion.success('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const pagoData: any = {
      cuota: { id: Number(this.pagoForm.value.id_cuota) },
      jugador: { id: Number(this.pagoForm.value.id_jugador) },
      abonado: Boolean(this.pagoForm.value.abonado),
      fecha: this.pagoForm.value.fecha?.length === 10
        ? `${this.pagoForm.value.fecha}T00:00:00`
        : this.pagoForm.value.fecha,
    };

    if (this.isEditMode && this.pago?.id) {
      pagoData.id = this.pago.id;
      this.oPagoService.update(pagoData).subscribe({
        next: () => {
          this.notificacion.success('Pago actualizado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el pago');
          this.notificacion.error('Error actualizando el pago');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oPagoService.create(pagoData).subscribe({
        next: () => {
          this.notificacion.success('Pago creado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el pago');
          this.notificacion.error('Error creando el pago');
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
