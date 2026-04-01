import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ArticuloAdminPlist } from '../../../articulo/admin/plist/plist';
import { TipoarticuloService } from '../../../../service/tipoarticulo';

@Component({
  standalone: true,
  selector: 'app-articulo-teamadmin-plist',
  imports: [ArticuloAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class ArticuloTeamadminPlist implements OnInit {
  @Input() id_tipoarticulo?: number;

  private oTipoarticuloService = inject(TipoarticuloService);

  ngOnInit(): void {
    if (this.id_tipoarticulo && this.id_tipoarticulo > 0) {
      this.oTipoarticuloService.get(this.id_tipoarticulo).subscribe({
        next: (tipo) => {
        },
        error: () => {},
      });
    }
  }
}
