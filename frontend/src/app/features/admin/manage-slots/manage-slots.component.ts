import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { SlotService } from '../../../core/services/slot.service';
import { Doctor, Slot, CreateSlotRequest } from '../../../core/models';

@Component({
    selector: 'app-manage-slots',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule
    ],
    templateUrl: './manage-slots.component.html',
    styleUrls: ['./manage-slots.component.css']
})
export class ManageSlotsComponent implements OnInit, OnDestroy {
    doctors: Doctor[] = [];
    slots: Slot[] = [];
    filteredSlots: Slot[] = [];
    loading = true;
    error: string | null = null;

    selectedDoctorId: number | null = null;
    showCreateForm = false;
    showBulkCreateForm = false;

    slotForm: FormGroup;
    bulkSlotForm: FormGroup;

    displayedColumns: string[] = ['doctor', 'date', 'time', 'status', 'actions'];

    private destroy$ = new Subject<void>();

    constructor(
        private authService: AuthService,
        private doctorService: DoctorService,
        private slotService: SlotService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {
        this.slotForm = this.fb.group({
            doctorId: ['', Validators.required],
            date: ['', Validators.required],
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            isAvailable: [true]
        });

        this.bulkSlotForm = this.fb.group({
            doctorId: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            startTime: ['09:00', Validators.required],
            endTime: ['17:00', Validators.required],
            slotDuration: [30, [Validators.required, Validators.min(15)]],
            breakDuration: [0, [Validators.min(0)]]
        });
    }

    ngOnInit(): void {
        this.loadData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Load doctors and slots
     */
    loadData(): void {
        this.loading = true;
        this.error = null;

        forkJoin({
            doctors: this.doctorService.getAllDoctors(),
            slots: this.slotService.getAllSlots()
        })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ doctors, slots }) => {
                    this.doctors = doctors;
                    this.slots = slots;
                    this.filterSlots();
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading data:', error);
                    this.error = 'Failed to load data';
                    this.loading = false;
                }
            });
    }

    /**
     * Filter slots by selected doctor
     */
    filterSlots(): void {
        if (this.selectedDoctorId) {
            this.filteredSlots = this.slots.filter(slot => slot.doctorId === this.selectedDoctorId);
        } else {
            this.filteredSlots = this.slots;
        }
    }

    /**
     * Handle doctor filter change
     */
    onDoctorFilterChange(doctorId: number | null): void {
        this.selectedDoctorId = doctorId;
        this.filterSlots();
    }

    /**
     * Toggle create form
     */
    toggleCreateForm(): void {
        this.showCreateForm = !this.showCreateForm;
        this.showBulkCreateForm = false;
        if (this.showCreateForm) {
            this.slotForm.reset({ isAvailable: true });
        }
    }

    /**
     * Toggle bulk create form
     */
    toggleBulkCreateForm(): void {
        this.showBulkCreateForm = !this.showBulkCreateForm;
        this.showCreateForm = false;
        if (this.showBulkCreateForm) {
            this.bulkSlotForm.reset({
                startTime: '09:00',
                endTime: '17:00',
                slotDuration: 30,
                breakDuration: 0
            });
        }
    }

    /**
     * Create single slot
     */
    createSlot(): void {
        if (this.slotForm.invalid) {
            return;
        }

        const formValue = this.slotForm.value;
        const date = new Date(formValue.date);
        const [startHour, startMinute] = formValue.startTime.split(':');
        const [endHour, endMinute] = formValue.endTime.split(':');

        const startDateTime = new Date(date);
        startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

        const endDateTime = new Date(date);
        endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

        const slotRequest: CreateSlotRequest = {
            doctorId: formValue.doctorId,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            isAvailable: formValue.isAvailable
        };

        this.slotService.createSlot(slotRequest)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (slot) => {
                    this.slots.push(slot);
                    this.filterSlots();
                    this.slotForm.reset({ isAvailable: true });
                    this.showCreateForm = false;
                    this.showSnackBar('Slot created successfully', 'success');
                },
                error: (error) => {
                    console.error('Error creating slot:', error);
                    this.showSnackBar(error.error?.message || 'Failed to create slot', 'error');
                }
            });
    }

    /**
     * Create bulk slots
     */
    createBulkSlots(): void {
        if (this.bulkSlotForm.invalid) {
            return;
        }

        const formValue = this.bulkSlotForm.value;
        const startDate = new Date(formValue.startDate);
        const endDate = new Date(formValue.endDate);
        const slotDuration = formValue.slotDuration;
        const breakDuration = formValue.breakDuration;

        const slots: CreateSlotRequest[] = [];

        // Generate slots for each day
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const [startHour, startMinute] = formValue.startTime.split(':');
            const [endHour, endMinute] = formValue.endTime.split(':');

            let currentTime = new Date(date);
            currentTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

            const dayEnd = new Date(date);
            dayEnd.setHours(parseInt(endHour), parseInt(endMinute), 0);

            while (currentTime < dayEnd) {
                const slotEnd = new Date(currentTime);
                slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

                if (slotEnd <= dayEnd) {
                    slots.push({
                        doctorId: formValue.doctorId,
                        startTime: new Date(currentTime).toISOString(),
                        endTime: slotEnd.toISOString(),
                        isAvailable: true
                    });
                }

                currentTime.setMinutes(currentTime.getMinutes() + slotDuration + breakDuration);
            }
        }

        if (slots.length === 0) {
            this.showSnackBar('No slots to create', 'error');
            return;
        }

        // Create all slots
        const createRequests = slots.map(slot => this.slotService.createSlot(slot));

        forkJoin(createRequests)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (createdSlots) => {
                    this.slots.push(...createdSlots);
                    this.filterSlots();
                    this.bulkSlotForm.reset({
                        startTime: '09:00',
                        endTime: '17:00',
                        slotDuration: 30,
                        breakDuration: 0
                    });
                    this.showBulkCreateForm = false;
                    this.showSnackBar(`${createdSlots.length} slots created successfully`, 'success');
                },
                error: (error) => {
                    console.error('Error creating bulk slots:', error);
                    this.showSnackBar('Failed to create some slots', 'error');
                    this.loadData(); // Reload to get accurate state
                }
            });
    }

    /**
     * Delete slot
     */
    deleteSlot(slot: Slot): void {
        const confirmed = confirm(`Are you sure you want to delete this slot?`);
        if (!confirmed) {
            return;
        }

        this.slotService.deleteSlot(slot.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.slots = this.slots.filter(s => s.id !== slot.id);
                    this.filterSlots();
                    this.showSnackBar('Slot deleted successfully', 'success');
                },
                error: (error) => {
                    console.error('Error deleting slot:', error);
                    this.showSnackBar(error.error?.message || 'Failed to delete slot', 'error');
                }
            });
    }

    /**
     * Get doctor name
     */
    getDoctorName(doctorId: number): string {
        const doctor = this.doctors.find(d => d.id === doctorId);
        return doctor ? doctor.fullName : 'Unknown Doctor';
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
