import { Component, OnInit, OnDestroy, AfterViewChecked, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidenteService, IncidenteDetalle } from '../../core/services/incidente.service';
import { MecanicoService, Mecanico } from '../../core/services/mecanico.service';
import { PagoService } from '../../core/services/pago.service';
import { AuthService } from '../../core/services/auth.service';
import { ChatComponent } from '../chat/chat.component';
import * as L from 'leaflet';

@Component({
  selector: 'app-mantenimientos',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatComponent],
  templateUrl: './mantenimientos.component.html'
})
export class MantenimientosComponent implements OnInit, OnDestroy, AfterViewChecked {
  private incidenteService = inject(IncidenteService);
  private mecanicoService = inject(MecanicoService);
  private pagoService = inject(PagoService);
  private authService = inject(AuthService);

  mantenimientos: IncidenteDetalle[] = [];
  mecanicosDisponibles: Mecanico[] = [];
  
  isLoading = true;
  isUpdating = false;
  isConfirmingPago = false;
  error: string | null = null;
  role = this.authService.getRole();

  // Modal Detalles
  selectedIncidente: IncidenteDetalle | null = null;
  isDetalleModalOpen = false;
  private map: L.Map | null = null;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  // Asignacion de multiples mecanicos temporal store
  asignacionesPendientes: { [incidenteId: number]: number[] } = {};

  // Chat modal
  chatIncidenteId: number | null = null;

  ngOnInit(): void {
    this.cargarMantenimientos();
    if (this.role === 'Taller') {
      this.cargarMecanicosDisponibles();
    }
  }

  ngAfterViewChecked(): void {
    if (this.isDetalleModalOpen && this.selectedIncidente && !this.map && this.mapContainer) {
      this.initMap(this.selectedIncidente);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  cargarMantenimientos(): void {
    this.isLoading = true;
    this.error = null;
    this.incidenteService.getMantenimientosTaller().subscribe({
      next: (data) => {
        this.mantenimientos = data;
        
        // Inicializar seleccionados
        this.mantenimientos.forEach(m => {
          this.asignacionesPendientes[m.id] = m.mecanicos?.map(mec => mec.id) || [];
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar mantenimientos:', err);
        this.error = 'Ocurrió un error al cargar los mantenimientos. Por favor intenta de nuevo.';
        this.isLoading = false;
      }
    });
  }

  cargarMecanicosDisponibles(): void {
    this.mecanicoService.getMecanicos().subscribe({
      next: (data) => {
        this.mecanicosDisponibles = data.filter(m => m.estado === 'Disponible');
      },
      error: (err) => console.error('Error al cargar mecánicos:', err)
    });
  }

  toggleMecanicoSeleccion(incidenteId: number, mecanicoId: number, event: any) {
    const isChecked = event.target.checked;
    const current = this.asignacionesPendientes[incidenteId] || [];
    if (isChecked) {
      if (!current.includes(mecanicoId)) {
        this.asignacionesPendientes[incidenteId] = [...current, mecanicoId];
      }
    } else {
      this.asignacionesPendientes[incidenteId] = current.filter(id => id !== mecanicoId);
    }
  }

  guardarAsignacion(incidenteId: number): void {
    const mecanicosIds = this.asignacionesPendientes[incidenteId];
    this.isUpdating = true;
    
    this.incidenteService.asignarMecanicosIncidente(incidenteId, mecanicosIds).subscribe({
      next: (incidenteActualizado) => {
        const index = this.mantenimientos.findIndex(m => m.id === incidenteId);
        if (index !== -1) {
          this.mantenimientos[index] = incidenteActualizado;
        }
        this.isUpdating = false;
        alert('Técnicos asignados correctamente.');
      },
      error: (err) => {
        console.error('Error al asignar mecánicos:', err);
        alert('Hubo un error al asignar los técnicos.');
        this.isUpdating = false;
      }
    });
  }

  cambiarEstado(id: number, nuevoEstado: string): void {
    this.isUpdating = true;
    this.incidenteService.actualizarEstadoIncidente(id, nuevoEstado).subscribe({
      next: (incidenteActualizado) => {
        const index = this.mantenimientos.findIndex(m => m.id === id);
        if (index !== -1) {
          this.mantenimientos[index] = incidenteActualizado;
        }
        this.isUpdating = false;
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        alert('Hubo un error al actualizar el estado.');
        this.isUpdating = false;
      }
    });
  }

  // --- Detalles Modal ---
  abrirModalDetalles(incidente: IncidenteDetalle): void {
    this.selectedIncidente = incidente;
    this.isDetalleModalOpen = true;
    
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 100);
  }

  cerrarModalDetalles(): void {
    this.isDetalleModalOpen = false;
    this.selectedIncidente = null;
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initMap(incidente: IncidenteDetalle): void {
    if (!incidente.coordenadagps) return;

    try {
      const coords = incidente.coordenadagps.split(',').map(c => parseFloat(c.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        this.map = L.map(this.mapContainer.nativeElement).setView([coords[0], coords[1]], 15);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(this.map);

        L.marker([coords[0], coords[1]]).addTo(this.map)
          .bindPopup(`<b>Ubicación del Incidente</b><br>ID: #${incidente.id}`)
          .openPopup();
      }
    } catch (e) {
      console.error('Error parseando coordenadas:', e);
    }
  }

  getFotosDelIncidente(incidente: IncidenteDetalle | null): string[] {
    if (!incidente || !incidente.evidencias || incidente.evidencias.length === 0) return [];
    const fotosStr = incidente.evidencias[0].fotos;
    if (!fotosStr) return [];
    return fotosStr.split('|||').filter(url => url.trim().length > 0);
  }

  tienePagoPendiente(incidente: IncidenteDetalle): boolean {
    return incidente.pagos?.some(p => p.estado === 'Pendiente Confirmación' && p.metodo === 'Directo') || false;
  }

  confirmarPagoDirecto(incidenteId: number): void {
    if (!confirm('¿Confirmas que recibiste el pago en efectivo/transferencia del conductor?')) return;

    this.isConfirmingPago = true;
    this.pagoService.confirmarPagoDirecto(incidenteId).subscribe({
      next: () => {
        alert('Pago confirmado exitosamente. El incidente ha sido marcado como Pagado.');
        this.cargarMantenimientos();
        this.isConfirmingPago = false;
      },
      error: (err) => {
        console.error('Error al confirmar pago:', err);
        alert(err.error?.detail || 'Hubo un error al confirmar el pago.');
        this.isConfirmingPago = false;
      }
    });
  }
}
