import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ValidationService } from '../../core/services/validation.service';

interface ApiResponse {
  message: string;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  isLoading = false;
  errorMessage: string = '';
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        ValidationService.passwordValidator()
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { 'passwordMismatch': true };
  }

  getErrorMessage(controlName: string): string {
    const control = this.changePasswordForm.get(controlName);
    
    if (controlName === 'confirmPassword' && this.changePasswordForm.errors?.['passwordMismatch']) {
      return 'Passwords do not match';
    }
    
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    
    if (control?.hasError('minlength')) {
      return 'Password must be at least 8 characters long';
    }
    
    if (control?.hasError('noUpperCase')) {
      return 'Password must contain at least one uppercase letter';
    }
    
    if (control?.hasError('noLowerCase')) {
      return 'Password must contain at least one lowercase letter';
    }
    
    if (control?.hasError('noNumeric')) {
      return 'Password must contain at least one number';
    }
    
    if (control?.hasError('noSpecialChar')) {
      return 'Password must contain at least one special character';
    }
    
    return '';
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  clearError() {
    this.errorMessage = '';
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { currentPassword, newPassword } = this.changePasswordForm.value;

      this.authService.changePassword(currentPassword, newPassword).subscribe({
        next: (response: string | ApiResponse) => {
          const message = typeof response === 'object' ? response.message : response;
          this.toastr.success(message || 'Password changed successfully');
          this.router.navigate(['/dashboard']);
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error;
          this.toastr.error(error);
          this.isLoading = false;
          this.changePasswordForm.get('currentPassword')?.reset();
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      Object.keys(this.changePasswordForm.controls).forEach(key => {
        const control = this.changePasswordForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
} 