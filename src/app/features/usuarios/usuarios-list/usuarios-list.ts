import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, Usuario, Rol } from '../../../core/services/user.service';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl border border-gray-100">
      
      <!-- Header Section -->
      <div class="px-4 py-8 sm:px-10 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
            Gestión de Usuarios
          </h1>
          <p class="text-gray-500 text-sm md:text-base">
            Administra los accesos y roles de la plataforma vehicular.
          </p>
        </div>
        <button (click)="openModal()" class="mt-4 md:mt-0 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          + Nuevo Usuario
        </button>
      </div>

      <!-- Table Section -->
      <div class="px-4 py-8 sm:px-10 bg-white relative">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 text-gray-500 text-sm tracking-widest uppercase border-b border-gray-200">
                <th class="p-5 font-semibold">ID</th>
                <th class="p-5 font-semibold">Correo Electrónico</th>
                <th class="p-5 font-semibold">Rol Asignado</th>
                <th class="p-5 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              
              @for (user of users; track user.Id) {
                <tr class="group hover:bg-gray-50/50 transition-colors duration-200">
                  <td class="p-5 text-gray-500 font-medium whitespace-nowrap">#{{ user.Id }}</td>
                  <td class="p-5">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-lg mr-4">
                        {{ user.Correo.charAt(0).toUpperCase() }}
                      </div>
                      <span class="text-gray-900 font-medium">{{ user.Correo }}</span>
                    </div>
                  </td>
                  <td class="p-5">
                    <span class="px-3 py-1 rounded-full text-xs font-bold tracking-wide border"
                          [ngClass]="{
                            'bg-blue-50 text-blue-700 border-blue-200': user.rol?.Nombre === 'Administrador',
                            'bg-emerald-50 text-emerald-700 border-emerald-200': user.rol?.Nombre === 'Conductor',
                            'bg-amber-50 text-amber-700 border-amber-200': user.rol?.Nombre === 'Taller' || (!user.rol?.Nombre || (user.rol?.Nombre !== 'Administrador' && user.rol?.Nombre !== 'Conductor'))
                          }">
                      {{ user.rol?.Nombre || 'Sin Rol' }}
                    </span>
                  </td>
                  <td class="p-5 text-center whitespace-nowrap">
                    <button (click)="openModal(user)" 
                            class="text-gray-400 hover:text-blue-500 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50 mr-2"
                            title="Editar usuario">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button (click)="deleteUser(user.Id)" 
                            class="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                            title="Eliminar usuario">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              }
              @empty {
                <tr>
                  <td colspan="4" class="p-10 text-center text-gray-400">
                    <div class="flex flex-col items-center justify-center">
                      <svg class="h-12 w-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p class="text-lg">No hay usuarios registrados</p>
                    </div>
                  </td>
                </tr>
              }

            </tbody>
          </table>
        </div>
      </div>

      <!-- Create User Modal (Light Theme) -->
      @if (isModalOpen) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" (click)="closeModal()"></div>
          
          <div class="relative w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-6 md:p-8 transform transition-all">
            <button (click)="closeModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              @if (isEditing) {
                Editar Usuario
              } @else {
                Añadir Usuario
              }
            </h2>

            <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
              
              @if (createError) {
                <div class="mb-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ createError }}
                </div>
              }

              <div class="space-y-4">
                <!-- Correo -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <input type="email" formControlName="Correo" 
                         class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                         placeholder="usuario@ejemplo.com">
                </div>
                
                <!-- Contraseña -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                    @if (isEditing) { <span class="text-xs font-normal text-gray-400 ml-1">(Dejar en blanco para conservar actual)</span> }
                  </label>
                  <input type="password" formControlName="Password" 
                         class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                         placeholder="••••••••">
                </div>

                <!-- Rol -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Rol a Asignar</label>
                  <select formControlName="IdRol" 
                          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium">
                    <option value="" disabled selected>Selecciona un rol</option>
                    @for (r of roles; track r.Id) {
                      <option [value]="r.Id">{{ r.Nombre }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="mt-8 flex justify-end gap-3">
                <button type="button" (click)="closeModal()" class="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors">
                  Cancelar
                </button>
                <button type="submit" [disabled]="userForm.invalid || isSubmitting"
                        class="px-5 py-2.5 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                  @if (isSubmitting) {
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  } @else {
                    @if (isEditing) { Guardar Cambios } @else { Crear Usuario }
                  }
                </button>
              </div>
            </form>

          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class UsuariosList implements OnInit {
  users: Usuario[] = [];
  roles: Rol[] = [];
  
  isModalOpen = false;
  isEditing = false;
  editingUserId: number | null = null;
  
  isSubmitting = false;
  createError: string | null = null;
  
  userForm: FormGroup;
  private fb = inject(FormBuilder);
  userService = inject(UserService);

  constructor() {
    this.userForm = this.fb.group({
      Correo: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      IdRol: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error loading users:', err)
    });
  }

  loadRoles() {
    this.userService.getRoles().subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error('Error loading roles:', err)
    });
  }

  openModal(user?: Usuario) {
    this.isModalOpen = true;
    this.createError = null;
    this.userForm.reset();
    
    if (user) {
      this.isEditing = true;
      this.editingUserId = user.Id;
      this.userForm.get('Correo')?.setValue(user.Correo);
      this.userForm.get('IdRol')?.setValue(user.IdRol);
      this.userForm.get('Password')?.setValue('');
      this.userForm.get('Password')?.clearValidators();
      this.userForm.get('Password')?.updateValueAndValidity();
    } else {
      this.isEditing = false;
      this.editingUserId = null;
      this.userForm.get('IdRol')?.setValue('');
      this.userForm.get('Password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('Password')?.updateValueAndValidity();
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    this.isSubmitting = true;
    this.createError = null;
    
    // Parse IdRol to integer before sending
    const payload = {
      ...this.userForm.value,
      IdRol: parseInt(this.userForm.value.IdRol, 10)
    };

    if (this.isEditing && !payload.Password) {
      delete payload.Password;
    }

    const request = this.isEditing && this.editingUserId
      ? this.userService.updateUser(this.editingUserId, payload)
      : this.userService.createUser(payload);

    request.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeModal();
        this.loadUsers(); // Refresh the list
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 400 && err.error?.detail) {
          this.createError = err.error.detail;
        } else {
          this.createError = "Ha ocurrido un error al conectar con el servidor.";
        }
      }
    });
  }

  deleteUser(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.Id !== id);
        },
        error: (err) => alert('Hubo un error al eliminar el usuario.')
      });
    }
  }
}
