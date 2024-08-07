import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
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
	private baseUrl = `${environment.apiUrl}/api/auth`;
	constructor(
		private _http: HttpClient,
		@Inject(ToastrService)
		private _notifications: ToastrService,
		private _userService: UserService,
		@Inject(PLATFORM_ID) private platformId: any
	) {}

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
					this._notifications.error(error.error.message);
					return throwError(error);
				})
			);
	}

	register(name: string, email: string, password: string) {
		return this._http
			.post<{ token: string }>(`${this.baseUrl}/register`, { name, email, password })
			.pipe(
				tap((response) => {
					localStorage.setItem('loginToken', response.token),
						this._notifications.success('Usuário criado com sucesso!');
				}),
				catchError((error) => {
					this._notifications.error(error.error.message);
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
			const decodedToken: any = jwtDecode(parsedToken.token);
			const expirationDate = new Date(0);
			expirationDate.setUTCSeconds(decodedToken.exp);

			if (expirationDate > new Date()) {
				return true;
			} else {
				this.logout();
				return false;
			}
		} catch (error) {
			console.error('Error decoding or validating token:', error);
			return false;
		}
	}

	logout(): void {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem('loginToken');
		}
	}
}
