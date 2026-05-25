import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';
import { IPaymentConfirm, IPaymentSession } from '../model/payment-session';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly url = `${serverURL}/payment`;

  iniciarCuota(jugadorId: number, cuotaId: number): Observable<IPaymentSession> {
    return this.http.post<IPaymentSession>(`${this.url}/iniciar/cuota/${jugadorId}/${cuotaId}`, {});
  }

  iniciarTienda(): Observable<IPaymentSession> {
    return this.http.post<IPaymentSession>(`${this.url}/iniciar/tienda`, {});
  }

  getSesion(sessionToken: string): Observable<IPaymentSession> {
    return this.http.post<IPaymentSession>(`${this.url}/sesion`, { sessionToken });
  }

  confirmar(sessionToken: string, datos: IPaymentConfirm): Observable<IPaymentSession> {
    return this.http.post<IPaymentSession>(`${this.url}/confirmar`, { sessionToken, ...datos });
  }

  cancelar(sessionToken: string): Observable<IPaymentSession> {
    return this.http.post<IPaymentSession>(`${this.url}/cancelar`, { sessionToken });
  }
}
