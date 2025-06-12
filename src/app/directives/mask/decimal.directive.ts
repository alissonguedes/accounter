import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appDecimal]',
  standalone: true,
})
export class DecimalDirective implements OnInit {
  @Input('data-align') align: 'left' | 'right' | 'center' = 'right';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    const input = this.el.nativeElement as HTMLInputElement;
    input.placeholder = '0,00';
    this.renderer.addClass(input, `${this.align}-align`);

    if (!input.value || input.value === '0') {
      input.value = '0,00';
    }

    this.renderer.listen(input, 'focus', () => {
      if (!input.value || input.value === '0') {
        input.value = '0,00';
      }
    });

    this.renderer.listen(input, 'blur', () => {
      if (!input.value || input.value === '0') {
        input.value = '0,00';
      }
    });
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    const input = this.el.nativeElement as HTMLInputElement;

    if (
      ['Backspace'].includes(e.key) &&
      (!input.value || input.value === '0,00')
    ) {
      input.value = '0,00';
      e.preventDefault();
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    const input = this.el.nativeElement as HTMLInputElement;

    if (
      ['Backspace'].includes(e.key) &&
      (!input.value || input.value === '0' || input.value === '0,00')
    ) {
      input.value = '0,00';
      e.preventDefault();
      return;
    }

    input.value = this.applyDecimalMask(input.value);
  }

  private applyDecimalMask(value: string): string {
    let raw = value.replace(/\D/g, '');

    if (raw.length === 0) {
      return '0,00';
    }

    while (raw.length < 3) {
      raw = '0' + raw;
    }

    let int = raw.slice(0, raw.length - 2);
    let dec = raw.slice(-2);

    int = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${int},${dec}`;
  }
}
