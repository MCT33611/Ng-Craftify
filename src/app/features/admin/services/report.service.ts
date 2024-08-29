import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ReportResponse } from '../../../models/report-response.model';
import { ReportResponseDictionary } from '../../../models/report-response-dictionary.model';
import { IUser } from '../../../models/iuser';
import { IWorker } from '../../../models/iworker';
import { handleError } from '../../../shared/utils/handleError';
import { IApiResponse } from '../../../models/api-response.models';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.API_BASE_URL}/api/report`;

  constructor(private http: HttpClient) {}

  getActiveSubscriptions(): Observable<ReportResponse<number>> {
    return this.http.get<ReportResponse<number>>(`${this.apiUrl}/active-subscriptions`);
  }

  getActiveUsers(): Observable<ReportResponse<number>> {
    return this.http.get<ReportResponse<number>>(`${this.apiUrl}/active-users`);
  }

  getApprovedWorkers(): Observable<ReportResponse<number>> {
    return this.http.get<ReportResponse<number>>(`${this.apiUrl}/approved-workers`);
  }

  getAverageWorkerHourlyRate(): Observable<ReportResponse<number>> {
    return this.http.get<ReportResponse<number>>(`${this.apiUrl}/average-worker-hourly-rate`);
  }

  getBlockedUsers(): Observable<ReportResponse<number>> {
    return this.http.get<ReportResponse<number>>(`${this.apiUrl}/blocked-users`);
  }

  getBookingsByStatus(): Observable<ReportResponseDictionary<number>> {
    return this.http.get<ReportResponseDictionary<number>>(`${this.apiUrl}/bookings-by-status`);
  }

  getNewUsersThisMonth(): Observable<ReportResponse<number>> {
    return this.http.get<ReportResponse<number>>(`${this.apiUrl}/new-users-this-month`);
  }


  getTotalBookings(): Observable<ReportResponse<number>> {
    return this.http.get<ReportResponse<number>>(`${this.apiUrl}/total-bookings`);
  }

  getTotalRevenueByActiveSubscriptions(): Observable<ReportResponse<number>> {
    return this.http.get<ReportResponse<number>>(`${this.apiUrl}/total-revenue-by-active-subscriptions`);
  }

  getTotalRevenueBySubscriptions(): Observable<ReportResponse<number>> {
    return this.http.get<ReportResponse<number>>(`${this.apiUrl}/total-revenue-by-subscriptions`);
  }

  getTotalRevenueFromBookings(): Observable<ReportResponse<number>> {
    return this.http.get<ReportResponse<number>>(`${this.apiUrl}/total-revenue-from-bookings`);
  }

  getTotalServiceCategories(): Observable<ReportResponse<number>> {
    return this.http.get<ReportResponse<number>>(`${this.apiUrl}/total-service-categories`);
  }

  getTotalSubscriptions(): Observable<ReportResponse<number>> {
    return this.http.get<ReportResponse<number>>(`${this.apiUrl}/total-subscriptions`);
  }

  getTotalUsers(): Observable<ReportResponse<number>> {
    return this.http.get<ReportResponse<number>>(`${this.apiUrl}/total-users`);
  }

  getTotalWorkers(): Observable<ReportResponse<number>> {
    return this.http.get<ReportResponse<number>>(`${this.apiUrl}/total-workers`);
  }

  getUnapprovedWorkers(): Observable<ReportResponse<number>> {
    return this.http.get<ReportResponse<number>>(`${this.apiUrl}/unapproved-workers`);
  }

  getAllBookings(): Observable<Object> {
    return this.http.get(`${environment.API_BASE_URL}/api/Booking`).pipe(catchError(handleError));
  }

  getAllCustomers(): Observable<IApiResponse<IUser>> {
    return this.http.get<IApiResponse<IUser>>(`${environment.API_BASE_URL}/api/Profile/Custormers`)
    .pipe(catchError(handleError));
  }
  
  getAllWorkers(): Observable<IWorker[]> {
    return this.http.get<IWorker[]>(`${environment.API_BASE_URL}/api/Profile/Workers`)
    .pipe(catchError(handleError));
  }
}
