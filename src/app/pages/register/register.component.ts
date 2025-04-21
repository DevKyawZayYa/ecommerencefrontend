import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';
import { ValidationService } from '../../core/services/validation.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(ValidationService.emailPattern)]],
      password: ['', [Validators.required, Validators.minLength(8), ValidationService.passwordValidator()]],
      confirmPassword: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      mobileCode: ['+60', [Validators.required]],
      mobileNumber: ['', [Validators.required, ValidationService.phoneNumberValidator()]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      region: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      postalCode: ['', [Validators.required, ValidationService.postalCodeValidator()]],
      country: ['Malaysia', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.hasError('noUpperCase')) return 'Password must contain at least one uppercase letter';
    if (control?.hasError('noLowerCase')) return 'Password must contain at least one lowercase letter';
    if (control?.hasError('noNumeric')) return 'Password must contain at least one number';
    if (control?.hasError('noSpecialChar')) return 'Password must contain at least one special character';
    if (control?.hasError('invalidPhone')) return 'Please enter a valid phone number';
    if (control?.hasError('invalidPostalCode')) return 'Please enter a valid postal code';
    return ValidationService.getErrorMessage(control!);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formData = this.registerForm.value;
      
      // Remove confirmPassword from the request
      const { confirmPassword, ...registerData } = formData;
      
      this.authService.register(registerData).subscribe({
        next: (response: string) => {
          console.log('Registration successful:', response);
          this.toast.success(response || 'Registration successful! Please login.');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.toast.error(error?.error || error?.message || 'Registration failed');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
      this.toast.error('Please correct the errors in the form');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}