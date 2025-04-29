import { Route, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { AboutComponent } from './pages/about/about.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';

import { authGuard } from './auth.guard';

export const routes: Routes = [
	{
		path: '',
		component: MainLayoutComponent,
		canActivate: [authGuard],
		children: [
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'pacientes', component: PacientesComponent }
		]
	},
	{
		path: '',
		component: AuthLayoutComponent,
		children: [
			{ path: 'login', component: LoginComponent },
		]
	},
	{
		path: '**', redirectTo: ''
	}
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
