import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- MAIN WRAPPER: Full screen dark tech background -->
    <div class="relative min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-orange-500 selection:text-white overflow-hidden">
      
      <!-- ABSTRACT GLOW BACKGROUND (NO IMAGES, JUST CSS) -->
      <div class="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div class="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/30 blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
        <div class="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-orange-600/30 blur-[150px] mix-blend-screen animate-pulse" style="animation-delay: 2s; animation-duration: 8s;"></div>
        <!-- Digital Mesh Overlay -->
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0NzU1NjkiIGZpbGwtb3BhY2l0eT0iMC4xNSI+PHBhdGggZD0iTTM2IDM0djI2aC0yVjMySDB2LWh2MjhINXYzMGgtdlptLTItMkgyMlYwaDJtLTE4IDBoMnY2MEg0ViwaIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      </div>

      <!-- GLASS NAVBAR -->
      <nav class="fixed w-full z-50 top-0 transition-all duration-300 bg-slate-950/50 backdrop-blur-xl border-b border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-20">
            <!-- Logo -->
            <div class="flex-shrink-0 cursor-pointer flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <span class="font-extrabold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Emergencias<span class="text-orange-500">Auto</span></span>
            </div>

            <!-- Botones a la derecha -->
            <div class="flex items-center gap-4">
              <a routerLink="/login" class="hidden sm:inline-flex text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200">
                Iniciar Sesión
              </a>
              <a routerLink="/registro-taller" class="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transform hover:-translate-y-0.5 transition-all duration-300">
                Soy Taller Automotriz
              </a>
            </div>
          </div>
        </div>
      </nav>

      <!-- HERO SECTION -->
      <main class="relative z-10 pt-40 pb-20 sm:pt-48 sm:pb-32 lg:pb-48">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div class="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 ring-1 ring-inset ring-white/10">
            <span class="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse mr-2"></span>
            <span class="text-xs font-semibold uppercase tracking-widest text-slate-300">Plataforma Operativa 24/7</span>
          </div>

          <h1 class="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-8 drop-shadow-2xl max-w-4xl leading-tight">
            Gestión de asisencias <br class="hidden sm:block"/>
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-orange-400 to-red-400">a la velocidad de la luz.</span>
          </h1>

          <p class="mt-4 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-medium tracking-wide mb-12">
            La red colaborativa número uno para conductores y talleres automotrices. Reporta colisiones, averías y coordina la llegada de grúas y técnicos desde un solo ecosistema inteligente.
          </p>

          <div class="flex flex-col sm:flex-row gap-5 w-full justify-center">
            <a routerLink="/login" class="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] transform hover:-translate-y-1 transition-all duration-300 group">
              Central de Despacho
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a routerLink="/registro-taller" class="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-lg transform hover:-translate-y-1 transition-all duration-300">
              Afiliar Mi Taller
            </a>
          </div>
        </div>
      </main>

      <!-- FEATURES / BENTO GRID UI -->
      <section class="relative z-10 py-20 bg-slate-950/80 border-t border-slate-900 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-500">¿Por qué unirse a la red?</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Card 1 -->
            <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 hover:border-orange-500/50 transition-colors duration-300 group">
              <div class="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-orange-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-white mb-3">Geolocalización Inmediata</h3>
              <p class="text-slate-400 leading-relaxed font-medium">Detectamos y enrutamos coordenadas exactas del incidente directo a la pantalla de los mecánicos disponibles.</p>
            </div>

            <!-- Card 2 -->
            <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 hover:border-blue-500/50 transition-colors duration-300 group">
              <div class="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-blue-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-white mb-3">Seguridad Dinámica</h3>
              <p class="text-slate-400 leading-relaxed font-medium">Arquitectura sellada con Bearer Tokens. Un taller jamás robará la cartera de clientes o los técnicos de otro.</p>
            </div>

            <!-- Card 3 -->
            <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 hover:border-purple-500/50 transition-colors duration-300 group">
              <div class="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-purple-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-white mb-3">Gestión Corporativa</h3>
              <p class="text-slate-400 leading-relaxed font-medium">Asigna mecánicos libres, gestiona el inventario de grúas y escala el aforo del taller con nuestro Dashboard exclusivo.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="relative z-10 border-t border-white/5 py-10 bg-slate-950">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-2 opacity-50">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="font-bold tracking-tight text-sm">EmergenciasAuto &copy; 2026. Todos los derechos reservados.</span>
          </div>
          <div class="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" class="hover:text-white transition-colors">Términos de Uso</a>
            <a href="#" class="hover:text-white transition-colors">Privacidad</a>
            <a href="#" class="hover:text-white transition-colors">Ayuda</a>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LandingComponent {}
