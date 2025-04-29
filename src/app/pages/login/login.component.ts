import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { TokenService } from '../../services/auth/token.service';

declare const M: any;
declare const document: any;

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
})
export class LoginComponent {
	loginForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private token: TokenService,
		private router: Router
	) {

		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
		});

		if (this.authService.isAuthenticated()) {
			this.router.navigate(['/dashboard']);
		}
	}

	onSubmit(): void {

		if (this.loginForm.valid) {

			const { email, password } = this.loginForm.value;
			const btn_login = document.querySelector('#btn-login');
			const preloader = document.querySelector('#preloader-login');
			const inputs = document.querySelectorAll('input');

			preloader.style.display = 'flex';
			btn_login.disabled = true;
			inputs.forEach((el: any) => {
				el.disabled = true;
			});

			this.authService.login(email, password).subscribe(

				(response) => {

					if (response.authorized) {
						this.token.setToken(response.access_token);
						location.href = '/dashboard';
						// this.router.navigate(['/dashboard']);
					} else {
						M.toast('Erro de autenticação');
					}

				},

				(error) => {

					preloader.style.display = 'none';
					btn_login.disabled = false;
					inputs.forEach((el: any) => {
						el.disabled = false;
					});

					M.toast({ html: `Usuário ou senha incorretos!` });
					alert(`${error.status} - ${error.statusText}`);
					console.log(error);

				}
			);
		} else {
			this.loginForm.markAllAsTouched();
		}
	}

}
