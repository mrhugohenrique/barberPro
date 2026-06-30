import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { InputComponent } from '../../components/input/input.component';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, InputComponent],
	templateUrl: './login.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);
	private readonly _notifications = inject(ToastrService);

	readonly isRegister = signal(false);

	readonly _formGroup = new FormGroup({
		email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
		password: new FormControl<string | null>(null, Validators.required),
		name: new FormControl<string | null>(null)
	});

	toggleForm() {
		this.isRegister.update((reg) => !reg);
	}

	onSubmit() {
		const { email, password } = this._formGroup.value;
		if (email && password) {
			this.authService.login(email, password).subscribe({
				next: () => {
					this.router.navigate(['/']);
				}
			});
		} else {
			this._formGroup.markAllAsTouched();
			this._notifications.warning('Preencha o e-mail e a senha');
		}
	}

	onSubmitRegister() {
		if (this.isRegister()) {
			const { name, email, password } = this._formGroup.value;
			if (name && email && password) {
				this.authService.register(name, email, password).subscribe({
					next: () => {
						this.isRegister.set(false);
						this._formGroup.reset();
					}
				});
			} else {
				this._formGroup.markAllAsTouched();
				this._formGroup.markAsDirty();
				this._notifications.warning('Preencha todos os campos');
			}
		}
	}

	register() {
		this._formGroup.reset();
		this.isRegister.update((reg) => !reg);
	}
}
