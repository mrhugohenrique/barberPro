import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
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
import { appIcons } from '../../components/sidebar/sidebar.component';
import { ToastrService } from 'ngx-toastr';
import { HaircutService } from '../../services/haircut.service';
import { Product } from '../../services/types';

@Component({
	selector: 'app-type-hair-cut',
	standalone: true,
	templateUrl: './type-hair-cut.component.html',
	imports: [
		CommonModule,
		WindowComponent,
		InputComponent,
		FormsModule,
		ReactiveFormsModule,
		NgIconComponent
	],
	viewProviders: [provideIcons(appIcons)],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeHairCutComponent implements OnInit {
	private readonly _notifications = inject(ToastrService);
	private readonly _haircutService = inject(HaircutService);

	readonly isModalOpen = signal(false);
	readonly modalTitle = signal('');
	readonly tipoHairCuts = signal<Product[]>([]);
	readonly pageSize = signal(5);
	readonly currentPage = signal(1);

	readonly _formGroup = new FormGroup({
		id: new FormControl<number | null>(null),
		name: new FormControl<string | null>(null, Validators.required),
		price: new FormControl<number | null>(null, Validators.required)
	});

	readonly firstItemIndex = computed(() => (this.currentPage() - 1) * this.pageSize() + 1);
	
	readonly lastItemIndex = computed(() => 
		Math.min(this.currentPage() * this.pageSize(), this.tipoHairCuts().length)
	);

	readonly displayedItems = computed(() => {
		const startIndex = (this.currentPage() - 1) * this.pageSize();
		return this.tipoHairCuts().slice(startIndex, startIndex + this.pageSize());
	});

	readonly totalPages = computed(() => 
		Math.ceil(this.tipoHairCuts().length / this.pageSize())
	);

	readonly isFirstPage = computed(() => this.currentPage() === 1);
	readonly isLastPage = computed(() => this.currentPage() === this.totalPages() || this.totalPages() === 0);

	ngOnInit(): void {
		this.getAllItems();
	}

	getAllItems() {
		this._haircutService.getAll().subscribe({
			next: (response) => {
				this.tipoHairCuts.set(response);
			},
			error: () => {
				this._notifications.error('Erro ao listar tipos de cortes.');
			}
		});
	}

	onSubmit() {
		if (this._formGroup.invalid) {
			this._notifications.warning('Por favor, preencha todos os campos obrigatórios!');
			return;
		}

		const id = this._formGroup.value.id;
		const name = this._formGroup.value.name ?? '';
		const price = Number(this._formGroup.value.price ?? 0);

		this._formGroup.disable();

		const request = id
			? this._haircutService.update(id, name, price)
			: this._haircutService.create(name, price);

		request.subscribe({
			next: (resp) => {
				const { response } = resp;
				if (response.success) {
					this.closeModal();
					this._notifications.success(response.message);
					this.getAllItems();
				} else {
					this._formGroup.enable();
					this._notifications.error(response.message);
				}
			},
			error: (error) => {
				this._formGroup.enable();
				this._notifications.error(error.error?.message || 'Erro ao salvar item.');
			}
		});
	}

	excluirItem(index: number): void {
		const items = this.displayedItems();
		const id = items[index].id;
		if (id) {
			this.deleteItem(id);
		}
	}

	deleteItem(id: number) {
		this._haircutService.delete(id).subscribe({
			next: () => {
				this._notifications.success('Item excluído com sucesso');
				this.getAllItems();
			},
			error: (error) => {
				this._notifications.error(error.error?.message || 'Erro ao excluir item.');
			}
		});
	}

	openModal(isEdit = false, index?: number): void {
		if (isEdit) {
			this.modalTitle.set('Atualizar Item');
			if (index !== undefined) {
				const itemToEdit = this.displayedItems()[index];
				this._formGroup.patchValue({
					id: itemToEdit.id,
					name: itemToEdit.name as string,
					price: Number(itemToEdit.price)
				});
			}
		} else {
			this.modalTitle.set('Adicionar Novo Item');
			this._formGroup.reset();
		}
		this.isModalOpen.set(true);
	}

	closeModal() {
		this._formGroup.reset();
		this._formGroup.enable();
		this.isModalOpen.set(false);
	}

	totalPagesArray(): number[] {
		return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
	}

	goToFirstPage(): void {
		this.currentPage.set(1);
	}

	goToPage(page: number): void {
		if (page >= 1 && page <= this.totalPages()) {
			this.currentPage.set(page);
		}
	}

	goToLastPage(): void {
		this.currentPage.set(this.totalPages() || 1);
	}
}
