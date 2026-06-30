import { Route } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guard/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { loginGuard } from './guard/login.guard';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { TypeHairCutComponent } from './pages/type-hair-cut/type-hair-cut.component';
import { NewScheduleComponent } from './pages/new-schedule/new-schedule.component';
import { AppointmentComponent } from './pages/appointment/appointment.component';
import { ScheduledComponent } from './pages/scheduled/scheduled.component';

export const routes: Route[] = [
	{
		path: '',
		component: HomeComponent,
		canActivate: [authGuard],
		children: [
			{
				path: '',
				title: 'Dashboard',
				component: ScheduledComponent,
				canActivateChild: [authGuard]
			},
			{
				path: 'newSchedule',
				title: 'Agendamento',
				component: NewScheduleComponent,
				canActivateChild: [authGuard]
			},
			{
				path: 'typeHairCut',
				title: 'Tipo de corte',
				component: TypeHairCutComponent,
				canActivateChild: [authGuard]
			},
			{
				path: 'myAccount',
				title: 'Minha conta',
				component: MyAccountComponent,
				canActivateChild: [authGuard]
			},
			{
				path: 'appointment',
				title: 'Agendamento',
				component: AppointmentComponent,
				canActivateChild: [authGuard]
			}
		]
	},
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [loginGuard]
	}
];

export const routeIcons: { [key: string]: string } = {
	'': 'featherHome',
	myAccount: 'featherFile',
	typeHairCut: 'featherScissors',
	newSchedule: 'featherCalendar',
	appointment: 'featherClock'
};

export function getRouteIcon(path: string): string {
	return routeIcons[path];
}

export function getChildRoutesWithIcons() {
	const childRoutesWithIcons: { path: string; icon: string; title: string | undefined }[] = [];
	routes.forEach((route) => {
		if (route.children) {
			route.children.forEach((child) => {
				let title: string | undefined = undefined;
				if (typeof child.title === 'string') {
					title = child.title;
				}
				childRoutesWithIcons.push({
					path: child.path ?? '',
					title: title,
					icon: getRouteIcon(child.path ?? '')
				});
			});
		}
	});
	return childRoutesWithIcons;
}
