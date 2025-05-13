import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  confirmPasswordValidator,
  checkEmailExists,
} from '../../../app.config';
import { Form } from '../../../shared/form';
import { toast } from '../../../shared/toast';
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
  form = this.fb.group(
    {
      name: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.email],
        [checkEmailExists()],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]],
    },
    {
      validators: confirmPasswordValidator('password', 'password_confirmation'),
    }
  );

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  submitForm() {
    if (this.form.valid) {
      this.disable();
      this.preloaderService.show('login-spinner');

      this.auth.cadastro(this.getValues()).subscribe(
        (response: any) => {
          toast(response.message);
          this.router.navigate(['/login']);
        },
        (error: any) => {
          toast(error.error.message);
        }
      );
    }

    return '';
  }
}
