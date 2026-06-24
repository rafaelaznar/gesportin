import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SessionService } from '../../../service/session';
import { CarritoService } from '../../../service/carrito';
import { FacturaService } from '../../../service/factura-service';
import { JugadorService } from '../../../service/jugador-service';
import { ClubService } from '../../../service/club';
import { ImageUploadService } from '../../../service/image-upload';
import { IClub } from '../../../model/club';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboardComponent implements OnInit {
  userName = signal('');
  carritoCount = signal(0);
  facturasCount = signal(0);
  equiposCount = signal(0);
  loading = signal(true);
  clubLogo = signal<string | null>(null);

  constructor(
    private session: SessionService,
    private carritoService: CarritoService,
    private facturaService: FacturaService,
    private jugadorService: JugadorService,
    private clubService: ClubService,
    public imageUpload: ImageUploadService,
  ) {}

  ngOnInit(): void {
    const token = this.session.getToken();
    if (token) {
      const jwt = this.session.parseJWT(token);
      this.userName.set(jwt.username || '');
    }
    const userId = this.session.getUserId();
    if (userId) {
      this.carritoService
        .getPage(0, 1000, 'id', 'asc', '', 0, userId)
        .subscribe({ next: (p) => this.carritoCount.set(p.totalElements) });
      this.facturaService
        .getPage(0, 1000, 'id', 'desc', userId)
        .subscribe({ next: (p) => this.facturasCount.set(p.totalElements) });
      this.jugadorService
        .getPage(0, 1000, 'id', 'asc', '', userId, 0)
        .subscribe({ next: (p) => this.equiposCount.set(p.totalElements) });
    }
    const clubId = this.session.getClubId();
    if (clubId) {
      this.clubService.get(clubId).subscribe({
        next: (club: IClub) => {
          const src = this.imageUpload.toPreviewSrc(club.imagen);
          this.clubLogo.set(src);
        },
      });
    }
    this.loading.set(false);
  }
}
