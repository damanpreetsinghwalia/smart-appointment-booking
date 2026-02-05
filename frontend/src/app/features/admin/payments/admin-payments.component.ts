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
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../../core/services/auth.service';
import { Payment, PaymentStatus } from '../../../core/models';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-admin-payments',
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
    templateUrl: './admin-payments.component.html',
    styleUrls: ['./admin-payments.component.css']
})
export class AdminPaymentsComponent implements OnInit, OnDestroy {
    payments: Payment[] = [];
    filteredPayments: Payment[] = [];
    loading = true;
    error: string | null = null;

    searchTerm = '';
    filterStatus: PaymentStatus | '' = '';

    paymentStatuses = PaymentStatus;
    displayedColumns: string[] = ['id', 'patient', 'doctor', 'amount', 'method', 'date', 'status'];

    // Statistics
    totalRevenue = 0;
    pendingCount = 0;
    completedCount = 0;
    failedCount = 0;
    refundedCount = 0;

    private destroy$ = new Subject<void>();
    private apiUrl = `${environment.apiUrl}/Payments`;

    constructor(
        private authService: AuthService,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.loadPayments();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Load all payments
     */
    loadPayments(): void {
        this.loading = true;
        this.error = null;

        this.http.get<Payment[]>(this.apiUrl)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (payments) => {
                    this.payments = payments;
                    this.calculateStatistics();
                    this.applyFilters();
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading payments:', error);
                    this.error = 'Failed to load payments';
                    this.loading = false;
                }
            });
    }

    /**
     * Calculate statistics
     */
    calculateStatistics(): void {
        this.totalRevenue = this.payments
            .filter(p => p.status === PaymentStatus.Completed)
            .reduce((sum, p) => sum + p.amount, 0);

        this.pendingCount = this.payments.filter(p => p.status === PaymentStatus.Pending).length;
        this.completedCount = this.payments.filter(p => p.status === PaymentStatus.Completed).length;
        this.failedCount = this.payments.filter(p => p.status === PaymentStatus.Failed).length;
        this.refundedCount = this.payments.filter(p => p.status === PaymentStatus.Refunded).length;
    }

    /**
     * Apply filters
     */
    applyFilters(): void {
        this.filteredPayments = this.payments.filter(payment => {
            const patientName = this.getPatientName(payment).toLowerCase();
            const doctorName = this.getDoctorName(payment).toLowerCase();
            const transactionId = (payment.transactionId || '').toLowerCase();

            const matchesSearch = !this.searchTerm ||
                patientName.includes(this.searchTerm.toLowerCase()) ||
                doctorName.includes(this.searchTerm.toLowerCase()) ||
                transactionId.includes(this.searchTerm.toLowerCase());

            const matchesStatus = !this.filterStatus || payment.status === this.filterStatus;

            return matchesSearch && matchesStatus;
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
    onStatusFilter(status: PaymentStatus | ''): void {
        this.filterStatus = status;
        this.applyFilters();
    }

    /**
     * Clear filters
     */
    clearFilters(): void {
        this.searchTerm = '';
        this.filterStatus = '';
        this.applyFilters();
    }

    /**
     * Get patient name
     */
    getPatientName(payment: Payment): string {
        if (payment.appointment?.patient) {
            return `${payment.appointment.patient.firstName} ${payment.appointment.patient.lastName}`.trim();
        }
        return 'Unknown';
    }

    /**
     * Get doctor name
     */
    getDoctorName(payment: Payment): string {
        if (payment.appointment?.slot?.doctor) {
            return payment.appointment.slot.doctor.fullName || 'Unknown';
        }
        return 'Unknown';
    }

    /**
     * Format date
     */
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
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
     * Get status class
     */
    getStatusClass(status: PaymentStatus): string {
        switch (status) {
            case PaymentStatus.Pending:
                return 'status-pending';
            case PaymentStatus.Completed:
                return 'status-completed';
            case PaymentStatus.Failed:
                return 'status-failed';
            case PaymentStatus.Refunded:
                return 'status-refunded';
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
