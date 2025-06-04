import { Directive, Input, OnInit, TemplateRef } from '@angular/core';
import { TitleService } from '../../services/title/title.service';

@Directive({
  selector: '[ngTitle]',
  standalone: true,
})
export class TitleDirective implements OnInit {
  @Input('ngTitle') title: string = '';

  constructor(
    private titleService: TitleService,
    private template: TemplateRef<any>
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.template);
  }
}
