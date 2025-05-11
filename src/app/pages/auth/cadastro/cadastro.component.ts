import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Form } from '../../../shared/form';
import { AuthService } from '../../../services/auth/auth.service';
import { PreloaderComponent } from '../../../services/preloader/preloader/preloader.component';

@Component({
  selector: 'app-cadastro',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, PreloaderComponent],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css',
})
export class CadastroComponent extends Form implements OnInit {
  router = inject(Router);
  auth = inject(AuthService);
  // token = inject(TokenService);
  form = this.fb.group({
    name: ['Alisson', [Validators.required]],
    email: ['alissonguedes87@gmail.com', [Validators.required]],
    password: [
      '2EZgxw7GoQZlu7s',
      [Validators.required, Validators.minLength(6)],
    ],
    passowrd_confirmation: ['2EZgxw7GoQZlu7s', [Validators.required]],
  });

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  submitForm() {
    if (this.form.valid) {
      this.disable();
      this.preloaderService.show('login-spinner');
    }
    return '';
  }
}
