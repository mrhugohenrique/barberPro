import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Product, ProductsResponse, httpClientResponse } from './types';

@Injectable({
	providedIn: 'root'
})
export class HaircutService {
	private readonly _http = inject(HttpClient);
	private readonly baseUrl = `${environment.apiUrl}/products`;

	getAll(): Observable<Product[]> {
		return this._http.get<ProductsResponse>(this.baseUrl).pipe(
			map((resp: ProductsResponse) => resp.response)
		);
	}

	create(name: string, price: number): Observable<httpClientResponse> {
		return this._http.post<httpClientResponse>(this.baseUrl, { name, price });
	}

	update(id: number, name: string, price: number): Observable<httpClientResponse> {
		return this._http.put<httpClientResponse>(`${this.baseUrl}/${id}`, { name, price });
	}

	delete(id: number): Observable<unknown> {
		return this._http.delete<unknown>(`${this.baseUrl}/${id}`);
	}
}
