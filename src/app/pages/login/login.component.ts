import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  userName: FormControl = new FormControl();

  password: FormControl = new FormControl();

  router = inject(Router);

  onLogin() {
    debugger;
    if(this.userName.value === 'admin' && this.password.value === '2233')
    {
      this.router.navigate(['/dashboard']);
    }
    else
    {
      alert('Invalid Credentials');
    }
  }
}
