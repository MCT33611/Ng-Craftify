import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = `${environment.API_BASE_URL}/api/Notification/email`;  // Update this with your actual API URL

  constructor(private http: HttpClient) { }

  sendEmail(to: string, subject: string, htmlMessage: string): Observable<any> {
    const data = { to, subject, htmlMessage }
    console.log(data);
    
    return this.http.post(`${this.apiUrl}/send`, data);
  }
}
