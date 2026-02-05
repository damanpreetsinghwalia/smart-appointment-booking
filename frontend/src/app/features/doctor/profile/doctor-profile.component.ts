import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
}

@Component({
    selector: 'app-doctor-profile',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSnackBarModule
    ],
    templateUrl: './doctor-profile.component.html',
    styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit, OnDestroy {
    profileForm: FormGroup;
    passwordForm: FormGroup;

    loading = true;
    editMode = false;
    changingPassword = false;

    userProfile: UserProfile | null = null;

    private destroy$ = new Subject<void>();
    private apiUrl = environment.apiUrl;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private http: HttpClient,
        private snackBar: MatSnackBar
    ) {
        this.profileForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(2)]],
            email: [{ value: '', disabled: true }], // Email is read-only
            phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', [Validators.required]],
            newPassword: ['', [
                Validators.required,
                Validators.minLength(6),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            ]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit(): void {
        this.loadProfile();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Password match validator
     */
    passwordMatchValidator(form: FormGroup) {
        const newPassword = form.get('newPassword');
        const confirmPassword = form.get('confirmPassword');

        if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        return null;
    }

    /**
     * Load user profile
     */
    loadProfile(): void {
        this.loading = true;

        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            this.showSnackBar('Please login to view profile', 'error');
            this.loading = false;
            return;
        }

        // Get user details from token or API
        this.userProfile = {
            id: currentUser.userId || '',
            fullName: currentUser.fullName || '',
            email: currentUser.email || '',
            phoneNumber: currentUser.phoneNumber || '',
            role: currentUser.role || 'Doctor'
        };

        // Populate form
        this.profileForm.patchValue({
            fullName: this.userProfile?.fullName || '',
            email: this.userProfile?.email || '',
            phoneNumber: this.userProfile?.phoneNumber || ''
        });

        this.loading = false;
    }

    /**
     * Toggle edit mode
     */
    toggleEditMode(): void {
        if (this.editMode) {
            // Cancel edit - reload original data
            this.loadProfile();
        }
        this.editMode = !this.editMode;
    }

    /**
     * Save profile changes
     */
    saveProfile(): void {
        if (this.profileForm.invalid) {
            return;
        }

        const formValue = this.profileForm.getRawValue();

        // In a real application, you would call an API to update the profile
        // For now, we'll just update the local data
        this.userProfile = {
            ...this.userProfile!,
            fullName: formValue.fullName,
            phoneNumber: formValue.phoneNumber
        };

        this.editMode = false;
        this.showSnackBar('Profile updated successfully', 'success');
    }

    /**
     * Toggle password change form
     */
    togglePasswordChange(): void {
        this.changingPassword = !this.changingPassword;
        if (!this.changingPassword) {
            this.passwordForm.reset();
        }
    }

    /**
     * Change password
     */
    changePassword(): void {
        if (this.passwordForm.invalid) {
            return;
        }

        const formValue = this.passwordForm.value;

        // In a real application, call API to change password
        // POST /api/Auth/change-password

        this.passwordForm.reset();
        this.changingPassword = false;
        this.showSnackBar('Password changed successfully', 'success');
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
     * Logout
     */
    logout(): void {
        this.authService.logout();
    }

    // Form getters
    get fullName() { return this.profileForm.get('fullName'); }
    get phoneNumber() { return this.profileForm.get('phoneNumber'); }
    get currentPassword() { return this.passwordForm.get('currentPassword'); }
    get newPassword() { return this.passwordForm.get('newPassword'); }
    get confirmPassword() { return this.passwordForm.get('confirmPassword'); }
}
