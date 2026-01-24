import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { DoctorService } from '../../../core/services/doctor.service';
import { SlotService } from '../../../core/services/slot.service';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.css']
})
export class DoctorsListComponent implements OnInit {
  doctors: any[] = [];
  loading = true;
  errorMessage = '';
  selectedSpecialization = 'All';
  specializations: string[] = ['All'];

  constructor(
    private doctorService: DoctorService,
    private slotService: SlotService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.loading = true;
    this.doctorService.getAllDoctors().subscribe({
      next: (doctors: any[]) => {
        this.doctors = doctors;
        this.extractSpecializations(doctors);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading doctors:', error);
        this.errorMessage = 'Failed to load doctors. Please try again.';
        this.loading = false;
      }
    });
  }

  extractSpecializations(doctors: any[]): void {
    const specs = new Set(doctors.map(d => d.specialization).filter(s => s));
    this.specializations = ['All', ...Array.from(specs)];
  }

  get filteredDoctors(): any[] {
    if (this.selectedSpecialization === 'All') {
      return this.doctors;
    }
    return this.doctors.filter(d => d.specialization === this.selectedSpecialization);
  }

  viewDoctorSlots(doctorId: number): void {
    this.router.navigate(['/patient/book-appointment', doctorId]);
  }
}