import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor, CreateDoctorRequest, UpdateDoctorRequest } from '../../../core/models';

@Component({
    selector: 'app-manage-doctors',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule
    ],
    templateUrl: './manage-doctors.component.html',
    styleUrls: ['./manage-doctors.component.css']
})
export class ManageDoctorsComponent implements OnInit, OnDestroy {
    doctors: Doctor[] = [];
    filteredDoctors: Doctor[] = [];
    loading = true;
    error: string | null = null;

    showCreateForm = false;
    editingDoctor: Doctor | null = null;

    doctorForm: FormGroup;
    searchTerm = '';
    filterSpecialization = '';

    displayedColumns: string[] = ['name', 'specialization', 'email', 'phone', 'fee', 'status', 'actions'];

    specializations = [
        'General Medicine',
        'Cardiology',
        'Dermatology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'Psychiatry',
        'Radiology',
        'Surgery'
    ];

    private destroy$ = new Subject<void>();

    constructor(
        private authService: AuthService,
        private doctorService: DoctorService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar
    ) {
        this.doctorForm = this.fb.group({
            fullName: ['', Validators.required],
            specialization: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', Validators.required],
            consultationFee: [500, [Validators.required, Validators.min(0)]],
            isAvailable: [true]
        });
    }

    ngOnInit(): void {
        this.loadDoctors();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Load all doctors
     */
    loadDoctors(): void {
        this.loading = true;
        this.error = null;

        this.doctorService
            .getAllDoctors()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (doctors) => {
                    this.doctors = doctors;
                    this.applyFilters();
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading doctors:', error);
                    this.error = 'Failed to load doctors';
                    this.loading = false;
                }
            });
    }

    /**
     * Apply search and filter
     */
    applyFilters(): void {
        this.filteredDoctors = this.doctors.filter(doctor => {
            const matchesSearch = !this.searchTerm ||
                doctor.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                doctor.email.toLowerCase().includes(this.searchTerm.toLowerCase());

            const matchesSpecialization = !this.filterSpecialization ||
                doctor.specialization === this.filterSpecialization;

            return matchesSearch && matchesSpecialization;
        });
    }

    /**
     * Handle search input
     */
    onSearch(term: string): void {
        this.searchTerm = term;
        this.applyFilters();
    }

    /**
     * Handle specialization filter
     */
    onFilterChange(specialization: string): void {
        this.filterSpecialization = specialization;
        this.applyFilters();
    }

    /**
     * Toggle create form
     */
    toggleCreateForm(): void {
        this.showCreateForm = !this.showCreateForm;
        this.editingDoctor = null;
        if (this.showCreateForm) {
            this.doctorForm.reset({
                consultationFee: 500,
                isAvailable: true
            });
        }
    }

    /**
     * Create doctor
     */
    createDoctor(): void {
        if (this.doctorForm.invalid) {
            return;
        }

        const doctorRequest: CreateDoctorRequest = this.doctorForm.value;

        this.doctorService.createDoctor(doctorRequest)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (doctor) => {
                    this.doctors.push(doctor);
                    this.applyFilters();
                    this.doctorForm.reset({ consultationFee: 500, isAvailable: true });
                    this.showCreateForm = false;
                    this.showSnackBar('Doctor created successfully', 'success');
                },
                error: (error) => {
                    console.error('Error creating doctor:', error);
                    this.showSnackBar(error.error?.message || 'Failed to create doctor', 'error');
                }
            });
    }

    /**
     * Edit doctor
     */
    editDoctor(doctor: Doctor): void {
        this.editingDoctor = doctor;
        this.showCreateForm = true;
        this.doctorForm.patchValue({
            fullName: doctor.fullName,
            specialization: doctor.specialization,
            email: doctor.email,
            phoneNumber: doctor.phoneNumber,
            consultationFee: doctor.consultationFee,
            isAvailable: doctor.isAvailable
        });
    }

    /**
     * Update doctor
     */
    updateDoctor(): void {
        if (this.doctorForm.invalid || !this.editingDoctor) {
            return;
        }

        const updateRequest: UpdateDoctorRequest = this.doctorForm.value;

        this.doctorService.updateDoctor(this.editingDoctor.id, updateRequest)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    const index = this.doctors.findIndex(d => d.id === this.editingDoctor!.id);
                    if (index !== -1) {
                        this.doctors[index] = { ...this.editingDoctor!, ...updateRequest };
                    }
                    this.applyFilters();
                    this.doctorForm.reset({ consultationFee: 500, isAvailable: true });
                    this.showCreateForm = false;
                    this.editingDoctor = null;
                    this.showSnackBar('Doctor updated successfully', 'success');
                },
                error: (error) => {
                    console.error('Error updating doctor:', error);
                    this.showSnackBar(error.error?.message || 'Failed to update doctor', 'error');
                }
            });
    }

    /**
     * Delete doctor
     */
    deleteDoctor(doctor: Doctor): void {
        const confirmed = confirm(`Are you sure you want to delete Dr. ${doctor.fullName}?`);
        if (!confirmed) {
            return;
        }

        this.doctorService.deleteDoctor(doctor.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.doctors = this.doctors.filter(d => d.id !== doctor.id);
                    this.applyFilters();
                    this.showSnackBar('Doctor deleted successfully', 'success');
                },
                error: (error) => {
                    console.error('Error deleting doctor:', error);
                    this.showSnackBar(error.error?.message || 'Failed to delete doctor', 'error');
                }
            });
    }

    /**
     * Cancel editing
     */
    cancelEdit(): void {
        this.showCreateForm = false;
        this.editingDoctor = null;
        this.doctorForm.reset({ consultationFee: 500, isAvailable: true });
    }

    /**
     * Show snackbar
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
     * Logout
     */
    logout(): void {
        this.authService.logout();
    }
}
