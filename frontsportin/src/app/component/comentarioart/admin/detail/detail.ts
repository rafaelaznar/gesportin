import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { ComentarioartService } from '../../../../service/comentarioart';
import { IComentarioart } from '../../../../model/comentarioart';
import { ImageUploadService } from '../../../../service/image-upload';

@Component({
  standalone: true,
  selector: 'app-comentarioart-admin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class ComentarioartAdminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private comentarioartService = inject(ComentarioartService);
  imageUpload: ImageUploadService = inject(ImageUploadService);

  oComentarioart = signal<IComentarioart | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idComentarioart = this.id();
    if (!idComentarioart || isNaN(idComentarioart)) {
      this.error.set('ID de comentario no válido');
      this.loading.set(false);
      return;
    }
    this.load(idComentarioart);
  }

  private load(id: number): void {
    this.comentarioartService.get(id).subscribe({
      next: (data) => {
        this.oComentarioart.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el comentario');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
