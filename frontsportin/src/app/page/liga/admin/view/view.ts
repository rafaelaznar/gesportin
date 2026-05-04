import { Component, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LigaAdminDetail } from '../../../../component/liga/admin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { LigaService } from '../../../../service/liga';

@Component({
  selector: 'app-liga-admin-view-page',
  imports: [LigaAdminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]="breadcrumbItems()"></app-breadcrumb><app-liga-admin-detail [id]="id_liga"></app-liga-admin-detail>',
})
export class LigaAdminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Ligas', route: '/liga' },
    { label: 'Liga' },
  ]);

  private route = inject(ActivatedRoute);
  private ligaService = inject(LigaService);
  id_liga = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_liga.set(n);
    if (!isNaN(n)) {
      this.ligaService.get(n).subscribe({
        next: (liga) => {
          const equipo = liga.equipo;
          const cat = equipo?.categoria;
          const temp = cat?.temporada;
          const items: BreadcrumbItem[] = [{ label: 'Ligas', route: '/liga' }];
          if (temp?.club) {
            items.push({ label: temp.club.nombre, route: `/club/view/${temp.club.id}` });
          }
          if (temp) {
            items.push({ label: 'Temporadas', route: `/temporada/view/${temp.id}` });
          }
          if (cat) {
            items.push({ label: cat.nombre!, route: `/categoria/view/${cat.id}` });
          }
          if (equipo) {
            items.push({ label: equipo.nombre!, route: `/equipo/view/${equipo.id}` });
          }
          items.push({ label: liga.nombre! });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
