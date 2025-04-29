import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
declare const document: any;

@Injectable({
	providedIn: 'root'
})
export class TitleService {

	private documentTitle = 'Accounter :: Controle Financeiro';
	private titleSubject = new BehaviorSubject<string>('');
	title$ = this.titleSubject.asObservable();

	setTitle(title: string) {
		setTimeout(() => {
			this.titleSubject.next(title);
			document.querySelector('title').innerText = `${this.documentTitle} | ${title}`;
		});
	}

}
