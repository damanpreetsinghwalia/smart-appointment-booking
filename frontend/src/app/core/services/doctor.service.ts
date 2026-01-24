import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Doctor, CreateDoctorRequest, UpdateDoctorRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/Doctors`;

  constructor(private http: HttpClient) {}

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  getDoctorByUserId(userId: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/user/${userId}`);
  }

  createDoctor(doctor: CreateDoctorRequest): Observable<Doctor> {
    return this.http.post<Doctor>(this.apiUrl, doctor);
  }

  updateDoctor(id: number, doctor: UpdateDoctorRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, doctor);
  }

  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchDoctors(specialization?:  string): Observable<Doctor[]> {
    const params = specialization ? `?specialization=${specialization}` : '';
    return this.http.get<Doctor[]>(`${this.apiUrl}${params}`);
  }
}