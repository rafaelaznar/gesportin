import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Client } from '@stomp/stompjs';
import { serverURL } from '../environment/environment';
import { IMensajeChat } from '../model/mensaje-chat';
import { IPage } from '../model/plist';
import { SessionService } from './session';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private session = inject(SessionService);

  private client: Client | null = null;

  connect(idClub: number): Observable<IMensajeChat> {
    this.disconnect();

    const token = this.session.getToken() ?? '';
    const wsUrl = serverURL.replace(/^http/, 'ws') + '/ws?token=' + token;
    const mensajes$ = new Subject<IMensajeChat>();

    this.client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      onConnect: () => {
        this.client!.subscribe(`/topic/chat/club/${idClub}`, (message) => {
          try {
            mensajes$.next(JSON.parse(message.body));
          } catch (_) {}
        });
      },
    });

    this.client.activate();
    return mensajes$.asObservable();
  }

  enviar(idClub: number, contenido: string): void {
    if (this.client?.connected) {
      this.client.publish({
        destination: `/app/chat/club/${idClub}`,
        body: JSON.stringify({ contenido }),
      });
    }
  }

  historial(idClub: number, page = 0, size = 50): Observable<IPage<IMensajeChat>> {
    return this.http.get<IPage<IMensajeChat>>(
      `${serverURL}/chat/club/${idClub}/mensajes?page=${page}&size=${size}&sort=fechaEnvio,desc`,
    );
  }

  disconnect(): void {
    this.client?.deactivate();
    this.client = null;
  }
}
