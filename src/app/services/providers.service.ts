import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentType, AppointmentTypesService } from './appointment-types.service';
@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  private baseUrl = environment.apiUrls.providers;

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
        //filter the providers that are active
        const activeProviders = data.filter(provider => provider.active);
        this.providersSubject.next(activeProviders);
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

  updateAvailability(providerId: string, availability: any): void {
    console.log('Updating availability for provider:', providerId);
    console.log('Availability:', availability);
    this.http.put(`${this.baseUrl}/${providerId}/availability`, availability).subscribe({
      next: () => console.log('Default availability set.'),
      error: (err) => console.error('Error setting availability:', err)
    });
  }


  createProvider(provider: Provider): Observable<string | null> {
    let id: string | null = null;
    this.http.post<Provider>(`${this.baseUrl}`, provider).subscribe({
      next: (data) => {
        id = data.id;
        const defaultAvailability = {
          provider_id: id,
          weekly_schedule: {
            monday:    [{ start: '09:00:00', end: '17:00:00' }],
            tuesday:   [{ start: '09:00:00', end: '17:00:00' }],
            wednesday: [{ start: '09:00:00', end: '17:00:00' }],
            thursday:  [{ start: '09:00:00', end: '17:00:00' }],
            friday:    [{ start: '09:00:00', end: '17:00:00' }]
          }
        }
        this.updateAvailability(id, defaultAvailability);
        this.providersSubject.next([...this.providersSubject.getValue(), data]);
        this.snackBar.open('Provider created', 'Close', { duration: 3000 });
        
      },
      error: (error) => {
        console.error('Error creating provider:', error);
        this.snackBar.open('Error creating provider', 'Close', { duration: 3000 });
        return null;
      }
    })
    return of(id);
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
    console.log('Deleting provider:', id);
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
