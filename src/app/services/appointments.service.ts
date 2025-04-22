import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  private baseUrl = 'http://localhost:8083';

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

  bookAppointment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointments`, data);
  }
}
