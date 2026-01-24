import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { PatientDashboardComponent } from './features/patient/dashboard/patient-dashboard.component';
import { DoctorsListComponent } from './features/patient/doctors/doctors-list.component';
import { BookAppointmentComponent } from './features/patient/book-appointment/book-appointment.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Default route
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
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
      { path: 'dashboard', 
        component:  PatientDashboardComponent 
      },
      {
        path: 'doctors',
        component: DoctorsListComponent
      },
      {
        path: 'book-appointment/:doctorId',
        component: BookAppointmentComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Doctor routes (protected)
  // {
  //   path: 'doctor',
  //   canActivate: [AuthGuard],
  //   data: { role: 'Doctor' },
  //   children:  [
  //     { path:  'dashboard', component: DoctorDashboardComponent }
  //   ]
  // },

  // Admin routes (protected)
  // {
  //   path: 'admin',
  //   canActivate: [AuthGuard],
  //   data:  { role: 'Admin' },
  //   children: [
  //     { path: 'dashboard', component: AdminDashboardComponent }
  //   ]
  // },

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