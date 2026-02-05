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
import { Doctor, Appointment, AppointmentStatus, Slot } from '../../../core/models';

@Component({
    selector: 'app-doctor-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './doctor-dashboard.component.html',
    styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit, OnDestroy {
    doctor: Doctor | null = null;
    appointments: Appointment[] = [];
    todayAppointments: Appointment[] = [];
    slots: Slot[] = [];
    loading = true;
    error: string | null = null;

    // Statistics
    todayCount = 0;
    upcomingCount = 0;
    totalAppointmentsCount = 0;
    totalSlotsCount = 0;

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

        const currentUser = this.authService.getCurrentUser();

        if (!currentUser) {
            this.error = 'User not authenticated';
            this.loading = false;
            return;
        }

        // For now, we'll get all doctors and find the one matching the current user's email
        // This is a workaround since backend doesn't have getDoctorByUserId endpoint
        this.doctorService
            .getAllDoctors()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (doctors) => {
                    // Find doctor by email match
                    this.doctor = doctors.find(d => d.email === currentUser.email) || null;

                    if (this.doctor) {
                        this.loadDoctorData(this.doctor.id);
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
     * Load doctor's appointments and slots
     */
    loadDoctorData(doctorId: number): void {
        forkJoin({
            appointments: this.appointmentService.getDoctorAppointments(doctorId),
            slots: this.slotService.getSlotsByDoctorId(doctorId)
        })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ appointments, slots }) => {
                    this.appointments = appointments;
                    this.slots = slots;
                    this.calculateStatistics();
                    this.filterTodayAppointments();
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading doctor data:', error);
                    this.error = 'Failed to load appointments and slots';
                    this.loading = false;
                }
            });
    }

    /**
     * Calculate dashboard statistics
     */
    calculateStatistics(): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Today's appointments
        this.todayCount = this.appointments.filter(apt => {
            const aptDate = new Date(apt.appointmentDate);
            aptDate.setHours(0, 0, 0, 0);
            return aptDate.getTime() === today.getTime();
        }).length;

        // Upcoming appointments (Scheduled & Confirmed)
        this.upcomingCount = this.appointments.filter(
            apt =>
                (apt.status === AppointmentStatus.Scheduled ||
                    apt.status === AppointmentStatus.Confirmed) &&
                new Date(apt.appointmentDate) >= today
        ).length;

        // Total appointments
        this.totalAppointmentsCount = this.appointments.length;

        // Total slots
        this.totalSlotsCount = this.slots.length;
    }

    /**
     * Filter today's appointments
     */
    filterTodayAppointments(): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.todayAppointments = this.appointments
            .filter(apt => {
                const aptDate = new Date(apt.appointmentDate);
                aptDate.setHours(0, 0, 0, 0);
                return aptDate.getTime() === today.getTime();
            })
            .sort((a, b) => {
                const timeA = new Date(a.slot?.startTime || a.appointmentDate).getTime();
                const timeB = new Date(b.slot?.startTime || b.appointmentDate).getTime();
                return timeA - timeB;
            })
            .slice(0, 5); // Show only first 5
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
     * Get status color class
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
     * Navigate to appointments page
     */
    viewAllAppointments(): void {
        this.router.navigate(['/doctor/appointments']);
    }

    /**
     * Logout
     */
    logout(): void {
        this.authService.logout();
    }
}
