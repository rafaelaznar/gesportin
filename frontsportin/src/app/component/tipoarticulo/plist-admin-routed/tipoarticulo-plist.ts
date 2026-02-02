import { Component, signal, computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { IPage } from '../../../model/plist';
import { ITipoarticulo } from '../../../model/tipoarticulo';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { TipoarticuloService } from '../../../service/tipoarticulo';
import { TrimPipe } from '../../../pipe/trim-pipe';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Subscription } from 'rxjs/internal/Subscription';
import { debounceTimeSearch } from '../../../environment/environment';

@Component({
  selector: 'app-tipoarticulo-plist',
  imports: [Paginacion, BotoneraRpp, TrimPipe, RouterLink],
  templateUrl: './tipoarticulo-plist.html',
  styleUrl: './tipoarticulo-plist.css',
})
export class TipoarticuloPlistAdminRouted {
  oPage = signal<IPage<ITipoarticulo> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);

  // For fill functionality
  rellenaCantidad = signal<number>(10);
  rellenando = signal<boolean>(false);
  rellenaOk = signal<string>('');
  rellenaError = signal<string>('');
  totalElementsCount = computed(() => this.oPage()?.totalElements ?? 0);

  // Mensajes y total
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);

  // Variables de ordenamiento
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  // variables de filtro
  club = signal<number>(0);

  // variables de búsqueda
  private searchSubject = new Subject<string>();
  descripcion = signal<string>('');
  private searchSubscription?: Subscription;

  constructor(
    private oTipoarticuloService: TipoarticuloService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('club');
    if (id) {
      this.club.set(+id);
    }

    // Configurar el debounce para la búsqueda
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
    // Cancelar la suscripción al destruir el componente
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  getPage() {
    this.oTipoarticuloService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.descripcion(),
        this.club(),
      )
      .subscribe({
        next: (data: IPage<ITipoarticulo>) => {
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

  onRppChange(rpp: number): void {
    this.numRpp.set(rpp);
    this.numPage.set(0);
    this.getPage();
  }

  goToPage(page: number): void {
    this.numPage.set(page);
    this.getPage();
  }

  onSearchDescription(value: string) {
    // Emitir el valor al Subject para que sea procesado con debounce
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
}
