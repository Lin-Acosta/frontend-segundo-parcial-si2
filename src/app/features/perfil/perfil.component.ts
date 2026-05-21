import { Component, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProfileService, ProfileData } from '../../core/services/profile.service';
import { IncidenteService, ServicioTallerOut } from '../../core/services/incidente.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl border border-gray-100">
        <div class="px-6 py-8 sm:px-10 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center text-white text-2xl font-black">
              {{ avatarInitial }}
            </div>
            <div>
              <h1 class="text-3xl font-extrabold text-gray-900">Mi Perfil</h1>
              <p class="text-gray-500 mt-1">Gestiona tu información personal y configuración de cuenta.</p>
            </div>
          </div>
        </div>
      </div>

      @if (loading) {
        <div class="flex justify-center py-12">
          <div class="flex items-center gap-3 text-gray-500">
            <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-lg font-medium">Cargando perfil...</span>
          </div>
        </div>
      }

      @if (!loading && profile) {
        <!-- Alertas -->
        @if (successMessage) {
          <div class="bg-emerald-50 text-emerald-700 px-5 py-4 rounded-xl text-sm font-medium border border-emerald-200 flex items-center gap-3 shadow-sm animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            {{ successMessage }}
          </div>
        }
        @if (errorMessage) {
          <div class="bg-red-50 text-red-600 px-5 py-4 rounded-xl text-sm font-medium border border-red-200 flex items-center gap-3 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {{ errorMessage }}
          </div>
        }

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Datos de Cuenta -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-white flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">Datos de Cuenta</h2>
                <p class="text-xs text-gray-500">Correo electrónico y seguridad</p>
              </div>
            </div>
            <form [formGroup]="accountForm" class="p-6 space-y-5">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Rol</label>
                <div class="w-full bg-gray-100 border border-gray-200 text-gray-600 rounded-xl px-4 py-3 font-semibold flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full" [ngClass]="{
                    'bg-blue-500': profile.rol_nombre === 'Administrador',
                    'bg-orange-500': profile.rol_nombre === 'Taller',
                    'bg-green-500': profile.rol_nombre === 'Conductor'
                  }"></span>
                  {{ profile.rol_nombre || 'Sin rol' }}
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Correo electrónico</label>
                <input type="email" formControlName="Correo"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-medium placeholder-gray-400">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Nueva Contraseña</label>
                <input type="password" formControlName="Password"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-medium placeholder-gray-400"
                  placeholder="Dejar vacío si no desea cambiarla">
              </div>
            </form>
          </div>

          <!-- Datos del Perfil según Rol -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-50/50 to-white flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.214 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">Datos del Perfil</h2>
                <p class="text-xs text-gray-500">Información específica de tu rol</p>
              </div>
            </div>

            <!-- Admin Form -->
            @if (profile.rol_nombre === 'Administrador') {
              <form [formGroup]="adminForm" class="p-6 space-y-5">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Nombre de Usuario</label>
                  <input type="text" formControlName="Usuario"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium placeholder-gray-400"
                    placeholder="Nombre de administrador">
                </div>
              </form>
            }

            <!-- Taller Form -->
            @if (profile.rol_nombre === 'Taller') {
              <div class="px-6 pt-5">
                <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-blue-100 mb-1">Balance Actual</p>
                    <h3 class="text-3xl font-black"><span>$</span>{{ profile.taller?.balance || 0 }}</h3>
                    <p class="text-xs text-blue-100 mt-1">
                      @if ((profile.taller?.balance || 0) >= 0) {
                        Monto a favor (por comisiones y pagos por Stripe)
                      } @else {
                        Deuda pendiente a la plataforma (por pagos en efectivo)
                      }
                    </p>
                  </div>
                  <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <form [formGroup]="tallerForm" class="p-6 space-y-5">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Nombre del Taller</label>
                  <input type="text" formControlName="Nombre"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium placeholder-gray-400">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Dirección</label>
                  <input type="text" formControlName="Direccion"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium placeholder-gray-400">
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Capacidad Actual</label>
                    <input type="number" formControlName="Cap"
                      class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Capacidad Máxima</label>
                    <input type="number" formControlName="Capmax"
                      class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium">
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Coordenadas</label>
                  <input type="text" formControlName="Coordenadas" readonly
                    class="w-full bg-gray-100 border border-gray-200 text-gray-600 rounded-xl px-4 py-3 font-medium cursor-not-allowed"
                    placeholder="Selecciona en el mapa abajo">
                </div>

                <!-- ─── SERVICIOS DEL TALLER ─── -->
                <div class="border-t border-gray-100 pt-5 mt-5">
                  <div class="flex items-center justify-between mb-3">
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Servicios Ofrecidos</label>
                  </div>
                  
                  <div class="flex flex-wrap gap-2 mb-4">
                    @for (svc of misServicios; track svc.id) {
                      <div class="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200 flex items-center gap-2">
                        {{ svc.nombre }}
                        <button type="button" (click)="eliminarServicio(svc.id)" class="text-blue-400 hover:text-red-500 transition-colors focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    } @empty {
                      <p class="text-sm text-gray-400 italic">No tienes servicios configurados. Agrega uno para destacar tu taller.</p>
                    }
                  </div>

                  <div class="flex gap-2">
                    <select #selectServicio class="flex-1 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-medium">
                      <option value="">-- Seleccionar servicio --</option>
                      @for (opcion of catalogServiciosDisponibles; track opcion) {
                        <option [value]="opcion">{{ opcion }}</option>
                      }
                    </select>
                    <button type="button" (click)="agregarServicio(selectServicio.value); selectServicio.value=''"
                      [disabled]="!selectServicio.value"
                      class="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-bold hover:bg-blue-200 transition-colors disabled:opacity-50">
                      Agregar
                    </button>
                  </div>
                </div>

              </form>
            }

            <!-- Conductor Form -->
            @if (profile.rol_nombre === 'Conductor') {
              <form [formGroup]="conductorForm" class="p-6 space-y-5">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Cédula de identidad (CI)</label>
                  <input type="text" formControlName="CI"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium">
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Nombre</label>
                    <input type="text" formControlName="Nombre"
                      class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Apellidos</label>
                    <input type="text" formControlName="Apellidos"
                      class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium">
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Fecha de Nacimiento</label>
                  <input type="date" formControlName="Fechanac"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium">
                </div>
              </form>
            }

            <!-- Mecanico Form -->
            @if (profile.rol_nombre === 'Mecanico') {
              <form [formGroup]="mecanicoForm" class="p-6 space-y-5">
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">Disponibilidad</label>
                  <div class="flex items-center gap-3">
                    <button type="button" (click)="toggleEstadoMecanico('Disponible')" 
                            [class.ring-2]="mecanicoForm.value.Estado === 'Disponible'"
                            [class.ring-emerald-500]="mecanicoForm.value.Estado === 'Disponible'"
                            class="flex-1 py-2 px-4 rounded-lg font-bold text-sm bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all">
                      Disponible
                    </button>
                    <button type="button" (click)="toggleEstadoMecanico('Ocupado')"
                            [class.ring-2]="mecanicoForm.value.Estado === 'Ocupado'"
                            [class.ring-rose-500]="mecanicoForm.value.Estado === 'Ocupado'"
                            class="flex-1 py-2 px-4 rounded-lg font-bold text-sm bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 transition-all">
                      Ocupado
                    </button>
                  </div>
                  <p class="text-[10px] text-gray-500 mt-2">Ponte como Ocupado para no recibir nuevas asignaciones temporales.</p>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Nombre</label>
                    <input type="text" formControlName="Nombre" readonly
                      class="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 cursor-not-allowed">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Apellidos</label>
                    <input type="text" formControlName="Apellidos" readonly
                      class="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 cursor-not-allowed">
                  </div>
                </div>
              </form>
            }

            @if (!profile.administrador && !profile.taller && !profile.conductor) {
              <div class="p-6 text-center text-gray-400">
                <p class="font-medium">No se encontraron datos de perfil adicionales.</p>
              </div>
            }
          </div>
        </div>

        <!-- Mapa de Ubicación (solo Taller) -->
        @if (profile.rol_nombre === 'Taller') {
          <div class="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 to-white flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-bold text-gray-900">Ubicación del Taller</h2>
                  <p class="text-xs text-gray-500">Haz clic en el mapa para seleccionar la ubicación de tu taller</p>
                </div>
              </div>
              @if (mapDirty) {
                <button (click)="saveUbicacion()" [disabled]="savingUbicacion"
                  class="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md flex items-center gap-2 disabled:opacity-50">
                  @if (savingUbicacion) {
                    <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  }
                  Guardar Ubicación
                </button>
              }
            </div>
            <div id="profile-map" class="h-[400px] w-full"></div>
          </div>
        }

        <!-- Botón Guardar General -->
        <div class="flex justify-end">
          <button (click)="saveProfile()" [disabled]="saving"
            class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100">
            @if (saving) {
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Guardando...
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              Guardar Cambios
            }
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-in;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class PerfilComponent implements OnInit, AfterViewInit, OnDestroy {
  private profileService = inject(ProfileService);
  private incidenteService = inject(IncidenteService);
  private fb = inject(FormBuilder);

  profile: ProfileData | null = null;
  loading = true;
  saving = false;
  savingUbicacion = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  accountForm!: FormGroup;
  adminForm!: FormGroup;
  tallerForm!: FormGroup;
  conductorForm!: FormGroup;
  mecanicoForm!: FormGroup;

  // Map
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  mapDirty = false;
  private selectedCoords: string | null = null;

  // Services
  misServicios: ServicioTallerOut[] = [];
  catalogoServicios: string[] = [];

  get catalogServiciosDisponibles(): string[] {
    const nombresActuales = this.misServicios.map(s => s.nombre);
    return this.catalogoServicios.filter(s => !nombresActuales.includes(s));
  }

  get avatarInitial(): string {
    if (!this.profile) return '?';
    return this.profile.Correo.charAt(0).toUpperCase();
  }

  ngOnInit() {
    this.accountForm = this.fb.group({
      Correo: [''],
      Password: ['']
    });
    this.adminForm = this.fb.group({
      Usuario: ['']
    });
    this.tallerForm = this.fb.group({
      Nombre: [''],
      Direccion: [''],
      Cap: [0],
      Capmax: [0],
      Coordenadas: ['']
    });
    this.conductorForm = this.fb.group({
      CI: [''],
      Nombre: [''],
      Apellidos: [''],
      Fechanac: ['']
    });
    this.mecanicoForm = this.fb.group({
      Nombre: [''],
      Apellidos: [''],
      Estado: ['']
    });

    this.loadProfile();
  }

  ngAfterViewInit() {
    // Map will be initialized after profile loads (see loadProfile)
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  loadProfile() {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.populateForms();
        this.loading = false;
        // Initialize map after a short delay to ensure DOM is ready
        if (data.rol_nombre === 'Taller') {
          setTimeout(() => this.initMap(), 100);
          this.loadServicios();
        }
      },
      error: () => {
        this.errorMessage = 'Error al cargar el perfil. Intenta recargar la página.';
        this.loading = false;
      }
    });
  }

  populateForms() {
    if (!this.profile) return;

    this.accountForm.patchValue({
      Correo: this.profile.Correo,
      Password: ''
    });

    if (this.profile.administrador) {
      this.adminForm.patchValue({
        Usuario: this.profile.administrador.Usuario || ''
      });
    }

    if (this.profile.taller) {
      this.tallerForm.patchValue({
        Nombre: this.profile.taller.Nombre || '',
        Direccion: this.profile.taller.Direccion || '',
        Cap: this.profile.taller.Cap ?? 0,
        Capmax: this.profile.taller.Capmax ?? 0,
        Coordenadas: this.profile.taller.Coordenadas || ''
      });
    }

    if (this.profile.conductor) {
      this.conductorForm.patchValue({
        CI: this.profile.conductor.CI || '',
        Nombre: this.profile.conductor.Nombre || '',
        Apellidos: this.profile.conductor.Apellidos || '',
        Fechanac: this.profile.conductor.Fechanac || ''
      });
    }

    if (this.profile.mecanico) {
      this.mecanicoForm.patchValue({
        Nombre: this.profile.mecanico.nombre || '',
        Apellidos: this.profile.mecanico.apellidos || '',
        Estado: this.profile.mecanico.estado || 'Disponible'
      });
    }
  }

  toggleEstadoMecanico(estado: string) {
    this.mecanicoForm.patchValue({ Estado: estado });
    this.mecanicoForm.markAsDirty();
  }

  loadServicios() {
    this.incidenteService.getCatalogoServicios().subscribe(cat => {
      this.catalogoServicios = cat;
    });
    this.incidenteService.getMisServicios().subscribe(mis => {
      this.misServicios = mis;
    });
  }

  agregarServicio(nombre: string) {
    if (!nombre) return;
    this.incidenteService.agregarServicio(nombre).subscribe({
      next: (nuevoSvc) => {
        this.misServicios.push(nuevoSvc);
        this.successMessage = `Servicio '${nombre}' agregado.`;
        this.autoClearSuccess();
      },
      error: (err) => {
        this.errorMessage = err.error?.detail || 'Error al agregar servicio.';
      }
    });
  }

  eliminarServicio(id: number) {
    this.incidenteService.eliminarServicio(id).subscribe({
      next: () => {
        this.misServicios = this.misServicios.filter(s => s.id !== id);
        this.successMessage = 'Servicio eliminado.';
        this.autoClearSuccess();
      },
      error: (err) => {
        this.errorMessage = err.error?.detail || 'Error al eliminar servicio.';
      }
    });
  }

  initMap() {
    const mapContainer = document.getElementById('profile-map');
    if (!mapContainer || this.map) return;

    // Fix Leaflet's default icon path issue
    const iconDefault = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Default center: Santa Cruz, Bolivia
    let lat = -17.7833;
    let lng = -63.1821;

    // If there's an existing coordinate, use it
    if (this.profile?.taller?.Coordenadas) {
      try {
        const parts = this.profile.taller.Coordenadas.replace(' ', '').split(',');
        lat = parseFloat(parts[0]);
        lng = parseFloat(parts[1]);
      } catch {}
    }

    this.map = L.map('profile-map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(this.map);

    // Place marker if coordinates exist
    if (this.profile?.taller?.Coordenadas) {
      this.marker = L.marker([lat, lng], { icon: iconDefault }).addTo(this.map);
      this.marker.bindPopup('<b>Ubicación actual del taller</b>').openPopup();
    }

    // Click to select location
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      const coordStr = `${clickLat.toFixed(6)},${clickLng.toFixed(6)}`;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng, { icon: iconDefault }).addTo(this.map!);
      }
      this.marker.bindPopup(`<b>Nueva ubicación</b><br>${coordStr}`).openPopup();

      this.selectedCoords = coordStr;
      this.tallerForm.patchValue({ Coordenadas: coordStr });
      this.mapDirty = true;
    });
  }

  saveProfile() {
    if (!this.profile) return;
    this.saving = true;
    this.clearMessages();

    const payload: any = {};

    // Account data
    const acc = this.accountForm.value;
    if (acc.Correo && acc.Correo !== this.profile.Correo) {
      payload.Correo = acc.Correo;
    }
    if (acc.Password) {
      payload.Password = acc.Password;
    }

    // Admin data
    if (this.profile.rol_nombre === 'Administrador') {
      const admin = this.adminForm.value;
      if (admin.Usuario !== undefined) {
        payload.admin_usuario = admin.Usuario;
      }
    }

    // Taller data
    if (this.profile.rol_nombre === 'Taller') {
      const taller = this.tallerForm.value;
      payload.taller_nombre = taller.Nombre;
      payload.taller_direccion = taller.Direccion;
      payload.taller_coordenadas = taller.Coordenadas;
      payload.taller_cap = taller.Cap;
      payload.taller_capmax = taller.Capmax;
    }

    // Conductor data
    if (this.profile.rol_nombre === 'Conductor') {
      const cond = this.conductorForm.value;
      payload.conductor_ci = cond.CI;
      payload.conductor_nombre = cond.Nombre;
      payload.conductor_apellidos = cond.Apellidos;
      if (cond.Fechanac) {
        payload.conductor_fechanac = cond.Fechanac;
      }
    }

    // Mecanico data
    if (this.profile.rol_nombre === 'Mecanico') {
      const mec = this.mecanicoForm.value;
      if (this.mecanicoForm.dirty) {
         payload.mecanico_estado = mec.Estado;
      }
    }

    this.profileService.updateProfile(payload).subscribe({
      next: (data) => {
        this.profile = data;
        this.populateForms();
        this.saving = false;
        this.successMessage = '¡Perfil actualizado correctamente!';
        this.autoClearSuccess();
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.detail || 'Error al guardar los cambios.';
      }
    });
  }

  saveUbicacion() {
    if (!this.selectedCoords) return;
    this.savingUbicacion = true;
    this.clearMessages();

    const direccion = this.tallerForm.value.Direccion;

    this.profileService.updateUbicacion({
      Coordenadas: this.selectedCoords,
      Direccion: direccion || undefined
    }).subscribe({
      next: (data) => {
        this.profile = data;
        this.populateForms();
        this.savingUbicacion = false;
        this.mapDirty = false;
        this.successMessage = '¡Ubicación del taller actualizada correctamente!';
        this.autoClearSuccess();
      },
      error: (err) => {
        this.savingUbicacion = false;
        this.errorMessage = err.error?.detail || 'Error al guardar la ubicación.';
      }
    });
  }

  private clearMessages() {
    this.successMessage = null;
    this.errorMessage = null;
  }

  private autoClearSuccess() {
    setTimeout(() => {
      this.successMessage = null;
    }, 4000);
  }
}
