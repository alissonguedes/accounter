import { Injectable, signal, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
declare const document: any;

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private documentTitle = 'Accounter :: Controle Financeiro';
  private titleSubject = new BehaviorSubject<string>('');

  title = signal<TemplateRef<any> | null>(null);

  setTitle(title: TemplateRef<any>) {
    this.title.set(title);
  }
}
