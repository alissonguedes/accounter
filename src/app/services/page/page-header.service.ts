import { Injectable, signal, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PageHeaderService {

	header = signal<TemplateRef<any> | null>(null);

	constructor() { }

	setHeader(header: TemplateRef<any>) {
		this.header.set(header);
	}

	clearHeader() {
		this.header.set(null);
	}

}
