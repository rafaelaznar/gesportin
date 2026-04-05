import { Component, computed, inject, Input, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { debounceTimeSearch } from '../../../../environment/environment';
import { IFactura } from '../../../../model/factura';
import { IPage } from '../../../../model/plist';
import { FacturaService } from '../../../../service/factura-service';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';

@Component({
  standalone: true,
  selector: 'app-factura-teamadmin-plist',
  imports: [RouterLink, Paginacion, BotoneraActionsPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class FacturaTeamadminPlist implements OnInit, OnDestroy {
  @Input() id_usuario?: number;

  readonly strRole = 'teamadmin';
  oPage = signal<IPage<IFactura> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10);
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  fecha = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  private facturaService = inject(FacturaService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    if (!this.id_usuario) {
      const idParam = this.route.snapshot.paramMap.get('id_usuario');
      if (idParam) {
        this.id_usuario = Number(idParam);
      }
    }

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((term) => {
        this.fecha.set(term);
        this.numPage.set(0);
        this.getPage();
      });

    this.getPage();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  getPage(): void {
    this.facturaService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.id_usuario ?? 0
      )
      .subscribe({
        next: (data) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
        },
        error: (err) => console.error(err),
      });
  }

  onOrder(field: string): void {
    if (this.orderField() === field) {
      this.orderDirection.set(this.orderDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.orderField.set(field);
      this.orderDirection.set('asc');
    }
    this.numPage.set(0);
    this.getPage();
  }

  goToPage(n: number): void {
    this.numPage.set(n);
    this.getPage();
  }

  onSearch(v: string): void {
    this.searchSubject.next(v);
  }
}
