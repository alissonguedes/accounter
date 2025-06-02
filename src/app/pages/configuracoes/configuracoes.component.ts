import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AppComponent } from '../../app.component';
import { initApp, menuCollapse } from '../../app.config';
import { TitleDirective } from '../../directives/title/title.directive';

declare const M: any;
declare const document: any;

@Component({
  selector: 'app-configuracoes',
  imports: [
    CommonModule,
    TitleDirective,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ConfiguracoesComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    menuCollapse();
    initApp();

    let emailSidenav = document.querySelector('#email-sidenav');
    M.Sidenav.init(emailSidenav);
  }

  sidenav(): void {
    if (window.innerWidth < 960) {
      const sidenav = document.querySelector('#email-sidenav');
      const appSidebar = document.querySelector('.app-sidebar');

      console.log(sidenav);
      if (
        sidenav &&
        typeof M !== 'undefined' &&
        M.Sidenav.getInstance(sidenav)
      ) {
        M.Sidenav.getInstance(sidenav).close();
      }

      if (
        appSidebar &&
        typeof M !== 'undefined' &&
        M.Sidenav.getInstance(appSidebar)
      ) {
        M.Sidenav.getInstance(appSidebar).close();
      }
    }
  }
}
