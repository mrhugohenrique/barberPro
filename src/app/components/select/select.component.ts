import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-select',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
	@Input() label: string = '';
	@Input() id: string = 'app-select';
	@Input() options: selectOption[] = [];
	@Input() control: FormControl = new FormControl();
	@Input() disabled: boolean = false;
	@Input() required: boolean = false;

	ngOnInit() {
		if (this.required) {
			this.control.setValidators([Validators.required]);
			this.control.updateValueAndValidity();
		}
		if (this.disabled) {
			this.control.disable({ emitEvent: false });
		} else {
			this.control.enable({ emitEvent: false });
		}
	}
}

export type selectOption = {
	label: string;
	value: number;
};
