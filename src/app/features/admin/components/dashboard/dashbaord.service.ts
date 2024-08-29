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

    getAllBookings(): Observable<IApiResponse<IBooking>> {
      return this._http.get<IApiResponse<IBooking>>(`${environment.API_BASE_URL}/api/Booking`);
    }

    getAllCustomers(): Observable<IApiResponse<IUser>> {
      return this._http.get<IApiResponse<IUser>>(`${environment.API_BASE_URL}/api/Profile/Custormers`)
      .pipe(catchError(handleError));
    }
    
    getAllWorkers(): Observable<IApiResponse<IWorker>> {
      return this._http.get<IApiResponse<IWorker>>(`${environment.API_BASE_URL}/api/Profile/Workers`)
      .pipe(catchError(handleError));
    }
  
}
