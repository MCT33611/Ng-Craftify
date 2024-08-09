import { Injectable } from '@angular/core';
import { TokenService } from '../../../services/token.service';
import { HttpClient } from '@angular/common/http';
import { IWorker } from '../../../models/iworker';
import { catchError, Observable, throwError } from 'rxjs';
import { IUser } from '../../../models/iuser';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/utils/handleError';
import { IBooking } from '../../../models/ibooking';
import { IApiResponse } from '../../../models/api-response.models';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  constructor(
    private _tokenService: TokenService,
    private _http: HttpClient
  ) { };


  get(): Observable<IWorker> {
    const workerId = this._tokenService.getWorkerId()
    return this._http.get<IWorker>(`${environment.API_BASE_URL}/api/Profile/worker/${workerId}`).pipe(
      catchError(handleError)
    );
  }

  update(worker: IWorker): Observable<Object> {
    const workerId = this._tokenService.getWorkerId();
    if (!workerId) {
      return throwError(() => new Error('Worker ID is missing'));
    }

    const requestBody = {
      serviceTitle: worker.serviceTitle || "",
      description: worker.description || "",
      skills: worker.skills || "",
      perHourPrice: worker.perHourPrice || 0,
      logoUrl: worker.logoUrl || "",
      smallPreviewImageUrl: worker.smallPreviewImageUrl || "",
      mediumPreviewImageUrl: worker.mediumPreviewImageUrl || "",
      largePreviewImageUrl: worker.largePreviewImageUrl || ""
    };

    return this._http.put<IWorker>(`${environment.API_BASE_URL}/api/Profile/worker/${workerId}`, requestBody).pipe(
      catchError((error) => {
        console.error('Update error:', error);
        return handleError(error);
      })
    );
  }

  getAllRequest(): Observable<IApiResponse<IBooking>> {
    const userId = this._tokenService.getUserId();
    return this._http.get<IApiResponse< IBooking>>(`${environment.API_BASE_URL}/api/Booking?userId=${userId}`)
      .pipe(catchError(handleError));
  }

  rescheduleBooking(booking: IBooking): Observable<Object> {
    return this._http.put(`${environment.API_BASE_URL}/api/Booking/${booking.id}`, booking)
      .pipe(catchError(handleError));
  }
}
