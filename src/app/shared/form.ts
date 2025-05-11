import { inject, Injectable, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PreloaderComponent } from '../services/preloader/preloader/preloader.component';
import { PreloaderService } from '../services/preloader/preloader.service';

declare const M: any;
declare const document: any;

@Injectable({
  providedIn: 'root',
})
export abstract class Form {
  protected abstract form: FormGroup;
  protected fb = inject(FormBuilder);
  public searchControl = new FormControl();
  public submited = signal(false);

  constructor(protected preloaderService: PreloaderService) {}

  //   protected abstract fields(): {
  //     [key: string]: any;
  //   };

  //   public init(): void {
  //     this.preloaderService.show();
  //     this.form = this.fb.group(this.fields());
  //   }

  public getForm() {
    return this.form;
  }

  public setValues(values: object): void {
    this.form.setValue(values);
  }

  public getValues() {
    return this.form.value;
  }

  public reset(): void {
    this.form.reset();
  }

  public invalid(): boolean {
    return this.form.invalid;
  }

  protected abstract submitForm(): {};

  public enable(): void {
    // document.querySelector('#modal-categoria').classList.remove('loading');
    // document.querySelector('#preloader-modal').style.display = 'none';
    this.submited.set(false);
    this.form.enable();
    setTimeout(() => {
      let select = document.querySelector('select');
      M.FormSelect.init(select);
    });
  }

  public disable(): void {
    // document.querySelector('#modal-categoria').classList.add('loading');
    // document.querySelector('#preloader-modal').style.display = 'flex';
    this.submited.set(true);
    this.form.disable();
    setTimeout(() => {
      let select = document.querySelector('select');
      M.FormSelect.init(select);
    });
  }

  public alert(status: number, message: string): void {
    return M.toast({
      html: message,
    });
  }
}
