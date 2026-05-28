import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private oHttp: HttpClient) {}

  recoverPassword(mailTo: string): Observable<void> {
    return this.oHttp.post<void>(`${serverURL}/email/recover-password`, { mailTo });
  }

  changePassword(tokenPassword: string, password: string, confirmPassword: string): Observable<void> {
    return this.oHttp.post<void>(`${serverURL}/email/change-password`, {
      tokenPassword,
      password,
      confirmPassword,
    });
  }
}
