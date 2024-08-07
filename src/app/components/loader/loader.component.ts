import { Component, inject } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
	selector: 'app-loader',
	standalone: true,
	imports: [],
	template: `
		@if (isLoading()) {
			<div class="overlay">
				<div
					class="flex justify-center items-center min-h-screen fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-15 backdrop-blur-sm"
				>
					<div
						class="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500"
					></div>
				</div>
			</div>
		}
	`
})
export class LoaderComponent {
	private readonly SPINNER = inject(LoaderService);
	isLoading = this.SPINNER.isLoading;
}
