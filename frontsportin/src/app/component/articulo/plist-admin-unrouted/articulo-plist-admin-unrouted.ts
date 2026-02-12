import { Component, computed, inject, Input, signal } from '@angular/core';
import { IPage } from '../../../model/plist';
import { IArticulo } from '../../../model/articulo';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { debounceTimeSearch } from '../../../environment/environment';
import { ArticuloService } from '../../../service/articulo';
import { HttpErrorResponse } from '@angular/common/http';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { RouterLink } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim-pipe';
import { MatDialogRef } from '@angular/material/dialog';
import { BotoneraActionsPlist } from '../../shared/botonera-actions-plist/botonera-actions-plist';

@Component({
  selector: 'app-articulo-plist-admin-unrouted',
  imports: [BotoneraRpp, Paginacion, RouterLink, TrimPipe, BotoneraActionsPlist],
  templateUrl: './articulo-plist-admin-unrouted.html',
  styleUrl: './articulo-plist-admin-unrouted.css',
  standalone: true,
})
export class ArticuloPlistAdminUnrouted {
  @Input() tipoarticulo = signal<number>(0);

  oPage = signal<IPage<IArticulo> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);
  rellenaCantidad = signal<number>(10);
  rellenando = signal<boolean>(false);
  rellenaOk = signal<number | null>(null);
  rellenaError = signal<string | null>(null);
  publishingId = signal<number | null>(null);
  publishingAction = signal<'publicar' | 'despublicar' | null>(null);

  // Mensajes y total
  message = signal<string | null>(null);
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  private messageTimeout: any = null;

  // Variables de ordenamiento
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  // Variables de búsqueda
  descripcion = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  private oArticuloService = inject(ArticuloService);
  private dialogRef = inject(MatDialogRef<ArticuloPlistAdminUnrouted>, { optional: true });

  ngOnInit() {
    // Configurar el debounce para la búsqueda
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
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  getPage() {
    this.oArticuloService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.descripcion(),
        this.tipoarticulo(),
      )
      .subscribe({
        next: (data: IPage<IArticulo>) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
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

  goToPage(numPage: number) {
    this.numPage.set(numPage);
    this.getPage();
  }

  onRppChange(n: number) {
    this.numRpp.set(n);
    this.numPage.set(0);
    this.getPage();
  }

  onCantidadChange(value: string) {
    this.rellenaCantidad.set(+value);
  }

  onSearchDescription(value: string) {
    this.searchSubject.next(value);
  }

  isDialogMode(): boolean {
    return !!this.dialogRef;
  }

  onSelect(articulo: IArticulo): void {
    this.dialogRef?.close(articulo);
  }
}
