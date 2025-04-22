import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentType, AppointmentTypesService } from './appointment-types.service';
@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  private baseUrl = '/api/providers';

  private providersSubject: BehaviorSubject<Provider[]> = new BehaviorSubject<Provider[]>([]);
  public providers$: Observable<Provider[]> = this.providersSubject.asObservable();
  appointmentTypes: AppointmentType[] = [];
  constructor(private http: HttpClient, private snackBar: MatSnackBar, private appointmentTypesService: AppointmentTypesService) { 
    this.fetchProviders();
    this.appointmentTypesService.appointmentTypes$.subscribe(data => this.appointmentTypes = data);
  }

  async fetchProviders(): Promise<void> {    
    this.http.get<Provider[]>(`${this.baseUrl}`).subscribe({
      next: (data) => {
        this.providersSubject.next(data);
        console.log('Providers fetched:', data);
      },
      error: (error) => console.error('Error fetching providers:', error)
    })
  }

  getAppointmentTypes(appointmentTypes: AppointmentType[]): AppointmentType[] {
    console.log('appointmentTypes', appointmentTypes);
    //return the list of appointmentTypes that in the list appointmentTypes
    return this.appointmentTypes.filter(type => appointmentTypes.some(t => t.id === type.id));
  }


  createProvider(provider: Provider): void {
    this.http.post<Provider>(`${this.baseUrl}`, provider).subscribe({
      next: (data) => {
        this.providersSubject.next([...this.providersSubject.getValue(), data]);
        this.snackBar.open('Provider created', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error creating provider:', error);
        this.snackBar.open('Error creating provider', 'Close', { duration: 3000 });
      }
    })
  }

  updateProvider(provider: Provider): void {
    this.http.put<Provider>(`${this.baseUrl}/${provider.id}`, provider).subscribe({
      next: (data) => {
        this.providersSubject.next([...this.providersSubject.getValue().map(p => p.id === provider.id ? data : p)]);
        this.snackBar.open('Provider updated', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating provider:', error);
        this.snackBar.open('Error updating provider', 'Close', { duration: 3000 });
      }
    })
  }

  deleteProvider(id: string): void {
    this.http.delete<Provider>(`${this.baseUrl}/${id}`).subscribe({
      next: () => {
        this.providersSubject.next(this.providersSubject.getValue().filter(p => p.id !== id));
        this.snackBar.open('Provider deleted', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error deleting provider:', error);
        this.snackBar.open('Error deleting provider', 'Close', { duration: 3000 });
      }
    })
  }
  

}

export interface Provider {
  id: string;
  name: string;
  email: string;
  phone?: string; // Optional field
  specialization?: string; // Optional field
  appointment_types: string[]; // List of appointment type IDs
  active: boolean; // Defaults to true
}
