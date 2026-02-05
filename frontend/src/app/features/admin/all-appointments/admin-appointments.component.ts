import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment, AppointmentStatus } from '../../../core/models';

@Component({
    selector: 'app-admin-appointments',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatChipsModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './admin-appointments.component.html',
    styleUrls: ['./admin-appointments.component.css']
})
export class AdminAppointmentsComponent implements OnInit, OnDestroy {
    appointments: Appointment[] = [];
    filteredAppointments: Appointment[] = [];
    loading = true;
    error: string | null = null;

    searchTerm = '';
    filterStatus: AppointmentStatus | '' = '';
    filterDoctor = '';
    filterPatient = '';

    appointmentStatuses = AppointmentStatus;
    displayedColumns: string[] = ['id', 'patient', 'doctor', 'date', 'time', 'status', 'reason'];

    // Statistics
    totalCount = 0;
    scheduledCount = 0;
    confirmedCount = 0;
    completedCount = 0;
    cancelledCount = 0;

    private destroy$ = new Subject<void>();

    constructor(
        private authService: AuthService,
        private appointmentService: AppointmentService
    ) { }

    ngOnInit(): void {
        this.loadAppointments();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Load all appointments
     */
    loadAppointments(): void {
        this.loading = true;
        this.error = null;

        this.appointmentService
            .getAllAppointments()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (appointments) => {
                    this.appointments = appointments;
                    this.calculateStatistics();
                    this.applyFilters();
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading appointments:', error);
                    this.error = 'Failed to load appointments';
                    this.loading = false;
                }
            });
    }

    /**
     * Calculate statistics
     */
    calculateStatistics(): void {
        this.totalCount = this.appointments.length;
        this.scheduledCount = this.appointments.filter(a => a.status === AppointmentStatus.Scheduled).length;
        this.confirmedCount = this.appointments.filter(a => a.status === AppointmentStatus.Confirmed).length;
        this.completedCount = this.appointments.filter(a => a.status === AppointmentStatus.Completed).length;
        this.cancelledCount = this.appointments.filter(a => a.status === AppointmentStatus.Cancelled).length;
    }

    /**
     * Apply filters
     */
    applyFilters(): void {
        this.filteredAppointments = this.appointments.filter(appointment => {
            const patientName = this.getPatientName(appointment).toLowerCase();
            const doctorName = this.getDoctorName(appointment).toLowerCase();
            const reason = (appointment.reason || '').toLowerCase();

            const matchesSearch = !this.searchTerm ||
                patientName.includes(this.searchTerm.toLowerCase()) ||
                doctorName.includes(this.searchTerm.toLowerCase()) ||
                reason.includes(this.searchTerm.toLowerCase());

            const matchesStatus = !this.filterStatus || appointment.status === this.filterStatus;

            const matchesDoctor = !this.filterDoctor ||
                doctorName.includes(this.filterDoctor.toLowerCase());

            const matchesPatient = !this.filterPatient ||
                patientName.includes(this.filterPatient.toLowerCase());

            return matchesSearch && matchesStatus && matchesDoctor && matchesPatient;
        });
    }

    /**
     * Handle search
     */
    onSearch(term: string): void {
        this.searchTerm = term;
        this.applyFilters();
    }

    /**
     * Handle status filter
     */
    onStatusFilter(status: AppointmentStatus | ''): void {
        this.filterStatus = status;
        this.applyFilters();
    }

    /**
     * Clear all filters
     */
    clearFilters(): void {
        this.searchTerm = '';
        this.filterStatus = '';
        this.filterDoctor = '';
        this.filterPatient = '';
        this.applyFilters();
    }

    /**
     * Get patient name
     */
    getPatientName(appointment: Appointment): string {
        if (appointment.patient) {
            return `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim();
        }
        return 'Unknown Patient';
    }

    /**
     * Get doctor name
     */
    getDoctorName(appointment: Appointment): string {
        if (appointment.slot?.doctor) {
            return appointment.slot.doctor.fullName || 'Unknown Doctor';
        }
        return 'Unknown Doctor';
    }

    /**
     * Format date
     */
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Format time
     */
    formatTime(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    /**
     * Get status color
     */
    getStatusColor(status: AppointmentStatus): string {
        switch (status) {
            case AppointmentStatus.Scheduled:
                return 'primary';
            case AppointmentStatus.Confirmed:
                return 'accent';
            case AppointmentStatus.Completed:
                return 'success';
            case AppointmentStatus.Cancelled:
                return 'warn';
            default:
                return '';
        }
    }

    /**
     * Get status class
     */
    getStatusClass(status: AppointmentStatus): string {
        switch (status) {
            case AppointmentStatus.Scheduled:
                return 'status-scheduled';
            case AppointmentStatus.Confirmed:
                return 'status-confirmed';
            case AppointmentStatus.Completed:
                return 'status-completed';
            case AppointmentStatus.Cancelled:
                return 'status-cancelled';
            default:
                return '';
        }
    }

    /**
     * Logout
     */
    logout(): void {
        this.authService.logout();
    }
}
