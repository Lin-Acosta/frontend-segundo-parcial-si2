import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService, ProfileData } from '../../core/services/profile.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
      <!-- Navbar -->
      <nav class="bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <div routerLink="/dashboard" class="flex-shrink-0 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div class="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg shadow-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.315 48.315 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
                </div>
                <span class="font-bold text-xl text-gray-900 tracking-tight">Emergencia<span class="text-blue-600">Vehicular</span></span>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm font-semibold hidden sm:inline-flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                {{ role() || 'Usuario Desconocido' }}
              </span>
              <button routerLink="/dashboard/perfil" class="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2" title="Mi Perfil">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Mi Perfil
              </button>
              <button (click)="logout()" class="text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        @if (isHomePage()) {
          <div class="bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl border border-gray-100">
            <div class="px-4 py-8 sm:px-10 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 class="text-3xl leading-tight font-extrabold text-gray-900">Panel de Control</h1>
                <p class="mt-2 max-w-2xl text-lg text-gray-500">Bienvenido al área protegida. Aquí puedes configurar y visualizar los datos del sistema dependiendo de tu nivel de acceso.</p>
              </div>

              <!-- Workshop Balance Card Quick View -->
              @if (role() === 'Taller' && profile()) {
                <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-xl min-w-[280px] animate-fade-in relative overflow-hidden group">
                  <div class="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                  <div class="relative z-10">
                    <div class="flex items-center gap-2 mb-1">
                      <div class="w-2 h-2 rounded-full" [ngClass]="(profile()?.taller?.balance || 0) >= 0 ? 'bg-emerald-400' : 'bg-orange-400'"></div>
                      <p class="text-xs font-bold text-blue-100 uppercase tracking-wider">Estado de Cuenta</p>
                    </div>
                    <div class="flex items-end gap-1">
                      <span class="text-xl font-bold mb-1">$</span>
                      <h3 class="text-4xl font-black tracking-tight">{{ profile()?.taller?.balance || 0 }}</h3>
                    </div>
                    <p class="text-[10px] text-blue-100 mt-2 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
                      </svg>
                      {{ (profile()?.taller?.balance || 0) >= 0 ? 'Monto a favor' : 'Deuda pendiente' }}
                    </p>
                  </div>
                </div>
              }
            </div>
          
          <div class="px-4 py-8 sm:px-10 bg-white">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <!-- Card 1 -->
              @if (hasPermiso('Ver Usuarios')) {
                <div routerLink="/dashboard/usuarios" class="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer group">
                  <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-900">Gestión de Usuarios</h3>
                  <p class="text-sm text-gray-500 mt-2">Administrar perfiles, roles y accesos.</p>
                </div>
              }

              <!-- Card 2: Mantenimientos (Taller y Mecánico) -->
              @if (hasPermiso('Ver Mantenimientos') || role() === 'Taller' || role() === 'Mecanico') {
                <div routerLink="/dashboard/mantenimientos" class="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer group">
                  <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 19.5l-4.5-4.5M10.5 19.5a9 9 0 100-18 9 9 0 000 18z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900 group-hover:text-purple-900">Mantenimientos</h3>
                  <p class="text-sm text-gray-500 mt-2">Buscar y despachar alertas a talleres o conductores.</p>
                </div>
              }

              <!-- Card 3 -->
              @if (hasPermiso('Gestionar Roles')) {
                <div routerLink="/dashboard/roles" class="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-emerald-400 hover:bg-emerald-50 transition-colors cursor-pointer group">
                  <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900 group-hover:text-emerald-900">Roles y Permisos</h3>
                  <p class="text-sm text-gray-500 mt-2">Configura capacidades de acceso al activar/desactivar permisos del sistema.</p>
                </div>
              }

              <!-- Card 4 -->
              @if (hasPermiso('Gestionar Mecanicos') || role() === 'Taller') {
                <div routerLink="/dashboard/mecanicos" class="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-orange-400 hover:bg-orange-50 transition-colors cursor-pointer group">
                  <div class="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.673 4.673a2.25 2.25 0 01-3.182 0l-1.06-1.06a2.25 2.25 0 010-3.182l4.673-4.673m-1.458 5.75l-4.5 4.5M15.75 3.75l-6 6" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900 group-hover:text-orange-900">Personal Técnico</h3>
                  <p class="text-sm text-gray-500 mt-2">Gestionar mecánicos, asignaciones operativas y datos de personal del taller.</p>
                </div>
              }

              <!-- Card: Solicitudes Pendientes — visible para Taller -->
              @if (role() === 'Taller') {
                <div routerLink="/dashboard/solicitudes-pendientes" class="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-cyan-400 hover:bg-cyan-50 transition-colors cursor-pointer group">
                  <div class="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900 group-hover:text-cyan-900">Solicitudes Pendientes</h3>
                  <p class="text-sm text-gray-500 mt-2">Ver emergencias reportadas por conductores y ofrecer tu servicio de asistencia.</p>
                </div>
              }

              <!-- Card: Mis Incidentes — visible para Conductor -->
              @if (role() === 'Conductor') {
                <div routerLink="/dashboard/mis-incidentes" class="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-emerald-400 hover:bg-emerald-50 transition-colors cursor-pointer group">
                  <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900 group-hover:text-emerald-900">Mis Incidentes</h3>
                  <p class="text-sm text-gray-500 mt-2">Ver el estado de tus siniestros reportados y realizar pagos.</p>
                </div>
              }

              <!-- Card 5: Bitacora — visible para todos -->
              <div routerLink="/dashboard/bitacora" class="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-violet-400 hover:bg-violet-50 transition-colors cursor-pointer group">
                <div class="w-12 h-12 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 group-hover:text-violet-900">Bitácora</h3>
                <p class="text-sm text-gray-500 mt-2">Consultar el historial de actividades y operaciones realizadas en el sistema.</p>
              </div>

              <!-- Card: Mi Perfil — visible para todos -->
              <div routerLink="/dashboard/perfil" class="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer group">
                <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 group-hover:text-indigo-900">Mi Perfil</h3>
                <p class="text-sm text-gray-500 mt-2">Gestionar tu información personal, contraseña y configuración de cuenta.</p>
              </div>

              <!-- Card: Reportes — visible para Taller -->
              @if (role() === 'Taller') {
                <div routerLink="/dashboard/reportes" class="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-rose-400 hover:bg-rose-50 transition-colors cursor-pointer group">
                  <div class="w-12 h-12 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11l3 3L22 4" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900 group-hover:text-rose-900">Reportes y Estadísticas</h3>
                  <p class="text-sm text-gray-500 mt-2">Analiza tus ingresos, volumen de servicios y tendencias mensuales.</p>
                </div>
              }

            </div>
          </div>
        </div>
        }

        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private router = inject(Router);
  
  role = toSignal(this.authService.currentUserRole$, { initialValue: this.authService.getRole() });
  profile = toSignal(this.profileService.getProfile());

  isHomePage() {
    return this.router.url === '/dashboard';
  }

  hasPermiso(permiso: string): boolean {
    return this.authService.hasPermiso(permiso);
  }

  logout() {
    this.authService.logout();
  }
}
