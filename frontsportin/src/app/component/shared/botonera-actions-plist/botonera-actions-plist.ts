import { I } from '@angular/cdk/keycodes';
import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionService } from '../../../service/session';
import { SecurityService } from '../../../service/security.service';

@Component({
  selector: 'app-botonera-actions-plist',
  imports: [RouterLink],
  templateUrl: './botonera-actions-plist.html',
  styleUrl: './botonera-actions-plist.css',
})
export class BotoneraActionsPlist {

  @Input() id: number = 0;
  @Input() strEntity: string = '';

  private session: SessionService = inject(SessionService);
  private security = inject(SecurityService);

  // Entities that club-admins may not edit/delete
  private clubForbidden = new Set([
    'club',
    'carrito',
    'comentario',
    'comentarioart',
    'puntuacion',
    'factura',
    'compra',
    'usuario',
  ]);

  get canEdit(): boolean {
    if (this.session.isClubAdmin() && this.clubForbidden.has(this.strEntity)) {
      return false;
    }
    return true;
  }

  get canDelete(): boolean {
    if (this.session.isClubAdmin() && this.clubForbidden.has(this.strEntity)) {
      return false;
    }
    return true;
  }

}
