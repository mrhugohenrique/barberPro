import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
import { tap, finalize, catchError, throwError } from 'rxjs';
import { LoaderService } from '../../components/loader/loader.service';
import { environment } from '../../../environments/environment';
import { httpClientResponse, Product, ProductsResponse } from '../../services/types';

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
	private baseUrl = `${environment.apiUrl}`;

	haircuts: selectOption[] = [];

	private _notifications = inject(ToastrService);
	private _HttpClient = inject(HttpClient);
	private _loading = inject(LoaderService);

	readonly _formGroup = new FormGroup({
		name: new FormControl('', Validators.required),
		haircut: new FormControl('', Validators.required)
	});

	ngOnInit() {
		this.getAllItems();
	}

	handleRegisterService() {
		if (this._formGroup.invalid) {
			return this._notifications.warning('Por favor, preencha todos os campos obrigatórios!');
		}
		this._loading.showLoader();
		const BODY = {
			customerName: this._formGroup.value.name,
			productId: this._formGroup.value.haircut
		};

		this._HttpClient
			.post<httpClientResponse>(`${this.baseUrl}/appointments`, BODY)
			.pipe(
				tap((resp: httpClientResponse) => {
					const { response } = resp;

					if (response.success) {
						this._notifications.success('Serviço agendado com sucesso!');
						this._formGroup.reset();
					} else {
						this._notifications.error(response.message);
					}
				}),
				finalize(() => {
					this._loading.hideLoader();
				}),
				catchError((error) => {
					this._notifications.error(error.error.message || 'Erro ao agendar serviço.');
					return throwError(error);
				})
			)
			.subscribe();
		return;
	}

	handleChangeSelect(event: Event) {
		const value = (event.target as HTMLSelectElement).value;
		this._formGroup.patchValue({ haircut: value });
	}

	getAllItems() {
		this._loading.showLoader();
		this._HttpClient
			.get<ProductsResponse>(`${this.baseUrl}/products`)
			.pipe(
				tap((resp: ProductsResponse) => {
					this.haircuts = resp.response.map((product: Product) => ({
						label: `${product.name} - R$ ${product.price}`,
						value: product.id
					}));
				}),
				finalize(() => {
					this._loading.hideLoader();
				})
			)
			.subscribe();
	}
}
