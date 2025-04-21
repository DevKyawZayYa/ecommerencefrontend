import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../../services/customer/customer.service';
import { Customer } from '../../../models/customer.model';
import { CommonModule, DatePipe } from '@angular/common';
import { AccountSidebarComponent } from '../components/account-sidebar/account-sidebar.component';
import { ValidationService } from '../../../core/services/validation.service';
import { ToastrService } from 'ngx-toastr';

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
  userId: string = '';

  editMode = {
    name: false,
    email: false,
    phone: false,
    dob: false
  };

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private datePipe: DatePipe,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCustomer();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      id: [''],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(ValidationService.emailPattern)]],
      gender: ['Male'],
      dob: [''],
      mobileCode: ['+60', [Validators.required]],
      mobileNumber: ['', [Validators.required, ValidationService.phoneNumberValidator()]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      region: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      postalCode: ['', [Validators.required, ValidationService.postalCodeValidator()]],
      country: ['Malaysia', [Validators.required]],
      role: ['']
    });
  }

  loadCustomer(): void {
    this.customerService.getMyProfile().subscribe({
      next: (data: Customer) => {
        this.userId = data.id?.value;

        this.profileForm.patchValue({
          id: this.userId,
          firstName: data.firstName?.value || '',
          lastName: data.lastName?.value || '',
          email: data.email,
          gender: data.gender || 'Male',
          dob: data.dob || '',
          mobileCode: data.mobileCode || '+60',
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
      },
      error: (error) => {
        console.error('Failed to load profile:', error);
        this.toast.error('Failed to load profile data');
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName);
    if (!control) return '';
    
    if (control.hasError('invalidPhone')) return 'Please enter a valid phone number';
    if (control.hasError('invalidPostalCode')) return 'Please enter a valid postal code';
    return ValidationService.getErrorMessage(control);
  }

  onSave(): void {
    if (!this.profileForm.valid) {
      this.markFormGroupTouched(this.profileForm);
      this.toast.error('Please correct the errors in the form');
      return;
    }

    const formData = this.profileForm.value;
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
        this.toast.success('Profile updated successfully');
        this.profileForm.markAsPristine();
        this.resetEditMode();
        this.loadCustomer(); // Reload the data to ensure we have the latest
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.toast.error('Failed to update profile');
      }
    });
  }

  private resetEditMode(): void {
    this.editMode = {
      name: false,
      email: false,
      phone: false,
      dob: false
    };
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancelEdit(field: keyof typeof this.editMode): void {
    this.editMode[field] = false;
    this.loadCustomer(); // Reset to original values
  }
}
