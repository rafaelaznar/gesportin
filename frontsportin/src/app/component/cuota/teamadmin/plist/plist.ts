import { Component, computed, inject, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { MODAL_REF } from '../../../shared/modal/modal.tokens';
import { debounceTimeSearch } from '../../../../environment/environment';
import { ICuota } from '../../../../model/cuota';
import { IPago } from '../../../../model/pago';
import { IPage } from '../../../../model/plist';
import { CuotaService } from '../../../../service/cuota';
import { PagoService } from '../../../../service/pago';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../../shared/botonera-rpp/botonera-rpp';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';

@Component({
  standalone: true,
  selector: 'app-cuota-teamadmin-plist',
  imports: [RouterLink, Paginacion, BotoneraRpp, BotoneraActionsPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CuotaTeamadminPlist implements OnInit, OnDestroy {
  @Input() id_equipo?: number;

  oPage = signal<IPage<ICuota> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(6);
  descripcion = signal<string>('');
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  pagosByCuota = signal<Map<number, IPago[]>>(new Map());

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  private cuotaService = inject(CuotaService);
  private pagoService = inject(PagoService);
  private modalRef = inject(MODAL_REF, { optional: true });

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((term) => {
        this.descripcion.set(term);
        this.numPage.set(0);
        this.getPage();
      });
    this.getPage();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  getPage(): void {
    this.cuotaService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.descripcion(),
        this.id_equipo ?? 0,
      )
      .subscribe({
        next: (data: IPage<ICuota>) => {
          this.oPage.set(data);
          this.pagosByCuota.set(new Map());
          data.content.forEach((cuota) => {
            this.pagoService.getPage(0, 100, 'id', 'asc', cuota.id, 0).subscribe({
              next: (pagosPage: IPage<IPago>) => {
                this.pagosByCuota.update((map) => {
                  const newMap = new Map(map);
                  newMap.set(cuota.id, pagosPage.content);
                  return newMap;
                });
              },
              error: (err: HttpErrorResponse) => console.error(err),
            });
          });
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
        },
        error: (err: HttpErrorResponse) => console.error(err),
      });
  }

  getPagosForCuota(cuotaId: number): IPago[] {
    return this.pagosByCuota().get(cuotaId) ?? [];
  }

  onRppChange(n: number): void { this.numRpp.set(n); this.numPage.set(0); this.getPage(); }
  goToPage(n: number): void { this.numPage.set(n); this.getPage(); }
  onSearch(value: string): void { this.searchSubject.next(value); }

  isDialogMode(): boolean { return !!this.modalRef; }
  onSelect(cuota: ICuota): void { this.modalRef?.close(cuota); }
}

