import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { UserService } from './user.service';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private readonly _http = inject(HttpClient);
	private readonly _notifications = inject(ToastrService);
	private readonly _userService = inject(UserService);
	private readonly platformId = inject<object>(PLATFORM_ID);

	private baseUrl = `${environment.apiUrl}/auth`;

	login(email: string, password: string) {
		return this._http
			.post<{
				token: string;
				user: object;
				mensagem: string;
			}>(`${this.baseUrl}/login`, { email, password })
			.pipe(
				tap((response) => {
					if (response) {
						const { token, user } = response;
						this._userService.saveLocalStorage({ token, user });
					}
				}),
				catchError((error) => {
					this._notifications.error(error.error?.message || 'Erro ao realizar login.');
					return throwError(error);
				})
			);
	}

	register(name: string, email: string, password: string) {
		return this._http
			.post<{ token: string }>(`${this.baseUrl}/register`, { name, email, password })
			.pipe(
				tap((response) => {
					localStorage.setItem('loginToken', JSON.stringify({ token: response.token })),
						this._notifications.success('Usuário criado com sucesso!');
				}),
				catchError((error) => {
					this._notifications.error(error.error?.message || 'Erro ao criar usuário.');
					return throwError(error);
				})
			);
	}

	isAuthenticated(): boolean {
		if (!isPlatformBrowser(this.platformId)) {
			return false;
		}

		const token = localStorage.getItem('loginToken');
		if (!token) {
			return false;
		}

		try {
			const parsedToken = JSON.parse(token);
			const decodedToken = jwtDecode<{ exp: number }>(parsedToken.token);
			const expirationDate = new Date(0);
			expirationDate.setUTCSeconds(decodedToken.exp);

			if (expirationDate > new Date()) {
				return true;
			} else {
				this.logout();
				return false;
			}
		} catch (error) {
			return false;
		}
	}

	logout(): void {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem('loginToken');
		}
	}
}
