import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Slot, CreateSlotRequest, UpdateSlotRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SlotService {
  private apiUrl = `${environment.apiUrl}/Slots`;

  constructor(private http: HttpClient) {}

  getAllSlots(): Observable<Slot[]> {
    return this.http.get<Slot[]>(this. apiUrl);
  }

  getSlotById(id: number): Observable<Slot> {
    return this.http.get<Slot>(`${this.apiUrl}/${id}`);
  }

  getSlotsByDoctorId(doctorId:  number): Observable<Slot[]> {
    return this.http.get<Slot[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  getAvailableSlots(doctorId?:  number): Observable<Slot[]> {
    const params = doctorId ? `?doctorId=${doctorId}` : '';
    return this.http.get<Slot[]>(`${this.apiUrl}/available${params}`);
  }

  createSlot(slot:  CreateSlotRequest): Observable<Slot> {
    return this. http.post<Slot>(this.apiUrl, slot);
  }

  updateSlot(id: number, slot: UpdateSlotRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, slot);
  }

  deleteSlot(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}