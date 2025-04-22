import { Routes } from '@angular/router';
import { BookingComponent } from './pages/booking.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AboutComponent } from './pages/about/about.component';
import { ProvidersComponent } from './pages/providers/providers.component';
import { AppointmentTypesComponent } from './pages/appointmentTypes/appointment-types.component';
export const routes: Routes = [
  { path: '', component: BookingComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'providers', component: ProvidersComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'about', component: AboutComponent },
  { path: 'appointment-types', component: AppointmentTypesComponent },
];
