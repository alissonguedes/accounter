import { Directive, Input, OnInit } from '@angular/core';
import { TitleService } from '../../services/title/title.service';

@Directive({
	selector: '[ngTitle]',
	standalone: true
})
export class TitleDirective implements OnInit {

	@Input('ngTitle') title: string = '';

	constructor(private titleService: TitleService) { }

	ngOnInit(): void {
		this.titleService.setTitle(this.title);
	}

}
