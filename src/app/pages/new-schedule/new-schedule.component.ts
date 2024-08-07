import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators
} from '@angular/forms';
import { InputComponent } from '../../components/input/input.component';
import { WindowComponent } from '../../components/window/window.component';
import { SelectComponent } from '../../components/select/select.component';

@Component({
	selector: 'app-new-schedule',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		InputComponent,
		WindowComponent,
		SelectComponent
	],
	templateUrl: './new-schedule.component.html',
	styleUrl: './new-schedule.component.scss',
	changeDetection: ChangeDetectionStrategy.Default
})
export class NewScheduleComponent implements OnInit {
	loading: boolean = false;

	haircuts = [
		{ label: 'Corte 1', value: 1 },
		{ label: 'Corte 2', value: 2 },
		{ label: 'Corte 3', value: 3 },
		{ label: 'Corte 4', value: 4 }
	];

	readonly _formGroup = new FormGroup({
		name: new FormControl('', Validators.required),
		haircut: new FormControl('', Validators.required)
	});

	ngOnInit(): void {}

	handleRegisterService() {
		if (this._formGroup.valid) {
			const customer = this._formGroup.value.name;
			const selectedHaircut = this._formGroup.value.haircut;
			console.log({ customer, selectedHaircut });
			// Enviar dados para o backend
		}
	}

	handleChangeSelect(event: Event) {
		const value = (event.target as HTMLSelectElement).value;
		this._formGroup.patchValue({ haircut: value });
	}
}
