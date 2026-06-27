import { Component, computed, inject, Input, signal } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { IPage } from '../../../../model/plist';
import { ITemporada } from '../../../../model/temporada';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { debounceTimeSearch } from '../../../../environment/environment';
import { TemporadaService } from '../../../../service/temporada';
import { HttpErrorResponse } from '@angular/common/http';
import { BotoneraRpp } from '../../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TrimPipe } from '../../../../pipe/trim-pipe';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';

@Component({
  selector: 'app-temporada-admin-plist',
  imports: [BotoneraRpp, Paginacion, RouterLink, TrimPipe, BotoneraActionsPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class TemporadaAdminPlist {
  @Input() id_club?: number;

  oPage = signal<IPage<ITemporada> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);

  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);

  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  club = signal<number>(0);

  private searchSubject = new Subject<string>();
  descripcion = signal<string>('');
  private searchSubscription?: Subscription;

  oTemporadaService = inject(TemporadaService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    if (this.id_club) {
      this.club.set(this.id_club);
    }

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.descripcion.set(searchTerm);
        this.numPage.set(0);
        this.getPage();
      });
    this.getPage();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  getPage(): void {
    this.oTemporadaService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.descripcion(),
        this.club(),
      )
      .subscribe({
        next: (data: IPage<ITemporada>) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
          this.cdr.detectChanges();
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
    this.cdr.detectChanges();
  }

  goToPage(page: number): void {
    this.numPage.set(page);
    this.getPage();
    this.cdr.detectChanges();
  }

  onSearchDescription(value: string): void {
    this.searchSubject.next(value);
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
}
