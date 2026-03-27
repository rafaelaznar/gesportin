import { Component, computed, inject, Input, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTimeSearch } from '../../../../environment/environment';
import { SessionService } from '../../../../service/session';
import { IComentarioart } from '../../../../model/comentarioart';
import { IPage } from '../../../../model/plist';
import { ComentarioartService } from '../../../../service/comentarioart';
import { BotoneraRpp } from '../../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { TrimPipe } from '../../../../pipe/trim-pipe';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';

@Component({
  standalone: true,
  selector: 'app-comentarioart-admin-plist',
  imports: [RouterLink, BotoneraRpp, Paginacion, TrimPipe, BotoneraActionsPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class ComentarioartAdminPlist {
  @Input() id_articulo?: number;
  @Input() id_usuario?: number;

  oPage = signal<IPage<IComentarioart> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10);
  descripcion = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  private comentarioartService = inject(ComentarioartService);
  private route = inject(ActivatedRoute);
  private dialogRef = inject(MatDialogRef<ComentarioartAdminPlist>, { optional: true });
  private session = inject(SessionService);

  ngOnInit() {
    if (this.id_articulo != null) {
      // ya se filtra por input
    } else {
      const idArticulo = this.route.snapshot.paramMap.get('id_articulo');
      if (idArticulo) {
        this.id_articulo = Number(idArticulo);
      }
    }

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        this.descripcion.set(searchTerm);
        this.numPage.set(0);
        this.getPage();
      });

    this.getPage();
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  getPage() {
    let orderField = this.orderField();
    if (orderField === 'id_articulo') {
      orderField = 'articulo.id';
    }

    this.comentarioartService
      .getPage(
        this.numPage(),
        this.numRpp(),
        orderField,
        this.orderDirection(),
        this.descripcion(),
        this.id_articulo ?? 0,
        this.id_usuario ?? 0,
      )
      .subscribe({
        next: (data) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error cargando comentarios de artículos:', err);
        },
      });
  }

  onRppChange(n: number) {
    this.numRpp.set(n);
    this.numPage.set(0);
    this.getPage();
  }

  goToPage(numPage: number) {
    this.numPage.set(numPage);
    this.getPage();
  }

  onSearchDescripcion(value: string) {
    this.searchSubject.next(value);
  }

  onOrder(order: string) {
    if (this.orderField() === order) {
      this.orderDirection.set(this.orderDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.orderField.set(order);
      this.orderDirection.set('asc');
    }
    this.numPage.set(0);
    this.getPage();
  }

  isDialogMode(): boolean {
    return !!this.dialogRef;
  }

  onSelect(comentarioart: IComentarioart): void {
    this.dialogRef?.close(comentarioart);
  }
}
