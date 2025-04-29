import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Injectable({
	providedIn: 'root'
})
export class PacientesService {

	private nome: any;
	private cpf: any;
	private rg: any;
	private codigo: any;
	private dataNascimento: any;

	constructor(private http: HttpService) { }

	getPacientes() {
		return this.http.get('users');
	}

	getPaciente(id: number) {
		return this.http.get('users', {
			id: id
		});
	}

	set setNome(nome: string) {
		this.nome = nome;
	}

	get getNome() {
		return this.nome;
	}

	set setCpf(cpf: string) {
		this.cpf = cpf;
	}

	get getCpf() {
		return this.cpf;
	}

	set setRg(rg: string) {
		this.rg = rg;
	}

	get getRg() {
		return this.rg;
	}

	set setCodigo(codigo: string) {
		this.codigo = codigo;
	}

	get getCodigo() {
		return this.codigo;
	}

	set setDataNascimento(dataNascimento: string) {
		this.dataNascimento = dataNascimento;
	}

	get getDataNascimento() {
		return this.dataNascimento;
	}

}
