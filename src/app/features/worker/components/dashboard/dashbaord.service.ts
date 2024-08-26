import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { IBooking } from '../../../../models/ibooking';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { handleError } from '../../../../shared/utils/handleError';
import { IApiResponse } from '../../../../models/api-response.models';

@Injectable({
  providedIn: 'root'
})
export class DashbaordService {

  constructor(
    private _http : HttpClient
  ) { }

    // GET /api/Booking
    getAllBookings(): Observable<IApiResponse< IBooking>> {
      return this._http.get<IApiResponse< IBooking>>(`${environment.API_BASE_URL}/api/Booking`).pipe(catchError(handleError));
    }
  
}
