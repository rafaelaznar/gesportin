import { Component, OnInit, inject, signal, effect, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { CuotaService } from '../../../../service/cuota';
import { EquipoService } from '../../../../service/equipo';
import { ICuota } from '../../../../model/cuota';
import { IEquipo } from '../../../../model/equipo';
import { SessionService } from '../../../../service/session';
import { EquipoAdminPlist } from '../../../equipo/admin/plist/plist';

@Component({
  selector: 'app-cuota-teamadmin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class CuotaTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/cuota/teamadmin');
  idEquipo = input<number>(0);

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private oCuotaService = inject(CuotaService);
  private oEquipoService = inject(EquipoService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  cuotaForm!: FormGroup;
  error = signal<string | null>(null);
  loading = signal<boolean>(false);
  submitting = signal(false);
  selectedEquipo = signal<IEquipo | null>(null);

  ngOnInit(): void {
    this.initForm();

    if (this.id() > 0) {
      this.loadById(this.id());
    } else {
      if (this.idEquipo() > 0) {
        this.cuotaForm.patchValue({ id_equipo: this.idEquipo() });
        this.loadEquipo(this.idEquipo());
      }
      this.loading?.set(false);
    }
  }

  private initForm(): void {
    this.cuotaForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      fecha: ['', Validators.required],
      id_equipo: [null, Validators.required],
    });
  }

  private loadById(id: number): void {
    this.loading.set(true);
    this.oCuotaService.get(id).subscribe({
      next: (data: ICuota) => {
        this.loadCuotaData(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el registro');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  private loadCuotaData(cuota: ICuota): void {
    this.cuotaForm.patchValue({
      id: cuota.id,
      descripcion: cuota.descripcion,
      cantidad: cuota.cantidad,
      fecha: cuota.fecha,
      id_equipo: cuota.equipo?.id,
    });
    if (cuota.equipo?.id) this.loadEquipo(cuota.equipo.id);
  }

  private loadEquipo(idEquipo: number): void {
    this.oEquipoService.get(idEquipo).subscribe({
      next: (equipo) => {
        this.selectedEquipo.set(equipo);
        const cat = equipo.categoria;
        const temp = cat?.temporada;
        const isEdit = this.id() > 0;
        const descripcion = this.cuotaForm.get('descripcion')?.value ?? '';
      },
      error: () => this.selectedEquipo.set(null),
    });
  }

  get descripcion() {
    return this.cuotaForm.get('descripcion');
  }

  get cantidad() {
    return this.cuotaForm.get('cantidad');
  }

  get fecha() {
    return this.cuotaForm.get('fecha');
  }

  get id_equipo() {
    return this.cuotaForm.get('id_equipo');
  }

  openEquipoFinderModal(): void {
    const ref = this.modalService.open<unknown, IEquipo | null>(EquipoAdminPlist);
    ref.afterClosed$.subscribe((equipo: IEquipo | null) => {
      if (equipo?.id != null) {
        this.cuotaForm.patchValue({ id_equipo: equipo.id });
        this.selectedEquipo.set(equipo);
        this.notificacion.success(`Equipo seleccionado: ${equipo.nombre}`);
      }
    });
  }

  onSubmit(): void {
    if (this.cuotaForm.invalid) {
      this.notificacion.success('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const cuotaData: any = {
      descripcion: this.cuotaForm.value.descripcion,
      cantidad: Number(this.cuotaForm.value.cantidad),
      fecha: this.cuotaForm.value.fecha,
      equipo: { id: Number(this.cuotaForm.value.id_equipo) },
    };

    if (this.id() > 0) {
      cuotaData.id = this.id();
      this.oCuotaService.update(cuotaData).subscribe({
        next: () => {
          this.notificacion.success('Cuota actualizada exitosamente');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando la cuota');
          this.notificacion.success('Error actualizando la cuota');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oCuotaService.create(cuotaData).subscribe({
        next: () => {
          this.notificacion.success('Cuota creada exitosamente');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando la cuota');
          this.notificacion.success('Error creando la cuota');
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
