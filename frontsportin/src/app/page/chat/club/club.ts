import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IClub } from '../../../model/club';
import { ClubService } from '../../../service/club';
import { SessionService } from '../../../service/session';
import { ChatRoomComponent } from '../../../component/chat/chat-room/chat-room';

@Component({
  selector: 'app-chat-club-page',
  standalone: true,
  imports: [FormsModule, ChatRoomComponent],
  templateUrl: './club.html',
  styleUrl: './club.css',
})
export class ChatClubPage implements OnInit {
  private session = inject(SessionService);
  private clubService = inject(ClubService);

  idClub = signal<number | null>(null);
  clubs = signal<IClub[]>([]);
  cargando = signal(true);

  get isAdmin(): boolean {
    return this.session.isAdmin();
  }

  ngOnInit(): void {
    if (this.session.isAdmin()) {
      this.clubService.getPage(0, 1000, 'nombre', 'asc').subscribe({
        next: (page) => {
          this.clubs.set(page.content);
          if (page.content.length > 0) {
            this.idClub.set(page.content[0].id);
          }
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false),
      });
    } else {
      this.idClub.set(this.session.getClubId());
      this.cargando.set(false);
    }
  }

  seleccionarClub(event: Event): void {
    this.idClub.set(Number((event.target as HTMLSelectElement).value));
  }
}
