import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IArticulo } from '../../../model/articulo';
import { IComentarioart } from '../../../model/comentarioart';
import { IUsuario } from '../../../model/usuario';
import { ArticuloService } from '../../../service/articulo';
import { ComentarioartService } from '../../../service/comentarioart';
import { UsuarioService } from '../../../service/usuarioService';
import { ArticuloPlistAdminUnrouted } from '../../articulo/plist-admin-unrouted/articulo-plist-admin-unrouted';
import { UsuarioPlistAdminUnrouted } from '../../usuario/plist-admin-unrouted/usuario-plist-admin-unrouted';

@Component({
  selector: 'app-comentarioart-edit-admin-routed',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './comentarioart-edit.html',
  styleUrl: './comentarioart-edit.css',
})
export class ComentarioartEditAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private oComentarioartService = inject(ComentarioartService);
  private oArticuloService = inject(ArticuloService);
  private oUsuarioService = inject(UsuarioService);
  private snackBar = inject(MatSnackBar);

  comentarioartForm!: FormGroup;
  id_comentarioart = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);
  articulos = signal<IArticulo[]>([]);
  usuarios = signal<IUsuario[]>([]);
  selectedArticulo = signal<IArticulo | null>(null);
  displayIdArticulo = signal<number | null>(null);
  selectedUsuario = signal<IUsuario | null>(null);
  displayIdUsuario = signal<number | null>(null);

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initForm();
    this.loadArticulos();
    this.loadUsuarios();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de comentario no valido');
      this.loading.set(false);
      return;
    }

    this.id_comentarioart.set(Number(idParam));

    if (isNaN(this.id_comentarioart())) {
      this.error.set('ID no valido');
      this.loading.set(false);
      return;
    }

    this.loadComentarioart();
  }

  private initForm(): void {
    this.comentarioartForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      contenido: ['', [Validators.required]],
      id_articulo: [null, Validators.required],
      id_usuario: [null, Validators.required],
    });

    this.comentarioartForm.get('id_articulo')?.valueChanges.subscribe((id) => {
      if (id) {
        this.syncArticulo(Number(id));
      } else {
        this.selectedArticulo.set(null);
        this.displayIdArticulo.set(null);
      }
    });

    this.comentarioartForm.get('id_usuario')?.valueChanges.subscribe((id) => {
      if (id) {
        this.syncUsuario(Number(id));
      } else {
        this.selectedUsuario.set(null);
        this.displayIdUsuario.set(null);
      }
    });
  }

  private loadComentarioart(): void {
    this.oComentarioartService.get(this.id_comentarioart()).subscribe({
      next: (comentarioart: IComentarioart) => {
        const idArticulo = comentarioart.articulo?.id ?? comentarioart.idArticulo ?? null;
        const idUsuario = comentarioart.usuario?.id ?? comentarioart.idUsuario ?? null;
        this.comentarioartForm.patchValue({
          id: comentarioart.id,
          contenido: comentarioart.contenido,
          id_articulo: idArticulo,
          id_usuario: idUsuario,
        });
        if (idArticulo) {
          this.syncArticulo(idArticulo);
        }
        if (idUsuario) {
          this.syncUsuario(idUsuario);
        }
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el comentario');
        this.snackBar.open('Error cargando el comentario', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  private loadArticulos(): void {
    this.oArticuloService.getPage(0, 1000, 'descripcion', 'asc').subscribe({
      next: (page) => {
        this.articulos.set(page.content);
        const idActual = this.comentarioartForm.get('id_articulo')?.value;
        if (idActual) {
          this.syncArticulo(Number(idActual));
        }
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error cargando articulos', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  private loadUsuarios(): void {
    this.oUsuarioService.getPage(0, 1000, 'nombre', 'asc').subscribe({
      next: (page) => {
        this.usuarios.set(page.content);
        const idActual = this.comentarioartForm.get('id_usuario')?.value;
        if (idActual) {
          this.syncUsuario(Number(idActual));
        }
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error cargando usuarios', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  get contenido() {
    return this.comentarioartForm.get('contenido');
  }

  get id_articulo() {
    return this.comentarioartForm.get('id_articulo');
  }

  get id_usuario() {
    return this.comentarioartForm.get('id_usuario');
  }

  private syncArticulo(idArticulo: number): void {
    this.displayIdArticulo.set(idArticulo);
    const articulo = this.articulos().find((item) => item.id === idArticulo) ?? null;
    this.selectedArticulo.set(articulo);
  }

  private syncUsuario(idUsuario: number): void {
    this.displayIdUsuario.set(idUsuario);
    const usuario = this.usuarios().find((item) => item.id === idUsuario) ?? null;
    this.selectedUsuario.set(usuario);
  }

  onSubmit(): void {
    if (this.comentarioartForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    this.submitting.set(true);

    const idArticulo = Number(this.comentarioartForm.value.id_articulo);
    const idUsuario = Number(this.comentarioartForm.value.id_usuario);

    const comentarioartData: any = {
      id: this.id_comentarioart(),
      contenido: this.comentarioartForm.value.contenido,
      idArticulo,
      idUsuario,
      articulo: { id: idArticulo },
      usuario: { id: idUsuario },
    };

    this.oComentarioartService.update(comentarioartData).subscribe({
      next: () => {
        this.snackBar.open('Comentario actualizado exitosamente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
        this.router.navigate(['/comentarioart']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error actualizando el comentario');
        this.snackBar.open('Error actualizando el comentario', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.submitting.set(false);
      },
    });
  }

  openArticuloFinderModal(): void {
    const dialogRef = this.dialog.open(ArticuloPlistAdminUnrouted, {
      height: '800px',
      width: '1100px',
      maxWidth: '95vw',
      panelClass: 'articulo-dialog',
      data: {
        title: 'Aqui elegir articulo',
        message: 'Plist finder para encontrar el articulo y asignarlo al comentario',
      },
    });

    dialogRef.afterClosed().subscribe((articulo: IArticulo | null) => {
      if (articulo) {
        this.comentarioartForm.patchValue({
          id_articulo: articulo.id,
        });
        this.syncArticulo(articulo.id);
        this.snackBar.open(`Articulo seleccionado: ${articulo.descripcion}`, 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }

  openUsuarioFinderModal(): void {
    const dialogRef = this.dialog.open(UsuarioPlistAdminUnrouted, {
      height: '800px',
      width: '1100px',
      maxWidth: '95vw',
      panelClass: 'usuario-dialog',
      data: {
        title: 'Aqui elegir usuario',
        message: 'Plist finder para encontrar el usuario y asignarlo al comentario',
      },
    });

    dialogRef.afterClosed().subscribe((usuario: IUsuario | null) => {
      if (usuario) {
        this.comentarioartForm.patchValue({
          id_usuario: usuario.id,
        });
        this.syncUsuario(usuario.id);
        this.snackBar.open(
          `Usuario seleccionado: ${usuario.nombre} ${usuario.apellido1 ?? ''} ${
            usuario.apellido2 ?? ''
          }`,
          'Cerrar',
          {
            duration: 3000,
          },
        );
      }
    });
  }
}
