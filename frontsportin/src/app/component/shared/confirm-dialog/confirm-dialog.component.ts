import { Component, inject } from '@angular/core';
import { ModalRef } from '../modal/modal-ref';
import { MODAL_DATA, MODAL_REF } from '../modal/modal.tokens';

export interface ConfirmDialogData {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  template: `
    <div class="confirm-dialog">
      <h2 class="confirm-dialog__title">{{ data.title || 'Confirmar' }}</h2>
      <p class="confirm-dialog__message" [innerHTML]="data.message || '¿Confirmar la acción?'"></p>
      <div class="confirm-dialog__actions">
        <button class="btn btn-secondary" (click)="onCancel()">{{ data.cancelLabel || 'Cancelar' }}</button>
        <button class="btn btn-danger" (click)="onConfirm()">{{ data.confirmLabel || 'Confirmar' }}</button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      padding: 1.5rem;
      min-width: 320px;
    }
    .confirm-dialog__title {
      margin: 0 0 0.75rem;
      font-size: 1.125rem;
      font-weight: 600;
    }
    .confirm-dialog__message {
      margin: 0 0 1.5rem;
      color: #555;
    }
    .confirm-dialog__actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `],
})
export class ConfirmDialogComponent {
  protected readonly data = inject(MODAL_DATA) as ConfirmDialogData;
  private readonly modalRef = inject(MODAL_REF) as ModalRef<ConfirmDialogData, boolean>;

  onConfirm(): void {
    this.modalRef.close(true);
  }

  onCancel(): void {
    this.modalRef.close(false);
  }
}
