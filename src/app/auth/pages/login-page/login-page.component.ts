import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2'
import { AuthService } from '../../services/auth.service';



@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  private fb          = inject( FormBuilder )
  private authService = inject( AuthService )
  private router      = inject( Router )

  public myForm : FormGroup = this.fb.group({
    email: ['andrea@google.com', [ Validators.required, Validators.email ]],
    password: ['123456', [ Validators.required, Validators.minLength(6) ]]
  })

  login(){
    const { email, password } = this.myForm.value;

    this.authService.login(email, password)
    // Envia la solicitud http
      .subscribe({
        // Si todo sale bien
        next: () => this.router.navigateByUrl('/dashboard'),
        // Si no, error
        error: (message) => {
          Swal.fire('Error', message, 'error' )
          console.log({ loginError: message })
        }
      })
  }

}
