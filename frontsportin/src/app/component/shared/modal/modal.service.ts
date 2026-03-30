import {
    ApplicationRef,
    createComponent,
    EmbeddedViewRef,
    EnvironmentInjector,
    inject,
    Injectable,
    Type,
} from '@angular/core';
import { ModalRef } from './modal-ref';
import { ModalComponent } from './modal.component';

export interface ModalConfig<TData = unknown> {
    data?: TData;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
    private readonly appRef = inject(ApplicationRef);
    private readonly environmentInjector = inject(EnvironmentInjector);

    open<TData = unknown, TResult = unknown>(
        component: Type<unknown>,
        config?: ModalConfig<TData>,
    ): ModalRef<TData, TResult> {
        const modalRef = new ModalRef<TData, TResult>(config?.data as TData);

        const modalComponentRef = createComponent(ModalComponent, {
            environmentInjector: this.environmentInjector,
        });

        // Set inputs before attaching view so they are available in ngOnInit
        modalComponentRef.setInput('contentComponent', component);
        modalComponentRef.setInput('modalRef', modalRef);
        modalComponentRef.setInput('data', config?.data);

        this.appRef.attachView(modalComponentRef.hostView);

        const domElem = (modalComponentRef.hostView as EmbeddedViewRef<unknown>)
            .rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);

        // Clean up DOM and view when the modal is closed
        modalRef.afterClosed$.subscribe(() => {
            this.appRef.detachView(modalComponentRef.hostView);
            modalComponentRef.destroy();
            domElem.remove();
        });

        return modalRef;
    }
}
