import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  currentUser: User | null = null;
  upcomingAppointments: any[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadUpcomingAppointments();
  }

  loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  loadUpcomingAppointments(): void {
    const userId = this.currentUser?.userId || this.currentUser?.id;
    if (userId) {
      this.appointmentService.getPatientAppointments(userId).subscribe({
        next: (appointments: any[]) => {
          // Filter upcoming appointments (status: Scheduled)
          this.upcomingAppointments = appointments
            .filter((apt: any) => apt.status === 'Scheduled')
            .slice(0, 3); // Show only 3 recent
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading appointments:', error);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}