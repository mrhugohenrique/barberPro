import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WindowComponent } from '../../components/window/window.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { allFeatherIcons } from '../../components/sidebar/sidebar.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
	selector: 'app-scheduled',
	standalone: true,
	imports: [WindowComponent, CommonModule, FormsModule, ReactiveFormsModule, NgIconComponent],
	templateUrl: './scheduled.component.html',
	styleUrl: './scheduled.component.scss',
	viewProviders: [provideIcons(allFeatherIcons)],
	changeDetection: ChangeDetectionStrategy.Default
})
export class ScheduledComponent {
	scheduled: TipoSheduled[] = [
		{ id: 1, name: 'João', service: 'Barba', price: '50' },
		{ id: 2, name: 'Mariana', service: 'Corte', price: '45' },
		{ id: 3, name: 'Lucas', service: 'Corte', price: '45' },
		{ id: 4, name: 'Vitor', service: 'Barba', price: '50' },
		{ id: 5, name: 'Pedro', service: 'Corte', price: '45' },
		{ id: 6, name: 'Lucas', service: 'Corte', price: '45' },
		{ id: 7, name: 'Vitor', service: 'Barba', price: '50' }
	];
	modalTitle = '';
	isModalOpen = false;
	pageSize: number = 5;
	currentPage: number = 1;

	openModal(isEdit = false, index?: number) {
		this.isModalOpen = true;
	}

	excluirItem(index: number): void {
		const id = this.scheduled[index].id;
		console.log('Excluindo o item:', id);
	}

	get firstItemIndex(): number {
		return (this.currentPage - 1) * this.pageSize + 1;
	}

	get lastItemIndex(): number {
		return Math.min(this.currentPage * this.pageSize, this.scheduled.length);
	}

	get displayedItems(): TipoSheduled[] {
		const startIndex = (this.currentPage - 1) * this.pageSize;
		return this.scheduled.slice(startIndex, startIndex + this.pageSize);
	}

	isFirstPage(): boolean {
		return this.currentPage === 1;
	}

	isLastPage(): boolean {
		return this.currentPage === Math.ceil(this.scheduled.length / this.pageSize);
	}

	totalPagesArray(): number[] {
		return Array(Math.ceil(this.scheduled.length / this.pageSize))
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
		if (page >= 1 && page <= Math.ceil(this.scheduled.length / this.pageSize)) {
			this.currentPage = page;
		}
	}

	goToLastPage(): void {
		if (!this.isLastPage()) {
			this.currentPage = Math.ceil(this.scheduled.length / this.pageSize);
		}
	}
}

interface TipoSheduled {
	id: number;
	name: string;
	price: number | string;
	service: string;
}
