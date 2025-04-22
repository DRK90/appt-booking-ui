// src/app/booking.component.ts
import { Component, OnInit }      from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import { MaterialModule }         from '../../shared/material-module.component';
import { AppointmentTypesService, AppointmentType } from '../../services/appointment-types.service';
import { ProvidersService, Provider }               from '../../services/providers.service';
import { CustomersService, Customer }               from '../../services/customers.service';
import { AppointmentsService }   from '../../services/appointments.service';
import { MatSnackBar }           from '@angular/material/snack-bar';
import { DateTime }             from 'luxon';

@Component({
  standalone: true,
  selector: 'app-booking',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  appointmentTypes: AppointmentType[] = [];
  customers: Customer[] = [];
  providers: Provider[] = [];
  filteredProviders: Provider[] = [];

  selectedCustomer: string = '';
  selectedAppointmentType: string = '';
  selectedProvider: string = '';
  selectedDate: Date | null = null;
  selectedTime: string = '09:00';

  constructor(
    private appointmentTypesService: AppointmentTypesService,
    private providersService: ProvidersService,
    private customersService: CustomersService,
    private appointmentsService: AppointmentsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.appointmentTypesService.appointmentTypes$
      .subscribe(list => this.appointmentTypes = list);

    this.customersService.customers$
      .subscribe(list => this.customers = list);

    this.providersService.providers$
      .subscribe(list => {
        this.providers = list;
        this.filterProviders();
      });
  }

  onTypeChange() {
    // whenever appointment type changes, re-filter providers
    this.filterProviders();
    // clear any previously selected provider
    this.selectedProvider = '';
  }

  filterProviders() {
    if (!this.selectedAppointmentType) {
      this.filteredProviders = [];
    } else {
      this.filteredProviders = this.providers
        .filter(p => p.appointment_types.includes(this.selectedAppointmentType));
    }
  }

  getSelectedAppointmentType() {
    return this.appointmentTypes.find(t => t.id === this.selectedAppointmentType);
  }

  getCustomerName(): string {
    return this.customers.find(c => c.id === this.selectedCustomer)?.name ?? '';
  }
  getProviderName(): string {
    return this.providers.find(p => p.id === this.selectedProvider)?.name ?? '';
  }

  get summary(): string {
    if (this.selectedAppointmentType && this.selectedCustomer && this.selectedProvider && this.selectedDate && this.selectedTime) {
      const dateStr = this.selectedDate.toLocaleDateString();
      return `Book a ${this.getSelectedAppointmentType()?.name ?? ''} appointment for ${this.getCustomerName()} on ${dateStr} at ${this.selectedTime} with ${this.getProviderName()}.`;
    }
    return '';
  }

  book() {
    if (!this.selectedAppointmentType || !this.selectedCustomer
        || !this.selectedProvider || !this.selectedDate || !this.selectedTime) {
      this.snackBar.open('Please fill out all fields', 'Close', { duration: 3000 });
      return;
    }
  
    // Combine selected date and time into one Luxon DateTime object in Eastern Time
    const [hour, minute] = this.selectedTime.split(':').map(Number);
  
    const dt = DateTime.fromObject(
      {
        year: this.selectedDate.getFullYear(),
        month: this.selectedDate.getMonth() + 1,
        day: this.selectedDate.getDate(),
        hour,
        minute,
      },
      { zone: 'America/New_York' }
    );
  
    const payload = {
      appointment_type_id: this.selectedAppointmentType,
      customer_id: this.selectedCustomer,
      provider_id: this.selectedProvider,
      start_time: dt.toISO({ suppressMilliseconds: true }), // ISO format in ET
      notes: `Booked via UI`
    };
  
    this.appointmentsService.bookAppointment(payload).subscribe({
      next: () => {
        this.snackBar.open('Appointment booked!', 'Close', { duration: 3000 });
        this.selectedAppointmentType = '';
        this.selectedCustomer = '';
        this.selectedProvider = '';
        this.selectedDate = null;
        this.selectedTime = '';
        this.filteredProviders = [];
      },
      error: (err: any) => {
        console.log(err);
        this.snackBar.open(`Error: ${err.error.detail}`, 'Close', { duration: 5000 });
      }
    });
  }
}
