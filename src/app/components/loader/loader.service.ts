import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class LoaderService {
	public isLoading = signal<boolean>(false);

	constructor() {}

	showLoader() {
		this.isLoading.set(true);
	}

	hideLoader() {
		this.isLoading.set(false);
	}
}
