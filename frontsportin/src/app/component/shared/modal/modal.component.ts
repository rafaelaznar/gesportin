import {
    Component,
    inject,
    Injector,
    input,
    OnInit,
    Type,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { ModalRef } from './modal-ref';
import { MODAL_DATA, MODAL_REF } from './modal.tokens';

@Component({
    selector: 'app-modal',
    standalone: true,
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.css',
})
export class ModalComponent implements OnInit {
    readonly contentComponent = input.required<Type<unknown>>();
    readonly modalRef = input.required<ModalRef>();
    readonly data = input<unknown>();

    @ViewChild('contentHost', { read: ViewContainerRef, static: true })
    contentHost!: ViewContainerRef;

    private readonly parentInjector = inject(Injector);

    ngOnInit(): void {
        const injector = Injector.create({
            providers: [
                { provide: MODAL_DATA, useValue: this.data() },
                { provide: MODAL_REF, useValue: this.modalRef() },
            ],
            parent: this.parentInjector,
        });

        const contentRef = this.contentHost.createComponent(this.contentComponent(), { injector });

        // Reenvía cada propiedad de data() como @Input() del componente contenido.
        // Así los componentes pueden usar input() signals en lugar de inject(MODAL_DATA),
        // garantizando que los valores estén disponibles antes de ngOnInit del contenido.
        if (this.data() && typeof this.data() === 'object') {
            for (const [key, value] of Object.entries(this.data() as Record<string, unknown>)) {
                try {
                    contentRef.setInput(key, value);
                } catch {
                    // El componente no expone este input como @Input(), se ignora
                }
            }
        }
    }

    onBackdropClick(): void {
        this.modalRef().close();
    }
}
