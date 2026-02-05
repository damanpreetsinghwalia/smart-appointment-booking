export interface Slot {
  id: number;
  doctorId: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  doctor?: {
    id: number;
    fullName: string;
    specialization: string;
    consultationFee: number;
  };
}

export interface CreateSlotRequest {
  doctorId: number;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
}

export interface UpdateSlotRequest {
  doctorId?: number;
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
}
