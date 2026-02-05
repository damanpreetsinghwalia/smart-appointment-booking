import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment, AppointmentStatus, Doctor } from '../../../core/models';

@Component({
    selector: 'app-doctor-appointments',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatChipsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatSnackBarModule
    ],
    templateUrl: './doctor-appointments.component.html',
    styleUrls: ['./doctor-appointments.component.css']
})
export class DoctorAppointmentsComponent implements OnInit, OnDestroy {
    doctor: Doctor | null = null;
    appointments: Appointment[] = [];
    filteredAppointments: Appointment[] = [];
    loading = true;
    error: string | null = null;

    // Filter states
    selectedTab = 0;
    appointmentStatuses = AppointmentStatus;

    private destroy$ = new Subject<void>();

    constructor(
        private authService: AuthService,
        private doctorService: DoctorService,
        private appointmentService: AppointmentService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadDoctorAndAppointments();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Load doctor profile and appointments
     */
    loadDoctorAndAppointments(): void {
        this.loading = true;
        this.error = null;

        const currentUser = this.authService.getCurrentUser();

        if (!currentUser) {
            this.error = 'User not authenticated';
            this.loading = false;
            return;
        }

        // Get all doctors and find the one matching current user's email
        this.doctorService
            .getAllDoctors()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (doctors) => {
                    this.doctor = doctors.find(d => d.email === currentUser.email) || null;

                    if (this.doctor) {
                        this.loadAppointments(this.doctor.id);
                    } else {
                        this.error = 'Doctor profile not found';
                        this.loading = false;
                    }
                },
                error: (error) => {
                    console.error('Error loading doctor profile:', error);
                    this.error = 'Failed to load doctor profile';
                    this.loading = false;
                }
            });
    }

    /**
     * Load appointments for the doctor
     */
    loadAppointments(doctorId: number): void {
        this.appointmentService
            .getDoctorAppointments(doctorId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (appointments) => {
                    this.appointments = appointments;
                    this.filterAppointments();
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading appointments:', error);
                    this.error = 'Failed to load appointments';
                    this.loading = false;
                    this.showSnackBar('Failed to load appointments', 'error');
                }
            });
    }

    /**
     * Filter appointments based on selected tab
     */
    filterAppointments(): void {
        switch (this.selectedTab) {
            case 0: // All appointments
                this.filteredAppointments = this.appointments;
                break;
            case 1: // Scheduled
                this.filteredAppointments = this.appointments.filter(
                    apt => apt.status === AppointmentStatus.Scheduled
                );
                break;
            case 2: // Confirmed
                this.filteredAppointments = this.appointments.filter(
                    apt => apt.status === AppointmentStatus.Confirmed
                );
                break;
            case 3: // Completed
                this.filteredAppointments = this.appointments.filter(
                    apt => apt.status === AppointmentStatus.Completed
                );
                break;
            case 4: // Cancelled
                this.filteredAppointments = this.appointments.filter(
                    apt => apt.status === AppointmentStatus.Cancelled
                );
                break;
            default:
                this.filteredAppointments = this.appointments;
        }
    }

    /**
     * Handle tab change event
     */
    onTabChange(index: number): void {
        this.selectedTab = index;
        this.filterAppointments();
    }

    /**
     * Update appointment status
     */
    updateAppointmentStatus(appointment: Appointment, newStatus: AppointmentStatus): void {
        const confirmed = confirm(
            `Are you sure you want to mark this appointment as ${newStatus}?`
        );

        if (!confirmed) {
            return;
        }

        this.appointmentService
            .updateAppointment(appointment.id, { status: newStatus })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    // Update local appointment status
                    const index = this.appointments.findIndex(a => a.id === appointment.id);
                    if (index !== -1) {
                        this.appointments[index].status = newStatus;
                        this.filterAppointments();
                    }
                    this.showSnackBar(`Appointment marked as ${newStatus}`, 'success');
                },
                error: (error) => {
                    console.error('Error updating appointment status:', error);
                    this.showSnackBar('Failed to update appointment status', 'error');
                }
            });
    }

    /**
     * Confirm appointment
     */
    confirmAppointment(appointment: Appointment): void {
        this.updateAppointmentStatus(appointment, AppointmentStatus.Confirmed);
    }

    /**
     * Complete appointment
     */
    completeAppointment(appointment: Appointment): void {
        this.updateAppointmentStatus(appointment, AppointmentStatus.Completed);
    }

    /**
     * Cancel appointment
     */
    cancelAppointment(appointment: Appointment): void {
        this.updateAppointmentStatus(appointment, AppointmentStatus.Cancelled);
    }

    /**
     * Get patient name from appointment
     */
    getPatientName(appointment: Appointment): string {
        if (appointment.patient) {
            return `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim();
        }
        return 'Unknown Patient';
    }

    /**
     * Format date to readable string
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
     * Format time to readable string
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
     * Get status color for chip
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
                return 'default';
        }
    }

    /**
     * Check if appointment can be confirmed
     */
    canConfirm(appointment: Appointment): boolean {
        return appointment.status === AppointmentStatus.Scheduled;
    }

    /**
     * Check if appointment can be completed
     */
    canComplete(appointment: Appointment): boolean {
        return (
            appointment.status === AppointmentStatus.Scheduled ||
            appointment.status === AppointmentStatus.Confirmed
        );
    }

    /**
     * Check if appointment can be cancelled
     */
    canCancel(appointment: Appointment): boolean {
        return (
            appointment.status === AppointmentStatus.Scheduled ||
            appointment.status === AppointmentStatus.Confirmed
        );
    }

    /**
     * Show snackbar notification
     */
    private showSnackBar(message: string, type: 'success' | 'error' | 'info'): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: [`snackbar-${type}`]
        });
    }

    /**
     * Get count of appointments by status
     */
    getScheduledCount(): number {
        return this.appointments.filter(apt => apt.status === AppointmentStatus.Scheduled).length;
    }

    getConfirmedCount(): number {
        return this.appointments.filter(apt => apt.status === AppointmentStatus.Confirmed).length;
    }

    getCompletedCount(): number {
        return this.appointments.filter(apt => apt.status === AppointmentStatus.Completed).length;
    }

    getCancelledCount(): number {
        return this.appointments.filter(apt => apt.status === AppointmentStatus.Cancelled).length;
    }

    /**
     * Logout
     */
    logout(): void {
        this.authService.logout();
    }
}
