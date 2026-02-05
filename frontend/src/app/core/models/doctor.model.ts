export interface Doctor {
  id: number;
  fullName: string;
  specialization: string;
  email: string;
  phoneNumber: string;
  consultationFee: number;
  isAvailable: boolean;
  createdAt?: string;
}

export interface CreateDoctorRequest {
  fullName: string;
  specialization: string;
  email: string;
  phoneNumber: string;
  consultationFee: number;
  isAvailable: boolean;
}

export interface UpdateDoctorRequest {
  fullName?: string;
  specialization?: string;
  email?: string;
  phoneNumber?: string;
  consultationFee?: number;
  isAvailable?: boolean;
}
