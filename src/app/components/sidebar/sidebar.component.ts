import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { getChildRoutesWithIcons } from '../../app.routes';
import {
	featherHome,
	featherFile,
	featherScissors,
	featherCalendar,
	featherClock,
	featherChevronLeft,
	featherChevronRight,
	featherEdit,
	featherTrash
} from '@ng-icons/feather-icons';

export const appIcons = {
	featherHome,
	featherFile,
	featherScissors,
	featherCalendar,
	featherClock,
	featherChevronLeft,
	featherChevronRight,
	featherEdit,
	featherTrash
};

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [NgIconComponent, CommonModule, RouterLink, RouterLinkActive],
	viewProviders: [provideIcons(appIcons)],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
	readonly isOpen = signal(false);
	readonly childRoutes = getChildRoutesWithIcons();

	toggleSidebar() {
		this.isOpen.update((open) => !open);
	}
}
