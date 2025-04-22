import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material-module.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentTypesService, AppointmentType } from '../../services/appointment-types.service';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-appointment-types',
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './appointment-types.component.html',
  styleUrl: './appointment-types.component.css'
})
export class AppointmentTypesComponent implements OnInit {
  form: FormGroup;
  appointmentTypes: AppointmentType[] = []; 

  constructor(
    private fb: FormBuilder,
    private appointmentTypeService: AppointmentTypesService
  ) {
    this.form = this.fb.group({
      selectedAppointmentType: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      duration_minutes: ['', Validators.required],
      price: ['', Validators.required]
    });

    // Sort alphabetically by name
    this.appointmentTypeService.appointmentTypes$.subscribe(appointmentTypes => {
      this.appointmentTypes = appointmentTypes;
    });
  }

  ngOnInit(): void {
    // Whenever selection changes, patch form
    this.form.get('selectedAppointmentType')!.
    valueChanges.pipe(
      filter((id: string) => !!id)   // only non‑empty ids
    )
    .subscribe(id => {
        const apt = this.appointmentTypes.find(c => c.id === id)!;
        this.form.patchValue({
                name: apt.name,
                description: apt.description,
                duration_minutes: apt.duration_minutes,
                price: apt.price
              });
    });
  }

  

  submit(): void {
    if (this.form.invalid) return;

    const { selectedAppointmentType, name, description, duration_minutes, price } = this.form.value;
    const payload = { name, description, duration_minutes, price };

    if (selectedAppointmentType) {
      this.appointmentTypeService.updateAppointmentType({ id: selectedAppointmentType, ...payload } );
    } else {
      this.appointmentTypeService.postAppointmentType(payload as any);
    }

    // Reset after operation
    this.form.reset({
      selectedAppointmentType: '',
      name: '',
      description: '',
      duration_minutes: '',
      price: ''
    });
    console.log('form', this.form.value);
  }

  delete(): void {
    const id = this.form.value.selectedAppointmentType;
    if (id) {
      this.appointmentTypeService.deleteAppointmentType({ id } as any);
      this.form.reset({
        selectedAppointmentType: '',
        name: '',
        description: '',
        duration_minutes: '',
        price: ''
      });
    }
  }
}
  
  
