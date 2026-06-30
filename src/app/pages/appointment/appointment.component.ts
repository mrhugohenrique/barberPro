import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { httpClientResponse } from '../../services/types';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WindowComponent } from '../../components/window/window.component';

@Component({
	selector: 'app-appointment',
	standalone: true,
	templateUrl: './appointment.component.html',
	imports: [CommonModule, FormsModule, ReactiveFormsModule, WindowComponent],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentComponent implements OnInit {
	private readonly baseUrl = `${environment.apiUrl}`;
	private readonly _notifications = inject(ToastrService);
	private readonly _HttpClient = inject(HttpClient);

	readonly appointments = signal<Appointment[]>([]);
	readonly hours = Array.from({ length: 21 }, (_, i) => 8 + i / 2); // Horários: 8:00 a 18:00
	readonly staffMembers = ['Mary', 'John', 'Miranda', 'Michael'];

	ngOnInit() {
		this.loadAppointments();
		this.appointments.set(this.getAppointments());
	}

	getStaffAppointments(staff: string): Appointment[] {
		return this.appointments().filter((app) => app.staffMember === staff);
	}

	formatHourLabel(hour: number): string {
		const h = Math.floor(hour);
		const m = hour % 1 === 0 ? '00' : '30';
		return `${h.toString().padStart(2, '0')}:${m}`;
	}

	getAppointments(): Appointment[] {
		return [
			{
				staffMember: 'Mary',
				clientName: 'Brenda Massey',
				serviceType: 'Blow Dry',
				startTime: '09:00',
				endTime: '10:00',
				color: 'bg-blue-200 border-l-4 border-blue-500 text-blue-900'
			},
			{
				staffMember: 'John',
				clientName: 'Zachary Kelley',
				serviceType: 'Beard Grooming',
				startTime: '09:00',
				endTime: '10:00',
				color: 'bg-yellow-200 border-l-4 border-yellow-500 text-yellow-900'
			},
			{
				staffMember: 'John',
				clientName: 'Jenny Murtaugh',
				serviceType: 'Haircut & Styling',
				startTime: '10:00',
				endTime: '11:00',
				color: 'bg-pink-200 border-l-4 border-pink-500 text-pink-900'
			},
			{
				staffMember: 'Miranda',
				clientName: 'Diana Campos',
				serviceType: 'Balinese Massage',
				startTime: '09:30',
				endTime: '11:00',
				color: 'bg-teal-200 border-l-4 border-teal-500 text-teal-900'
			},
			{
				staffMember: 'Michael',
				clientName: 'Robert Vance',
				serviceType: 'Shaving & Care',
				startTime: '12:30',
				endTime: '13:30',
				color: 'bg-indigo-200 border-l-4 border-indigo-500 text-indigo-900'
			}
		];
	}

	loadAppointments() {
		this._HttpClient
			.get<httpClientResponse>(`${this.baseUrl}/appointments`)
			.pipe(
				catchError((error) => {
					this._notifications.error(error.error?.message || 'Erro ao carregar agendamentos.');
					return throwError(error);
				})
			)
			.subscribe();
	}

	calculatePosition(startTime: string): string {
		const parts = startTime.split(':');
		const hour = parseInt(parts[0], 10);
		const minute = parseInt(parts[1], 10);
		
		// 8:00 é a linha base (0px). Cada hora tem 100px de altura (50px por 30min)
		const position = (hour - 8) * 100 + (minute / 60) * 100;
		return `${position}px`;
	}

	calculateHeight(startTime: string, endTime: string): string {
		const startParts = startTime.split(':');
		const endParts = endTime.split(':');
		
		const startHour = parseInt(startParts[0], 10);
		const startMinute = parseInt(startParts[1], 10);
		const endHour = parseInt(endParts[0], 10);
		const endMinute = parseInt(endParts[1], 10);
		
		const totalStartMinutes = startHour * 60 + startMinute;
		const totalEndMinutes = endHour * 60 + endMinute;
		
		const diffMinutes = totalEndMinutes - totalStartMinutes;
		
		// 1 minuto = 1.666px (100px por 60min)
		const height = (diffMinutes / 60) * 100;
		return `${height}px`;
	}
}

export interface Appointment {
	staffMember: string;
	clientName: string;
	serviceType: string;
	startTime: string; // Formato "HH:mm"
	endTime: string; // Formato "HH:mm"
	color: string;
}
