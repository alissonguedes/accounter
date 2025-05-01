import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CategoriaService } from './categoria.service';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../../app.component';
import { PreloaderService } from '../../../services/preloader/preloader.service';
import { CategoriaForm } from './categoria-form';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

declare const M: any;
declare const document: any;

@Component({
	selector: 'app-categorias',
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './categorias.component.html',
	styleUrl: './categorias.component.css',
})
export class CategoriasComponent implements OnInit {

	public categorias: any = [];
	protected searchControl: any;

	constructor(
		protected app: AppComponent,
		protected categoriaForm: CategoriaForm,
		private categoriaService: CategoriaService,
		protected preloaderService: PreloaderService
	) {

		this.categoriaForm.init();

	}

	ngOnInit(): void {
		this.categoriaService.getCategorias().subscribe(
			result => {
				this.categorias = result;
			}
		);
		this.categoriaForm.search(() => { alert('teste') });
	}

	openModal(id?: number) {
		let modalCategoria = document.querySelector('#modal-categoria');
		let modalOptions = {
			dismissible: false,
			onOpenStart: () => {
				if (id) {
					this.categoriaForm.edit(id);
				}
			},
			onOpenEnd: () => {
				if (!id) {
					this.categoriaForm.enable();
				}
			},
			onCloseEnd: () => {
				this.categoriaForm.reset();
			}
		}
		let modal = M.Modal.init(modalCategoria, modalOptions);
		modal.open();
	}

	save() {

	}

	// private pesquisar(valor: string) {
	// 	return this.categoriaService.getCategorias(valor).subscribe(
	// 		results => {
	// 			console.log(results);
	// 			this.preloaderService.hide();
	// 		}
	// 	);
	// }

}
