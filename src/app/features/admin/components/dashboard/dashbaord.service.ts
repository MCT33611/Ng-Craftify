import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { IBooking } from '../../../../models/ibooking';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { handleError } from '../../../../shared/utils/handleError';
import { IUser } from '../../../../models/iuser';
import { IWorker } from '../../../../models/iworker';
import { IApiResponse } from '../../../../models/api-response.models';

@Injectable({
  providedIn: 'root'
})
export class DashbaordService {

  constructor(
    private _http : HttpClient
  ) { }

    getAllBookings(): Observable<Object> {
      return this._http.get(`${environment.API_BASE_URL}/api/Booking`).pipe(catchError(handleError));
    }

    getAllCustomers(): Observable<IUser[]> {
      return this._http.get<IUser[]>(`${environment.API_BASE_URL}/api/Profile/Custormers`)
      .pipe(catchError(handleError));
    }
    
    getAllWorkers(): Observable<IWorker[]> {
      return this._http.get<IWorker[]>(`${environment.API_BASE_URL}/api/Profile/Workers`)
      .pipe(catchError(handleError));
    }
  
}
