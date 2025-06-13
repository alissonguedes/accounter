import { Route, Routes } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { CadastroComponent } from './pages/auth/cadastro/cadastro.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EntradasComponent } from './pages/entradas/entradas.component';
import { SaidasComponent } from './pages/saidas/saidas.component';
import { AplicativosComponent } from './pages/aplicativos/aplicativos.component';
import { PatrimonioComponent } from './pages/patrimonio/patrimonio.component';
import { ConfiguracoesComponent } from './pages/configuracoes/configuracoes.component';
import { ProjecaoComponent } from './pages/projecao/projecao.component';
import { PlanejamentoComponent } from './pages/planejamento/planejamento.component';
import { FluxoDeCaixaComponent } from './pages/fluxo-de-caixa/fluxo-de-caixa.component';
import { EntradasComponent as CaixaoEntradas } from './pages/fluxo-de-caixa/entradas/entradas.component';
import { SaidasComponent as CaixaSaidas } from './pages/fluxo-de-caixa/saidas/saidas.component';
import { AplicativosComponent as CaixaAplicativos } from './pages/fluxo-de-caixa/aplicativos/aplicativos.component';
import { PatrimonioComponent as CaixaPatrimonio } from './pages/fluxo-de-caixa/patrimonio/patrimonio.component';
import { CategoriasComponent } from './pages/configuracoes/categorias/categorias.component';
import { SistemaComponent } from './pages/configuracoes/sistema/sistema.component';
import { CarteirasDigitaisComponent } from './pages/configuracoes/carteiras-digitais/carteiras-digitais.component';
import { CartoesCreditoComponent } from './pages/configuracoes/cartoes-credito/cartoes-credito.component';
import { AplicativosComponent as ConfigApps } from './pages/configuracoes/aplicativos/aplicativos.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'entradas', component: EntradasComponent },
      { path: 'saidas', component: SaidasComponent },
      { path: 'aplicativos', component: AplicativosComponent },
      { path: 'patrimonio', component: PatrimonioComponent },
      { path: 'projecao', component: ProjecaoComponent },
      { path: 'planejamento', component: PlanejamentoComponent },
      { path: 'caixa', component: FluxoDeCaixaComponent },
      { path: 'caixa/entradas', component: CaixaoEntradas },
      { path: 'caixa/saidas', component: CaixaSaidas },
      { path: 'caixa/patrimonio', component: CaixaPatrimonio },
      { path: 'caixa/aplicativos', component: CaixaAplicativos },
      {
        path: 'configuracoes',
        component: ConfiguracoesComponent,
        children: [
          { path: '', redirectTo: 'categorias', pathMatch: 'full' },
          { path: 'categorias', component: CategoriasComponent },
          { path: 'carteiras-digitais', component: CarteirasDigitaisComponent },
          { path: 'cartoes-credito', component: CartoesCreditoComponent },
          { path: 'aplicativos', component: ConfigApps },
          { path: 'sistema', component: SistemaComponent },
        ],
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signin', component: CadastroComponent },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

// // As rotas propriamente ditas.
// export const routes: Routes = [
// 	{
// 		path: '',
// 		component: MainLayoutComponent,
// 		children: [
// 			...protectedRoutesWithGuard,
// 			{ path: '', redirectTo: '/login', pathMatch: 'full' },
// 			{ path: 'login', component: LoginComponent },
// 			{ path: '**', redirectTo: 'login' },
// 		]
// 	}
// ];
