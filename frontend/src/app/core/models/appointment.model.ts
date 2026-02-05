export interface Appointment {
  id: number;
  patientId: string;
  slotId: number;
  appointmentDate: string;
  status: AppointmentStatus;
  reason?: string;
  slot?: {
    id: number;
    startTime: string;
    endTime: string;
    doctor?: {
      id: number;
      fullName: string;
      specialization: string;
      consultationFee: number;
      user?: {
        firstName: string;
        lastName: string;
      };
    };
  };
  patient?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Confirmed = 'Confirmed',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface CreateAppointmentRequest {
  patientId: string;
  slotId: number;
  appointmentDate: string;
  reason?: string;
}

export interface UpdateAppointmentRequest {
  status?: AppointmentStatus;
  reason?: string;
}