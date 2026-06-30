import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { httpClientResponse } from './types';

@Injectable({
	providedIn: 'root'
})
export class AppointmentService {
	private readonly _http = inject(HttpClient);
	private readonly baseUrl = `${environment.apiUrl}/appointments`;

	create(customerName: string, productId: string | number): Observable<httpClientResponse> {
		return this._http.post<httpClientResponse>(this.baseUrl, { customerName, productId });
	}

	getAll(): Observable<unknown> {
		return this._http.get<unknown>(this.baseUrl);
	}
}
