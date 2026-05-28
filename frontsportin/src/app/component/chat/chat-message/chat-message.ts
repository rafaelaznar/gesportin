import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IMensajeChat } from '../../../model/mensaje-chat';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './chat-message.html',
  styleUrl: './chat-message.css',
})
export class ChatMessageComponent {
  @Input() mensaje!: IMensajeChat;
  @Input() propio = false;
}
