import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  HostListener,
} from '@angular/core';

declare const Mask: {
  maxlength: {
    cep: number;
    cnpj: number;
    cpf: number;
    date: number;
    email: null;
    time: number;
    phone: number;
    celular: number;
  };
  format: {
    cep: RegExp;
    cnpj: RegExp;
    cpf: RegExp;
    date: RegExp;
    email: RegExp;
    time: RegExp;
    credit_card: RegExp;
  };
  exec: (inputElement: HTMLInputElement, maskType: string) => void;
  masker: {
    isNumeric: (char: string) => boolean;
    numeric: (v: string) => string;
    decimal: (v: string) => string;
    string: (v: string) => string;
    cpf: (v: string) => string;
    cnpj: (v: string) => string;
    cpfcnpj: (v: string) => string;
    date: (v: string) => string;
    time: (v: string) => string;
    phone: (v: string) => string;
    celular: (v: string) => string;
    cep: (v: string) => string;
    email: (v: string) => string;
    credit_card: (v: string) => string;
  };
  init: () => void;
};

declare function decimal(inputElement: HTMLInputElement): void;

@Directive({
  selector: '[appMask]',
})
export class MaskDirective implements OnInit, OnChanges {
  @Input('appMask') maskType!: string;
  @Input() dataOnevent!: string; // Optional: to override default events

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

    const definedMaxLength: number = Mask.maxlength[this.maskType]: number;
    if (definedMaxLength) {
      this.inputElement.setAttribute('maxlength', String(definedMaxLength));
    }

    const placeholder = this.inputElement.getAttribute('placeholder');
    if (placeholder) {
      const parentInputField = this.inputElement.closest('.input-field');
      if (parentInputField) {
        const label = parentInputField.querySelector('label');
        if (label) {
          label.classList.add('active');
        }
      }
    }

    // Clear existing listeners to prevent duplicates if `initializeMask` is called multiple times
    // (This part is tricky with HostListener; consider a cleaner approach for multiple events if needed)
    // For simplicity, direct event listeners are re-added.
    this.inputElement.removeEventListener('keydown', this.handleEvent);
    this.inputElement.removeEventListener('keyup', this.handleEvent);
    this.inputElement.removeEventListener('keypress', this.handleEvent);
    this.inputElement.removeEventListener('focus', this.handleDecimalFocusBlur);
    this.inputElement.removeEventListener('blur', this.handleDecimalFocusBlur);

    if (this.maskType === 'decimal') {
      // Direct call to decimal function, managing its own listeners
      decimal(this.inputElement);
    } else {
      const events = (this.dataOnevent || 'keyup keypress keydown').split(' ');
      events.forEach((eventType) => {
        this.inputElement.addEventListener(eventType, this.handleEvent);
      });
    }

    // Add general validation listeners
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
    const parentInputField = this.inputElement.closest('.input-field');
    if (parentInputField) {
      parentInputField.classList.remove('error');
      const existingErrorDiv = parentInputField.querySelector('.error-message');
      if (existingErrorDiv) {
        existingErrorDiv.remove();
      }

      const formatRegex: number = Mask.format[this.maskType];
	  console.log(formatRegex);
      if (
        this.inputElement.value &&
        formatRegex &&
        !formatRegex.test(this.inputElement.value)
      ) {
        parentInputField.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Formato inválido.';
        parentInputField.appendChild(errorDiv);
      }

      if (!this.inputElement.value) {
        parentInputField.classList.remove('error');
        const existingErrorDiv =
          parentInputField.querySelector('.error-message');
        if (existingErrorDiv) {
          existingErrorDiv.remove();
        }
      }
    }
  };
}
