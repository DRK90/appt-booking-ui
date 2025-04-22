import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({ providedIn: 'root' })
export class AppointmentTypesService {
  private baseUrl = '/api/appointment-types';

  private appointmentTypesSubject: BehaviorSubject<AppointmentType[]> = new BehaviorSubject<AppointmentType[]>([]);
  public appointmentTypes$: Observable<AppointmentType[]> = this.appointmentTypesSubject.asObservable();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.fetchAppointmentTypes();
  }

  async fetchAppointmentTypes(): Promise<void> {    
    this.http.get<AppointmentType[]>(`${this.baseUrl}/appointment-types`).subscribe({
      next: (data) => this.appointmentTypesSubject.next(data),
      error: (error) => console.error('Error fetching appointment types:', error)
    })
  }

  postAppointmentType(appointmentType: AppointmentType): void {
    this.http.post<AppointmentType>(`${this.baseUrl}/appointment-types`, appointmentType).subscribe({
      next: (data) => {
        this.appointmentTypesSubject.next([...this.appointmentTypesSubject.getValue(), data]);
        this.snackBar.open('Appointment type created', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error creating appointment type:', error);
        this.snackBar.open('Error creating appointment type', 'Close', { duration: 3000 });
      }
    })
  }

  updateAppointmentType(appointmentType: AppointmentType): void {
    this.http.put<AppointmentType>(`${this.baseUrl}/appointment-types/${appointmentType.id}`, appointmentType).subscribe({
      next: (data) => {
        this.appointmentTypesSubject.next(this.appointmentTypesSubject.getValue().map(type => type.id === appointmentType.id ? data : type));
        this.snackBar.open('Appointment type updated', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating appointment type:', error);
        this.snackBar.open('Error updating appointment type', 'Close', { duration: 3000 });
      }
    })
  }

  deleteAppointmentType(appointmentType: AppointmentType): void {
    this.http.delete<AppointmentType>(`${this.baseUrl}/appointment-types/${appointmentType.id}`).subscribe({
      next: () => {
        this.appointmentTypesSubject.next(this.appointmentTypesSubject.getValue().filter(type => type.id !== appointmentType.id));
        this.snackBar.open('Appointment type deleted', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error deleting appointment type:', error);
        this.snackBar.open('Error deleting appointment type', 'Close', { duration: 3000 });
      }
    })
  }

  getAppointmentTypeById(id: string): AppointmentType | undefined {
    return this.appointmentTypesSubject.getValue().find(type => type.id === id);
  }
}

export interface AppointmentType {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  color?: string; // Optional property
}