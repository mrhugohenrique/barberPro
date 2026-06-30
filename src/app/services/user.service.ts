import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LocalUser {
	id?: number;
	name?: string;
	email?: string;
}

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private readonly _http = inject(HttpClient);
	private readonly apiUrl = `${environment.apiUrl}/auth/user`;

	saveUser(user: LocalUser) {
		localStorage.setItem('user', JSON.stringify(user));
	}

	saveLocalStorage(value: { token: string; user: LocalUser }) {
		localStorage.setItem('loginToken', JSON.stringify(value));
	}

	getUser(): LocalUser {
		if (typeof window === 'undefined') return {};
		const loginToken = localStorage.getItem('loginToken');
		if (loginToken) {
			try {
				const parsedToken = JSON.parse(loginToken);
				return parsedToken.user || {};
			} catch (error) {
				return {};
			}
		}
		return {};
	}

	saveOrganism(organism: unknown) {
		localStorage.setItem('organism', JSON.stringify(organism));
	}

	getOrganism(): Record<string, unknown> {
		if (typeof window === 'undefined') return {};
		try {
			return JSON.parse(localStorage.getItem('organism') || '{}');
		} catch (error) {
			return {};
		}
	}

	updateProfile(userId: string | number | null | undefined, name: string, newPassword?: string): Observable<unknown> {
		return this._http.put<unknown>(this.apiUrl, { userId, name, newPassword });
	}
}
