import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ScheduledComponent } from '../scheduled/scheduled.component';

@Component({
	selector: 'app-home',
	standalone: true,
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	imports: [
		CommonModule,
		FooterComponent,
		HeaderComponent,
		RouterOutlet,
		HttpClientModule,
		SidebarComponent,
		LoaderComponent,
		ScheduledComponent
	]
})
export class HomeComponent implements OnInit {
	showButton: boolean = true;
	isSidebarOpen = true;

	constructor(private router: Router) {}

	ngOnInit(): void {
		this.checkRoute(this.router.url); // Verifica a rota inicial

		this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.checkRoute(event.urlAfterRedirects); // Verifica a rota sempre que há uma mudança
			}
		});
	}

	toggleSidebar() {
		this.isSidebarOpen = !this.isSidebarOpen;
	}

	checkRoute(url: string): void {
		// Mostrar o botão apenas na rota raiz (home)
		this.showButton = url === '/' || url === '/home';
	}

	navigateToMyAccount() {
		this.router.navigate(['/myAccount']);
	}
}
