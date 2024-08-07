import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { getChildRoutesWithIcons } from '../../app.routes';
import * as featherIcons from '@ng-icons/feather-icons';
export const allFeatherIcons = Object.entries(featherIcons).reduce(
	(acc: { [key: string]: string }, [key, icon]) => {
		acc[key] = icon;
		return acc;
	},
	{}
);

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [NgIconComponent, CommonModule, RouterLink],
	viewProviders: [provideIcons(allFeatherIcons)],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
	public isOpen: boolean = false;
	readonly childRoutes = getChildRoutesWithIcons();

	toggleSidebar() {
		this.isOpen = !this.isOpen;
	}
}
