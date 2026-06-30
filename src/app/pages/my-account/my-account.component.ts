import { Component, OnInit, inject, ChangeDetectionStrategy, signal } from '@angular/core';
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
import { InputComponent } from '../../components/input/input.component';
import { WindowComponent } from '../../components/window/window.component';

@Component({
	selector: 'app-my-account',
	standalone: true,
	templateUrl: './my-account.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, InputComponent, WindowComponent]
})
export class MyAccountComponent implements OnInit {
	private readonly _notifications = inject(ToastrService);
	private readonly _userService = inject(UserService);

	readonly loading = signal(false);

	readonly _formGroup = new FormGroup({
		userId: new FormControl<number | null>(null, Validators.required),
		name: new FormControl<string | null>('', Validators.required),
		email: new FormControl({ value: '', disabled: true }),
		password: new FormControl<string | null>(null),
		newPassword: new FormControl<string | null>(null)
	});

	ngOnInit(): void {
		const user = this._userService.getUser();
		if (user && user.id) {
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

		this.loading.set(true);
		this._formGroup.disable();

		const { userId, name, newPassword } = this._formGroup.value;

		this._userService.updateProfile(userId, name ?? '', newPassword ?? undefined).subscribe({
			next: () => {
				this._notifications.success('Informações atualizadas com sucesso!');
				this.loading.set(false);
				this._formGroup.enable();
				this._formGroup.controls.email.disable(); // mantém email desativado
				
				// Atualizar dados locais salvos
				const currentUser = this._userService.getUser();
				this._userService.saveUser({ ...currentUser, name: name ?? undefined });
			},
			error: (error) => {
				this.loading.set(false);
				this._formGroup.enable();
				this._formGroup.controls.email.disable();
				this._notifications.error(error.error?.message || 'Erro ao atualizar dados.');
			}
		});
	}
}
