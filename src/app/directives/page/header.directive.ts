import { Directive, Input, OnInit, TemplateRef } from '@angular/core';
import { PageHeaderService } from '../../services/page/page-header.service';

@Directive({
  selector: '[ngHeader]',
})
export class HeaderDirective implements OnInit {
  @Input('ngHeader') header: string = '';

  constructor(
    private headerService: PageHeaderService,
    private template: TemplateRef<any>
  ) {}

  ngOnInit(): void {
    this.headerService.setHeader(this.template);
  }
}
