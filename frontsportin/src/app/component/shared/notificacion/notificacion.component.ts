import { Component, inject, input, OnInit } from '@angular/core';
import { MODAL_DATA, MODAL_REF } from '../modal/modal.tokens';
import { ModalRef } from '../modal/modal-ref';

export type NotificacionTipo = 'success' | 'error' | 'warning' | 'info';

export interface NotificacionData {
  tipo?: NotificacionTipo;
  titulo?: string;
  mensaje: string;
  /** ms antes de cerrarse automáticamente; 0 = no cierra solo (por defecto 2500) */
  autoCierre?: number;
  /** Texto del botón de confirmación */
  confirmLabel?: string;
}

const ICONOS: Record<NotificacionTipo, string> = {
  success: 'bi-check-circle-fill',
  error:   'bi-x-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
  info:    'bi-info-circle-fill',
};

const COLORES: Record<NotificacionTipo, { bg: string; icon: string; btn: string }> = {
  success: { bg: '#d1fae5', icon: '#059669', btn: '#059669' },
  error:   { bg: '#fee2e2', icon: '#dc2626', btn: '#dc2626' },
  warning: { bg: '#fef9c3', icon: '#d97706', btn: '#d97706' },
  info:    { bg: '#e0f2fe', icon: '#0284c7', btn: '#0284c7' },
};

@Component({
  selector: 'app-notificacion',
  standalone: true,
  template: `
    <div class="swal-box" [style.background]="color.bg">
      <div class="swal-icon-ring" [style.border-color]="color.icon + '33'">
        <i class="bi swal-icon" [class]="icono" [style.color]="color.icon"></i>
      </div>
      @if (titulo()) {
        <h2 class="swal-titulo">{{ titulo() }}</h2>
      }
      <p class="swal-mensaje">{{ mensaje() }}</p>
      <button
        class="swal-btn"
        [style.background]="color.btn"
        (click)="close()"
      >{{ data.confirmLabel ?? 'Aceptar' }}</button>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .swal-box {
      padding: 2rem 2rem 1.6rem;
      text-align: center;
      min-width: 320px;
      max-width: 440px;
      border-radius: 14px;
    }

    .swal-icon-ring {
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      border: 3px solid;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;
      animation: bounceIn .35s cubic-bezier(.34,1.56,.64,1) both;
    }

    .swal-icon {
      font-size: 2.4rem;
      line-height: 1;
    }

    .swal-titulo {
      font-size: 1.35rem;
      font-weight: 700;
      color: #111;
      margin: 0 0 .45rem;
    }

    .swal-mensaje {
      font-size: 1rem;
      color: #374151;
      margin: 0 0 1.5rem;
      line-height: 1.5;
    }

    .swal-btn {
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: .55rem 2.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: filter .12s;
    }

    .swal-btn:hover { filter: brightness(1.1); }

    @keyframes bounceIn {
      from { transform: scale(.3); opacity: 0; }
      to   { transform: scale(1);  opacity: 1; }
    }
  `],
})
export class NotificacionComponent implements OnInit {
  protected readonly data = inject(MODAL_DATA) as NotificacionData;
  private readonly modalRef = inject(MODAL_REF) as ModalRef<NotificacionData, void>;

  protected readonly tipo   = input<NotificacionTipo>('success');
  protected readonly titulo = input<string | undefined>(undefined);
  protected readonly mensaje = input<string>('');

  protected get icono()  { return ICONOS[(this.data.tipo  ?? 'success')]; }
  protected get color()  { return COLORES[(this.data.tipo ?? 'success')]; }

  private _timer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    const delay = this.data.autoCierre ?? 2500;
    if (delay > 0) {
      this._timer = setTimeout(() => this.close(), delay);
    }
  }

  close(): void {
    clearTimeout(this._timer);
    this.modalRef.close();
  }
}
