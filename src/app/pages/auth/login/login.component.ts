import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { Form } from '../../../shared/form';
import { toast } from '../../../shared/toast';
import { TokenService } from '../../../services/auth/token.service';
import { AuthService } from '../../../services/auth/auth.service';
import { PreloaderComponent } from '../../../services/preloader/preloader/preloader.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, PreloaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent extends Form implements OnInit {
  router = inject(Router);
  auth = inject(AuthService);
  token = inject(TokenService);
  form = this.fb.group({
    email: [
      'alissonguedes87@gmail.com',
      [Validators.required, Validators.email],
    ],
    password: ['2EZgxw7GoQZlu7s', [Validators.required]],
  });

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['dashboard']);
    }
  }

  submitForm() {
    if (this.form.valid) {
      this.disable();
      this.preloaderService.show('login-spinner');

      this.auth.login(this.getValues()).subscribe(
        (response: any) => {
          //   this.preloaderService.hide('login-spinner');
          //   this.enable();
          let user = response.user;
          console.log(user, user.id);
          localStorage.setItem('id', user.id);
          localStorage.setItem('username', user.name);
          localStorage.setItem('email', user.email);
          this.token.setToken(response.access_token);
          location.href = 'dashboard';
        },
        (error: any) => {
          this.preloaderService.hide('login-spinner');
          this.enable();
          toast(error.error.message);
        }
      );
    }
    return true;
  }
}
