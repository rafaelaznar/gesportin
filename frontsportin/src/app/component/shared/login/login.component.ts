import { Component, Inject, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../service/login';
import { LoginType } from '../../../model/login';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { debug as ENV_DEBUG } from '../../../environment/environment';
import { SessionService } from '../../../service/session';
import { IToken } from '../../../model/token';
import { NotificacionService } from '../../../service/notificacion';;

@Component({
  selector: 'app-login.component',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
})
export class LoginComponent implements OnInit {
  // obtener si el modo debug esta activo de environment (signal - zoneless)

  readonly debug: WritableSignal<boolean> = signal(ENV_DEBUG);
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);

  loginForm!: FormGroup;
  readonly error: WritableSignal<string | null> = signal(null);
  readonly submitting: WritableSignal<boolean> = signal(false);

  @Inject(SessionService)
  private oSessionService = inject(SessionService);
  private notificacion = inject(NotificacionService);

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1024)]],
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    this.loginService
      .sha256(this.loginForm.value.password)
      .then((hash) => {
        // debug es signal; .value si queremos usarlo en TS
        if (this.debug()) {
          console.log('SHA256:', hash);
        }

        const payload: Partial<LoginType> = {
          username: this.loginForm.value.username,
          password: hash,
        };

        this.loginService.create(payload).subscribe({
          next: (data: IToken) => {
            // guardar el token y notificar a quien esté suscrito
            this.oSessionService.setToken(data.token);
            // en caso de que se quiera disparar el evento manualmente también es posible,
            // setToken ya ejecuta subjectLogin.next(), pero no está de más recordar:
            // this.oSessionService.subjectLogin.next();

            // detener spinner antes de navegar (zoneless via signals)
            this.submitting.set(false);
            if (this.debug()) {
              console.log('Login successful, token: ', data);
            }
            this.notificacion.success('Login successful');
            if (this.oSessionService.isUser()) {
              this.router.navigate(['/mi']);
            } else if (this.oSessionService.isClubAdmin()) {
              this.router.navigate(['/club/teamadmin']);
            } else {
              this.router.navigate(['/admin']);
            }
          },
          error: (err: HttpErrorResponse) => {
            this.submitting.set(false);
            if (err.status === 0) {
              // El interceptor ya muestra la notificación global; solo actualizamos el inline.
              this.error.set('Backend not alive');
            } else if (err.status === 503) {
              // El interceptor ya muestra la notificación global; solo actualizamos el inline.
              this.error.set("Backend can't access to database");
            } else if (err.status === 403) {
              this.error.set('Auth error');
              this.notificacion.error('Usuario o contraseña incorrectos.', 'Auth error');
            } else {
              this.error.set(err.error?.message || err.statusText || 'Login failed');
              this.notificacion.error(err.error?.message || err.statusText || 'Login failed');
            }
          },
        });
      })
      .catch((err) => {
        // si el hash falla, asegurarse de detener el spinner
        this.submitting.set(false);
        this.error.set('Error preparando credenciales');
        if (this.debug()) {
          console.error('Hashing failed:', err);
        }
        this.notificacion.error('Error preparando credenciales');
      });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  fillAdmin(): void {
    this.loginForm.setValue({
      username: 'admin',
      password: 'ausias',
    });
  }

  fillUser(): void {
    this.loginForm.setValue({
      username: 'usuario',
      password: 'ausias',
    });
  }

  fillAdminClub(): void {
    this.loginForm.setValue({
      username: 'clubadmin',
      password: 'ausias',
    });
  }
}
