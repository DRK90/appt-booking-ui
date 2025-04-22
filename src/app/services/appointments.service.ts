import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  private baseUrl = environment.apiUrls.appointments; //https://appointments-service-ianfiofulq-uc.a.run.app/appointments

  constructor(private http: HttpClient) {}

  getAvailableSlots(providerId: string, appointmentTypeId: string, startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/available-slots`, {
      params: {
        provider_id: providerId,
        appointment_type_id: appointmentTypeId,
        start_date: startDate,
        end_date: endDate
      }
    });
  }

  getAppointments(providerId?: string, customerId?: string): Observable<Appointment[]> {
    const params: any = {
      start_date: new Date().toISOString()  // always include today's date
    };
  
    if (providerId) {
      params.provider_id = providerId;
    }
    if (customerId) {
      params.customer_id = customerId;
    }
  
    return this.http.get<Appointment[]>(`${this.baseUrl}`, { params });
  }
  

  bookAppointment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }
}

export interface Appointment {
  id: string;
  provider_id: string;
  customer_id: string;
  appointment_type_id: string;
  start_time: string;  // ISO 8601 string (e.g., "2024-07-12T14:30:00Z")
  end_time: string;    // ISO 8601 string
  status: 'scheduled' | 'cancelled' | 'completed' | 'no_show';
  notes?: string;
  created_at: string;  // ISO timestamp
  updated_at: string;  // ISO timestamp
}
