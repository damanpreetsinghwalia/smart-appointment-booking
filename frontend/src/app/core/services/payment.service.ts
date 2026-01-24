import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payment, CreatePaymentRequest, RefundRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/Payments`;

  constructor(private http: HttpClient) {}

  getAllPayments(): Observable<Payment[]> {
    return this. http.get<Payment[]>(this.apiUrl);
  }

  getPaymentById(id:  number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  getPaymentByAppointmentId(appointmentId:  number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/appointment/${appointmentId}`);
  }

  createPayment(payment: CreatePaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  processRefund(id: number, refundRequest: RefundRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/refund`, refundRequest);
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}