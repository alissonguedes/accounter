import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appMask]',
})
export class MaskDirective implements OnInit, OnChanges {
  @Input('appMask') maskType!: string;
  @Input() dataOnevent!: string;

  private inputElement: HTMLInputElement;

  constructor(private el: ElementRef) {
    this.inputElement = this.el.nativeElement;
  }

  ngOnInit() {
    this.initializeMask();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['maskType'] || changes['dataOnevent']) {
      // Re-initialize if mask type or event changes
      this.initializeMask();
    }
  }

  private initializeMask() {
    if (!this.inputElement || !this.maskType) {
      return;
    }

    const definedMaxLength: number | null =
      Mask.maxlength[this.maskType as keyof typeof Mask.maxlength];

    if (definedMaxLength !== null && definedMaxLength !== undefined)
      this.inputElement.setAttribute('maxlength', String(definedMaxLength));

    const placeholder = this.inputElement.getAttribute('placeholder');

    if (placeholder) {
      const parentInputField = this.inputElement.closest('.input-field');
      if (parentInputField) {
        const label = parentInputField.querySelector('label');
        if (label) label.classList.add('active');
      }
    }

    this.inputElement.removeEventListener('keydown', this.handleEvent);
    this.inputElement.removeEventListener('keyup', this.handleEvent);
    this.inputElement.removeEventListener('keypress', this.handleEvent);
    this.inputElement.removeEventListener('focus', this.handleDecimalFocusBlur);
    this.inputElement.removeEventListener('blur', this.handleDecimalFocusBlur);

    if (this.maskType === 'decimal') {
      decimal(this.inputElement);
    } else {
      const events = (this.dataOnevent || 'keyup keypress keydown').split(' ');
      events.forEach((eventType) => {
        this.inputElement.addEventListener(eventType, this.handleEvent);
      });
    }

    ['keypress', 'keyup', 'keydown'].forEach((eventType) => {
      this.inputElement.addEventListener(eventType, this.handleValidationEvent);
    });
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    // Angular handles model updates via ngModel or reactive forms,
    // so ensure the underlying value is updated.
    // The Mask.exec and decimal functions already modify inputElement.value
    // and dispatch an 'input' event, which Angular listens to.
  }

  @HostListener('blur')
  onBlur() {
    // In case of decimal, the decimal function handles blur.
    // For other masks, if a final format adjustment is needed on blur, add it here.
    if (this.maskType !== 'decimal' && this.inputElement.value) {
      Mask.exec(this.inputElement, this.maskType);
    }
    this.handleValidationEvent(); // Validate on blur as well
  }

  private handleEvent = (event: Event) => {
    Mask.exec(this.inputElement, this.maskType);
  };

  private handleValidationEvent = () => {
    // const parentInputField = this.inputElement.closest('.input-field');
    // if (parentInputField) {
    //   parentInputField.classList.remove('error');
    //   const existingErrorDiv = parentInputField.querySelector('.error-message');
    //   if (existingErrorDiv) {
    //     existingErrorDiv.remove();
    //   }
    //   const formatRegex = 'teste';
    //   // const formatRegex: number | any = Mask.format[this.maskType];
    //   //   console.log(Mask.format['decimal']);
    //   if (
    //   !  this.inputElement.value // &&
    //     //     formatRegex &&
    //     //     !formatRegex.test(this.inputElement.value)
    //   ) {
    //     parentInputField.classList.add('error');
    //     const errorDiv = document.createElement('div');
    //     errorDiv.className = 'error-message';
    //     errorDiv.textContent = 'Formato inválido.';
    //     parentInputField.appendChild(errorDiv);
    //   }
    //   if (!this.inputElement.value) {
    //     parentInputField.classList.remove('error');
    //     const existingErrorDiv =
    //       parentInputField.querySelector('.error-message');
    //     if (existingErrorDiv) {
    //       existingErrorDiv.remove();
    //     }
    //   }
    // }
  };

  // If the decimal function specifically attaches blur, you might need to handle it or re-attach
  private handleDecimalFocusBlur = () => {
    // This function is generally handled within the `decimal` function now
    // But if you had a separate blur for non-decimal masks, you'd add it here.
    if (this.maskType !== 'decimal' && this.inputElement.value) {
      Mask.exec(this.inputElement, this.maskType);
    }
    this.handleValidationEvent();
  };
}
