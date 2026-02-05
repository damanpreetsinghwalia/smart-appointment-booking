import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { SlotService } from '../../../core/services/slot.service';
import { Doctor, Appointment, Slot, AppointmentStatus } from '../../../core/models';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
    doctors: Doctor[] = [];
    appointments: Appointment[] = [];
    slots: Slot[] = [];
    recentAppointments: Appointment[] = [];
    loading = true;
    error: string | null = null;

    // Statistics
    totalDoctors = 0;
    totalPatients = 0;
    totalAppointments = 0;
    totalSlots = 0;
    scheduledCount = 0;
    confirmedCount = 0;
    completedCount = 0;

    private destroy$ = new Subject<void>();

    constructor(
        private authService: AuthService,
        private doctorService: DoctorService,
        private appointmentService: AppointmentService,
        private slotService: SlotService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadDashboardData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Load all dashboard data
     */
    loadDashboardData(): void {
        this.loading = true;
        this.error = null;

        forkJoin({
            doctors: this.doctorService.getAllDoctors(),
            appointments: this.appointmentService.getAllAppointments(),
            slots: this.slotService.getAllSlots()
        })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ doctors, appointments, slots }) => {
                    this.doctors = doctors;
                    this.appointments = appointments;
                    this.slots = slots;
                    this.calculateStatistics();
                    this.filterRecentAppointments();
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading dashboard data:', error);
                    this.error = 'Failed to load dashboard data';
                    this.loading = false;
                }
            });
    }

    /**
     * Calculate dashboard statistics
     */
    calculateStatistics(): void {
        this.totalDoctors = this.doctors.length;
        this.totalAppointments = this.appointments.length;
        this.totalSlots = this.slots.length;

        // Count unique patients
        const uniquePatients = new Set(this.appointments.map(apt => apt.patientId));
        this.totalPatients = uniquePatients.size;

        // Count by status
        this.scheduledCount = this.appointments.filter(
            apt => apt.status === AppointmentStatus.Scheduled
        ).length;

        this.confirmedCount = this.appointments.filter(
            apt => apt.status === AppointmentStatus.Confirmed
        ).length;

        this.completedCount = this.appointments.filter(
            apt => apt.status === AppointmentStatus.Completed
        ).length;
    }

    /**
     * Filter recent appointments (last 10)
     */
    filterRecentAppointments(): void {
        this.recentAppointments = this.appointments
            .sort((a, b) => {
                const dateA = new Date(a.appointmentDate).getTime();
                const dateB = new Date(b.appointmentDate).getTime();
                return dateB - dateA;
            })
            .slice(0, 10);
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
     * Get doctor name from appointment
     */
    getDoctorName(appointment: Appointment): string {
        if (appointment.slot?.doctor) {
            return appointment.slot.doctor.fullName || 'Unknown Doctor';
        }
        return 'Unknown Doctor';
    }

    /**
     * Format date to readable string
     */
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
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
     * Navigate to manage doctors
     */
    manageDoctors(): void {
        this.router.navigate(['/admin/doctors']);
    }

    /**
     * Navigate to manage slots
     */
    manageSlots(): void {
        this.router.navigate(['/admin/slots']);
    }

    /**
     * Navigate to view appointments
     */
    viewAppointments(): void {
        this.router.navigate(['/admin/appointments']);
    }

    /**
     * Navigate to view payments
     */
    viewPayments(): void {
        this.router.navigate(['/admin/payments']);
    }

    /**
     * Logout
     */
    logout(): void {
        this.authService.logout();
    }
}
