export interface Payment {
  id: number;
  appointmentId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId?: string;
  status: PaymentStatus;
  createdAt?: string;
  appointment?: {
    id: number;
    appointmentDate: string;
    patient?: {
      firstName: string;
      lastName: string;
      email: string;
    };
    slot?: {
      startTime: string;
      endTime: string;
      doctor?: {
        id: number;
        fullName: string;
        specialization: string;
        consultationFee: number;
      };
    };
  };
}

export enum PaymentStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
  Refunded = 'Refunded'
}

export interface CreatePaymentRequest {
  appointmentId: number;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
}

export interface UpdatePaymentStatusRequest {
  status: PaymentStatus;
  cancelAppointmentOnFailure?: boolean;
}

export interface RefundRequest {
  reason?: string;
}