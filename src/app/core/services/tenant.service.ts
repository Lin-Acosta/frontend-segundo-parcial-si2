import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Tenant {
  Id: number;
  Nombre: string;
  SuscripcionActiva: number;
  Dominio?: string;
  LogoUrl?: string;
  CreatedAt?: string;
}

export interface PlanSaaS {
  Id: number;
  Nombre: string;
  PrecioMensual: number;
  MaxUsuarios: number;
  MaxIncidentes: number;
  Descripcion?: string;
  Activo: boolean;
}

export interface Suscripcion {
  Id: number;
  tenant_id: number;
  plan_id: number;
  FechaInicio?: string;
  FechaFin?: string;
  Estado: string;
  StripeSubscriptionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/saas`;

  // Tenants
  getTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(`${this.apiUrl}/tenants`);
  }

  createTenant(data: Partial<Tenant>): Observable<Tenant> {
    return this.http.post<Tenant>(`${this.apiUrl}/tenants`, data);
  }

  updateTenant(id: number, data: Partial<Tenant>): Observable<Tenant> {
    return this.http.put<Tenant>(`${this.apiUrl}/tenants/${id}`, data);
  }

  deleteTenant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tenants/${id}`);
  }

  // Planes
  getPlanes(): Observable<PlanSaaS[]> {
    return this.http.get<PlanSaaS[]>(`${this.apiUrl}/planes`);
  }

  createPlan(data: Partial<PlanSaaS>): Observable<PlanSaaS> {
    return this.http.post<PlanSaaS>(`${this.apiUrl}/planes`, data);
  }

  // Suscripciones
  getSuscripciones(): Observable<Suscripcion[]> {
    return this.http.get<Suscripcion[]>(`${this.apiUrl}/suscripciones`);
  }

  createSuscripcion(data: Partial<Suscripcion>): Observable<Suscripcion> {
    return this.http.post<Suscripcion>(`${this.apiUrl}/suscripciones`, data);
  }
}
