import { Component, OnInit } from '@angular/core';
import { PacientesService } from './pacientes.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PacienteFormService } from './paciente.module';
import { Router } from '@angular/router';
import { TitleDirective } from '../../directives/title/title.directive';
import { HeaderDirective } from '../../directives/page/header.directive';
import { PreloaderService } from '../../services/preloader/preloader.service';
import { AppComponent } from '../../app.component';

declare const M: any;
declare const document: any;

@Component({
	selector: 'app-pacientes',
	imports: [CommonModule, ReactiveFormsModule, TitleDirective, HeaderDirective],
	templateUrl: './pacientes.component.html',
	styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit {

	form: any;
	private modal_form: string = '';
	protected pacientes: any = [];

	constructor(
		private fb: FormBuilder,
		public app: AppComponent,
		public preloaderService: PreloaderService,
		private pacientesService: PacientesService,
		protected pacienteForm: PacienteFormService,
		protected router: Router,
	) {
		this.form = this.pacienteForm.formulario;
		this.preloaderService.show();
	}

	ngOnInit() {

		let self = this;
		this.modal_form = document.querySelector('.modal');
		// document.querySelector('#preloader').style.display = 'flex';
		// document.querySelector('#progress').style.display = 'flex';

		this.pacientesService.getPacientes().subscribe(
			(data) => {
				this.pacientes = data;
				// self.preloaderService.hide();
				// document.querySelector('#preloader').style.display = 'none';
				// document.querySelector('#progress').style.display = 'none';
			}
		);

	}

	edit(id?: number): void {

		let tabs = document.querySelector('.tabs');
		let tab = M.Tabs.init(tabs);
		let modal = M.Modal.init(this.modal_form, {
			onOpenStart: () => {
				this.form.disable();
				document.querySelector('#modal-pacientes').classList.add('loading');
				document.querySelector('#modal-pacientes #preloader-modal').style.display = 'flex';
			},
			onOpenEnd: () => {
				tab.select('dados-pessoais');
				tab.updateTabIndicator();
				if (id) {
					this.pacienteForm.edit(id);
				} else {
					document.querySelector('#modal-pacientes').classList.remove('loading');
					document.querySelector('#modal-pacientes #preloader-modal').style.display = 'none';
					this.form.enable();
				}
				let d = document.querySelectorAll('[formControlName]');

				let self = this;
				d.forEach((i: any) => {
					i.addEventListener('keyup', function (e: any) {
						self.isFormValid();
					});
				});
			},
			onCloseStart: () => {
				this.form.reset();
			}
		});

		modal.open();

	}

	isFormValid() {

		// d.forEach((a: any) => {
		// 	a.classList.remove('ng-pristine');
		// 	a.classList.remove('ng-invalid');
		// })

		console.log(this.form.valid);
		return this.form.valid;

	}

	save(): void {

		if (this.form.valid) {
			console.log('Login data:', this.form.value);
			alert('Dados salvos com sucesso!');
		} else {
			// this.form.markAllAsTouched();
		}

	}

}
