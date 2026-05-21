import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUserRoleSubject = new BehaviorSubject<string | null>(this.getStoredRole());
  currentUserRole$ = this.currentUserRoleSubject.asObservable();
  
  private currentPermisosSubject = new BehaviorSubject<string[]>(this.getStoredPermisos());
  currentPermisos$ = this.currentPermisosSubject.asObservable();

  login(correo: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', correo); // OAuth2 espera 'username', no 'Correo'
    formData.append('password', password);

    return this.http.post<any>(`${this.apiUrl}/login`, formData).pipe(
      tap({
        next: (response) => {
          if (response.access_token) {
            localStorage.setItem('access_token', response.access_token);
            if (response.role) {
              localStorage.setItem('role', response.role);
              this.currentUserRoleSubject.next(response.role);
            }
            if (response.permisos) {
              localStorage.setItem('permisos', JSON.stringify(response.permisos));
              this.currentPermisosSubject.next(response.permisos);
            }
          }
        }
      })
    );
  }

  registerTaller(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar-taller`, data);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    localStorage.removeItem('permisos');
    this.currentUserRoleSubject.next(null);
    this.currentPermisosSubject.next([]);
    this.router.navigate(['/login']);
  }

  getRole(): string | null {
    return this.currentUserRoleSubject.value;
  }

  private getStoredRole(): string | null {
    return localStorage.getItem('role');
  }

  private getStoredPermisos(): string[] {
    const raw = localStorage.getItem('permisos');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  hasPermiso(permiso: string): boolean {
    // El Administrador tiene acceso total a todas las funcionalidades
    if (this.getRole() === 'Administrador') {
      return true;
    }
    const permisos = this.currentPermisosSubject.value;
    return permisos.includes(permiso);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
