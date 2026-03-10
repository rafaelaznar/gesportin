import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioPlistAdminUnrouted } from '../plist-admin-unrouted/usuario-plist-admin-unrouted';

@Component({
  selector: 'app-usuario-plist',
  standalone: true,
  imports: [UsuarioPlistAdminUnrouted],
  templateUrl: './usuario-plist.html',
  styleUrl: './usuario-plist.css',
})
export class UsuarioPlist {

  private routeSub?: Subscription;
  
  idTipousuario = signal<number>(0);
  idRol = signal<number>(0);
  idClub = signal<number>(0);


  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
  
    this.routeSub = this.route.params.subscribe((params) => {
      this.idTipousuario.set(params['id_tipousuario'] ? Number(params['id_tipousuario']) : 0);
      this.idRol.set(params['id_rol'] ? Number(params['id_rol']) : 0);
      this.idClub.set(params['id_club'] ? Number(params['id_club']) : 0);
    });
  }
}
