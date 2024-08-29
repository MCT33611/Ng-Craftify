import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { IPlan } from '../../../../../models/iplan';
import { handleError } from '../../../../../shared/utils/handleError';
import { IApiResponse } from '../../../../../models/api-response.models';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  

  constructor(
    private _http: HttpClient
  ) { }


    // GET /api/Plan
    getAll(): Observable<IApiResponse<IPlan>> {
      return this._http.get<IApiResponse<IPlan>>(`${environment.API_BASE_URL}/api/Plan`).pipe(catchError(handleError));
    }
  
    // GET /api/Plan/{id}
    get(id: string): Observable<IPlan> {
      return this._http.get<IPlan>(`${environment.API_BASE_URL}/api/Plan/${id}`).pipe(catchError(handleError));
    }
  
    // POST /api/Plan
    create(category: IPlan): Observable<IPlan> {
      return this._http.post<IPlan>(`${environment.API_BASE_URL}/api/Plan`, category).pipe(catchError(handleError));
    }
  
    // PUT /api/Plan/{id}
    update(Id: string, category: IPlan): Observable<IPlan> {
      return this._http.put<IPlan>(`${environment.API_BASE_URL}/api/Plan/${Id}`, category).pipe(catchError(handleError));
    }
  
    // DELETE /api/Plan/{id}
    delete(Id: string): Observable<void> {
      return this._http.delete<void>(`${environment.API_BASE_URL}/api/Plan/${Id}`).pipe(catchError(handleError));
    }
}
