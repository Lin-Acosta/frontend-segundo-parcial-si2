import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PagoService } from '../../../core/services/pago.service';

@Component({
  selector: 'app-pago-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pago-success.html'
})
export class PagoSuccess implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pagoService = inject(PagoService);

  isVerifying = true;
  success = false;
  errorMsg = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const sessionId = params['session_id'];
      const incidenteId = params['incidente_id'];

      if (sessionId && incidenteId) {
        this.verificarPago(sessionId, +incidenteId);
      } else {
        this.isVerifying = false;
        this.errorMsg = 'Parámetros inválidos. No se puede verificar el pago.';
      }
    });
  }

  verificarPago(sessionId: string, incidenteId: number) {
    this.pagoService.confirmarPagoStripe(sessionId, incidenteId).subscribe({
      next: (res) => {
        this.isVerifying = false;
        this.success = true;
      },
      error: (err) => {
        console.error('Error al verificar pago:', err);
        this.isVerifying = false;
        this.errorMsg = 'No se pudo verificar el pago. Si realizaste el cobro, por favor contacta a soporte.';
      }
    });
  }
}
