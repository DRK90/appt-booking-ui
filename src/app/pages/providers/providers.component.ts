import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material-module.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvidersService, Provider } from '../../services/providers.service';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { AppointmentType, AppointmentTypesService } from '../../services/appointment-types.service';
@Component({
  selector: 'app-providers',
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './providers.component.html',
  styleUrl: './providers.component.css'
})
export class ProvidersComponent implements OnInit {
  form: FormGroup;
  providers: Provider[] = []; 
  appointmentTypes: AppointmentType[] = [];
  constructor(
    private fb: FormBuilder,
    private providerService: ProvidersService,
    private appointmentTypesService: AppointmentTypesService
  ) {
    this.form = this.fb.group({
      selectedProvider: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      specialization: [''],
      appointment_types: [[]],
      active: [true]
    });

    // Sort alphabetically by name
  }

  ngOnInit(): void {
    // Subscribe to appointment types
    this.appointmentTypesService.appointmentTypes$.subscribe(types => {
      this.appointmentTypes = types;
    });

    // Subscribe to providers
    this.providerService.providers$.subscribe(providers => {
      this.providers = providers;
    });

    // Whenever selection changes, patch form
    this.form.get('selectedProvider')!
    .valueChanges
    .pipe(
      filter((id: string) => !!id)   // only non‑empty ids
    )
    .subscribe(id => {
      const prov = this.providers.find(p => p.id === id)!;
      this.form.patchValue({
        name:              prov.name,
        email:             prov.email,
        phone:             prov.phone,
        specialization:    prov.specialization,
        appointment_types: prov.appointment_types,
        active:            prov.active
      });
    });
  }

  getAppointmentTypesForSelectedProvider(): AppointmentType[] {
    const selectedProviderId = this.form.value.selectedProvider;
    if (!selectedProviderId) return [];
    //list of the Ids of the appointmentTypes pulled out of the object appointment_types

    const selectProviderAppointmentTypeIds = this.form.value.appointment_types;
    console.log('selectProviderAppointmentTypeIds', selectProviderAppointmentTypeIds);
    return this.providerService.getAppointmentTypes(selectProviderAppointmentTypeIds);
  }

  

  submit(): void {
    if (this.form.invalid) return;

    const { selectedProvider, name, email, phone, specialization, appointment_types, active } = this.form.value;
    const payload = { name, email, phone, specialization, appointment_types, active };

    if (selectedProvider) {
      this.providerService.updateProvider({ id: selectedProvider, ...payload });
    } else {
      console.log('Creating provider in component');
      this.providerService.createProvider(payload as any).subscribe((id) => {
      console.log('id', id);

      });
    }



    // Reset after operation
    this.form.patchValue({
      selectedProvider: '',
      name: '',
      email: '',
      phone: '',
      specialization: '',
      appointment_types: [],
      active: true
    });
    console.log('form', this.form.value);
  }

  delete(): void {
    const id = this.form.value.selectedProvider;
    console.log('Deleting provider in component:', id);
    if (id) {
      this.providerService.deleteProvider(id);
      this.form.patchValue({
        selectedProvider: '',
        name: '',
        email: '',
        phone: '',
        specialization: '',
        appointment_types: [],
        active: true
      });
    }
  }
}
  
  
