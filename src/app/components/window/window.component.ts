import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-window',
	standalone: true,
	imports: [],
	templateUrl: './window.component.html',
	styleUrl: './window.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowComponent {
	private readonly _router = inject(Router);
	readonly title = input<string>('Default Title');

	close() {
		this._router.navigate(['/']);
	}
}
