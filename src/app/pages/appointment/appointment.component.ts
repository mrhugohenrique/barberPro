import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../components/loader/loader.service';
import { finalize, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { httpClientResponse } from '../../services/types';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-appointment',
	standalone: true,
	templateUrl: './appointment.component.html',
	imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class AppointmentComponent implements OnInit {
	private baseUrl = `${environment.apiUrl}`;
	appointments: Appointment[] = [];
	hours = Array.from({ length: 22 }, (_, i) => 8 + i / 2); // Horas do dia, de 8:00 a 18:00 a cada 30 minutos
	staffMembers = ['Mary', 'John', 'Miranda', 'Michael'];

	private _notifications = inject(ToastrService);
	private _HttpClient = inject(HttpClient);
	private _loading = inject(LoaderService);

	ngOnInit() {
		this.loadAppointments();
		this.appointments = this.getAppointments();
	}

	generateTimes(): string[] {
		const times = [];
		for (let hour = 8; hour < 18; hour++) {
			times.push(`${hour}:00`, `${hour}:30`);
		}
		return times;
	}

	findAppointment(staff: string, time: string): Appointment | null {
		return (
			this.appointments.find((app) => app.staffMember === staff && app.startTime === time) ||
			null
		);
	}

	getAppointments(): Appointment[] {
		return [
			{
				staffMember: 'Mary',
				clientName: 'Brenda Massey',
				serviceType: 'Blow Dry',
				startTime: '9:00',
				endTime: '10:00',
				color: 'bg-blue-300'
			},
			{
				staffMember: 'John',
				clientName: 'Zachary Kelley',
				serviceType: 'Beard Grooming',
				startTime: '9:00',
				endTime: '10:00',
				color: 'bg-yellow-300'
			},
			{
				staffMember: 'John',
				clientName: 'Jenny Murtaugh',
				serviceType: 'Beard Grooming',
				startTime: '10:00',
				endTime: '11:00',
				color: 'bg-pink-300'
			},
			{
				staffMember: 'Miranda',
				clientName: 'Diana Campos',
				serviceType: 'Balinese Massage',
				startTime: '9:45',
				endTime: '11:00',
				color: 'bg-teal-300'
			}
		];
	}

	loadAppointments() {
		this._loading.showLoader();
		this._HttpClient
			.get<httpClientResponse>(`${this.baseUrl}/appointments`)
			.pipe(
				finalize(() => {
					this._loading.hideLoader();
				}),
				catchError((error) => {
					this._notifications.error(error.error.message || 'Erro ao agendar serviço.');
					return throwError(error);
				})
			)
			.subscribe();
	}
	calculatePosition(startTime: string): string {
		const hour = parseInt(startTime.split(':')[0]);
		const minute = parseInt(startTime.split(':')[1]);
		return `${(hour - 8) * 100 + (minute / 60) * 50 - 2}px`;
	}

	calculateHeight(startTime: string, endTime: string): string {
		const startHour = parseInt(startTime.split(':')[0]);
		const startMinute = parseInt(startTime.split(':')[1]);
		const endHour = parseInt(endTime.split(':')[0]);
		const endMinute = parseInt(endTime.split(':')[1]);
		return `${(((endHour - startHour) * 60 + (endMinute - startMinute)) / 30) * 50 - 10}px`;
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
