export interface Doctor {
  id:  number;
  userId: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  availabilityStatus: boolean;
  user?:  {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
}

export interface CreateDoctorRequest {
  userId: string;
  specialization:  string;
  qualification: string;
  experienceYears: number;
  consultationFee:  number;
  availabilityStatus: boolean;
}

export interface UpdateDoctorRequest {
  specialization?: string;
  qualification?:  string;
  experienceYears?: number;
  consultationFee?: number;
  availabilityStatus?: boolean;
}