import { Component, computed, inject, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { SecurityService } from '../../../../service/security.service';
import { debounceTimeSearch } from '../../../../environment/environment';
import { ICategoria } from '../../../../model/categoria';
import { IPage } from '../../../../model/plist';
import { CategoriaService } from '../../../../service/categoria';
import { BotoneraRpp } from '../../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';

@Component({
  selector: 'app-categoria-teamadmin-plist',
  imports: [BotoneraRpp, Paginacion, RouterLink, BotoneraActionsPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
  standalone: true,
})
export class CategoriaTeamadminPlist {
  @Input() temporada = signal<number>(0);

  oPage = signal<IPage<ICategoria> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);

  totalRecords = computed(() => {
    const page = this.oPage();
    if (!page) return 0;
    if (this.nombre().length > 0 || this.temporada() > 0) return page.content.length;
    return page.totalElements ?? 0;
  });

  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  nombre = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  private oCategoriaService = inject(CategoriaService);
  private dialogRef = inject(MatDialogRef<CategoriaTeamadminPlist>, { optional: true });
  private security = inject(SecurityService);

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.nombre.set(searchTerm);
        this.numPage.set(0);
        this.getPage();
      });

    this.getPage();
  }

  getPage(): void {
    this.oCategoriaService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.nombre(),
        this.temporada(),
      )
      .subscribe({
        next: (data: IPage<ICategoria>) => {
          let filtered = data.content;
          if (this.security.isClubAdmin()) {
            const clubId = this.security.getClubId();
            if (clubId != null) {
              filtered = filtered.filter((cat) => cat.temporada?.club?.id === clubId);
            }
          }
          this.oPage.set({ ...data, content: filtered });
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
  }

  onRppChange(rpp: number): void {
    this.numRpp.set(rpp);
    this.numPage.set(0);
    this.getPage();
  }

  goToPage(page: number): void {
    this.numPage.set(page);
    this.getPage();
  }

  onSearchName(value: string): void {
    this.searchSubject.next(value);
  }

  clearSearchFilter(): void {
    this.nombre.set('');
    this.numPage.set(0);
    this.getPage();
  }

  onOrder(order: string): void {
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

  onSelect(categoria: ICategoria): void {
    this.dialogRef?.close(categoria);
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
