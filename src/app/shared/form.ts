import { inject, Injectable } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { PreloaderService } from "../services/preloader/preloader.service";

declare const M: any;
declare const document: any;

@Injectable({
	providedIn: 'root'
})

export abstract class Form {

	private form!: FormGroup;
	protected fb = inject(FormBuilder);
	public searchControl = new FormControl();

	constructor(protected preloaderService: PreloaderService) { }

	protected abstract fields(): {
		[key: string]: any;
	}

	public init(): void {
		this.preloaderService.show();
		this.form = this.fb.group(this.fields());
	}

	public getForm() {
		return this.form;
	}

	public setValues(values: object): void {
		this.form.setValue(values);
	}

	public reset(): void {
		this.form.reset();
	}

	public enable(): void {
		let select = document.querySelector('select');
		M.FormSelect.init(select);
		document.querySelector('#modal-categoria').classList.remove('loading');
		document.querySelector('#preloader-modal').style.display = 'none';
		this.form.enable();
	}

	public disable(): void {
		document.querySelector('#modal-categoria').classList.add('loading');
		document.querySelector('#preloader-modal').style.display = 'flex';
		this.form.disable();
	}

}
