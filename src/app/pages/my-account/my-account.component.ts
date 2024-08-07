import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import {
	FormGroup,
	FormControl,
	Validators,
	FormsModule,
	ReactiveFormsModule
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs';
import { InputComponent } from '../../components/input/input.component';
import { WindowComponent } from '../../components/window/window.component';
import { LoaderService } from '../../components/loader/loader.service';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-my-account',
	standalone: true,
	templateUrl: './my-account.component.html',
	styleUrl: './my-account.component.scss',
	changeDetection: ChangeDetectionStrategy.Default,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, InputComponent, WindowComponent]
})
export class MyAccountComponent implements OnInit {
	private _notifications = inject(ToastrService);
	private _userService = inject(UserService);
	private _httpClient = inject(HttpClient);
	private _loaderService = inject(LoaderService);

	user = this._userService.getUser();
	loading = false;
	readonly API_URL = `${environment.apiUrl}/api/auth/users`;

	readonly _formGroup = new FormGroup({
		userId: new FormControl(null, Validators.required),
		name: new FormControl<string | number | null>('', Validators.required),
		email: new FormControl({ value: '', disabled: true }),
		password: new FormControl(null),
		newPassword: new FormControl(null)
	});

	ngOnInit(): void {
		const user = this._userService.getUser();
		if (user) {
			this._formGroup.patchValue({
				userId: user.id,
				name: user.name,
				email: user.email
			});
		}
	}

	attRegister(): void {
		if (this._formGroup.invalid) {
			this._notifications.warning('Por favor, preencha todos os campos obrigatórios!');
			return;
		}

		this.loading = true;
		const { userId, name, newPassword } = this._formGroup.value;

		console.log('Enviando requisição com dados:', {
			userId,
			name,
			newPassword
		}); // Adicione isto para debug
		this._loaderService.showLoader();
		this._httpClient
			.put(this.API_URL, {
				userId,
				name,
				newPassword
			})
			.pipe(take(1))
			.subscribe({
				next: () => {
					this._notifications.success('Informações atualizadas com sucesso!');
					this.loading = false;
					this._loaderService.hideLoader();
				},
				error: (error: any) => {
					this.loading = false;
					this._notifications.error(error.error.message);
					console.error('Erro na requisição:', error);
					this._loaderService.hideLoader();
				}
			});
	}
}
