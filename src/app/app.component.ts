import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  private authService = inject( AuthService );
  private router = inject( Router );

  public finishedAuthCheck = computed<boolean>( () => {
    // Se realiza aqui, ya que es el punto de entrada de la app y con checking no se sabe aun si tiene o no token
    console.log(this.authService.authStatus() )
    if ( this.authService.authStatus() === AuthStatus.checking ) {
      return false;
    }

    return true;
  });


  public authStatusChangedEffect = effect(() => {
    console.log(this.authService.authStatus() )

    // switch( this.authService.authStatus() ) {

    //   case AuthStatus.checking: return;

    //   case AuthStatus.authenticated:
    //     this.router.navigateByUrl('/dashboard');
    //     return;

    //   case AuthStatus.notAuthenticated:
    //     this.router.navigateByUrl('/auth/login');
    //     return;
    // }
  });

}
