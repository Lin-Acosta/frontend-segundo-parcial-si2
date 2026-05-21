import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;
  isLoading = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.error = null;

    const { correo, password } = this.loginForm.value;

    this.authService.login(correo, password).subscribe({
      next: () => {
        const role = this.authService.getRole();
        if (role === 'Administrador' || role === 'Taller' || role === 'Mecanico') {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = "Acceso denegado. Los conductores deben ingresar mediante la aplicación móvil.";
          this.authService.logout();
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.error = "Correo electrónico o contraseña incorrectos.";
        } else {
          this.error = "No se pudo conectar al servidor. Inténtalo más tarde.";
        }
      }
    });
  }
}
