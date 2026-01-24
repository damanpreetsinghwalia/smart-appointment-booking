export interface Payment {
  id:  number;
  appointmentId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  status: PaymentStatus;
  appointment?: {
    id: number;
    appointmentDate: string;
    patient?: {
      firstName: string;
      lastName: string;
    };
    slot?: {
      doctor?: {
        user?: {
          firstName: string;
          lastName: string;
        };
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
  transactionId: string;
}

export interface RefundRequest {
  reason?:  string;
}