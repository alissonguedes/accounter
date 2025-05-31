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
    const modalPeriodo = this.modalPeriodo.nativeElement;

    const modalOptions = {
      dismissible: false,
      startingTop: '15%',
      endingTop: '15%',
      onOpenStart: () => {
        const self = this;
        const meses = this.calendar.getMonths();
        const selectYear = this.selectPeriodo.nativeElement;
        const periodoInput = this.periodoInput.nativeElement;
        const periodoLabel = this.periodoLabel.nativeElement;
        const btnMonth = document.querySelectorAll('#calendar-months .btn');

        let currentPeriodo =
          periodoInput?.value ||
          `${this.calendar.currentMonth}/${this.calendar.currentYear}`;
        let [mesSelecionado, anoSelecionado] = currentPeriodo.split('/');

        this.anoSelecionado = selectYear?.value;

        // limpa a seleção de mês ao trocar o ano
        btnMonth.forEach((label: any) => label.classList.remove('checked'));
        document.querySelector(`#calendar-months .btn input[value="${mesSelecionado}"]`).parentElement.classList.add('checked');

        selectYear.addEventListener('change', function (e: any) {
          let novoAnoSelecionado = e.target.value;

          // limpa a seleção de mês ao trocar o ano
          btnMonth.forEach((label: any) => label.classList.remove('checked'));

          if (novoAnoSelecionado === anoSelecionado)
            document.querySelector(`#calendar-months .btn input[value="${mesSelecionado}"]`).parentElement.classList.add('checked');

          self.anoSelecionado = novoAnoSelecionado;
        });

        document
          .getElementById('calendar-months')
          .addEventListener('change', function (e: any) {
            const input = e.target;

            if (input.matches('input[type="radio"]')) {
              mesSelecionado = input.value;
              anoSelecionado = selectYear.value;

              const periodoSelecionado = `${mesSelecionado}/${anoSelecionado}`;

              periodoInput.value = periodoSelecionado;
              periodoLabel.textContent = `${meses[mesSelecionado - 1]}/${anoSelecionado}`;
              btnMonth.forEach((label: any) =>label.classList.remove('checked'));
              input.parentElement.classList.add('checked');
              modal.close();
            }
          });
      },
    };

    const modal = M.Modal.init(modalPeriodo, modalOptions);
    modal.open();
  }

  openModalPeriodo_OLD() {
    const selectAno = document.querySelector(
      '#modal-periodo .input-field select[name="ano"]'
    );
    const meses = this.calendar.getMonths();

    /** abre a janela de período para seleção do mês/ano dos lançamentos */
    // document
    //   .querySelectorAll('#calendar-months .btn')
    //   .forEach((label: any) => label.classList.remove('checked'));

    const periodoInput = document.querySelector("input[name='periodo']");
    const periodoLabel = document.querySelector('#periodo-label');
    let periodo = periodoInput?.value;

    const selectedValue = periodoInput.getAttribute('value').split('/')[0];
    document
      .querySelector(`#calendar-months .btn input[value='${selectedValue}']`)
      ?.parentElement.classList.add('checked');

    const modalElement = this.modalPeriodo?.nativeElement;
    //document.getElementById('modal-periodo');
    // const modalInstance = M.Modal.init(modalElement, {
    //     dismissible: false,
    //     onOpenStart: () => {
    //         let periodo = periodoInput.value || button.dataset.value || `${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
    //         let [mesSelecionado, anoSelecionado] = periodo.split("/");
    //         selectAno.value = anoSelecionado;
    //         M.FormSelect.init(selectAno);
    //         ShowCalendar.showMonths(anoSelecionado);
    //         if (anoSelecionado === String(new Date().getFullYear())) {
    //             document.querySelector(`#calendar-months input[value="${mesSelecionado}"]`)?.parentElement.classList.add("checked");
    //         }
    //         selectAno.addEventListener("change", function () {
    //             let novoAnoSelecionado = this.value;
    //             ShowCalendar.showMonths(novoAnoSelecionado);
    //             document.querySelectorAll("#calendar-months .btn").forEach(label => label.classList.remove("checked"));
    //             if (novoAnoSelecionado === String(new Date().getFullYear())) {
    //                 document.querySelector(`#calendar-months input[value="${mesSelecionado}"]`)?.parentElement.classList.add("checked");
    //             }
    //             anoSelecionado = novoAnoSelecionado;
    //         });
    //         document.getElementById("calendar-months").addEventListener("change", function (event) {
    //             const input = event.target;
    //             if (input.matches("input[type='radio']")) {
    //                 mesSelecionado = input.value;
    //                 document.querySelectorAll("#calendar-months .btn").forEach(label => label.classList.remove("checked"));
    //                 input.parentElement.classList.add("checked");
    //                 const periodoSelecionado = `${mesSelecionado}/${anoSelecionado}`;
    //                 button.setAttribute("data-value", periodoSelecionado);
    //                 button.textContent = `${meses[parseInt(mesSelecionado) - 1]}/${anoSelecionado}`;
    //                 periodoInput.value = periodoSelecionado;
    //                 modalInstance.close();
    //             }
    //         });
    //     }
    // });
    const modalInstance = M.Modal.init(modalElement, {
      dismissible: false,
      startingTop: '15%',
      endingTop: '15%',
      onOpenStart: () => {
        const dataAtual = new Date();
        const mesAtual = String(dataAtual.getMonth() + 1); // Mês atual (1-12)
        const anoAtual = String(dataAtual.getFullYear()); // Ano atual

        let periodo = periodoInput.value || `${mesAtual}/${anoAtual}`;
        let [mesSelecionado, anoSelecionado] = periodo.split('/');

        selectAno.value = anoSelecionado;
        M.FormSelect.init(selectAno);
        ShowCalendar.showMonths(anoSelecionado);

        // Marcar o mês selecionado ao abrir o modal
        document
          .querySelector(`#calendar-months input[value="${mesSelecionado}"]`)
          ?.parentElement.classList.add('checked');

        selectAno.addEventListener('change', function (e: any) {
          let value = null;
          let novoAnoSelecionado = value;
          ShowCalendar.showMonths(novoAnoSelecionado);

          // Limpa a seleção de mês ao trocar de ano
          document
            .querySelectorAll('#calendar-months .btn')
            .forEach((label: any) => label.classList.remove('checked'));

          // Se voltar para o ano selecionado inicialmente, remarcar o mês selecionado anteriormente
          if (novoAnoSelecionado === anoSelecionado) {
            document
              .querySelector(
                `#calendar-months input[value="${mesSelecionado}"]`
              )
              ?.parentElement.classList.add('checked');
          }
        });

        document
          .getElementById('calendar-months')
          .addEventListener('change', function (event: any) {
            const input = event.target;
            if (input.matches("input[type='radio']")) {
              mesSelecionado = input.value;
              anoSelecionado = selectAno.value;

              // Limpa seleções antigas e marca o novo mês escolhido
              document
                .querySelectorAll('#calendar-months .btn')
                .forEach((label: any) => label.classList.remove('checked'));
              input.parentElement.classList.add('checked');

              const periodoSelecionado = `${mesSelecionado}/${anoSelecionado}`;
              console.log(periodoSelecionado);
              periodoInput.setAttribute('data-value', periodoSelecionado);
              periodoLabel.textContent = `${
                meses[parseInt(mesSelecionado) - 1]
              }/${anoSelecionado}`;
              periodoInput.value = periodoSelecionado;
              // ShowCalendar.selectMonth(periodoSelecionado);

              modalInstance.close();
            }
          });
      },
      onCloseEnd: () => {
        //   location.reload();
      },
    });

    modalInstance.open();
  }
}
