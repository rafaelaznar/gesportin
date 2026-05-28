import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IMensajeChat } from '../../../model/mensaje-chat';
import { ChatService } from '../../../service/chat.service';
import { SessionService } from '../../../service/session';
import { ChatMessageComponent } from '../chat-message/chat-message';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [FormsModule, ChatMessageComponent],
  templateUrl: './chat-room.html',
  styleUrl: './chat-room.css',
})
export class ChatRoomComponent implements OnChanges, OnDestroy {
  @Input() idClub!: number;
  @ViewChild('messageList') messageList!: ElementRef<HTMLDivElement>;

  private chatService = inject(ChatService);
  private session = inject(SessionService);

  mensajes = signal<IMensajeChat[]>([]);
  textoNuevo = '';
  cargando = signal(true);

  private subscription: Subscription | null = null;

  get idUsuarioActual(): number {
    return this.session.getUserId() ?? 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idClub'] && this.idClub != null) {
      this.reiniciar();
    }
  }

  ngOnDestroy(): void {
    this.teardown();
  }

  private teardown(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;
    this.chatService.disconnect();
  }

  private reiniciar(): void {
    this.teardown();
    this.mensajes.set([]);
    this.cargando.set(true);
    this.cargarHistorial();
    this.subscription = this.chatService.connect(this.idClub).subscribe((msg) => {
      this.mensajes.update((msgs) => [...msgs, msg]);
      this.scrollAlFondo();
    });
  }

  private cargarHistorial(): void {
    this.chatService.historial(this.idClub, 0, 50).subscribe({
      next: (page) => {
        this.mensajes.set([...page.content].reverse());
        this.cargando.set(false);
        this.scrollAlFondo();
      },
      error: () => this.cargando.set(false),
    });
  }

  enviar(): void {
    const texto = this.textoNuevo.trim();
    if (!texto) return;
    this.textoNuevo = '';
    this.chatService.enviar(this.idClub, texto);
  }

  private scrollAlFondo(): void {
    setTimeout(() => {
      const el = this.messageList?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
