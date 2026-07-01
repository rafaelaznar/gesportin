import { Component, inject } from '@angular/core';
import { ModalRef } from '../modal/modal-ref';
import { MODAL_DATA, MODAL_REF } from '../modal/modal.tokens';

export interface ResultDialogData {
  title?: string;
  message: string;
  details?: string[];
}

@Component({
  selector: 'app-result-dialog',
  standalone: true,
  imports: [],
  template: `
    <div class="result-dialog">
      <h2 class="result-dialog__title">{{ data.title || 'Resultado' }}</h2>
      <p class="result-dialog__message" [innerHTML]="data.message"></p>
      @if (data.details && data.details.length > 0) {
        <ul class="result-dialog__details">
          @for (d of data.details; track $index) {
            <li>{{ d }}</li>
          }
        </ul>
      }
      <div class="result-dialog__actions">
        <button class="btn btn-primary" (click)="onClose()">Cerrar</button>
      </div>
    </div>
  `,
  styles: [`
    .result-dialog {
      padding: 1.5rem;
      min-width: 380px;
      max-width: 560px;
    }
    .result-dialog__title {
      margin: 0 0 0.75rem;
      font-size: 1.125rem;
      font-weight: 600;
    }
    .result-dialog__message {
      margin: 0 0 1rem;
      color: #333;
      line-height: 1.5;
    }
    .result-dialog__details {
      margin: 0 0 1rem;
      padding-left: 1.25rem;
      font-size: 0.875rem;
      color: #555;
      max-height: 300px;
      overflow-y: auto;
    }
    .result-dialog__actions {
      display: flex;
      justify-content: flex-end;
    }
  `],
})
export class ResultDialogComponent {
  protected readonly data = inject(MODAL_DATA) as ResultDialogData;
  private readonly modalRef = inject(MODAL_REF) as ModalRef<ResultDialogData, boolean>;

  onClose(): void {
    this.modalRef.close(true);
  }
}
