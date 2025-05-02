import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { TokenService } from '../../../services/auth/token.service';

declare const M: any;
declare const document: any;

export function confirmPasswordValidator(controlName: string, matchingControlName: string): ValidatorFn {
	return (controls: AbstractControl): ValidationErrors | null => {
		const control = controls.get(controlName);
		const matchingControl = controls.get(matchingControlName);

		if (!control || !matchingControl) return null;

		if (matchingControl.errors && !matchingControl.errors['confirmPasswordMismatch']) {
			return null;
		}

		if (control.value !== matchingControl.value) {
			matchingControl.setErrors({ confirmPasswordMismatch: true });
			return { confirmPasswordMismatch: true };
		} else {
			matchingControl.setErrors(null);
			return null;
		}
	};
}

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, RouterLink, ReactiveFormsModule],
	templateUrl: './cadastro.component.html',
	styleUrl: '../login/login.component.css',
})
export class CadastroComponent {
	signinForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private token: TokenService,
		private router: Router
	) {

		this.signinForm = this.fb.group({
			name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			confirmPassword: ['', [Validators.required]]
		}, {
			validators: confirmPasswordValidator('password', 'confirmPassword')
		});

		if (this.authService.isAuthenticated()) {
			this.router.navigate(['/dashboard']);
		}
	}

	onSubmit(): void {

		if (this.signinForm.valid) {

			const { name, email, password, confirmPassword } = this.signinForm.value;
			const btn_login = document.querySelector('#btn-login');
			const preloader = document.querySelector('#preloader-login');
			const inputs = document.querySelectorAll('input');

			preloader.style.display = 'flex';
			btn_login.disabled = true;
			inputs.forEach((el: any) => {
				el.disabled = true;
			});

			this.authService.cadastro(name, email, password, confirmPassword).subscribe(

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
			this.signinForm.markAllAsTouched();
		}
	}

}
