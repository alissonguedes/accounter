import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PacientesService } from "./pacientes.service";
import { Observable } from "rxjs";

declare const M: any;
declare const document: any;

@Injectable({
	providedIn: 'root'
})
export class PacienteFormService {

	formulario: FormGroup;

	constructor(private fb: FormBuilder, private paciente: PacientesService) {

		this.formulario = this.createForm();

	}

	public enableFields() {
		let fieldsDisable = this.formulario;
		let controls = fieldsDisable.controls;
		for (let key of Object.keys(controls)) {
			let control = this.formulario.get(key);
			// console.log(`Campo: ${key}`, `Valor: ${control?.value}`, `Disabled: ${control?.disabled} `);
		}
		// this.formulario.enable();
		// this.formulario.disable();
	}

	public edit(id: number): any {

		return this.paciente.getPaciente(id).subscribe((dados: any) => {

			let dataNascimento = dados.dataNascimento.split('-');
			let data = new Date(dataNascimento[0], dataNascimento[1] - 1, dataNascimento[2]);

			this.paciente.setNome = dados.nome;
			this.paciente.setCpf = dados.cpf;
			this.paciente.setRg = dados.rg;
			this.paciente.setCodigo = dados.id;
			this.paciente.setDataNascimento = data.toLocaleDateString('pt-br');

			let pacienteDados = {
				'nome': this.paciente.getNome,
				'cpf': this.paciente.getCpf,
				'rg': this.paciente.getRg,
				'codigo': this.paciente.getCodigo,
				'data-nascimento': this.paciente.getDataNascimento
			}

			this.formulario.setValue(pacienteDados);
			this.formulario.enable();

			document.querySelector('#modal-pacientes').classList.remove('loading');
			document.querySelector('#modal-pacientes #preloader-modal').style.display = 'none';

		})

	}

	createForm(paciente?: Partial<PacientesService>): FormGroup {

		return this.fb.group({
			'nome': [{ value: '', disabled: true }, [Validators.required]],
			'cpf': [{ value: '', disabled: true }, [Validators.required]],
			'rg': [{ value: '', disabled: true }],
			'data-nascimento': [{ value: '', disabled: true }],
			'codigo': [{ value: '', disabled: true }]
		});

	}

	// getNomeFormMessage(form: FormGroup): string | null {
	// 	const nome = form.get('nome');
	// 	if (nome?.hasError('required')) return 'Informe o nome do paciente';
	// 	return null;
	// }

	// getCpfErrorMessage(form: FormGroup): string | null {
	// 	const pwd = form.get('cpf');
	// 	if (pwd?.hasError('required')) return 'CPF é obrigatório';
	// 	// if (pwd?.hasError('minlength')) return 'Mínimo de 6 caracteres';
	// 	return null;
	// }

}
