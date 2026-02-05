import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { PatientDashboardComponent } from './features/patient/dashboard/patient-dashboard.component';
import { DoctorsListComponent } from './features/patient/doctors/doctors-list.component';
import { BookAppointmentComponent } from './features/patient/book-appointment/book-appointment.component';
import { MyAppointmentsComponent } from './features/patient/my-appointments/my-appointments.component';
import { PatientProfileComponent } from './features/patient/profile/patient-profile.component';
import { DoctorDashboardComponent } from './features/doctor/dashboard/doctor-dashboard.component';
import { DoctorAppointmentsComponent } from './features/doctor/appointments/doctor-appointments.component';
import { DoctorProfileComponent } from './features/doctor/profile/doctor-profile.component';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { ManageSlotsComponent } from './features/admin/manage-slots/manage-slots.component';
import { ManageDoctorsComponent } from './features/admin/manage-doctors/manage-doctors.component';
import { AdminAppointmentsComponent } from './features/admin/all-appointments/admin-appointments.component';
import { AdminPaymentsComponent } from './features/admin/payments/admin-payments.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Landing page
  {
    path: '',
    component: LandingComponent
  },

  // Auth routes (no guard needed)
  {
    path: 'login',
    component: LoginComponent
  },

  //Register route (we'll create this component next)
  {
    path: 'register',
    component: RegisterComponent
  },

  // // Patient routes (protected)
  {
    path: 'patient',
    canActivate: [AuthGuard],
    data: { role: 'Patient' },
    children: [
      {
        path: 'dashboard',
        component: PatientDashboardComponent
      },
      {
        path: 'doctors',
        component: DoctorsListComponent
      },
      {
        path: 'book-appointment/:id',
        component: BookAppointmentComponent
      },
      {
        path: 'my-appointments',
        component: MyAppointmentsComponent
      },
      {
        path: 'profile',
        component: PatientProfileComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Doctor routes (protected)
  {
    path: 'doctor',
    canActivate: [AuthGuard],
    data: { role: 'Doctor' },
    children: [
      {
        path: 'dashboard',
        component: DoctorDashboardComponent
      },
      {
        path: 'appointments',
        component: DoctorAppointmentsComponent
      },
      {
        path: 'profile',
        component: DoctorProfileComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Admin routes (protected)
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { role: 'Admin' },
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'slots',
        component: ManageSlotsComponent
      },
      {
        path: 'doctors',
        component: ManageDoctorsComponent
      },
      {
        path: 'appointments',
        component: AdminAppointmentsComponent
      },
      {
        path: 'payments',
        component: AdminPaymentsComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Unauthorized page
  // {
  //   path: 'unauthorized',
  //   component: UnauthorizedComponent
  // },

  // 404 Not Found
  {
    path: '**',
    redirectTo: '/login'
  }
];