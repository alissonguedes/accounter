import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';

@Injectable({
	providedIn: 'root'
})
export class CategoriaService {

	private id: any;
	private id_parent: any;
	private titulo: any;
	private imagem: any;
	private color: any;
	private text_color: any;
	private ordem: any;

	constructor(private http: HttpService) { }

	getCategorias(search?: string) {
		let find = null;
		if (search) {
			find = {
				search: search
			}
		}
		return this.http.get('categorias', find);
	}

	getCategoria(id: number) {
		return this.http.get('categorias', {
			id: id
		});
	}

	setId(id: number) {
		this.id = id;
	}

	getId() {
		return this.id;
	}

	setTitulo(titulo: string) {
		this.titulo = titulo;
	}

	getTitulo() {
		return this.titulo;
	}

	setIdParent(id: number) {
		this.id_parent = id;
	}

	getIdParent() {
		return this.id_parent;
	}

	setImagem(imagem: string) {
		this.imagem = imagem;
	}

	getImagem() {
		return this.imagem;
	}

	setColor(color: string) {
		this.color = color;
	}

	getColor() {
		return this.color;
	}

	setTextColor(color: string) {
		this.text_color = color;
	}

	getTextColor() {
		return this.text_color;
	}

	setOrdem(ordem: number) {
		this.ordem = ordem;
	}

	getOrdem() {
		return this.ordem;
	}

}
