import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { WindowComponent } from '../../components/window/window.component';
import { InputComponent } from '../../components/input/input.component';
import {
	FormGroup,
	FormControl,
	Validators,
	FormsModule,
	ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { allFeatherIcons } from '../../components/sidebar/sidebar.component';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { SelectComponent } from '../../components/select/select.component';
import { LoaderService } from '../../components/loader/loader.service';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-type-hair-cut',
	standalone: true,
	templateUrl: './type-hair-cut.component.html',
	styleUrl: './type-hair-cut.component.scss',
	imports: [
		CommonModule,
		WindowComponent,
		InputComponent,
		FormsModule,
		ReactiveFormsModule,
		NgIconComponent,
		SelectComponent
	],
	viewProviders: [provideIcons(allFeatherIcons)],
	changeDetection: ChangeDetectionStrategy.Default
})
export class TypeHairCutComponent implements OnInit {
	isModalOpen = false;
	modalTitle = '';
	tipoHairCuts: TipoHairCut[] = [];
	pageSize: number = 5;
	currentPage: number = 1;
	Math = Math;

	private baseUrl = `${environment.apiUrl}/api/products`;

	private _notifications = inject(ToastrService);
	private _HttpClient = inject(HttpClient);
	private _loading = inject(LoaderService);

	readonly _formGroup = new FormGroup({
		id: new FormControl<number | null>(null),
		name: new FormControl<string | number | null>(null, Validators.required),
		price: new FormControl<string | number | null>(null, Validators.required)
	});
	ngOnInit(): void {
		this.getAllItems();
	}

	getAllItems() {
		this._loading.showLoader();
		this._HttpClient
			.get<TipoHairCut[]>(`${this.baseUrl}`)
			.pipe(
				tap((response) => {
					this.tipoHairCuts = response;
				}),
				finalize(() => {
					this._loading.hideLoader();
				})
			)
			.subscribe();
	}

	saveItem(forms: any) {
		const { id, name, price } = forms;
		(forms.id
			? this._HttpClient.put(`${this.baseUrl}/${id}`, { name, price })
			: this._HttpClient.post(`${this.baseUrl}`, { name, price })
		)
			.pipe(
				tap((resp: any) => {
					const { response } = resp;
					if (response) {
						this.closeModal();
						this._formGroup.reset();
						this._notifications.success(resp.message);
						this.getAllItems();
					} else {
						this._notifications.error(response.message);
					}
				}),
				finalize(() => {
					this._loading.hideLoader();
				}),
				catchError((error) => {
					this._formGroup.enable();
					this._notifications.error(error.error.message);
					return throwError(error);
				})
			)
			.subscribe();
	}

	addItem() {
		if (this._formGroup.valid) {
			const newItem = {
				id: this._formGroup.value.id,
				name: String(this._formGroup.value.name),
				price: String(this._formGroup.value.price)
			};
			this._formGroup.disable();
			this._loading.showLoader();
			this.saveItem(newItem);
		} else {
			this._notifications.warning('Por favor, preencha todos os campos obrigatórios!');
			return;
		}
	}

	excluirItem(index: number): void {
		const id = this.tipoHairCuts[index].id;
		this.deleteItem(id);
	}

	deleteItem(id: number) {
		this._HttpClient.delete(`${this.baseUrl}/${id}`).subscribe(() => {
			this._notifications.success('Item excluído com sucesso');
			this.getAllItems();
		});
	}

	openModal(isEdit = false, index?: number): void {
		if (isEdit) {
			this.modalTitle = 'Atualizar Item';
			if (index !== undefined) {
				const itemToEdit = this.tipoHairCuts[index];
				this._formGroup.patchValue({
					id: itemToEdit.id,
					name: itemToEdit.name,
					price: itemToEdit.price
				});
			}
		} else {
			this.modalTitle = 'Adicionar Novo Item';
			this._formGroup.reset();
		}
		this.isModalOpen = true;
	}

	closeModal() {
		this._formGroup.reset();
		this._formGroup.enable();
		this.isModalOpen = false;
	}

	get firstItemIndex(): number {
		return (this.currentPage - 1) * this.pageSize + 1;
	}

	get lastItemIndex(): number {
		return Math.min(this.currentPage * this.pageSize, this.tipoHairCuts.length);
	}

	get displayedItems(): TipoHairCut[] {
		const startIndex = (this.currentPage - 1) * this.pageSize;
		return this.tipoHairCuts.slice(startIndex, startIndex + this.pageSize);
	}

	isFirstPage(): boolean {
		return this.currentPage === 1;
	}

	isLastPage(): boolean {
		return this.currentPage === Math.ceil(this.tipoHairCuts.length / this.pageSize);
	}

	totalPagesArray(): number[] {
		return Array(Math.ceil(this.tipoHairCuts.length / this.pageSize))
			.fill(0)
			.map((x, i) => i + 1);
	}

	goToFirstPage(): void {
		if (!this.isFirstPage()) {
			this.currentPage = 1;
		}
	}

	goToPage(page: number): void {
		if (this.currentPage === page) return;
		if (page >= 1 && page <= Math.ceil(this.tipoHairCuts.length / this.pageSize)) {
			this.currentPage = page;
		}
	}

	goToLastPage(): void {
		if (!this.isLastPage()) {
			this.currentPage = Math.ceil(this.tipoHairCuts.length / this.pageSize);
		}
	}
}
interface TipoHairCut {
	id: number;
	name: string;
	price: number | string;
}
