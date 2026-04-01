import { inject, Injectable } from '@angular/core';
import { ModalService } from '../component/shared/modal/modal.service';
import {
  NotificacionComponent,
  NotificacionData,
  NotificacionTipo,
} from '../component/shared/notificacion/notificacion.component';

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private readonly modalService = inject(ModalService);

  private show(data: NotificacionData): void {
    this.modalService.open<NotificacionData, void>(NotificacionComponent, { data });
  }

  success(mensaje: string, titulo = '¡Correcto!', opts?: Partial<NotificacionData>): void {
    this.show({ tipo: 'success', titulo, mensaje, ...opts });
  }

  error(mensaje: string, titulo = 'Ha ocurrido un error', opts?: Partial<NotificacionData>): void {
    this.show({ tipo: 'error', titulo, mensaje, autoCierre: 0, ...opts });
  }

  warning(mensaje: string, titulo = 'Atención', opts?: Partial<NotificacionData>): void {
    this.show({ tipo: 'warning', titulo, mensaje, ...opts });
  }

  info(mensaje: string, titulo?: string, opts?: Partial<NotificacionData>): void {
    this.show({ tipo: 'info', titulo, mensaje, ...opts });
  }
}
