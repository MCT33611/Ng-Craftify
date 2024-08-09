import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../../../../../services/token.service';
import { Observable, catchError } from 'rxjs';
import { IUser } from '../../../../../models/iuser';
import { environment } from '../../../../../../environments/environment';
import { IRoles } from '../../../../../core/constants/roles';
import { handleError } from '../../../../../shared/utils/handleError';
import { IWorker } from '../../../../../models/iworker';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  

  constructor(
    private _http: HttpClient
  ) { }

  get(userId:string): Observable<IUser> {
    return this._http.get<IUser>(`${environment.API_BASE_URL}/api/Profile/${userId}`);
  }

  getWorker(workerId:string): Observable<IWorker> {
    return this._http.get<IWorker>(`${environment.API_BASE_URL}/api/Profile/Worker/${workerId}`);
  }

  getAllCustomers(): Observable<IUser[]> {
    return this._http.get<IUser[]>(`${environment.API_BASE_URL}/api/Profile/Custormers`)
    .pipe(catchError(handleError));
  }
  
  getAllWorkers(): Observable<IWorker[]> {
    return this._http.get<IWorker[]>(`${environment.API_BASE_URL}/api/Profile/Workers`)
    .pipe(catchError(handleError));
  }

  AccessChange(userId:string): Observable<Object> {
    return this._http.patch(`${environment.API_BASE_URL}/api/Profile/AccessChange/${userId}`,null);
  }

  ApprovalChange(userId:string): Observable<Object> {
    return this._http.patch(`${environment.API_BASE_URL}/api/Profile/Worker/ApprovalChange/${userId}`,null);
  }
}
