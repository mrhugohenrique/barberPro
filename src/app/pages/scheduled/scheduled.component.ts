import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { WindowComponent } from '../../components/window/window.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { appIcons } from '../../components/sidebar/sidebar.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
	selector: 'app-scheduled',
	standalone: true,
	imports: [WindowComponent, CommonModule, FormsModule, ReactiveFormsModule, NgIconComponent],
	templateUrl: './scheduled.component.html',
	viewProviders: [provideIcons(appIcons)],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduledComponent {
	readonly scheduled = signal<TipoSheduled[]>([
		{ id: 1, name: 'João', service: 'Barba', price: 50 },
		{ id: 2, name: 'Mariana', service: 'Corte', price: 45 },
		{ id: 3, name: 'Lucas', service: 'Corte', price: 45 },
		{ id: 4, name: 'Vitor', service: 'Barba', price: 50 },
		{ id: 5, name: 'Pedro', service: 'Corte', price: 45 },
		{ id: 6, name: 'Lucas', service: 'Corte', price: 45 },
		{ id: 7, name: 'Vitor', service: 'Barba', price: 50 }
	]);

	readonly modalTitle = signal('');
	readonly isModalOpen = signal(false);
	readonly pageSize = signal(5);
	readonly currentPage = signal(1);

	readonly firstItemIndex = computed(() => (this.currentPage() - 1) * this.pageSize() + 1);

	readonly lastItemIndex = computed(() => 
		Math.min(this.currentPage() * this.pageSize(), this.scheduled().length)
	);

	readonly displayedItems = computed(() => {
		const startIndex = (this.currentPage() - 1) * this.pageSize();
		return this.scheduled().slice(startIndex, startIndex + this.pageSize());
	});

	readonly totalPages = computed(() => 
		Math.ceil(this.scheduled().length / this.pageSize())
	);

	readonly isFirstPage = computed(() => this.currentPage() === 1);
	readonly isLastPage = computed(() => this.currentPage() === this.totalPages() || this.totalPages() === 0);

	openModal(isEdit = false) {
		this.modalTitle.set(isEdit ? 'Editar Agendamento' : 'Novo Agendamento');
		this.isModalOpen.set(true);
	}

	excluirItem(index: number): void {
		const items = this.displayedItems();
		const id = items[index].id;
		// Remove localmente o agendamento simulado
		this.scheduled.update((list) => list.filter((item) => item.id !== id));
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

interface TipoSheduled {
	id: number;
	name: string;
	price: number | string;
	service: string;
}
