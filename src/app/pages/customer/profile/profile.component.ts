import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer/customer.service';
import { Customer } from '../../../models/customer.model';
import { CommonModule, DatePipe } from '@angular/common';
import { AccountSidebarComponent } from '../components/account-sidebar/account-sidebar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AccountSidebarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [DatePipe]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  createdDate: string = '';
  lastLogin: string = '';
  userId: string = ''; // Will be populated from /me endpoint

  editMode = {
    name: false,
    email: false,
    phone: false,
    dob: false
  };

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      id: [''],
      firstName: [''],
      lastName: [''],
      email: [''],
      gender: ['Male'],
      dob: [''],
      mobileCode: [''],
      mobileNumber: [''],
      address: [''],
      city: [''],
      region: [''],
      postalCode: [''],
      country: [''],
      role: ['']
    });

    this.loadCustomer();
  }

  loadCustomer(): void {
    this.customerService.getMyProfile().subscribe((data: Customer) => {
      this.userId = data.id?.value; // ✅ this is string now

      this.profileForm.patchValue({
        id: this.userId,
        firstName: data.firstName?.value,
        lastName: data.lastName?.value,
        email: data.email,
        gender: data.gender || 'Male',
        dob: data.dob || '',
        mobileCode: data.mobileCode,
        mobileNumber: data.mobileNumber,
        address: data.address,
        city: data.city,
        region: data.region,
        postalCode: data.postalCode,
        country: data.country,
        role: data.role
      });

      this.createdDate = this.datePipe.transform(data.createdDate, 'MMM d, y, h:mm a') || '';
      this.lastLogin = this.datePipe.transform(data.lastLoginDate, 'MMM d, y, h:mm a') || '';
    });
  }

  onSave(): void {
    if (!this.profileForm.valid) return;

    const formData = this.profileForm.value;

    this.userId = formData.id; // ✅ FIXED: no ".value"

    const updatePayload = {
      id: { value: this.userId },
      firstName: { value: formData.firstName },
      lastName: { value: formData.lastName },
      email: formData.email,
      mobileCode: formData.mobileCode,
      mobileNumber: formData.mobileNumber,
      dob: formData.dob,
      gender: formData.gender,
      address: formData.address,
      city: formData.city,
      region: formData.region,
      postalCode: formData.postalCode,
      country: formData.country,
      isActive: true,
      role: 'Customer',
      lastLoginDate: new Date().toISOString()
    };

    this.customerService.updateCustomer(this.userId, updatePayload).subscribe({
      next: () => {
        alert('Profile updated successfully ✅');
        this.profileForm.markAsPristine(); // ✅ clear dirty
        this.editMode = {
          name: false,
          email: false,
          phone: false,
          dob: false
        };
      },
      error: (err) => {
        console.error('❌ Update failed:', err);
        alert('Something went wrong ❌');
      }
    });
  }
}
