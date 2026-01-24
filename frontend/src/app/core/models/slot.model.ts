export interface Slot {
  id: number;
  doctorId: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  doctor?: {
    id: number;
    specialization: string;
    consultationFee: number;
    user?:  {
      firstName: string;
      lastName: string;
    };
  };
}

export interface CreateSlotRequest {
  doctorId: number;
  startTime: string;
  endTime: string;
}

export interface UpdateSlotRequest {
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
}