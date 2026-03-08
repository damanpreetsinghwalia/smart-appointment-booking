import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { SlotService } from '../../../core/services/slot.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { PaymentService } from '../../../core/services/payment.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {
  doctorId!: number;
  doctor: any = null;
  availableSlots: any[] = [];
  allSlots: any[] = [];
  selectedSlot: any = null;
  loading = true;
  bookingInProgress = false;
  errorMessage = '';
  successMessage = '';
  currentUser: any;

  // Confirmation state
  bookingConfirmed = false;
  bookedAppointment: any = null;
  bookedPayment: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private slotService: SlotService,
    private appointmentService: AppointmentService,
    private paymentService: PaymentService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    this.route.params.subscribe(params => {
      this.doctorId = +params['id'];
      if (this.doctorId) {
        this.loadDoctorDetails();
        this.loadAvailableSlots();
      }
    });
  }

  loadDoctorDetails(): void {
    this.doctorService.getDoctorById(this.doctorId).subscribe({
      next: (doctor: any) => {
        this.doctor = doctor;
      },
      error: (error: any) => {
        console.error('Error loading doctor:', error);
        this.errorMessage = 'Failed to load doctor details.';
      }
    });
  }

  loadAvailableSlots(): void {
    this.loading = true;
    this.slotService.getSlotsByDoctorId(this.doctorId).subscribe({
      next: (slots: any[]) => {
        // Store all slots for display (booked ones shown as disabled)
        this.allSlots = slots;
        // Filter only available slots (keep for backward compat)
        this.availableSlots = slots.filter(slot => slot.isAvailable);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading slots:', error);
        this.errorMessage = 'Failed to load available slots.';
        this.loading = false;
      }
    });
  }

  selectSlot(slot: any): void {
    // Only allow selecting available slots
    if (!slot.isAvailable) {
      return;
    }
    // Toggle: if clicking same slot, deselect it
    if (this.selectedSlot?.id === slot.id) {
      this.selectedSlot = null;
    } else {
      this.selectedSlot = slot;
    }
    this.errorMessage = '';
  }

  bookAppointment(): void {
    if (!this.selectedSlot) {
      this.errorMessage = 'Please select a time slot.';
      return;
    }

    this.bookingInProgress = true;
    this.errorMessage = '';
    this.successMessage = '';

    const appointmentData = {
      patientId: this.currentUser.userId,
      slotId: this.selectedSlot.id,
      reason: ''
    };

    this.appointmentService.createAppointment(appointmentData).subscribe({
      next: (response: any) => {
        this.bookedAppointment = response;

        // Create payment record
        const paymentData = {
          appointmentId: response.id,
          amount: this.doctor.consultationFee,
          paymentMethod: 'Cash'
        };

        this.paymentService.createPayment(paymentData).subscribe({
          next: (payment: any) => {
            this.bookedPayment = payment;
            this.bookingConfirmed = true;
            this.bookingInProgress = false;
            this.successMessage = 'Appointment booked successfully!';
          },
          error: (paymentError: any) => {
            console.error('Payment creation error:', paymentError);
            // Appointment was created even if payment failed
            this.bookingConfirmed = true;
            this.bookingInProgress = false;
            this.successMessage = 'Appointment booked! Payment will be collected at the clinic.';
          }
        });
      },
      error: (error: any) => {
        console.error('Booking error:', error);

        if (error.error && typeof error.error === 'string') {
          this.errorMessage = error.error;
        } else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Failed to book appointment. Please try again.';
        }

        this.bookingInProgress = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/patient/doctors']);
  }

  viewMyAppointments(): void {
    this.router.navigate(['/patient/my-appointments']);
  }
}