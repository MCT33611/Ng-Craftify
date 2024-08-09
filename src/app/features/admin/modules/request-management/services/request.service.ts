import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { IBooking } from '../../../../../models/ibooking';
import { environment } from '../../../../../../environments/environment';
import { handleError } from '../../../../../shared/utils/handleError';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../../../../../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    private _http:HttpClient,
    private token:TokenService
  ) { }

  getAllRequest(): Observable<IBooking[]> {
    const userId = this.token.getUserId();
    return this._http.get<IBooking[]>(`${environment.API_BASE_URL}/api/Booking?userId=${userId}`)
      .pipe(catchError(handleError));
  }

  getRequest(id:string): Observable<IBooking> {
    return this._http.get<IBooking>(`${environment.API_BASE_URL}/api/Booking/${id}`)
      .pipe(catchError(handleError));
  }

  rescheduleBooking(booking: IBooking): Observable<Object> {
    return this._http.put(`${environment.API_BASE_URL}/api/Booking/${booking.id}`, booking)
      .pipe(catchError(handleError));
  }
}
