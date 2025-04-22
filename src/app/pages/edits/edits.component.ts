import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material-module.component';
import { ProvidersService, Provider } from '../../services/providers.service';
import { AppointmentsService, Appointment } from '../../services/appointments.service';
import { CustomersService, Customer } from '../../services/customers.service';
import { AppointmentTypesService, AppointmentType } from '../../services/appointment-types.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  standalone: true,
  selector: 'app-appointments-viewer',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './edits.component.html',
  styleUrls: ['./edits.component.css']
})
export class EditsComponent implements OnInit {
  providers: Provider[] = [];
  customers: Customer[] = [];
  appointmentTypes: AppointmentType[] = [];

  selectedProvider: string = '';
  selectedCustomer: string = '';
  appointments: Appointment[] = [];
  constructor(
    private providersService: ProvidersService,
    private appointmentsService: AppointmentsService,
    private customersService: CustomersService,
    private appointmentTypesService: AppointmentTypesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.providersService.providers$.subscribe(list => this.providers = list);
    this.customersService.customers$.subscribe(list => this.customers = list);
    this.appointmentTypesService.appointmentTypes$.subscribe(list => this.appointmentTypes = list);
  }

  fetchAppointments() {
    this.appointmentsService
      .getAppointments(this.selectedProvider || undefined, this.selectedCustomer || undefined)
      .subscribe({
        next: (data) => this.appointments = data,
        error: (err) => this.snackBar.open(`Error: ${err.message}`, 'Close', { duration: 5000 })
      });
  }

  getCustomerName(id: string): string {
    return this.customers.find(c => c.id === id)?.name ?? 'Unknown';
  }

  getAppointmentTypeName(id: string): string {
    return this.appointmentTypes.find(t => t.id === id)?.name ?? 'Unknown';
  }
}
