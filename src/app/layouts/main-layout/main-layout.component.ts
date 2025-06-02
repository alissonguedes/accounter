import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../services/title/title.service';
import { AppComponent } from '../../app.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { PreloaderComponent } from '../../services/preloader/preloader/preloader.component';
import { ShowCalendar } from './show-calendar';

declare const localStorage: any;
declare const M: any;
declare const document: any;

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    PreloaderComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  @ViewChild('modalPeriodo') modalPeriodo!: ElementRef;
  @ViewChild('selectPeriodo') selectPeriodo!: ElementRef;
  @ViewChild('periodoInput') periodoInput!: ElementRef;
  @ViewChild('periodoLabel') periodoLabel!: ElementRef;

  public anoSelecionado: number = this.calendar.currentYear;

  storage: any;

  constructor(
    public app: AppComponent,
    public http: HttpService,
    public calendar: ShowCalendar
  ) {
    this.storage = localStorage;

    document.addEventListener('DOMContentLoaded', function () {
      let btnSidenav = document.querySelector('[data-target="slide-out"]');
      btnSidenav.addEventListener('click', function (e: any) {
        e.stopPropagation();
        let sidenavMain = document.querySelector('#slide-out');
        let sidenav = M.Sidenav.getInstance(sidenavMain);
        sidenav.open();
      });
    });
  }

  openModalPeriodo() {

    const btnMonth = document.querySelectorAll('#calendar-months .btn');
    const modalPeriodo = this.modalPeriodo.nativeElement;
    const selectYear = this.selectPeriodo.nativeElement;
    const periodoInput = this.periodoInput.nativeElement;

    let currentPeriodo = periodoInput?.value || `${this.calendar.currentMonth}/${this.calendar.currentYear}`;
    let [mesSelecionado, anoSelecionado] = currentPeriodo.split('/');

    const modalOptions = {
      dismissible: false,
      startingTop: '15%',
      endingTop: '15%',
      onOpenStart: () => {
        // limpa a seleção de mês ao trocar o ano
        btnMonth.forEach((label: any) => label.classList.remove('checked'));
        document.querySelector(`#calendar-months .btn input[value="${mesSelecionado}"]`).parentElement.classList.add('checked');
        selectYear.value = anoSelecionado;
        M.FormSelect.init(document.querySelector('select[name="ano"]'));
      },
      onCloseEnd: () => {},
    };

    const modal = M.Modal.init(modalPeriodo, modalOptions);
    modal.open();
  }
}
