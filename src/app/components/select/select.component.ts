import { Component, ChangeDetectionStrategy, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-select',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements OnInit {
	readonly label = input<string>('');
	readonly id = input<string>('app-select');
	readonly options = input<selectOption[]>([]);
	readonly control = input<FormControl>(new FormControl());
	readonly disabled = input<boolean>(false);
	readonly required = input<boolean>(false);

	ngOnInit() {
		const ctrl = this.control();
		if (this.required()) {
			ctrl.setValidators([Validators.required]);
			ctrl.updateValueAndValidity();
		}
		if (this.disabled()) {
			ctrl.disable({ emitEvent: false });
		} else {
			ctrl.enable({ emitEvent: false });
		}
	}
}

export type selectOption = {
	label: string;
	value: number | string;
};
