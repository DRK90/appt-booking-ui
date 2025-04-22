import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private baseUrl = environment.apiUrls.customers + '/customers';

  private customersSubject: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>([]);
  public customers$: Observable<Customer[]> = this.customersSubject.asObservable();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { 
    this.fetchCustomers();
  }

  async fetchCustomers(): Promise<void> {
    this.http.get<Customer[]>(`${this.baseUrl}`).subscribe({
      next: (data) => this.customersSubject.next(data),
      error: (error) => console.error('Error fetching customers:', error)
    })
  }

  createCustomer(customer: Customer): void {
    this.http.post<Customer>(`${this.baseUrl}`, customer).subscribe({
      next: (data) => {
        this.customersSubject.next([...this.customersSubject.getValue(), data]);
        this.snackBar.open('Customer created', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error creating customer:', error);
        this.snackBar.open('Error creating customer', 'Close', { duration: 3000 });
      }
    })
  }

  updateCustomer(customer: Customer): void {
    this.http.put<Customer>(`${this.baseUrl}/${customer.id}`, customer).subscribe({
      next: (data) => {
        this.customersSubject.next([...this.customersSubject.getValue().map(c => c.id === customer.id ? data : c)]);
        this.snackBar.open('Customer updated', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating customer:', error);
        this.snackBar.open('Error updating customer', 'Close', { duration: 3000 });
      }
    })
  }

  deleteCustomer(customer: Customer): void {
    this.http.delete<Customer>(`${this.baseUrl}/${customer.id}`).subscribe({
      next: () => this.customersSubject.next(this.customersSubject.getValue().filter(c => c.id !== customer.id)),
      error: (error) => {
        console.error('Error deleting customer:', error);
        this.snackBar.open('Error deleting customer', 'Close', { duration: 3000 });
      }
    })
  }
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}