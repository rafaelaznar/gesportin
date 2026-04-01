import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ComentarioAdminPlist } from '../../../comentario/admin/plist/plist';
import { NoticiaService } from '../../../../service/noticia';

@Component({
  standalone: true,
  selector: 'app-comentario-teamadmin-plist',
  imports: [ComentarioAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class ComentarioTeamadminPlist implements OnInit {
  @Input() id_noticia?: number;

  private oNoticiaService = inject(NoticiaService);

  ngOnInit(): void {
    if (this.id_noticia && this.id_noticia > 0) {
      this.oNoticiaService.getById(this.id_noticia).subscribe({
        next: (noticia) => {
        },
        error: () => {},
      });
    }
  }
}
