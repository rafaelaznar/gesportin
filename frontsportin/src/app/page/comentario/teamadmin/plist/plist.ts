import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComentarioTeamadminPlist } from '../../../../component/comentario/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-comentario-teamadmin-plist-page',
  imports: [ComentarioTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class ComentarioTeamadminPlistPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Comentarios' }]);

  id_noticia = signal<number | undefined>(undefined);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_noticia');
    if (idParam) {
      this.id_noticia.set(Number(idParam));
    }
  }
}
