import { InjectionToken } from '@angular/core';
import type { ModalRef } from './modal-ref';

export const MODAL_DATA = new InjectionToken<unknown>('MODAL_DATA');
export const MODAL_REF = new InjectionToken<ModalRef>('MODAL_REF');

/* -----------------------------
// Example of how these tokens are used in a modal content component to receive data and a reference to the modal:

PARENT:

  private readonly modalService = inject(ModalService);
  protected readonly demoResult = signal<string | null>(null);

  openDemoModal(): void {
    const data: DemoModalData = {
      title: 'Demo Modal',
      message: 'Typed data sent from the App component. Write something in the input below and close the modal to see it returned here.',
      badge: 'Basic Demo',
      fromParent: this.appInput,
    };

    const ref = this.modalService.open<DemoModalData, DemoModalResult>(DemoModalComponent, { data });

    ref.afterClosed$.subscribe(result => {
      if (result !== undefined) {
        this.demoResult.set(result.text || '(empty)');
      }
    });
  }


CHILD:

    protected readonly data = inject(MODAL_DATA) as DemoModalData; //use data sent from the parent component
    private readonly modalRef = inject(MODAL_REF) as ModalRef<DemoModalData, DemoModalResult>;

    protected inputText = '';

    close(): void {
        this.modalRef.close({ text: this.inputText });
    }

----------------------------- 
*/    