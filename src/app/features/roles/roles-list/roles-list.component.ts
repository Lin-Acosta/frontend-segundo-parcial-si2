import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleService, RolCompleto, Permiso } from '../../../core/services/role.service';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-gray-50 flex flex-col lg:flex-row gap-6 p-4 md:p-8">
      
      <!-- Seccion Izquierda: Lista de Roles -->
      <div class="flex-1 lg:max-w-xl flex flex-col gap-6">
        
        <div class="bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl border border-gray-100 flex-1">
          <div class="px-4 py-8 sm:px-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 mb-1">
                Roles de Sistema
              </h1>
              <p class="text-gray-500 text-sm">Gestiona los perfiles de acceso.</p>
            </div>
            <button (click)="openRoleModal()" class="px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105">
              + Nuevo Rol
            </button>
          </div>

          <div class="bg-white flex-1 p-4">
            <div class="grid gap-3">
              @for (rol of roles; track rol.Id) {
                <div (click)="selectRole(rol)" 
                     class="flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer group"
                     [ngClass]="selectedRole?.Id === rol.Id ? 'border-blue-400 bg-blue-50/50 shadow-sm' : 'border-dashed border-gray-200 hover:border-blue-300 hover:bg-gray-50'">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors"
                         [ngClass]="selectedRole?.Id === rol.Id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'">
                      {{ rol.Nombre.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <h3 class="font-bold transition-colors" [ngClass]="selectedRole?.Id === rol.Id ? 'text-blue-900' : 'text-gray-700'">{{ rol.Nombre }}</h3>
                      <p class="text-xs text-gray-500 mt-1">{{ rol.permisos.length }} Permisos asignados</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" [class.opacity-100]="selectedRole?.Id === rol.Id">
                    <button (click)="openRoleModal(rol); $event.stopPropagation()" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button (click)="deleteRole(rol.Id); $event.stopPropagation()" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              }
              @empty {
                <div class="p-8 text-center text-gray-400">No hay roles creados.</div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Seccion Derecha: Permisos del Rol Seleccionado -->
      <div class="flex-1 bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl border border-gray-100 flex flex-col">
        @if (selectedRole) {
          <div class="px-4 py-8 sm:px-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 class="text-xl font-bold text-gray-900">Configuración de Permisos</h2>
            <p class="text-sm text-gray-500 mt-1">Activa o desactiva capacidades para el rol <span class="font-bold text-blue-600">{{selectedRole.Nombre}}</span>.</p>
          </div>
          
          <div class="p-4 sm:p-8 flex-1 overflow-y-auto bg-white">
            <div class="grid gap-4">
              @for (permiso of allPermisos; track permiso.Id) {
                <label class="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50 cursor-pointer transition-colors shadow-sm">
                  <div>
                    <span class="font-semibold text-gray-800">{{ permiso.Nombre }}</span>
                  </div>
                  <div class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer"
                           [checked]="hasPermiso(permiso.Id)"
                           [disabled]="isToggling"
                           (change)="togglePermiso(permiso, $event)">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </label>
              }
            </div>
          </div>
        } @else {
          <div class="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <h3 class="text-xl font-bold text-gray-700">Ningún Rol Seleccionado</h3>
            <p class="mt-2 text-sm max-w-sm mx-auto">Selecciona un rol de la lista a la izquierda para visualizar y modificar sus permisos de sistema asociados.</p>
          </div>
        }
      </div>

    </div>

    <!-- Modal para Crear/Editar Rol -->
    @if (isModalOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" (click)="closeRoleModal()"></div>
        
        <div class="relative w-full max-w-sm bg-white border border-gray-100 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-6 transform transition-all">
          <h2 class="text-xl font-bold text-gray-900 mb-4">
            @if (isEditing) { Editar Rol } @else { Añadir Nuevo Rol }
          </h2>

          <form [formGroup]="roleForm" (ngSubmit)="submitRole()">
            @if (modalError) {
              <div class="mb-4 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm">{{ modalError }}</div>
            }
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Rol</label>
                <input type="text" formControlName="Nombre" 
                       class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500/50"
                       placeholder="Ej. Secretaria">
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <button type="button" (click)="closeRoleModal()" class="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
                Cancelar
              </button>
              <button type="submit" [disabled]="roleForm.invalid || isSubmitting"
                      class="px-4 py-2 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 flex items-center">
                @if (isSubmitting) { Cargando... } @else { Guardar }
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: []
})
export class RolesListComponent implements OnInit {
  roles: RolCompleto[] = [];
  allPermisos: Permiso[] = [];
  selectedRole: RolCompleto | null = null;
  
  // Modal State
  isModalOpen = false;
  isEditing = false;
  editingRoleId: number | null = null;
  isSubmitting = false;
  modalError: string | null = null;
  
  // Toggles State
  isToggling = false;

  roleForm: FormGroup;
  private fb = inject(FormBuilder);
  roleService = inject(RoleService);

  constructor() {
    this.roleForm = this.fb.group({
      Nombre: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit() {
    this.loadRoles();
    this.loadPermisos();
  }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        // Refresh selectedRole data if it exists
        if (this.selectedRole) {
          this.selectedRole = this.roles.find(r => r.Id === this.selectedRole!.Id) || null;
        }
      },
      error: (e) => console.error("Error cargando roles", e)
    });
  }

  loadPermisos() {
    this.roleService.getAllPermisos().subscribe({
      next: (data) => this.allPermisos = data,
      error: (e) => console.error("Error cargando permisos", e)
    });
  }

  selectRole(rol: RolCompleto) {
    this.selectedRole = rol;
  }

  hasPermiso(permisoId: number): boolean {
    if (!this.selectedRole) return false;
    return this.selectedRole.permisos.some(p => p.Id === permisoId);
  }

  togglePermiso(permiso: Permiso, event: Event) {
    if (!this.selectedRole) return;
    const isChecked = (event.target as HTMLInputElement).checked;
    const roleId = this.selectedRole.Id;
    
    this.isToggling = true;

    if (isChecked) {
      this.roleService.assignPermisoToRole(roleId, permiso.Id).subscribe({
        next: () => {
          this.isToggling = false;
          this.loadRoles(); // refreshes full list
        },
        error: (e) => {
          this.isToggling = false;
          (event.target as HTMLInputElement).checked = false; // rollback
          alert("Error asignando el permiso.");
        }
      });
    } else {
      this.roleService.removePermisoFromRole(roleId, permiso.Id).subscribe({
        next: () => {
          this.isToggling = false;
          this.loadRoles();
        },
        error: (e) => {
          this.isToggling = false;
          (event.target as HTMLInputElement).checked = true; // rollback
          alert("Error revocando el permiso.");
        }
      });
    }
  }

  // --- Modal Logic ---

  openRoleModal(rol?: RolCompleto) {
    this.isModalOpen = true;
    this.modalError = null;
    this.roleForm.reset();
    
    if (rol) {
      this.isEditing = true;
      this.editingRoleId = rol.Id;
      this.roleForm.get('Nombre')?.setValue(rol.Nombre);
    } else {
      this.isEditing = false;
      this.editingRoleId = null;
    }
  }

  closeRoleModal() {
    this.isModalOpen = false;
  }

  submitRole() {
    if (this.roleForm.invalid) return;
    this.isSubmitting = true;
    this.modalError = null;
    
    const payload = this.roleForm.value;

    const request = this.isEditing && this.editingRoleId
      ? this.roleService.updateRole(this.editingRoleId, payload)
      : this.roleService.createRole(payload);

    request.subscribe({
      next: (savedRol) => {
        this.isSubmitting = false;
        this.closeRoleModal();
        this.loadRoles();
        if (!this.isEditing) {
           // Optionally auto-select the newly created rule
           this.selectedRole = savedRol;
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 400 && err.error?.detail) {
          this.modalError = err.error.detail;
        } else {
          this.modalError = "Error al conectar con la base de datos.";
        }
      }
    });
  }

  deleteRole(id: number) {
    if (confirm('¿Eliminar definitivamente este rol? Esto desvinculará sus permisos permanentemente.')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => {
          if (this.selectedRole?.Id === id) this.selectedRole = null;
          this.loadRoles();
        },
        error: (err) => {
          if (err.status === 400 && err.error?.detail) {
            alert(err.error.detail); // Mostrar error de integridad
          } else {
            alert('No se pudo eliminar el rol.');
          }
        }
      });
    }
  }
}
