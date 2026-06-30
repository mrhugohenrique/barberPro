import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators
} from '@angular/forms';
import { InputComponent } from '../../components/input/input.component';
import { WindowComponent } from '../../components/window/window.component';
import { SelectComponent, selectOption } from '../../components/select/select.component';
import { ToastrService } from 'ngx-toastr';
import { HaircutService } from '../../services/haircut.service';
import { AppointmentService } from '../../services/appointment.service';
import { Product } from '../../services/types';

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
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewScheduleComponent implements OnInit {
	private readonly _notifications = inject(ToastrService);
	private readonly _haircutService = inject(HaircutService);
	private readonly _appointmentService = inject(AppointmentService);

	readonly haircuts = signal<selectOption[]>([]);

	readonly _formGroup = new FormGroup({
		name: new FormControl('', Validators.required),
		haircut: new FormControl('', Validators.required)
	});

	ngOnInit() {
		this.getAllItems();
	}

	handleRegisterService() {
		if (this._formGroup.invalid) {
			this._notifications.warning('Por favor, preencha todos os campos obrigatórios!');
			return;
		}

		const name = this._formGroup.value.name ?? '';
		const haircutId = this._formGroup.value.haircut ?? '';

		this._appointmentService.create(name, haircutId).subscribe({
			next: (resp) => {
				const { response } = resp;
				if (response.success) {
					this._notifications.success('Serviço agendado com sucesso!');
					this._formGroup.reset();
				} else {
					this._notifications.error(response.message);
				}
			},
			error: (error) => {
				this._notifications.error(error.error?.message || 'Erro ao agendar serviço.');
			}
		});
	}

	handleChangeSelect(event: Event) {
		const value = (event.target as HTMLSelectElement).value;
		this._formGroup.patchValue({ haircut: value });
	}

	getAllItems() {
		this._haircutService.getAll().subscribe({
			next: (products: Product[]) => {
				const options = products.map((product) => ({
					label: `${product.name} - R$ ${product.price}`,
					value: product.id
				}));
				this.haircuts.set(options);
			},
			error: () => {
				this._notifications.error('Erro ao buscar tipos de corte.');
			}
		});
	}
}
