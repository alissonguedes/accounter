class ShowCalendar {
  constructor() {}

  static setDefaultDate() {
    var date = ('01/' + $('[name="periodo"]').val()).split('/').reverse();
    var defaultDate = new Date(date[0], date[1] - 1, date[2]);

    $('.datepicker').datepicker({
      showMonthAfterYear: false,
      showDaysInNextAndPreviousMonths: false,
      autoClose: true,
      setDefaultDate: false,
      defaultDate: defaultDate,
      format: 'dd/mm/yyyy',
    });
  }

  static selectMonth(date) {
    var config_date = new DB('controle_financeiro', 'config');
    const inputPeriodo = document.querySelector("input[name='periodo']");
    const lancamentos = document.querySelector('[data-target="modal-periodo"]');
    const meses = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    let id = 0;
    let defaultDate =
      inputPeriodo.value ||
      `${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
    let textContent = null;

    config_date.get('defaultDate').then((cursor) => {
      if (!cursor) {
        let mes = defaultDate.split('/').splice(0, 1).join();
        let ano = defaultDate.split('/').splice(1);
        textContent = `${meses[mes - 1]}/${ano}`;
        config_date.add({ config: 'defaultDate', value: defaultDate });
      } else if (date) {
        let mes = date.split('/').splice(0, 1).join();
        let ano = date.split('/').splice(1).join();
        defaultDate = `${mes}/${ano}`;
        textContent = `${meses[mes - 1]}/${ano}`;
        config_date.update({ config: 'defaultDate', value: defaultDate });
      } else {
        defaultDate = cursor.value;
        let mes = defaultDate.split('/').splice(0, 1).join();
        let ano = defaultDate.split('/').splice(1);
        textContent = `${meses[mes - 1]}/${ano}`;
      }

      inputPeriodo.value = `${defaultDate}`;
      lancamentos.textContent = textContent;

      this.setDefaultDate();
    });
  }

  static showMonths(selectedYear) {
    var months = [
      'jan',
      'fev',
      'mar',
      'abr',
      'mai',
      'jun',
      'jul',
      'ago',
      'set',
      'out',
      'nov',
      'dez',
    ];
    let div_months = '';

    for (var i = 1; i <= 12; i++) {
      div_months += `<div class="col s3 center-align">
                <label class="btn" for="month_${months[i - 1]}">
                    ${months[i - 1]}
                    <input type="radio" name="mes" value="${i}" id="month_${
        months[i - 1]
      }">
                </label>
            </div>`;
    }

    document.querySelector('#calendar-months').innerHTML = div_months;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    document
      .querySelectorAll('#calendar-months .btn input[type="radio"]')
      .forEach((input) => {
        const value = parseInt(input.value, 10);
        if (selectedYear < currentYear || value <= currentMonth) {
          input.disabled = false;
          input.parentElement.classList.remove('disabled');
        } else {
          input.disabled = true;
          input.parentElement.classList.add('disabled');
        }
      });
  }
}
