import { inject, Injectable } from "@angular/core";
import { Validators } from "@angular/forms";
import { CategoriaService } from "./categoria.service";
import { Form } from "../../../shared/form";

declare const M: any;
declare const document: any;

@Injectable({
	providedIn: 'root'
})
export class CategoriaForm extends Form {

	private categoriaService = inject(CategoriaService);

	protected fields() {
		return {
			id: [{ value: '', disabled: true, }, [Validators.required]],
			id_parent: [{ value: '', disabled: true, }, [Validators.required]],
			titulo: [{ value: '', disabled: true, }, [Validators.required]],
			titulo_slug: [{ value: '', disabled: true, }, [Validators.required]],
			descricao: [{ value: '', disabled: true, }],
			status: [{ value: '', disabled: true, }],
			ordem: [],
			imagem: [],
			color: [],
			text_color: [],
		}
	}

	public edit(id: number) {
		this.disable();
		return this.categoriaService.getCategoria(id).subscribe(
			(dados: any) => {
				let fields = {
					'id': dados.id,
					'titulo': dados.titulo,
					'id_parent': dados.id_parent,
					'titulo_slug': dados.titulo_slug,
					'descricao': dados.descricao,
					'status': dados.status,
					'ordem': dados.ordem,
					'imagem': dados.imagem,
					'color': dados.color,
					'text_color': dados.text_color
				}
				this.setValues(fields);
				this.enable();
				// let select = document.querySelectorAll('select');
				// M.FormSelect.init(select);
			}
		);
	}

}
