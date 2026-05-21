import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminProfile {
  Usuario: string | null;
}

export interface TallerProfile {
  Id: number;
  Nombre: string;
  Direccion: string;
  Coordenadas: string | null;
  Cap: number | null;
  Capmax: number | null;
  balance: number | null;
}

export interface ConductorProfile {
  CI: string;
  Nombre: string;
  Apellidos: string;
  Fechanac: string | null;
}

export interface MecanicoProfile {
  id: number;
  ci: number;
  nombre: string;
  apellidos: string;
  estado: string;
}

export interface ProfileData {
  Id: number;
  Correo: string;
  rol_nombre: string | null;
  administrador: AdminProfile | null;
  taller: TallerProfile | null;
  conductor: ConductorProfile | null;
  mecanico: MecanicoProfile | null;
}

export interface ProfileUpdatePayload {
  Correo?: string;
  Password?: string;
  admin_usuario?: string;
  taller_nombre?: string;
  taller_direccion?: string;
  taller_coordenadas?: string;
  taller_cap?: number;
  taller_capmax?: number;
  conductor_ci?: string;
  conductor_nombre?: string;
  conductor_apellidos?: string;
  conductor_fechanac?: string;
  mecanico_estado?: string;
}

export interface UbicacionPayload {
  Coordenadas: string;
  Direccion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;
  private http = inject(HttpClient);

  getProfile(): Observable<ProfileData> {
    return this.http.get<ProfileData>(`${this.apiUrl}/me`);
  }

  updateProfile(data: ProfileUpdatePayload): Observable<ProfileData> {
    return this.http.put<ProfileData>(`${this.apiUrl}/me`, data);
  }

  updateUbicacion(data: UbicacionPayload): Observable<ProfileData> {
    return this.http.put<ProfileData>(`${this.apiUrl}/me/ubicacion`, data);
  }
}
