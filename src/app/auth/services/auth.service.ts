import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../enviroments/enviroments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // readonly garantiza que la variable no sera cambiada
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  // La señal debe ser pivada
  private _currentUser = signal<User | null>(null);
  // Si usuario esta autenticado o no
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );

  // !Al mundo exterior

  // computed: Señal de solo lectura
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
  //  this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token:string): boolean {

    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authenticated );
    localStorage.setItem('token', token);

    return true;
  }


  login(email: string, password: string): Observable<boolean> {

    const url = `${this.baseUrl}/auth/login`;
    console.log(url)
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        map(({ user, token }) => this.setAuthentication(user, token)),
        catchError(err => throwError(() => err.error.message))
      );
  }

  checkAuthStatus():Observable<boolean> {

    const url   = `${ this.baseUrl }/auth/check-token`;
    const token = localStorage.getItem('token');

    console.log(url)
    console.log(token)

    // Si no hay token
    if (!token) {
      this.logout();
      return of(false);
    }
    // Si token es correcto
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);

      return this.http.get<CheckTokenResponse>(url, { headers })
        .pipe(
          // Desestructura user, token de la resp
          // se manda a llamar setAuthentication que realiza la actualizacion de las variables y realiza el almacenamiento en el localS..
          map( ({ user, token }) => this.setAuthentication( user, token )),
          catchError(() => {
            this._authStatus.set( AuthStatus.notAuthenticated );
            return of(false);
          })
        );
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated );
    console.log(this._authStatus)

  }
}

