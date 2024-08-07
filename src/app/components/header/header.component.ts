import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherMenu, featherHome, featherFile } from '@ng-icons/feather-icons';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [NgIconComponent],
	viewProviders: [provideIcons({ featherMenu, featherHome, featherFile })],

	templateUrl: './header.component.html',
	styleUrl: './header.component.scss'
})
export class HeaderComponent {}
