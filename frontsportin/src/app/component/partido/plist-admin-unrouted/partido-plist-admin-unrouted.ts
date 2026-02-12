import { Component, computed, inject, Input, signal } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { IPartido } from '../../../model/partido';
import { IPage } from '../../../model/plist';
import { PartidoService } from '../../../service/partido';
import { RouterLink } from '@angular/router';
import { debounceTimeSearch } from '../../../environment/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { TrimPipe } from '../../../pipe/trim-pipe';
import { MatDialogRef } from '@angular/material/dialog';
import { BotoneraActionsPlist } from '../../shared/botonera-actions-plist/botonera-actions-plist';

@Component({
  selector: 'app-partido-plist-admin-unrouted',
  standalone: true,
  imports: [RouterLink, BotoneraRpp, Paginacion, TrimPipe, BotoneraActionsPlist],
  templateUrl: './partido-plist-admin-unrouted.html',
  styleUrl: './partido-plist-admin-unrouted.css',
})
export class PartidoPlistAdminUnrouted {
  @Input() liga = signal<number>(0);

  oPage = signal<IPage<IPartido> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10);
  strResult = signal<string>('');
  descripcion = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  oPartidoService = inject(PartidoService);
  private dialogRef = inject(MatDialogRef<PartidoPlistAdminUnrouted>, { optional: true });

  ngOnInit() {
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
    let campoParaElServidor = this.orderField();

    if (this.orderField() === 'id_liga') {
      campoParaElServidor = 'liga.id';
    }

    this.oPartidoService
      .getPage(
        this.numPage(),
        this.numRpp(),
        campoParaElServidor,
        this.orderDirection(),
        this.descripcion(),
        this.liga() == null ? 0 : this.liga()!,
      )
      .subscribe({
        next: (data: IPage<IPartido>) => {
          this.oPage.set(data);

          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.strResult.set('Error al cargar: ' + error.message);
          console.error(error);
        },
      });
  }

  goToPage(nPage: number) {
    this.numPage.set(nPage);
    this.getPage();
  }

  onRppChange(nRpp: number) {
    this.numRpp.set(nRpp);
    this.numPage.set(0);
    this.getPage();
  }

  onFilterChange(filter: string) {
    this.descripcion.set(filter);
    this.numPage.set(0);
    this.getPage();
  }

  onSearchDescription(value: string) {
    this.searchSubject.next(value);
  }

  onOrder(field: string) {
    this.orderField.set(field);
    this.orderDirection.update((current) => (current === 'asc' ? 'desc' : 'asc'));
    this.getPage();
  }

  
    isDialogMode(): boolean {
      return !!this.dialogRef;
    }
  
    onSelect(tipoarticulo: IPartido): void {
      this.dialogRef?.close(tipoarticulo);
    }
  
}
