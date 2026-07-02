import { Component, computed, inject, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { MODAL_REF } from '../../../shared/modal/modal.tokens';
import { debounceTimeSearch } from '../../../../environment/environment';
import { IComentarioart } from '../../../../model/comentarioart';
import { IPage } from '../../../../model/plist';
import { ComentarioartService } from '../../../../service/comentarioart';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../../shared/botonera-rpp/botonera-rpp';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';
import { TrimPipe } from '../../../../pipe/trim-pipe';

@Component({
  standalone: true,
  selector: 'app-comentarioart-teamadmin-plist',
  imports: [RouterLink, Paginacion, BotoneraRpp, BotoneraActionsPlist, TrimPipe],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class ComentarioartTeamadminPlist implements OnInit, OnDestroy {
  @Input() id_articulo?: number;
  @Input() id_usuario?: number;

  oPage = signal<IPage<IComentarioart> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(6);
  contenido = signal<string>('');
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  private comentarioartService = inject(ComentarioartService);
  private modalRef = inject(MODAL_REF, { optional: true });

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((term) => {
        this.contenido.set(term);
        this.numPage.set(0);
        this.getPage();
      });
    this.getPage();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  getPage(): void {
    this.comentarioartService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.contenido(),
        this.id_articulo ?? 0,
        this.id_usuario ?? 0,
      )
      .subscribe({
        next: (data: IPage<IComentarioart>) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
        },
        error: (err: HttpErrorResponse) => console.error(err),
      });
  }

  onRppChange(n: number): void { this.numRpp.set(n); this.numPage.set(0); this.getPage(); }
  goToPage(n: number): void { this.numPage.set(n); this.getPage(); }
  onSearch(value: string): void { this.searchSubject.next(value); }

  isDialogMode(): boolean { return !!this.modalRef; }
  onSelect(comentario: IComentarioart): void { this.modalRef?.close(comentario); }
}

