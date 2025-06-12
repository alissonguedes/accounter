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
