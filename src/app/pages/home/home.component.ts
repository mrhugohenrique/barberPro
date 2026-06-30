import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef, signal } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-home',
	standalone: true,
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	imports: [
		CommonModule,
		FooterComponent,
		RouterOutlet,
		SidebarComponent,
		LoaderComponent
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
	private readonly router = inject(Router);
	private readonly destroyRef = inject(DestroyRef);

	readonly showButton = signal(true);
	readonly isSidebarOpen = signal(true);

	ngOnInit(): void {
		this.checkRoute(this.router.url);

		this.router.events.pipe(
			takeUntilDestroyed(this.destroyRef)
		).subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.checkRoute(event.urlAfterRedirects);
			}
		});
	}

	toggleSidebar() {
		this.isSidebarOpen.update((open) => !open);
	}

	checkRoute(url: string): void {
		this.showButton.set(url === '/' || url === '/home');
	}

	navigateToMyAccount() {
		this.router.navigate(['/myAccount']);
	}
}
