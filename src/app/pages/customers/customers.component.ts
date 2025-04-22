import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material-module.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService, Customer } from '../../services/customers.service';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-customers',
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  form: FormGroup;
  customers: Customer[] = []; 

  constructor(
    private fb: FormBuilder,
    private customerService: CustomersService
  ) {
    this.form = this.fb.group({
      selectedCustomer: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    });

    // Sort alphabetically by name
    this.customerService.customers$.subscribe(customers => {
      this.customers = customers;
    });
  }

  ngOnInit(): void {
    // Whenever selection changes, patch form
    this.form.get('selectedCustomer')!.
    valueChanges.pipe(
      filter((id: string) => !!id)   // only non‑empty ids
    )
    .subscribe(id => {
      const cust = this.customers.find(c => c.id === id)!;
      this.form.patchValue({
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        address: cust.address
      });
    });
  }


  

  submit(): void {
    if (this.form.invalid) return;

    const { selectedCustomer, name, email, phone, address } = this.form.value;
    const payload = { name, email, phone, address };

    if (selectedCustomer) {
      this.customerService.updateCustomer({ id: selectedCustomer, ...payload });
    } else {
      this.customerService.createCustomer(payload as any);
    }

    // Reset after operation
    this.form.patchValue({
      selectedCustomer: '',
      name: '',
      email: '',
      phone: '',
      address: ''
    });
    console.log('form', this.form.value);
  }

  delete(): void {
    const id = this.form.value.selectedCustomer;
    if (id) {
      this.customerService.deleteCustomer({ id } as any);
      this.form.patchValue({
        selectedCustomer: '',
        name: '',
        email: '',
        phone: '',
        address: ''
      });
    }
  }
}
  
  
