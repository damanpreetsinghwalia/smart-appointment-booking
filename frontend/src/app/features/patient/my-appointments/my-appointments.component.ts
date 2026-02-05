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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment, AppointmentStatus } from '../../../core/models';

@Component({
    selector: 'app-my-appointments',
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
        MatSnackBarModule,
        MatDialogModule
    ],
    templateUrl: './my-appointments.component.html',
    styleUrls: ['./my-appointments.component.css']
})
export class MyAppointmentsComponent implements OnInit, OnDestroy {
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
        private appointmentService: AppointmentService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadAppointments();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Load all appointments for the current patient
     */
    loadAppointments(): void {
        this.loading = true;
        this.error = null;

        const currentUser = this.authService.getCurrentUser();
        const userId = currentUser?.userId || currentUser?.id;

        if (!userId) {
            this.error = 'User not authenticated';
            this.loading = false;
            return;
        }

        this.appointmentService
            .getPatientAppointments(userId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (appointments) => {
                    this.appointments = appointments;
                    this.filterAppointments();
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading appointments:', error);
                    this.error = 'Failed to load appointments. Please try again.';
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
            case 1: // Upcoming (Scheduled & Confirmed)
                this.filteredAppointments = this.appointments.filter(
                    (apt) =>
                        apt.status === AppointmentStatus.Scheduled ||
                        apt.status === AppointmentStatus.Confirmed
                );
                break;
            case 2: // Completed
                this.filteredAppointments = this.appointments.filter(
                    (apt) => apt.status === AppointmentStatus.Completed
                );
                break;
            case 3: // Cancelled
                this.filteredAppointments = this.appointments.filter(
                    (apt) => apt.status === AppointmentStatus.Cancelled
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
     * Cancel an appointment
     */
    cancelAppointment(appointment: Appointment): void {
        if (appointment.status === AppointmentStatus.Completed) {
            this.showSnackBar('Cannot cancel a completed appointment', 'error');
            return;
        }

        if (appointment.status === AppointmentStatus.Cancelled) {
            this.showSnackBar('Appointment is already cancelled', 'info');
            return;
        }

        // Confirm cancellation
        const confirmed = confirm(
            `Are you sure you want to cancel your appointment with Dr. ${this.getDoctorName(appointment)} on ${this.formatDate(appointment.appointmentDate)}?`
        );

        if (!confirmed) {
            return;
        }

        this.appointmentService
            .cancelAppointment(appointment.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.showSnackBar('Appointment cancelled successfully', 'success');
                    this.loadAppointments(); // Reload to get updated data
                },
                error: (error) => {
                    console.error('Error cancelling appointment:', error);
                    this.showSnackBar('Failed to cancel appointment', 'error');
                }
            });
    }

    /**
     * Get doctor's full name from appointment
     */
    getDoctorName(appointment: Appointment): string {
        if (appointment.slot?.doctor) {
            const doctor = appointment.slot.doctor;
            if (doctor.user) {
                return `${doctor.user.firstName} ${doctor.user.lastName}`.trim();
            }
            return 'Unknown Doctor';
        }
        return 'Unknown Doctor';
    }

    /**
     * Get doctor's specialization
     */
    getDoctorSpecialization(appointment: Appointment): string {
        return appointment.slot?.doctor?.specialization || 'General';
    }

    /**
     * Get consultation fee
     */
    getConsultationFee(appointment: Appointment): number {
        return appointment.slot?.doctor?.consultationFee || 0;
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
     * Check if appointment can be cancelled
     */
    canCancelAppointment(appointment: Appointment): boolean {
        return (
            appointment.status === AppointmentStatus.Scheduled ||
            appointment.status === AppointmentStatus.Confirmed
        );
    }

    /**
     * Check if appointment is upcoming
     */
    isUpcoming(appointment: Appointment): boolean {
        const appointmentDate = new Date(appointment.appointmentDate);
        const now = new Date();
        return appointmentDate > now && this.canCancelAppointment(appointment);
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
    getUpcomingCount(): number {
        return this.appointments.filter(
            (apt) =>
                apt.status === AppointmentStatus.Scheduled ||
                apt.status === AppointmentStatus.Confirmed
        ).length;
    }

    getCompletedCount(): number {
        return this.appointments.filter(
            (apt) => apt.status === AppointmentStatus.Completed
        ).length;
    }

    getCancelledCount(): number {
        return this.appointments.filter(
            (apt) => apt.status === AppointmentStatus.Cancelled
        ).length;
    }
}
